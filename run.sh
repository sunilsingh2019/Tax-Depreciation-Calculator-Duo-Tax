#!/bin/bash

# Exit on error
set -e

echo "Starting Tax Depreciation Calculator..."
echo "Building and starting Docker containers..."

# Build and start the containers
docker-compose up --build -d

echo ""
echo "Application started!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop the application: docker-compose down" 