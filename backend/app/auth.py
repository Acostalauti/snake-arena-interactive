from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from .models import User, LoginRequest, SignupRequest
from .database import (
    get_user_by_email,
    get_user_by_username,
    create_user,
    verify_password,
    set_current_user_session,
    get_current_user_session,
    db_user_to_user
)
from .db_config import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=User)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login with email and password."""
    db_user = verify_password(db, request.email, request.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = db_user_to_user(db_user)
    set_current_user_session(user)
    return user


@router.post("/signup", response_model=User)
async def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """Create a new user account."""
    # Check if email already exists
    if get_user_by_email(db, request.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username already exists
    if get_user_by_username(db, request.username):
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create new user
    db_user = create_user(db, request.username, request.email, request.password)
    user = db_user_to_user(db_user)
    set_current_user_session(user)
    return user


@router.post("/logout")
async def logout():
    """Logout the current user."""
    set_current_user_session(None)
    return {"message": "Successful logout"}


@router.get("/me", response_model=User)
async def get_current_user():
    """Get the currently logged-in user."""
    user = get_current_user_session()
    if user:
        return user
    raise HTTPException(status_code=401, detail="Not logged in")

