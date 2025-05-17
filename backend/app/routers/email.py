from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
from app.services.email_service import send_email_with_report
from app.schemas.calculator import DepreciationResponse, DepreciationYearDetail
import logging

router = APIRouter(
    prefix="/email",
    tags=["email"],
    responses={404: {"description": "Not found"}},
)

class EmailReportRequest(BaseModel):
    to: EmailStr
    name: Optional[str] = ""
    report: DepreciationResponse
    includeAttachment: bool = True

@router.get("/test")
async def test_email_route(request: Request):
    """Test endpoint to verify the email router is working"""
    return {
        "message": "Email router is working",
        "path": request.url.path,
        "full_url": str(request.url)
    }

@router.post("/send-report")
async def send_report(request: EmailReportRequest, background_tasks: BackgroundTasks):
    try:
        # Log request for debugging
        logging.info(f"Received email request for: {request.to}")
        
        # Process the email in the background so we don't hold up the response
        background_tasks.add_task(
            send_email_with_report,
            to_email=request.to,
            name=request.name,
            report=request.report,
            include_attachment=request.includeAttachment
        )
        
        return {"status": "success", "message": "Email queued for delivery"}
    except Exception as e:
        logging.error(f"Error sending email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

@router.get("/send-test-email")
async def send_test_email(email: Optional[str] = None, include_attachment: bool = True):
    """
    Test endpoint to send a test email directly
    """
    try:
        # Default test email address if none provided
        to_email = email or "sunil.singh.programmer@gmail.com"
        
        # Create a simple test report
        test_report = DepreciationResponse(
            property_type="residential",
            purchase_price=500000,
            first_year_depreciation=10000,
            five_year_depreciation=50000,
            total_depreciable_amount=400000,
            yearly_breakdown=[
                DepreciationYearDetail(
                    year=1,
                    diminishing_value=3000,
                    prime_cost=2000,
                    capital_works=5000,
                    total=10000
                ),
                DepreciationYearDetail(
                    year=2,
                    diminishing_value=2500,
                    prime_cost=2000,
                    capital_works=5000,
                    total=9500
                )
            ]
        )
        
        # Log that we're sending a test email
        logging.info(f"Sending test email to: {to_email} with attachment: {include_attachment}")
        
        # Send the email directly (not in background)
        await send_email_with_report(
            to_email=to_email,
            name="Test User",
            report=test_report,
            include_attachment=include_attachment
        )
        
        return {"status": "success", "message": f"Test email sent to {to_email}"}
    except Exception as e:
        logging.error(f"Error sending test email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send test email: {str(e)}")