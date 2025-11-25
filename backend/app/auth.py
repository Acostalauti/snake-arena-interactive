from fastapi import APIRouter, HTTPException
from .models import User, LoginRequest, SignupRequest
from .database import mock_users, set_current_user_session, get_current_user_session

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=User)
async def login(request: LoginRequest):
    user = next((u for u in mock_users if u.email == request.email), None)
    if user and request.password == "password": # Mock password check
        set_current_user_session(user)
        return user
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/signup", response_model=User)
async def signup(request: SignupRequest):
    new_user = User(
        id=str(len(mock_users) + 1),
        username=request.username,
        email=request.email
    )
    mock_users.append(new_user)
    set_current_user_session(new_user)
    return new_user

@router.post("/logout")
async def logout():
    set_current_user_session(None)
    return {"message": "Successful logout"}

@router.get("/me", response_model=User)
async def get_current_user():
    user = get_current_user_session()
    if user:
        return user
    raise HTTPException(status_code=401, detail="Not logged in")
