# Snake Arena Backend

## Setup

1. Install `uv` if you haven't already.
2. Install dependencies:
   ```bash
   uv sync
   ```

## Running the Server

### Using Makefile (Recommended)

```bash
make dev
```

### Manual Command

To start the development server with hot reload:

```bash
uv run uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
API Documentation (Swagger UI) is available at `http://localhost:8000/docs`.

## Common Commands

View all available Makefile commands:

```bash
make help
```

- `make install` - Install/sync dependencies
- `make dev` - Run development server
- `make test` - Run tests
- `make clean` - Remove generated files and caches

## Running Tests

To run the test suite:

```bash
uv run pytest
```
