from fastapi import APIRouter

from ..models import SessionResponse
from ..session_manager import session_manager

router = APIRouter()


@router.post("/session", response_model=SessionResponse)
async def create_session():
    session = session_manager.create_session()
    return SessionResponse(session_id=str(session.id))