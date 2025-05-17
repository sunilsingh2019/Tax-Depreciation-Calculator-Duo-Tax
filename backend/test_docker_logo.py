import os
import logging
from pathlib import Path
from datetime import datetime, date
from app.services.email_service import generate_pdf_report
from app.schemas.calculator import DepreciationResponse, DepreciationYearDetail

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_logo_paths():
    """Test if logo files exist in the correct locations"""
    templates_dir = Path("/app/app/templates")
    assets_dir = templates_dir / "assets"
    
    # Check if directories exist
    if not templates_dir.exists():
        logger.error(f"Templates directory not found at {templates_dir}")
        return False
    
    if not assets_dir.exists():
        logger.error(f"Assets directory not found at {assets_dir}")
        return False
    
    # Check for Duo Group logo
    duo_group_logo = assets_dir / "duo-group-logo.svg"
    if duo_group_logo.exists():
        logo_size = os.path.getsize(duo_group_logo)
        logger.info(f"Found Duo Group logo: {duo_group_logo} ({logo_size} bytes)")
    else:
        logger.error(f"Duo Group logo not found at {duo_group_logo}")
        return False
    
    # Check if email template references the logo
    email_template = templates_dir / "email_template.html"
    if email_template.exists():
        with open(email_template, 'r') as f:
            content = f.read()
            if 'alt="Duo Group Logo"' in content:
                logger.info("Email template correctly references Duo Group Logo")
            else:
                logger.warning("Email template doesn't reference Duo Group Logo correctly")
    else:
        logger.error(f"Email template not found at {email_template}")
    
    # Check if PDF template references the logo
    pdf_template = templates_dir / "pdf_report_template.html"
    if pdf_template.exists():
        with open(pdf_template, 'r') as f:
            content = f.read()
            if 'alt="Duo Group Logo"' in content:
                logger.info("PDF template correctly references Duo Group Logo")
            else:
                logger.warning("PDF template doesn't reference Duo Group Logo correctly")
    else:
        logger.error(f"PDF template not found at {pdf_template}")
    
    return True

def test_generate_pdf():
    """Test PDF generation with the Duo Group logo"""
    logger.info("Testing PDF generation with Duo Group logo...")
    
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
    
    # Generate PDF
    pdf_data = generate_pdf_report(mock_report)
    
    # Save PDF to file for inspection
    output_path = "/tmp/test_report.pdf"
    with open(output_path, "wb") as f:
        f.write(pdf_data)
    
    logger.info(f"PDF generated and saved to {output_path} ({len(pdf_data)} bytes)")
    
    return len(pdf_data) > 0

if __name__ == "__main__":
    print("\nTEST LOGO INTEGRATION IN DOCKER")
    print("==============================")
    
    # Test logo paths
    print("\nStep 1: Testing logo file paths...")
    if test_logo_paths():
        print("✅ Logo files check passed")
    else:
        print("❌ Logo files check failed")
    
    # Test PDF generation
    print("\nStep 2: Testing PDF generation with logo...")
    if test_generate_pdf():
        print("✅ PDF generation with logo successful")
    else:
        print("❌ PDF generation with logo failed") 