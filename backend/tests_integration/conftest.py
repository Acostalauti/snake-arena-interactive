"""
Configuration for integration tests.

This module provides fixtures for integration testing with a real SQLite database.
Each test gets a fresh database instance with clean state.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import os
import tempfile

from app.main import app
from app.db_models import Base
from app.db_config import get_db
from app.database import seed_database, set_current_user_session


@pytest.fixture(scope="function")
def test_db():
    """
    Create a temporary SQLite database for each test.
    
    This fixture:
    - Creates a fresh database for each test
    - Initializes the schema
    - Seeds with test data
    - Cleans up after the test
    """
    # Create a temporary file for the test database
    db_fd, db_path = tempfile.mkstemp(suffix=".db")
    
    # Create engine with the temporary database
    engine = create_engine(
        f"sqlite:///{db_path}",
        connect_args={"check_same_thread": False}
    )
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSessionLocal()
    
    # Seed the database
    seed_database(db)
    
    try:
        yield db
    finally:
        db.close()
        engine.dispose()
        os.close(db_fd)
        os.unlink(db_path)


@pytest.fixture(scope="function")
def client(test_db: Session):
    """
    Create a test client with a test database.
    
    This fixture overrides the database dependency to use the test database
    and clears session state before each test.
    """
    # Clear any existing session state before each test
    set_current_user_session(None)
    
    def override_get_db():
        try:
            yield test_db
        finally:
            pass  # Don't close the db here, let test_db fixture handle it
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    # Clean up session state after test
    set_current_user_session(None)
    
    # Clean up dependency overrides
    app.dependency_overrides.clear()

