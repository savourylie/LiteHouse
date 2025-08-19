"""Tests for data models."""

import pytest
from datetime import datetime
from pathlib import Path
from uuid import UUID

from litehouse.models import Session, TableMeta


class TestTableMeta:
    """Test TableMeta model."""

    def test_create_csv_table_meta(self):
        """Test creating a CSV table metadata."""
        table_meta = TableMeta(
            name="csv_1",
            kind="csv",
            path="/tmp/test.csv"
        )
        
        assert table_meta.name == "csv_1"
        assert table_meta.kind == "csv"
        assert table_meta.path == "/tmp/test.csv"
        assert table_meta.db is None

    def test_create_sqlite_table_meta(self):
        """Test creating a SQLite table metadata."""
        table_meta = TableMeta(
            name="users",
            kind="sqlite",
            path="/tmp/test.db",
            db="db_1"
        )
        
        assert table_meta.name == "users"
        assert table_meta.kind == "sqlite"
        assert table_meta.path == "/tmp/test.db"
        assert table_meta.db == "db_1"

    def test_invalid_kind_raises_error(self):
        """Test that invalid kind raises validation error."""
        with pytest.raises(ValueError):
            TableMeta(
                name="test",
                kind="invalid",
                path="/tmp/test.txt"
            )


class TestSession:
    """Test Session model."""

    def test_create_session(self, temp_workspace: Path):
        """Test creating a new session."""
        session = Session(
            workspace_dir=str(temp_workspace)
        )
        
        assert isinstance(session.id, UUID)
        assert isinstance(session.created_at, datetime)
        assert session.workspace_dir == str(temp_workspace)
        assert session.tables == {}

    def test_session_id_is_unique(self, temp_workspace: Path):
        """Test that each session gets a unique ID."""
        session1 = Session(workspace_dir=str(temp_workspace))
        session2 = Session(workspace_dir=str(temp_workspace))
        
        assert session1.id != session2.id

    def test_add_table_to_session(self, temp_workspace: Path):
        """Test adding a table to a session."""
        session = Session(workspace_dir=str(temp_workspace))
        table_meta = TableMeta(
            name="csv_1",
            kind="csv",
            path="/tmp/test.csv"
        )
        
        session.add_table(table_meta)
        
        assert "csv_1" in session.tables
        assert session.tables["csv_1"] == table_meta

    def test_get_table_from_session(self, temp_workspace: Path):
        """Test retrieving a table from a session."""
        session = Session(workspace_dir=str(temp_workspace))
        table_meta = TableMeta(
            name="csv_1",
            kind="csv",
            path="/tmp/test.csv"
        )
        session.add_table(table_meta)
        
        retrieved = session.get_table("csv_1")
        
        assert retrieved == table_meta

    def test_get_nonexistent_table_returns_none(self, temp_workspace: Path):
        """Test retrieving a nonexistent table returns None."""
        session = Session(workspace_dir=str(temp_workspace))
        
        retrieved = session.get_table("nonexistent")
        
        assert retrieved is None

    def test_list_tables(self, temp_workspace: Path):
        """Test listing all tables in a session."""
        session = Session(workspace_dir=str(temp_workspace))
        
        table1 = TableMeta(name="csv_1", kind="csv", path="/tmp/1.csv")
        table2 = TableMeta(name="csv_2", kind="csv", path="/tmp/2.csv")
        
        session.add_table(table1)
        session.add_table(table2)
        
        tables = session.list_tables()
        
        assert len(tables) == 2
        assert table1 in tables
        assert table2 in tables
