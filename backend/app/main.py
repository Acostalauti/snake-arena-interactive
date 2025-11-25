from fastapi import FastAPI, HTTPException
from typing import List, Optional
from datetime import date
from .models import LeaderboardEntry, SubmitScoreRequest, ActivePlayer, GameMode, GameState, Snake, Position, Direction, GameStatus
from .database import mock_leaderboard, get_current_user_session
from .auth import router as auth_router

app = FastAPI(title="Snake Arena API", version="1.0.0")

app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "Welcome to Snake Arena API. Visit /docs for documentation."}

@app.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(mode: Optional[GameMode] = None):
    entries = mock_leaderboard
    if mode:
        entries = [e for e in entries if e.mode == mode]
    return sorted(entries, key=lambda x: x.score, reverse=True)

@app.post("/leaderboard")
async def submit_score(request: SubmitScoreRequest):
    current_user = get_current_user_session()
    if not current_user:
        raise HTTPException(status_code=401, detail="Not logged in")
    
    entry = LeaderboardEntry(
        id=str(len(mock_leaderboard) + 1),
        username=current_user.username,
        score=request.score,
        mode=request.mode,
        date=date.today().isoformat()
    )
    mock_leaderboard.append(entry)
    return {"message": "Score submitted"}

@app.get("/spectator/active", response_model=List[ActivePlayer])
async def get_active_players():
    # Return mock active players
    return [
        ActivePlayer(
            id="1",
            username="speedrunner",
            score=120,
            mode=GameMode.walls,
            gameState=GameState(
                snake=Snake(body=[Position(x=10, y=10)], direction=Direction.RIGHT),
                food=Position(x=15, y=10),
                score=120,
                status=GameStatus.playing,
                mode=GameMode.walls
            )
        ),
        ActivePlayer(
            id="2",
            username="snakemaster",
            score=180,
            mode=GameMode.pass_through,
            gameState=GameState(
                snake=Snake(body=[Position(x=8, y=8)], direction=Direction.UP),
                food=Position(x=8, y=3),
                score=180,
                status=GameStatus.playing,
                mode=GameMode.pass_through
            )
        )
    ]
