import asyncio
import logging
from pathlib import Path
from datetime import datetime, date
from app.services.email_service import send_email_with_report
from app.schemas.calculator import DepreciationResponse, DepreciationYearDetail

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def test_send_email():
    """Test sending an email with the Duo Group logo in Docker"""
    logger.info("Testing email sending with Duo Group logo...")
    
    # Create a mock depreciation report
    yearly_breakdown = [
        DepreciationYearDetail(
            year=i,
            diminishing_value=1000.0 * (0.8 ** i),
            prime_cost=800.0,
            capital_works=1200.0,
            total=1000.0 * (0.8 ** i) + 800.0 + 1200.0
        ) for i in range(1, 6)
    ]
    
    mock_report = DepreciationResponse(
        property_type="residential",
        purchase_price=500000.0,
        construction_date=str(date(2015, 1, 1)),
        purchase_date=str(date.today()),
        first_year_depreciation=3000.0,
        five_year_depreciation=12000.0,
        total_depreciable_amount=50000.0,
        yearly_breakdown=yearly_breakdown
    )
    
    # Test email address
    to_email = "test@example.com"
    
    try:
        # Send the email
        await send_email_with_report(
            to_email=to_email,
            name="Test User",
            report=mock_report,
            include_attachment=True
        )
        logger.info(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return False

if __name__ == "__main__":
    print("\nTEST EMAIL SENDING WITH LOGO IN DOCKER")
    print("====================================")
    
    # Run the async test
    result = asyncio.run(test_send_email())
    
    if result:
        print("\n✅ Email test successful")
    else:
        print("\n❌ Email test failed") 