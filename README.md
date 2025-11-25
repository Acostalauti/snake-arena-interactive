# Snake Arena Interactive

A competitive snake game with real-time leaderboards and spectator mode. Built with React, FastAPI, and PostgreSQL.

## Features

- 🎮 Classic snake game with multiple modes (walls, pass-through)
- 🏆 Real-time leaderboard system
- 👀 Spectator mode to watch other players
- 🔐 User authentication and profiles
- 📊 Score tracking and statistics

## Quick Start with Docker (Recommended)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd snake-arena-interactive
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database on port 5432
   - FastAPI backend on port 8000
   - nginx frontend on port 80

3. **Access the application**
   - Frontend: http://localhost
   - Backend API docs: http://localhost:8000/docs

4. **View logs**
   ```bash
   # All services
   docker-compose logs -f

   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f frontend
   docker-compose logs -f postgres
   ```

5. **Stop the application**
   ```bash
   docker-compose down
   ```

6. **Stop and remove all data**
   ```bash
   docker-compose down -v
   ```

### Rebuilding After Code Changes

```bash
# Rebuild and restart all services
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

## Local Development (Without Docker)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies with uv**
   ```bash
   make install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and configure DATABASE_URL if using PostgreSQL
   # Leave empty to use SQLite for local development
   ```

4. **Run development server**
   ```bash
   make dev
   ```

   The API will be available at http://localhost:8000

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:8080

### Run Both Simultaneously

From the root directory:
```bash
npm install
npm run dev
```

## Project Structure

```
snake-arena-interactive/
├── backend/              # FastAPI backend
│   ├── app/             # Application code
│   │   ├── main.py      # FastAPI app entry point
│   │   ├── models.py    # Pydantic models
│   │   ├── database.py  # Database operations
│   │   ├── db_config.py # Database configuration
│   │   ├── db_models.py # SQLAlchemy models
│   │   └── auth.py      # Authentication routes
│   ├── tests_integration/ # Integration tests
│   ├── Dockerfile       # Backend container
│   └── pyproject.toml   # Python dependencies
├── frontend/            # React frontend
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   ├── Dockerfile      # Frontend container
│   ├── nginx.conf      # nginx configuration
│   └── package.json    # Node dependencies
└── docker-compose.yml  # Docker orchestration
```

## Environment Variables

### Backend (.env)

```bash
# PostgreSQL connection (Docker)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/snake_arena

# Or leave empty for SQLite (local development)
# DATABASE_URL=

# Secret key for sessions
SECRET_KEY=your-secret-key-here
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
make test

# Run with Docker
docker-compose exec backend pytest
```

## Database

### PostgreSQL (Production/Docker)

The Docker setup uses PostgreSQL 16 with persistent storage. Data is stored in a Docker volume named `postgres_data`.

### SQLite (Development)

For local development without Docker, the backend defaults to SQLite. The database file is created at `backend/snake_arena.db`.

### Migrations

Database tables are automatically created on startup. To reset the database:

```bash
# Docker
docker-compose down -v
docker-compose up -d

# Local (SQLite)
rm backend/snake_arena.db
# Restart the backend server
```

## Troubleshooting

### Port Conflicts

If ports 80, 8000, or 5432 are already in use:

1. **Edit docker-compose.yml** and change the port mappings:
   ```yaml
   ports:
     - "8080:80"  # Change 80 to 8080 for frontend
     - "8001:8000" # Change 8000 to 8001 for backend
   ```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# Check PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Frontend Not Loading

```bash
# Rebuild frontend
docker-compose up -d --build frontend

# Check nginx logs
docker-compose logs frontend
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

## License

MIT
