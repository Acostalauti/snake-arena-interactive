"""
SQLAlchemy database models for the Snake Arena application.
"""
from sqlalchemy import Column, String, Integer, DateTime, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from .models import GameMode

Base = declarative_base()


class DBUser(Base):
    """User table for storing user information."""
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class DBLeaderboardEntry(Base):
    """Leaderboard table for storing game scores."""
    __tablename__ = "leaderboard"

    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False, index=True)
    username = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    mode = Column(SQLEnum(GameMode), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<LeaderboardEntry(username={self.username}, score={self.score}, mode={self.mode})>"
