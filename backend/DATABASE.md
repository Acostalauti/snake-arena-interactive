# Snake Arena Backend - Database Setup

This backend uses SQLAlchemy for database operations with support for both **PostgreSQL** (production) and **SQLite** (development/testing).

## Quick Start

### Development (SQLite - Default)

The application uses SQLite by default, which requires no additional setup:

```bash
cd backend
uv run uvicorn app.main:app --reload
```

The database file (`snake_arena.db`) will be created automatically in the backend directory.

### Production (PostgreSQL)

To use PostgreSQL, create a `.env` file in the `backend/` directory:

```bash
DATABASE_URL=postgresql://username:password@hostname:port/database_name
SECRET_KEY=your-secret-key-here
```

Example:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/snake_arena
SECRET_KEY=production-secret-key-change-me
```

## Database Structure

### Tables

#### `users`
- `id` (String, Primary Key) - UUID
- `username` (String, Unique, Indexed)
- `email` (String, Unique, Indexed)
- `password_hash` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### `leaderboard`
- `id` (String, Primary Key) - UUID
- `user_id` (String, Indexed)
- `username` (String)
- `score` (Integer)
- `mode` (Enum: 'walls' or 'pass-through', Indexed)
- `created_at` (DateTime)

## Features

✅ **Automatic Database Initialization**: Tables are created automatically on startup
✅ **Auto-Seeding**: Sample data is loaded on first run
✅ **Environment-Based Configuration**: Switch between SQLite and PostgreSQL via `.env`
✅ **Password Hashing**: SHA-256 password hashing for user security
✅ **Session Management**: In-memory session tracking

## API Endpoints

All endpoints remain the same as before. The database migration is transparent to the API consumers.

### Authentication
- `POST /auth/login` - Login with email and password
- `POST /auth/signup` - Create new user account
- `POST /auth/logout` - Logout current user
- `GET /auth/me` - Get current user info

### Leaderboard
- `GET /leaderboard?mode={walls|pass-through}` - Get leaderboard (optionally filtered by mode)
- `POST /leaderboard` - Submit a score (requires authentication)

### Spectator
- `GET /spectator/active` - Get list of active players

## Test Users

The database is pre-seeded with test users (password: `password123`):
- player1@example.com
- speedrunner@example.com
- snakemaster@example.com
- gamer99@example.com
- prosnake@example.com
- ninja@example.com
- champion@example.com
- rookie@example.com

## Files

- `app/db_models.py` - SQLAlchemy database models
- `app/db_config.py` - Database configuration and session management
- `app/database.py` - Database operations (CRUD functions)
- `app/auth.py` - Authentication endpoints
- `app/main.py` - Main FastAPI application
- `.env` - Environment variables (git-ignored)
- `.env.example` - Example environment configuration

## Migration Notes

- Migrated from in-memory mock data to persistent database storage
- All API endpoints updated to use database operations
- Maintains backward compatibility with existing API contract
- Supports both PostgreSQL and SQLite databases
- Automatic table creation and data seeding on startup
