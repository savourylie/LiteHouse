from fastapi import Header, HTTPException
from typing import Optional

from .models import Session
from .session_manager import session_manager


async def get_session(x_session_id: Optional[str] = Header(None)) -> Session:
    if not x_session_id:
        raise HTTPException(status_code=400, detail="X-Session-Id header required")
    
    session = session_manager.get_session(x_session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return session