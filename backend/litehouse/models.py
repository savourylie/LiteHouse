from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Dict, List, Optional
from uuid import UUID

import duckdb
from pydantic import BaseModel


class FileKind(str, Enum):
    CSV = "csv"
    PARQUET = "parquet"
    JSON = "json"
    SQLITE = "sqlite"


class TableMeta(BaseModel):
    name: str
    kind: FileKind
    path: str
    db: Optional[str] = None


class Session:
    def __init__(self, session_id: UUID, workspace_dir: Path):
        self.id = session_id
        self.created_at = datetime.now()
        self.workspace_dir = workspace_dir
        self.conn = duckdb.connect(":memory:")
        self.tables: Dict[str, TableMeta] = {}

    def close(self):
        if self.conn:
            self.conn.close()


class SessionResponse(BaseModel):
    session_id: str


class UploadResponse(BaseModel):
    name: str
    kind: str


class TableInfo(BaseModel):
    name: str
    kind: str
    db: Optional[str] = None


class ColumnInfo(BaseModel):
    name: str
    type: str


class SchemaResponse(BaseModel):
    table: str
    columns: List[ColumnInfo]


class QueryRequest(BaseModel):
    sql: str
    limit: int = 100
    offset: int = 0


class QueryResponse(BaseModel):
    columns: List[ColumnInfo]
    rows: List[List]
    total_est: Optional[int] = None
    duration_ms: float


class ExportRequest(BaseModel):
    sql: str
    format: str = "csv"