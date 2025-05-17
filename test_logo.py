import os
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

def test_logo_files():
    """Test if logo files exist and are accessible"""
    
    # Get the templates directory path
    templates_dir = Path("backend/app/templates")
    assets_dir = templates_dir / "assets"
    
    # Check if directories exist
    if not templates_dir.exists():
        logging.error(f"Templates directory not found at {templates_dir}")
        return False
    
    if not assets_dir.exists():
        logging.error(f"Assets directory not found at {assets_dir}")
        return False
    
    # Check for logo files
    duo_group_logo = assets_dir / "duo-group-logo.svg"
    duo_tax_logo = assets_dir / "duo-tax-logo.svg"
    logo_png = assets_dir / "logo.png"
    
    # Check each logo file
    found_logos = []
    if duo_group_logo.exists():
        logo_size = os.path.getsize(duo_group_logo)
        logging.info(f"Found Duo Group logo: {duo_group_logo} ({logo_size} bytes)")
        found_logos.append("duo-group-logo.svg")
    else:
        logging.warning(f"Duo Group logo not found at {duo_group_logo}")
    
    if duo_tax_logo.exists():
        logo_size = os.path.getsize(duo_tax_logo)
        logging.info(f"Found Duo Tax logo: {duo_tax_logo} ({logo_size} bytes)")
        found_logos.append("duo-tax-logo.svg")
    else:
        logging.warning(f"Duo Tax logo not found at {duo_tax_logo}")
    
    if logo_png.exists():
        logo_size = os.path.getsize(logo_png)
        logging.info(f"Found logo.png: {logo_png} ({logo_size} bytes)")
        found_logos.append("logo.png")
    else:
        logging.warning(f"logo.png not found at {logo_png}")
    
    # Check if email template exists and includes logo reference
    email_template = templates_dir / "email_template.html"
    if email_template.exists():
        with open(email_template, 'r') as f:
            content = f.read()
            if 'alt="Duo Group Logo"' in content:
                logging.info("Email template contains Duo Group Logo reference")
            else:
                logging.warning("Email template doesn't reference Duo Group Logo correctly")
    else:
        logging.error(f"Email template not found at {email_template}")
    
    # Check if PDF template exists and includes logo reference
    pdf_template = templates_dir / "pdf_report_template.html"
    if pdf_template.exists():
        with open(pdf_template, 'r') as f:
            content = f.read()
            if 'alt="Duo Group Logo"' in content:
                logging.info("PDF template contains Duo Group Logo reference")
            else:
                logging.warning("PDF template doesn't reference Duo Group Logo correctly")
    else:
        logging.error(f"PDF template not found at {pdf_template}")
    
    return found_logos

if __name__ == "__main__":
    print("\nTESTING LOGO FILES")
    print("=================")
    found_logos = test_logo_files()
    
    if found_logos:
        print(f"\nLogo files found: {', '.join(found_logos)}")
        if "duo-group-logo.svg" in found_logos:
            print("✅ Duo Group logo is available for use in templates")
        else:
            print("❌ Duo Group logo not found")
    else:
        print("\n❌ No logo files found") 