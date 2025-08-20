from typing import List
from fastapi import APIRouter, Depends

from ..dependencies import get_session
from ..models import Session, TableInfo

router = APIRouter()


@router.get("/tables", response_model=List[TableInfo])
async def get_tables(session: Session = Depends(get_session)):
    tables = []
    for table_meta in session.tables.values():
        tables.append(TableInfo(
            name=table_meta.name,
            kind=table_meta.kind.value,
            db=table_meta.db
        ))
    return tables