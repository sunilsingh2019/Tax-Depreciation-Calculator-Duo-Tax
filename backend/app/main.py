from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routers import calculator, email
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

# Get a logger for this module
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Tax Depreciation Calculator API",
    description="API for calculating tax depreciation for properties",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Debug route to see what paths are being received
@app.get("/debug")
async def debug_route(request: Request):
    return {
        "message": "Debug endpoint",
        "path": request.url.path,
        "full_url": str(request.url),
        "method": request.method
    }

# Debug route at /api/v1/debug
@app.get("/api/v1/debug")
async def api_v1_debug_route(request: Request):
    return {
        "message": "API v1 debug endpoint",
        "path": request.url.path,
        "full_url": str(request.url),
        "method": request.method
    }

# Include routers
app.include_router(calculator.router, prefix="/api/v1")
app.include_router(email.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to the Tax Depreciation Calculator API"} 