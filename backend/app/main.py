from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from contextlib import asynccontextmanager
from pathlib import Path

from .models import LeaderboardEntry, SubmitScoreRequest, ActivePlayer, GameMode, GameState, Snake, Position, Direction, GameStatus
from .database import (
    get_current_user_session,
    get_leaderboard as db_get_leaderboard,
    create_leaderboard_entry,
    db_leaderboard_to_leaderboard,
    seed_database
)
from .db_config import get_db, init_db
from .auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    print("Initializing database...")
    init_db()
    
    # Seed database with initial data
    db = next(get_db())
    try:
        seed_database(db)
    finally:
        db.close()
    
    print("Database initialization complete!")
    yield


app = FastAPI(
    title="Snake Arena API",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(auth_router)


@app.get("/api")
async def root():
    return {"message": "Welcome to Snake Arena API. Visit /docs for documentation."}


@app.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(mode: Optional[GameMode] = None, db: Session = Depends(get_db)):
    """Get leaderboard entries, optionally filtered by game mode."""
    db_entries = db_get_leaderboard(db, mode=mode)
    return [db_leaderboard_to_leaderboard(entry) for entry in db_entries]


@app.post("/leaderboard")
async def submit_score(request: SubmitScoreRequest, db: Session = Depends(get_db)):
    """Submit a score to the leaderboard."""
    current_user = get_current_user_session()
    if not current_user:
        raise HTTPException(status_code=401, detail="Not logged in")
    
    # Create leaderboard entry
    db_entry = create_leaderboard_entry(
        db,
        user_id=current_user.id,
        username=current_user.username,
        score=request.score,
        mode=request.mode
    )
    
    return {"message": "Score submitted", "entry": db_leaderboard_to_leaderboard(db_entry)}


@app.get("/spectator/active", response_model=List[ActivePlayer])
async def get_active_players():
    """Get list of currently active players (mock implementation)."""
    # Return mock active players
    # TODO: Implement real-time player tracking
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


# Mount static files after all API routes
# This ensures API routes take precedence over static file serving
static_dir = Path(__file__).parent.parent / "static"
if static_dir.exists():
    app.mount("/assets", StaticFiles(directory=str(static_dir / "assets")), name="assets")
    
    # Catch-all route for client-side routing
    # This must be last to avoid catching API routes
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve the frontend application for all non-API routes."""
        # If the request is for a static file, try to serve it
        file_path = static_dir / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        
        # Otherwise, serve index.html for client-side routing
        index_path = static_dir / "index.html"
        if index_path.exists():
            return FileResponse(index_path)
        
        # If static files don't exist, return API-only message
        raise HTTPException(status_code=404, detail="Frontend not built. API only mode.")

