"""
Database configuration and session management for SQLAlchemy.
Supports both PostgreSQL (production) and SQLite (development/testing).
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from dotenv import load_dotenv

from .db_models import Base

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")

# If no DATABASE_URL is set, default to SQLite
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./snake_arena.db"
    print(f"Using SQLite database: {DATABASE_URL}")
else:
    print(f"Using database: {DATABASE_URL.split('@')[0]}@...")  # Don't log credentials

# Create engine with appropriate settings
if DATABASE_URL.startswith("sqlite"):
    # SQLite specific settings
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},  # Needed for SQLite
        echo=False  # Set to True for SQL debugging
    )
else:
    # PostgreSQL settings
    engine = create_engine(
        DATABASE_URL,
        echo=False,  # Set to True for SQL debugging
        pool_pre_ping=True,  # Verify connections before using them
        pool_size=5,
        max_overflow=10
    )

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function for FastAPI endpoints to get database session.
    
    Usage in endpoints:
        @app.get("/users")
        def get_users(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
