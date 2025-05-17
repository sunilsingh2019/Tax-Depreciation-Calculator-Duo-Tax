import asyncio
import logging
from app.schemas.calculator import DepreciationResponse, DepreciationYearDetail
from app.services.email_service import send_email_with_report

# Configure logging
logging.basicConfig(level=logging.INFO)

async def test_email_with_report():
    # Create a sample report
    yearly_breakdown = [
        DepreciationYearDetail(
            year=2023, 
            diminishing_value=5000.0, 
            prime_cost=4000.0, 
            capital_works=3000.0, 
            total=12000.0
        ),
        DepreciationYearDetail(
            year=2024, 
            diminishing_value=4500.0, 
            prime_cost=4000.0, 
            capital_works=3000.0, 
            total=11500.0
        ),
        DepreciationYearDetail(
            year=2025, 
            diminishing_value=4050.0, 
            prime_cost=4000.0, 
            capital_works=3000.0, 
            total=11050.0
        )
    ]
    
    sample_report = DepreciationResponse(
        property_type="residential",
        purchase_price=500000.0,
        construction_date="2010-01-01",
        purchase_date="2023-01-01",
        first_year_depreciation=12000.0,
        five_year_depreciation=57000.0,
        total_depreciable_amount=150000.0,
        yearly_breakdown=yearly_breakdown
    )
    
    # Email to send to
    to_email = "sunil.singh.programmer@gmail.com"  # Change to your email
    
    try:
        logging.info(f"Sending test email with PDF report to {to_email}")
        await send_email_with_report(
            to_email=to_email,
            name="Test User",
            report=sample_report,
            include_attachment=True
        )
        logging.info("Email sent successfully!")
        return True
    except Exception as e:
        logging.error(f"Failed to send email: {str(e)}")
        return False

if __name__ == "__main__":
    asyncio.run(test_email_with_report()) 