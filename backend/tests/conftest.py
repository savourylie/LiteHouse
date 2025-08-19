"""Pytest configuration and shared fixtures."""

import tempfile
import shutil
from pathlib import Path
from typing import Generator
import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def temp_workspace() -> Generator[Path, None, None]:
    """Create a temporary workspace directory for testing."""
    temp_dir = Path(tempfile.mkdtemp())
    try:
        yield temp_dir
    finally:
        shutil.rmtree(temp_dir)


@pytest.fixture
def sample_csv_content() -> str:
    """Sample CSV content for testing."""
    return """id,name,age,city
1,Alice,25,New York
2,Bob,30,San Francisco
3,Charlie,35,Chicago"""


@pytest.fixture
def sample_csv_file(temp_workspace: Path, sample_csv_content: str) -> Path:
    """Create a sample CSV file for testing."""
    csv_file = temp_workspace / "sample.csv"
    csv_file.write_text(sample_csv_content)
    return csv_file
