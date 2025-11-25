from fastapi.testclient import TestClient
from app.main import app
from app.database import mock_users, mock_leaderboard
from app.models import GameMode

client = TestClient(app)

def test_read_main():
    response = client.get("/auth/me")
    assert response.status_code == 401

def test_login_success():
    response = client.post("/auth/login", json={"email": "player1@example.com", "password": "password"})
    assert response.status_code == 200
    assert response.json()["username"] == "player1"

def test_login_failure():
    response = client.post("/auth/login", json={"email": "player1@example.com", "password": "wrongpassword"})
    assert response.status_code == 401

def test_signup():
    response = client.post("/auth/signup", json={"username": "newuser", "email": "new@example.com", "password": "password"})
    assert response.status_code == 200
    assert response.json()["username"] == "newuser"
    
    # Verify user was added
    assert any(u.username == "newuser" for u in mock_users)

def test_get_current_user():
    # Login first
    client.post("/auth/login", json={"email": "player1@example.com", "password": "password"})
    
    response = client.get("/auth/me")
    assert response.status_code == 200
    assert response.json()["username"] == "player1"

def test_logout():
    # Login first
    client.post("/auth/login", json={"email": "player1@example.com", "password": "password"})
    
    response = client.post("/auth/logout")
    assert response.status_code == 200
    
    # Verify logout
    response = client.get("/auth/me")
    assert response.status_code == 401

def test_get_leaderboard():
    response = client.get("/leaderboard")
    assert response.status_code == 200
    assert len(response.json()) > 0
    
    # Verify sorting
    entries = response.json()
    assert entries[0]["score"] >= entries[1]["score"]

def test_filter_leaderboard():
    response = client.get("/leaderboard?mode=walls")
    assert response.status_code == 200
    entries = response.json()
    assert all(e["mode"] == "walls" for e in entries)

def test_submit_score():
    # Login first
    client.post("/auth/login", json={"email": "player1@example.com", "password": "password"})
    
    response = client.post("/leaderboard", json={"score": 500, "mode": "walls"})
    assert response.status_code == 200
    
    # Verify score added
    response = client.get("/leaderboard")
    entries = response.json()
    assert any(e["score"] == 500 and e["username"] == "player1" for e in entries)

def test_submit_score_unauthorized():
    # Logout first
    client.post("/auth/logout")
    
    response = client.post("/leaderboard", json={"score": 500, "mode": "walls"})
    assert response.status_code == 401

def test_get_active_players():
    response = client.get("/spectator/active")
    assert response.status_code == 200
    assert len(response.json()) > 0
