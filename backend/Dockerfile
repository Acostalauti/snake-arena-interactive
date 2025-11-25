# Use Python 3.12 slim image
FROM python:3.12-slim-bookworm

WORKDIR /app

# Install system dependencies for PostgreSQL
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY pyproject.toml ./

# Install dependencies using pip
RUN pip install --no-cache-dir \
    alembic>=1.17.2 \
    fastapi>=0.122.0 \
    httpx>=0.28.1 \
    psycopg2-binary>=2.9.11 \
    pytest>=9.0.1 \
    python-dotenv>=1.2.1 \
    sqlalchemy>=2.0.44 \
    uvicorn>=0.38.0

# Copy application code
COPY . .

# Set Python path
ENV PYTHONPATH="/app:$PYTHONPATH"

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
