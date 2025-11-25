from typing import List, Optional
from .models import User, LeaderboardEntry, GameMode

# Mock Database
mock_users: List[User] = [
    User(id="1", username="player1", email="player1@example.com"),
    User(id="2", username="speedrunner", email="speedrunner@example.com"),
    User(id="3", username="snakemaster", email="snakemaster@example.com"),
    User(id="4", username="gamer99", email="gamer99@example.com"),
    User(id="5", username="prosnake", email="prosnake@example.com"),
    User(id="6", username="ninja", email="ninja@example.com"),
    User(id="7", username="champion", email="champion@example.com"),
    User(id="8", username="rookie", email="rookie@example.com"),
]

mock_leaderboard: List[LeaderboardEntry] = [
    LeaderboardEntry(id="1", username="snakemaster", score=450, mode=GameMode.walls, date="2024-01-15"),
    LeaderboardEntry(id="2", username="speedrunner", score=380, mode=GameMode.walls, date="2024-01-14"),
    LeaderboardEntry(id="3", username="player1", score=320, mode=GameMode.pass_through, date="2024-01-13"),
    LeaderboardEntry(id="4", username="gamer99", score=290, mode=GameMode.walls, date="2024-01-12"),
    LeaderboardEntry(id="5", username="prosnake", score=260, mode=GameMode.pass_through, date="2024-01-11"),
    LeaderboardEntry(id="6", username="ninja", score=410, mode=GameMode.pass_through, date="2024-01-16"),
    LeaderboardEntry(id="7", username="champion", score=505, mode=GameMode.walls, date="2024-01-17"),
    LeaderboardEntry(id="8", username="rookie", score=150, mode=GameMode.walls, date="2024-01-10"),
    LeaderboardEntry(id="9", username="speedrunner", score=340, mode=GameMode.pass_through, date="2024-01-09"),
    LeaderboardEntry(id="10", username="ninja", score=275, mode=GameMode.walls, date="2024-01-08"),
]

# Simple in-memory session management
# Note: In a real app with multiple workers, this wouldn't work. 
# But for this single-process mock, it's fine.
current_user: Optional[User] = None

def get_current_user_session() -> Optional[User]:
    return current_user

def set_current_user_session(user: Optional[User]):
    global current_user
    current_user = user
