import aiofiles
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from ..dependencies import get_session
from ..models import FileKind, Session, TableMeta, UploadResponse

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    # Determine file kind based on extension
    filename_lower = file.filename.lower()
    if filename_lower.endswith('.csv'):
        kind = FileKind.CSV
    elif filename_lower.endswith('.parquet'):
        kind = FileKind.PARQUET
    elif filename_lower.endswith('.json'):
        kind = FileKind.JSON
    elif filename_lower.endswith('.sqlite') or filename_lower.endswith('.db'):
        kind = FileKind.SQLITE
    else:
        raise HTTPException(
            status_code=400, 
            detail="Unsupported file type. Supported: .csv, .parquet, .json, .sqlite, .db"
        )
    
    # Save file to session workspace
    file_path = session.workspace_dir / file.filename
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    # Generate table name
    table_name = f"{kind.value}_{len(session.tables) + 1}"
    
    # Register table in DuckDB based on file type
    try:
        if kind == FileKind.CSV:
            # Use DuckDB's read_csv_auto for automatic CSV detection
            session.conn.execute(f"""
                CREATE VIEW {table_name} AS 
                SELECT * FROM read_csv_auto('{file_path}')
            """)
        elif kind == FileKind.PARQUET:
            session.conn.execute(f"""
                CREATE VIEW {table_name} AS 
                SELECT * FROM read_parquet('{file_path}')
            """)
        elif kind == FileKind.JSON:
            session.conn.execute(f"""
                CREATE VIEW {table_name} AS 
                SELECT * FROM read_json_auto('{file_path}')
            """)
        elif kind == FileKind.SQLITE:
            # For SQLite, we'll attach the database
            db_name = f"db_{len([t for t in session.tables.values() if t.kind == FileKind.SQLITE]) + 1}"
            session.conn.execute(f"ATTACH '{file_path}' AS {db_name} (READ_ONLY)")
            table_name = f"{db_name}.main"  # Assume main table for now
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to register table: {str(e)}")
    
    # Store table metadata
    table_meta = TableMeta(
        name=table_name,
        kind=kind,
        path=str(file_path),
        db=db_name if kind == FileKind.SQLITE else None
    )
    session.tables[table_name] = table_meta
    
    return UploadResponse(name=table_name, kind=kind.value)