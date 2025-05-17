from fastapi import APIRouter, HTTPException
from app.schemas.calculator import DepreciationRequest, DepreciationResponse
from app.services.calculator import calculate_depreciation

router = APIRouter(tags=["calculator"])

@router.post("/calculate", response_model=DepreciationResponse)
async def calculate(request: DepreciationRequest):
    """
    Calculate tax depreciation based on property information
    """
    try:
        result = calculate_depreciation(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 