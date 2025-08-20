import asyncio
import re
import time
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException

from ..dependencies import get_session
from ..models import ColumnInfo, QueryRequest, QueryResponse, Session

router = APIRouter()

# SQL tokens that we want to block for security
BANNED_TOKENS = {
    "INSTALL", "LOAD", "COPY", "ATTACH", "DETACH", 
    "PRAGMA", "SET", "CREATE", "DROP", "ALTER", 
    "INSERT", "UPDATE", "DELETE", "TRUNCATE"
}


def clean_and_validate_sql(sql: str) -> str:
    """Clean SQL comments and validate for security. Returns cleaned SQL."""
    # Remove SQL comments (both -- and /* */ style)
    # For -- comments, remove everything from -- to end of line
    sql_no_comments = re.sub(r'--.*', '', sql, flags=re.MULTILINE)
    # For /* */ comments, remove everything between /* and */
    sql_no_comments = re.sub(r'/\*.*?\*/', '', sql_no_comments, flags=re.DOTALL)
    
    # Clean up extra whitespace and newlines, join non-empty lines with spaces
    lines = [line.strip() for line in sql_no_comments.split('\n') if line.strip()]
    sql_cleaned = ' '.join(lines)
    
    # Remove trailing semicolons as they can cause issues with DuckDB when adding LIMIT/OFFSET
    sql_cleaned = sql_cleaned.rstrip(';').strip()
    
    sql_upper = sql_cleaned.upper()
    
    # Check for banned tokens using word boundaries to avoid false positives
    for token in BANNED_TOKENS:
        # Use word boundaries to match only complete tokens
        pattern = r'\b' + re.escape(token) + r'\b'
        if re.search(pattern, sql_upper):
            raise HTTPException(
                status_code=400, 
                detail=f"SQL contains prohibited token: {token}"
            )
    
    # Must start with SELECT for read-only queries (after removing comments)
    if not sql_cleaned.strip():
        raise HTTPException(
            status_code=400,
            detail="No SQL query found"
        )
    
    first_token = sql_upper.strip().split()[0] if sql_upper.strip() else ""
    if first_token not in ("SELECT", "WITH"):
        raise HTTPException(
            status_code=400,
            detail="Only SELECT and WITH queries are allowed"
        )
    
    return sql_cleaned


async def execute_query_with_timeout(session: Session, sql: str, timeout: int = 30) -> Any:
    """Execute query with timeout using asyncio."""
    
    def run_query():
        return session.conn.execute(sql).fetchall()
    
    try:
        # Run the query in a thread pool with timeout
        result = await asyncio.wait_for(
            asyncio.get_event_loop().run_in_executor(None, run_query),
            timeout=timeout
        )
        return result
    except asyncio.TimeoutError:
        raise HTTPException(status_code=408, detail=f"Query timed out after {timeout} seconds")


@router.post("/query", response_model=QueryResponse)
async def execute_query(
    query_request: QueryRequest,
    session: Session = Depends(get_session)
):
    # Clean and validate SQL
    cleaned_sql = clean_and_validate_sql(query_request.sql)
    
    # Check if the query already has LIMIT/OFFSET and handle accordingly
    cleaned_upper = cleaned_sql.upper()
    if 'LIMIT' in cleaned_upper or 'OFFSET' in cleaned_upper:
        # Query already has pagination, use as-is
        paginated_sql = cleaned_sql
    else:
        # Add pagination to the query
        paginated_sql = f"{cleaned_sql} LIMIT {query_request.limit} OFFSET {query_request.offset}"
    
    start_time = time.time()
    
    try:
        # Get column information first
        # We'll execute a LIMIT 0 version to get just the schema
        schema_sql = f"SELECT * FROM ({cleaned_sql}) LIMIT 0"
        schema_result = await execute_query_with_timeout(session, schema_sql)
        
        # Get column names and types from the result description
        columns = []
        if session.conn.description:
            for desc in session.conn.description:
                columns.append(ColumnInfo(
                    name=desc[0],
                    type=str(desc[1]) if desc[1] else "UNKNOWN"
                ))
        
        # Execute the actual paginated query
        rows = await execute_query_with_timeout(session, paginated_sql)
        
        # Convert rows to lists (DuckDB returns tuples)
        rows_list = [list(row) for row in rows]
        
        # Try to get total count estimate (optional, might be expensive)
        total_est = None
        try:
            count_sql = f"SELECT COUNT(*) FROM ({cleaned_sql})"
            count_result = await execute_query_with_timeout(session, count_sql, timeout=5)
            if count_result:
                total_est = count_result[0][0]
        except:
            # If count fails, we'll just return None
            pass
        
        duration_ms = (time.time() - start_time) * 1000
        
        return QueryResponse(
            columns=columns,
            rows=rows_list,
            total_est=total_est,
            duration_ms=duration_ms
        )
    
    except HTTPException:
        # Re-raise HTTP exceptions (timeouts, validation errors)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query execution failed: {str(e)}")