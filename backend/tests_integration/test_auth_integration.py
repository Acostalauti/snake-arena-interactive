"""
Integration tests for authentication endpoints.

Tests the complete authentication flow including:
- User signup
- User login
- Session management
- Logout
"""
import pytest
from fastapi.testclient import TestClient


class TestAuthentication:
    """Test authentication endpoints with real database."""
    
    def test_signup_new_user(self, client: TestClient):
        """Test creating a new user account."""
        response = client.post(
            "/auth/signup",
            json={
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "securepassword123"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "newuser"
        assert data["email"] == "newuser@example.com"
        assert "id" in data
        assert "password" not in data  # Should not return password
    
    def test_signup_duplicate_email(self, client: TestClient):
        """Test that duplicate email addresses are rejected."""
        # First signup
        client.post(
            "/auth/signup",
            json={
                "username": "user1",
                "email": "duplicate@example.com",
                "password": "password123"
            }
        )
        
        # Second signup with same email
        response = client.post(
            "/auth/signup",
            json={
                "username": "user2",
                "email": "duplicate@example.com",
                "password": "password456"
            }
        )
        
        assert response.status_code == 400
        assert "already" in response.json()["detail"].lower()
    
    def test_signup_duplicate_username(self, client: TestClient):
        """Test that duplicate usernames are rejected."""
        # First signup
        client.post(
            "/auth/signup",
            json={
                "username": "duplicateuser",
                "email": "user1@example.com",
                "password": "password123"
            }
        )
        
        # Second signup with same username
        response = client.post(
            "/auth/signup",
            json={
                "username": "duplicateuser",
                "email": "user2@example.com",
                "password": "password456"
            }
        )
        
        assert response.status_code == 400
        assert "already" in response.json()["detail"].lower()
    
    def test_login_success(self, client: TestClient):
        """Test successful login with correct credentials."""
        response = client.post(
            "/auth/login",
            json={
                "email": "player1@example.com",
                "password": "password123"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "player1"
        assert data["email"] == "player1@example.com"
        assert "id" in data
    
    def test_login_wrong_password(self, client: TestClient):
        """Test login fails with incorrect password."""
        response = client.post(
            "/auth/login",
            json={
                "email": "player1@example.com",
                "password": "wrongpassword"
            }
        )
        
        assert response.status_code == 401
        assert "invalid" in response.json()["detail"].lower()
    
    def test_login_nonexistent_user(self, client: TestClient):
        """Test login fails for non-existent user."""
        response = client.post(
            "/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "password123"
            }
        )
        
        assert response.status_code == 401
        assert "invalid" in response.json()["detail"].lower()
    
    def test_get_current_user_authenticated(self, client: TestClient):
        """Test getting current user info when logged in."""
        # Login first
        client.post(
            "/auth/login",
            json={
                "email": "player1@example.com",
                "password": "password123"
            }
        )
        
        # Get current user
        response = client.get("/auth/me")
        
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "player1"
        assert data["email"] == "player1@example.com"
    
    def test_get_current_user_unauthenticated(self, client: TestClient):
        """Test getting current user info when not logged in."""
        response = client.get("/auth/me")
        
        assert response.status_code == 401
        assert "not logged in" in response.json()["detail"].lower()
    
    def test_logout(self, client: TestClient):
        """Test logout functionality."""
        # Login first
        client.post(
            "/auth/login",
            json={
                "email": "player1@example.com",
                "password": "password123"
            }
        )
        
        # Verify logged in
        response = client.get("/auth/me")
        assert response.status_code == 200
        
        # Logout
        response = client.post("/auth/logout")
        assert response.status_code == 200
        
        # Verify logged out
        response = client.get("/auth/me")
        assert response.status_code == 401
    
    def test_session_persistence(self, client: TestClient):
        """Test that session persists across multiple requests."""
        # Login
        client.post(
            "/auth/login",
            json={
                "email": "speedrunner@example.com",
                "password": "password123"
            }
        )
        
        # Make multiple requests
        for _ in range(3):
            response = client.get("/auth/me")
            assert response.status_code == 200
            assert response.json()["username"] == "speedrunner"
    
    def test_login_creates_new_session(self, client: TestClient):
        """Test that logging in as different user changes session."""
        # Login as player1
        response = client.post(
            "/auth/login",
            json={
                "email": "player1@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 200
        assert response.json()["username"] == "player1"
        
        # Login as speedrunner (new session)
        response = client.post(
            "/auth/login",
            json={
                "email": "speedrunner@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 200
        assert response.json()["username"] == "speedrunner"
        
        # Verify current user is speedrunner
        response = client.get("/auth/me")
        assert response.status_code == 200
        assert response.json()["username"] == "speedrunner"
