# Snake Arena Interactive

A competitive snake game with real-time leaderboards and spectator mode. Built with React, FastAPI, and PostgreSQL.

## Features

- 🎮 Classic snake game with multiple modes (walls, pass-through)
- 🏆 Real-time leaderboard system
- 👀 Spectator mode to watch other players
- 🔐 User authentication and profiles
- 📊 Score tracking and statistics

## CI/CD Pipeline

![CI Status](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)

This project uses GitHub Actions for continuous integration and deployment:

- **Automated Testing**: All pushes and pull requests trigger backend (pytest) and frontend (vitest) tests
- **Automatic Deployment**: When tests pass on `main` branch, changes are automatically deployed to Render

### GitHub Actions Workflows

- **[CI - Run Tests](.github/workflows/ci.yml)**: Runs backend and frontend tests in parallel
- **[CD - Deploy to Render](.github/workflows/deploy.yml)**: Deploys to Render after successful tests

### Setup Deploy Hook

To enable automatic deployment to Render:

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Select your `snake-arena-app` web service
3. Navigate to Settings → Deploy Hook
4. Copy the deploy hook URL
5. In your GitHub repository, go to Settings → Secrets and variables → Actions
6. Create a new secret:
   - **Name**: `RENDER_DEPLOY_HOOK_URL`
   - **Value**: Paste the deploy hook URL
7. Save the secret

Once configured, every merge to `main` will automatically deploy to Render after tests pass.

### Running Tests Locally

```bash
# Backend tests
cd backend
make test

# Frontend tests
cd frontend
npm test
```


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
   - Unified application (backend API + frontend) on port 8000

3. **Access the application**
   - Application: http://localhost:8000
   - Backend API docs: http://localhost:8000/docs

4. **View logs**
   ```bash
   # All services
   docker-compose logs -f

   # Specific service
   docker-compose logs -f backend
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
│   ├── Dockerfile       # Backend-only container (legacy)
│   └── pyproject.toml   # Python dependencies
├── frontend/            # React frontend
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   ├── Dockerfile      # Frontend-only container (legacy)
│   ├── nginx.conf      # nginx configuration (for standalone frontend)
│   └── package.json    # Node dependencies
├── Dockerfile          # Unified container (backend + frontend)
└── docker-compose.yml  # Docker orchestration
```

**Note**: The unified `Dockerfile` at the project root builds both frontend and backend into a single container. The individual `Dockerfile`s in `backend/` and `frontend/` directories are kept for local development flexibility.

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

If ports 8000 or 5432 are already in use:

1. **Edit docker-compose.yml** and change the port mappings:
   ```yaml
   ports:
     - "8001:8000"  # Change 8000 to 8001 for the application
   ```

2. **Access the application** at http://localhost:8001

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
# Rebuild the unified container
docker-compose up -d --build backend

# Check application logs
docker-compose logs backend
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

## Deploying to Render

Deploy to Render cloud platform with one click using the Blueprint:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Quick Deploy

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Create **New Blueprint** and connect your repository
4. Render automatically detects `render.yaml` and sets up:
   - PostgreSQL database (free tier)
   - Unified web service (backend + frontend)
5. Your app will be live at `https://snake-arena-app.onrender.com`

**Free tier includes:**
- 750 hours/month runtime
- PostgreSQL database
- Automatic HTTPS
- Auto-deploy from Git

> [!NOTE]
> Free tier services spin down after 15 minutes of inactivity (30-60s cold start). Upgrade to $7/month for always-on service.

For detailed deployment instructions, troubleshooting, and custom domain setup, see the [Render Deployment Guide](RENDER_DEPLOY.md).

## License

MIT

New line for test CI/CD
