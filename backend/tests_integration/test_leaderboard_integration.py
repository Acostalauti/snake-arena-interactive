"""
Integration tests for leaderboard endpoints.

Tests the complete leaderboard functionality including:
- Retrieving leaderboard
- Filtering by game mode
- Submitting scores
- Authentication requirements
"""
import pytest
from fastapi.testclient import TestClient


class TestLeaderboard:
    """Test leaderboard endpoints with real database."""
    
    def test_get_leaderboard_all(self, client: TestClient):
        """Test retrieving all leaderboard entries."""
        response = client.get("/leaderboard")
        
        assert response.status_code == 200
        entries = response.json()
        assert len(entries) > 0
        
        # Verify entries are sorted by score (descending)
        for i in range(len(entries) - 1):
            assert entries[i]["score"] >= entries[i + 1]["score"]
        
        # Verify entry structure
        first_entry = entries[0]
        assert "id" in first_entry
        assert "username" in first_entry
        assert "score" in first_entry
        assert "mode" in first_entry
        assert "date" in first_entry
    
    def test_get_leaderboard_walls_mode(self, client: TestClient):
        """Test filtering leaderboard by walls mode."""
        response = client.get("/leaderboard?mode=walls")
        
        assert response.status_code == 200
        entries = response.json()
        assert len(entries) > 0
        
        # Verify all entries are for walls mode
        for entry in entries:
            assert entry["mode"] == "walls"
        
        # Verify sorting
        for i in range(len(entries) - 1):
            assert entries[i]["score"] >= entries[i + 1]["score"]
    
    def test_get_leaderboard_pass_through_mode(self, client: TestClient):
        """Test filtering leaderboard by pass-through mode."""
        response = client.get("/leaderboard?mode=pass-through")
        
        assert response.status_code == 200
        entries = response.json()
        assert len(entries) > 0
        
        # Verify all entries are for pass-through mode
        for entry in entries:
            assert entry["mode"] == "pass-through"
        
        # Verify sorting
        for i in range(len(entries) - 1):
            assert entries[i]["score"] >= entries[i + 1]["score"]
    
    def test_submit_score_authenticated(self, client: TestClient):
        """Test submitting a score when authenticated."""
        # Login first
        client.post(
            "/auth/login",
            json={
                "email": "player1@example.com",
                "password": "password123"
            }
        )
        
        # Submit score
        response = client.post(
            "/leaderboard",
            json={
                "score": 999,
                "mode": "walls"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "entry" in data
        assert data["entry"]["score"] == 999
        assert data["entry"]["username"] == "player1"
        assert data["entry"]["mode"] == "walls"
    
    def test_submit_score_unauthenticated(self, client: TestClient):
        """Test that submitting score requires authentication."""
        response = client.post(
            "/leaderboard",
            json={
                "score": 500,
                "mode": "walls"
            }
        )
        
        assert response.status_code == 401
    
    def test_submit_score_appears_in_leaderboard(self, client: TestClient):
        """Test that submitted score appears in leaderboard."""
        # Login
        client.post(
            "/auth/login",
            json={
                "email": "speedrunner@example.com",
                "password": "password123"
            }
        )
        
        # Submit a high score
        unique_score = 12345
        client.post(
            "/leaderboard",
            json={
                "score": unique_score,
                "mode": "pass-through"
            }
        )
        
        # Get leaderboard
        response = client.get("/leaderboard?mode=pass-through")
        assert response.status_code == 200
        entries = response.json()
        
        # Verify the score is in the leaderboard
        scores = [entry["score"] for entry in entries]
        assert unique_score in scores
        
        # Find the entry and verify details
        submitted_entry = next(e for e in entries if e["score"] == unique_score)
        assert submitted_entry["username"] == "speedrunner"
        assert submitted_entry["mode"] == "pass-through"
    
    def test_submit_multiple_scores(self, client: TestClient):
        """Test submitting multiple scores for the same user."""
        # Login
        client.post(
            "/auth/login",
            json={
                "email": "gamer99@example.com",
                "password": "password123"
            }
        )
        
        # Submit multiple scores
        scores = [100, 200, 150, 300]
        for score in scores:
            response = client.post(
                "/leaderboard",
                json={
                    "score": score,
                    "mode": "walls"
                }
            )
            assert response.status_code == 200
        
        # Get leaderboard
        response = client.get("/leaderboard?mode=walls")
        assert response.status_code == 200
        entries = response.json()
        
        # Verify all scores are present
        user_entries = [e for e in entries if e["username"] == "gamer99"]
        user_scores = [e["score"] for e in user_entries]
        
        # All submitted scores should be in the leaderboard
        for score in scores:
            assert score in user_scores
    
    def test_submit_score_different_modes(self, client: TestClient):
        """Test submitting scores for different game modes."""
        # Login
        client.post(
            "/auth/login",
            json={
                "email": "prosnake@example.com",
                "password": "password123"
            }
        )
        
        # Submit score for walls mode
        walls_score = 777
        response = client.post(
            "/leaderboard",
            json={
                "score": walls_score,
                "mode": "walls"
            }
        )
        assert response.status_code == 200
        
        # Submit score for pass-through mode
        passthrough_score = 888
        response = client.post(
            "/leaderboard",
            json={
                "score": passthrough_score,
                "mode": "pass-through"
            }
        )
        assert response.status_code == 200
        
        # Verify both scores appear in respective leaderboards
        response = client.get("/leaderboard?mode=walls")
        walls_entries = response.json()
        walls_scores = [e["score"] for e in walls_entries if e["username"] == "prosnake"]
        assert walls_score in walls_scores
        
        response = client.get("/leaderboard?mode=pass-through")
        passthrough_entries = response.json()
        passthrough_scores = [e["score"] for e in passthrough_entries if e["username"] == "prosnake"]
        assert passthrough_score in passthrough_scores
    
    def test_leaderboard_empty_mode_returns_all(self, client: TestClient):
        """Test that not providing a mode returns all entries."""
        response_all = client.get("/leaderboard")
        response_walls = client.get("/leaderboard?mode=walls")
        response_passthrough = client.get("/leaderboard?mode=pass-through")
        
        assert response_all.status_code == 200
        assert response_walls.status_code == 200
        assert response_passthrough.status_code == 200
        
        all_entries = response_all.json()
        walls_entries = response_walls.json()
        passthrough_entries = response_passthrough.json()
        
        # The combined count of filtered entries should not exceed all entries
        # (There might be overlap in the database)
        assert len(all_entries) >= len(walls_entries)
        assert len(all_entries) >= len(passthrough_entries)
