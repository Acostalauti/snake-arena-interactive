"""
Integration tests for spectator endpoints.

Tests the spectator functionality for viewing active game sessions.
"""
import pytest
from fastapi.testclient import TestClient


class TestSpectator:
    """Test spectator endpoints with real database."""
    
    def test_get_active_players(self, client: TestClient):
        """Test retrieving list of active players."""
        response = client.get("/spectator/active")
        
        assert response.status_code == 200
        players = response.json()
        
        # Should return a list (even if mock data)
        assert isinstance(players, list)
        
        # If there are players, verify structure
        if len(players) > 0:
            player = players[0]
            assert "id" in player
            assert "username" in player
            assert "score" in player
            assert "mode" in player
            assert "gameState" in player
            
            # Verify game state structure
            game_state = player["gameState"]
            assert "snake" in game_state
            assert "food" in game_state
            assert "score" in game_state
            assert "status" in game_state
            assert "mode" in game_state
    
    def test_get_active_players_no_auth_required(self, client: TestClient):
        """Test that getting active players doesn't require authentication."""
        # Don't login
        response = client.get("/spectator/active")
        
        # Should still work without authentication
        assert response.status_code == 200
    
    def test_active_players_consistent_format(self, client: TestClient):
        """Test that active players response has consistent format across calls."""
        # Make multiple requests
        responses = []
        for _ in range(3):
            response = client.get("/spectator/active")
            assert response.status_code == 200
            responses.append(response.json())
        
        # All responses should have the same structure
        for response_data in responses:
            assert isinstance(response_data, list)
            for player in response_data:
                assert "id" in player
                assert "username" in player
                assert "gameState" in player
