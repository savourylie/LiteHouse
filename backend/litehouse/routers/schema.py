from fastapi import APIRouter, Depends, HTTPException, Query

from ..dependencies import get_session
from ..models import ColumnInfo, SchemaResponse, Session

router = APIRouter()


@router.get("/schema", response_model=SchemaResponse)
async def get_schema(
    table: str = Query(..., description="Table name to inspect"),
    session: Session = Depends(get_session)
):
    if table not in session.tables:
        raise HTTPException(status_code=404, detail=f"Table '{table}' not found")
    
    try:
        # Get column information using DuckDB's DESCRIBE
        result = session.conn.execute(f"DESCRIBE {table}").fetchall()
        
        columns = []
        for row in result:
            # DuckDB DESCRIBE returns: (column_name, column_type, null, key, default, extra)
            columns.append(ColumnInfo(
                name=row[0],
                type=row[1]
            ))
        
        return SchemaResponse(table=table, columns=columns)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get schema: {str(e)}")