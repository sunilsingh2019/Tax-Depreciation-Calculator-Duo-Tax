# Using Docker with Tax Depreciation Calculator

This document provides instructions on how to use Docker with the Tax Depreciation Calculator application. Docker ensures consistent environments across development and production.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Starting the Application

1. Clone the repository:
   ```
   git clone <repository-url>
   cd tax--depreciation-calculator
   ```

2. Build and start the Docker containers:
   ```
   docker-compose up --build -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Testing PDF Generation and Email

We've included test scripts to verify that the logo displays correctly in both PDF reports and emails:

1. Test PDF generation:
   ```
   docker exec tax--depreciation-calculator-backend-1 python -m test_docker_logo
   ```
   This will create a test PDF at `/tmp/test_report.pdf` inside the container.

2. Test email functionality:
   ```
   docker exec tax--depreciation-calculator-backend-1 python -m test_docker_email
   ```
   This will send a test email to `test@example.com` (configure in the script if needed).

3. Extract the generated PDF from the container for inspection:
   ```
   docker cp tax--depreciation-calculator-backend-1:/tmp/test_report.pdf ./test_report.pdf
   ```

## Configuration

The Docker setup includes:

1. Pre-installation of all required system dependencies for PDF generation (WeasyPrint)
2. Support for SVG files in the PDF reports
3. Automatic setup of template directories
4. Embedding of the Duo Group logo in both PDF reports and emails

## Stopping the Application

To stop the Docker containers:
```
docker-compose down
```

## Troubleshooting

If you encounter issues with PDF generation:

1. Check logs:
   ```
   docker logs tax--depreciation-calculator-backend-1
   ```

2. Access a shell in the container:
   ```
   docker exec -it tax--depreciation-calculator-backend-1 bash
   ```

3. Verify assets directory:
   ```
   ls -la /app/app/templates/assets/
   ```

## Development with Docker

For development, the Docker configuration mounts local volumes, so your code changes will be reflected in real-time without rebuilding the containers. 