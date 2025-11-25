"""
Database operations for the Snake Arena application.
Provides CRUD operations for users and leaderboard entries using SQLAlchemy.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
import uuid
from datetime import datetime

from .models import User, LeaderboardEntry, GameMode
from .db_models import DBUser, DBLeaderboardEntry


# Session Management (in-memory for now, can be replaced with JWT tokens later)
current_user: Optional[User] = None


def get_current_user_session() -> Optional[User]:
    """Get the currently logged-in user from session."""
    return current_user


def set_current_user_session(user: Optional[User]):
    """Set the currently logged-in user in session."""
    global current_user
    current_user = user


# Database Operations

def seed_database(db: Session):
    """Seed the database with initial data if empty."""
    # Check if database is already seeded
    user_count = db.query(DBUser).count()
    if user_count > 0:
        return  # Already seeded
    
    print("Seeding database with initial data...")
    
    # Create mock users (for demo purposes, using simple hashed passwords)
    from hashlib import sha256
    mock_users = [
        DBUser(id="1", username="player1", email="player1@example.com", 
               password_hash=sha256("password123".encode()).hexdigest()),
        DBUser(id="2", username="speedrunner", email="speedrunner@example.com",
               password_hash=sha256("password123".encode()).hexdigest()),
        DBUser(id="3", username="snakemaster", email="snakemaster@example.com",
               password_hash=sha256("password123".encode()).hexdigest()),
        DBUser(id="4", username="gamer99", email="gamer99@example.com",
               password_hash=sha256("password123".encode()).hexdigest()),
        DBUser(id="5", username="prosnake", email="prosnake@example.com",
               password_hash=sha256("password123".encode()).hexdigest()),
        DBUser(id="6", username="ninja", email="ninja@example.com",
               password_hash=sha256("password123".encode()).hexdigest()),
        DBUser(id="7", username="champion", email="champion@example.com",
               password_hash=sha256("password123".encode()).hexdigest()),
        DBUser(id="8", username="rookie", email="rookie@example.com",
               password_hash=sha256("password123".encode()).hexdigest()),
    ]
    
    for user in mock_users:
        db.add(user)
    
    # Create mock leaderboard entries
    mock_leaderboard = [
        DBLeaderboardEntry(id="1", user_id="3", username="snakemaster", score=450, mode=GameMode.walls),
        DBLeaderboardEntry(id="2", user_id="2", username="speedrunner", score=380, mode=GameMode.walls),
        DBLeaderboardEntry(id="3", user_id="1", username="player1", score=320, mode=GameMode.pass_through),
        DBLeaderboardEntry(id="4", user_id="4", username="gamer99", score=290, mode=GameMode.walls),
        DBLeaderboardEntry(id="5", user_id="5", username="prosnake", score=260, mode=GameMode.pass_through),
        DBLeaderboardEntry(id="6", user_id="6", username="ninja", score=410, mode=GameMode.pass_through),
        DBLeaderboardEntry(id="7", user_id="7", username="champion", score=505, mode=GameMode.walls),
        DBLeaderboardEntry(id="8", user_id="8", username="rookie", score=150, mode=GameMode.walls),
        DBLeaderboardEntry(id="9", user_id="2", username="speedrunner", score=340, mode=GameMode.pass_through),
        DBLeaderboardEntry(id="10", user_id="6", username="ninja", score=275, mode=GameMode.walls),
    ]
    
    for entry in mock_leaderboard:
        db.add(entry)
    
    db.commit()
    print("Database seeded successfully!")


# User Operations

def get_user_by_email(db: Session, email: str) -> Optional[DBUser]:
    """Get a user by email address."""
    return db.query(DBUser).filter(DBUser.email == email).first()


def get_user_by_username(db: Session, username: str) -> Optional[DBUser]:
    """Get a user by username."""
    return db.query(DBUser).filter(DBUser.username == username).first()


def get_user_by_id(db: Session, user_id: str) -> Optional[DBUser]:
    """Get a user by ID."""
    return db.query(DBUser).filter(DBUser.id == user_id).first()


def create_user(db: Session, username: str, email: str, password: str) -> DBUser:
    """Create a new user."""
    from hashlib import sha256
    user_id = str(uuid.uuid4())
    password_hash = sha256(password.encode()).hexdigest()
    
    db_user = DBUser(
        id=user_id,
        username=username,
        email=email,
        password_hash=password_hash
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def verify_password(db: Session, email: str, password: str) -> Optional[DBUser]:
    """Verify user credentials and return user if valid."""
    from hashlib import sha256
    user = get_user_by_email(db, email)
    if not user:
        return None
    
    password_hash = sha256(password.encode()).hexdigest()
    if user.password_hash == password_hash:
        return user
    return None


# Leaderboard Operations

def get_leaderboard(db: Session, mode: Optional[GameMode] = None, limit: int = 100) -> List[DBLeaderboardEntry]:
    """Get leaderboard entries, optionally filtered by game mode."""
    query = db.query(DBLeaderboardEntry)
    
    if mode:
        query = query.filter(DBLeaderboardEntry.mode == mode)
    
    return query.order_by(desc(DBLeaderboardEntry.score)).limit(limit).all()


def create_leaderboard_entry(db: Session, user_id: str, username: str, score: int, mode: GameMode) -> DBLeaderboardEntry:
    """Create a new leaderboard entry."""
    entry_id = str(uuid.uuid4())
    
    db_entry = DBLeaderboardEntry(
        id=entry_id,
        user_id=user_id,
        username=username,
        score=score,
        mode=mode
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def get_user_best_score(db: Session, user_id: str, mode: GameMode) -> Optional[int]:
    """Get the user's best score for a specific game mode."""
    entry = db.query(DBLeaderboardEntry).filter(
        DBLeaderboardEntry.user_id == user_id,
        DBLeaderboardEntry.mode == mode
    ).order_by(desc(DBLeaderboardEntry.score)).first()
    
    return entry.score if entry else None


# Helper function to convert DB models to Pydantic models

def db_user_to_user(db_user: DBUser) -> User:
    """Convert database user to Pydantic User model."""
    return User(
        id=db_user.id,
        username=db_user.username,
        email=db_user.email
    )


def db_leaderboard_to_leaderboard(db_entry: DBLeaderboardEntry) -> LeaderboardEntry:
    """Convert database leaderboard entry to Pydantic LeaderboardEntry model."""
    return LeaderboardEntry(
        id=db_entry.id,
        username=db_entry.username,
        score=db_entry.score,
        mode=db_entry.mode,
        date=db_entry.created_at.strftime("%Y-%m-%d") if db_entry.created_at else ""
    )
