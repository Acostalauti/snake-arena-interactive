# Integration Tests

This directory contains integration tests that use a real SQLite database to test the complete API functionality.

## Overview

Integration tests verify that all components work correctly together:
- **Database**: Real SQLite database (temporary, created for each test)
- **API**: Complete FastAPI application
- **Authentication**: Full auth flow with sessions
- **Data Persistence**: Actual database operations

## Test Files

- `conftest.py` - Test configuration and fixtures
- `test_auth_integration.py` - Authentication endpoints
- `test_leaderboard_integration.py` - Leaderboard endpoints  
- `test_spectator_integration.py` - Spectator endpoints

## Running Tests

Run all integration tests:
```bash
cd backend
uv run pytest tests_integration/ -v
```

Run specific test file:
```bash
uv run pytest tests_integration/test_auth_integration.py -v
```

Run specific test:
```bash
uv run pytest tests_integration/test_auth_integration.py::TestAuthentication::test_login_success -v
```

## Test Database

Each test function gets a fresh SQLite database:
- Created in a temporary location
- Pre-seeded with test data
- Automatically cleaned up after the test
- Completely isolated from other tests

## Test Data

The test database is seeded with the same data as the development database:
- 8 test users (password: `password123`)
- 10 leaderboard entries
- Users: player1, speedrunner, snakemaster, gamer99, prosnake, ninja, champion, rookie

## Writing New Tests

To add new integration tests:

1. Create a test file: `test_<feature>_integration.py`
2. Import the fixtures from `conftest.py`
3. Use the `client` fixture for API calls
4. Use the `test_db` fixture if you need direct database access

Example:
```python
def test_my_feature(client):
    response = client.get("/my-endpoint")
    assert response.status_code == 200
```
