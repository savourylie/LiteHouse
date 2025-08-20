import tempfile
import uuid
from pathlib import Path
from typing import Dict, Optional

from .models import Session


class SessionManager:
    def __init__(self):
        self.sessions: Dict[str, Session] = {}

    def create_session(self) -> Session:
        session_id = uuid.uuid4()
        workspace_dir = Path(tempfile.mkdtemp(prefix=f"litehouse_{session_id.hex[:8]}_"))
        
        session = Session(session_id, workspace_dir)
        self.sessions[str(session_id)] = session
        
        return session

    def get_session(self, session_id: str) -> Optional[Session]:
        return self.sessions.get(session_id)

    def cleanup_session(self, session_id: str) -> bool:
        session = self.sessions.pop(session_id, None)
        if session:
            session.close()
            # Note: In production, also clean up workspace_dir
            return True
        return False


session_manager = SessionManager()