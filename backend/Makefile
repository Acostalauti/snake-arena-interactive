.PHONY: help install dev test clean lint

help:
	@echo "Available commands:"
	@echo "  make install    - Install/sync dependencies with uv"
	@echo "  make dev        - Run development server with auto-reload"
	@echo "  make test       - Run tests"
	@echo "  make clean      - Remove generated files and caches"
	@echo "  make lint       - Run linter (if configured)"

install:
	uv sync

dev:
	uv run uvicorn app.main:app --reload

test:
	uv run python -m pytest

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	rm -rf .pytest_cache 2>/dev/null || true
	rm -rf .coverage 2>/dev/null || true
	rm -rf htmlcov 2>/dev/null || true

lint:
	uv run ruff check .
