# Tax Depreciation Calculator

A web application for calculating tax depreciation for properties in Australia. This project is built with FastAPI (backend) and React with TypeScript (frontend), containerized with Docker.

## Features

- Calculate depreciation for residential, commercial, and industrial properties
- Support for both capital works and plant & equipment assets
- Calculate depreciation using both diminishing value and prime cost methods
- View detailed yearly breakdown of expected depreciation
- Interactive charts for visualizing depreciation over time

## Tech Stack

- **Backend**: FastAPI, Python 3.9
- **Frontend**: React, TypeScript, Tailwind CSS, Recharts, Vite
- **Containerization**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose installed

### Running the Application

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/tax-depreciation-calculator.git
   cd tax-depreciation-calculator
   ```

2. Start the application using Docker Compose:
   ```
   docker-compose up
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Development

### Backend

The backend is built with FastAPI and provides endpoints for calculating tax depreciation based on Australian tax rules.

Key files:
- `backend/app/main.py`: Main application entry point
- `backend/app/routers/calculator.py`: API routes for the calculator
- `backend/app/services/calculator.py`: Business logic for depreciation calculations
- `backend/app/schemas/calculator.py`: Data models and validation

### Frontend

The frontend is built with React, TypeScript, and Tailwind CSS, providing a modern and responsive user interface with proper type safety.

Key files:
- `frontend/src/components/CalculatorForm.tsx`: Form for inputting property details
- `frontend/src/components/ResultsDisplay.tsx`: Display for depreciation results
- `frontend/src/services/calculatorService.ts`: Service for communicating with the API

## API Documentation

When the application is running, you can access the API documentation at `http://localhost:8000/docs`.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Duo Tax Quantity Surveyors](https://duotax.com.au/) for the inspiration 