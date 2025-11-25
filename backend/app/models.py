from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

# Enums
class GameMode(str, Enum):
    walls = "walls"
    pass_through = "pass-through"

class GameStatus(str, Enum):
    idle = "idle"
    playing = "playing"
    paused = "paused"
    game_over = "game-over"

class Direction(str, Enum):
    UP = "UP"
    DOWN = "DOWN"
    LEFT = "LEFT"
    RIGHT = "RIGHT"

# Models
class User(BaseModel):
    id: str
    username: str
    email: str

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

class LeaderboardEntry(BaseModel):
    id: str
    username: str
    score: int
    mode: GameMode
    date: str

class SubmitScoreRequest(BaseModel):
    score: int
    mode: GameMode

class Position(BaseModel):
    x: int
    y: int

class Snake(BaseModel):
    body: List[Position]
    direction: Direction

class GameState(BaseModel):
    snake: Snake
    food: Position
    score: int
    status: GameStatus
    mode: GameMode

class ActivePlayer(BaseModel):
    id: str
    username: str
    score: int
    mode: GameMode
    gameState: GameState
