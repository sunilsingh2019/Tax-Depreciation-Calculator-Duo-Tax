import os
import logging
import tempfile
import smtplib  # Use regular smtplib instead of aiosmtplib
from pathlib import Path
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
# from aiosmtplib import SMTP  # Remove this import
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
from app.schemas.calculator import DepreciationResponse
from typing import Optional
import json

# Load templates from the templates directory
template_dir = Path(__file__).parent.parent / "templates"
if not template_dir.exists():
    template_dir.mkdir(exist_ok=True)
    
# Initialize Jinja2 environment
jinja_env = Environment(loader=FileSystemLoader(str(template_dir)))

# Email configuration
# NOTE: This is a demo configuration and does not actually send emails in production
# To send real emails, configure a real SMTP server and credentials below
USE_DEMO_MODE = False  # Set to False to use a real SMTP server

# Demo mode settings
FROM_EMAIL = "sunil.singh.programmer@gmail.com"  # Updated to match SMTP_USERNAME
FROM_NAME = "Duo Tax Depreciation"

# Real SMTP settings - replace with your actual SMTP server details when ready
SMTP_HOST = "smtp.gmail.com"  # Example: "smtp.gmail.com"
SMTP_PORT = 587  # Changed back to 587 for TLS
SMTP_USERNAME = "sunil.singh.programmer@gmail.com"  # Your email: "your-email@gmail.com"
SMTP_PASSWORD = "onor qvoo jaqk krxc"  # Replace with your 16-character app password
SMTP_USE_TLS = True  # Use TLS for Gmail

async def send_email_with_report(
    to_email: str,
    name: Optional[str] = "",
    report: DepreciationResponse = None,
    include_attachment: bool = True
):
    """
    Send an email with the depreciation report as HTML content and optionally as a PDF attachment
    """
    try:
        # Create email message
        message = MIMEMultipart()
        message["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
        message["To"] = to_email
        message["Subject"] = "Your Tax Depreciation Report from Duo Tax"
        
        # Generate the HTML content for the email body using a template
        email_html = generate_email_html(name, report)
        message.attach(MIMEText(email_html, "html"))
        
        # Add PDF attachment if requested
        if include_attachment and report:
            try:
                logging.info(f"Generating PDF attachment for {to_email}")
                try:
                    pdf_data = generate_pdf_report(report)
                    
                    attachment = MIMEApplication(pdf_data, _subtype="pdf")
                    attachment.add_header(
                        "Content-Disposition", 
                        f"attachment; filename=tax_depreciation_report_{datetime.now().strftime('%Y%m%d')}.pdf"
                    )
                    message.attach(attachment)
                    logging.info("PDF attachment generated and added to email")
                except Exception as pdf_error:
                    logging.error(f"Failed to generate PDF with WeasyPrint: {str(pdf_error)}")
                    # Continue sending email without attachment
                    logging.info("Sending email without PDF attachment due to PDF generation error")
            except Exception as pdf_error:
                logging.error(f"Failed to generate PDF: {str(pdf_error)}")
                # Continue sending email without attachment

        # Check if we're in demo mode
        if USE_DEMO_MODE:
            # Log the email details instead of actually sending it
            logging.info(f"DEMO MODE: Email would be sent to {to_email}")
            logging.info(f"DEMO MODE: Email subject: {message['Subject']}")
            
            # Create a directory to save demo emails if it doesn't exist
            demo_email_dir = Path(__file__).parent.parent / "demo_emails"
            if not demo_email_dir.exists():
                demo_email_dir.mkdir(exist_ok=True)
            
            # Save the email content to a file for demo purposes
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            demo_file = demo_email_dir / f"email_{timestamp}.html"
            with open(demo_file, "w") as f:
                f.write(f"To: {to_email}\n")
                f.write(f"Subject: {message['Subject']}\n")
                f.write(f"Attachment: {'Yes' if include_attachment else 'No'}\n\n")
                f.write(email_html)
            
            # Return success without actually sending
            logging.info(f"DEMO MODE: Email would be sent to {to_email} - saved to {demo_file}")
            return
        
        # Only reach here if not in demo mode - actually send the email using smtplib
        try:
            # Connect to SMTP server
            logging.info(f"Connecting to SMTP server: {SMTP_HOST}:{SMTP_PORT}")
            smtp = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
            
            # Start TLS for security
            if SMTP_USE_TLS:
                logging.info("Starting TLS")
                smtp.starttls()
            
            # Authenticate if credentials are provided
            if SMTP_USERNAME and SMTP_PASSWORD:
                logging.info(f"Authenticating with username: {SMTP_USERNAME}")
                smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
            
            # Send the email
            logging.info(f"Sending email to: {to_email}")
            smtp.send_message(message)
            
            # Close the connection
            smtp.quit()
            
            logging.info(f"Email sent successfully to {to_email}")
        except Exception as e:
            logging.error(f"Failed to send email: {str(e)}")
            raise e
    except Exception as e:
        logging.error(f"Error in send_email_with_report: {str(e)}")
        raise e


def generate_email_html(name: str, report: DepreciationResponse) -> str:
    """
    Generate HTML content for the email body
    """
    # Ensure the template directory has the email template
    email_template_path = template_dir / "email_template.html"
    if not email_template_path.exists():
        create_default_email_template()
    
    # Load the template
    template = jinja_env.get_template("email_template.html")
    
    # Prepare data for the template
    context = {
        "name": name or "Property Investor",
        "report": report,
        "current_year": datetime.now().year,
        "formatted_date": datetime.now().strftime("%d %B %Y"),
    }
    
    # Render the template with data
    return template.render(**context)


def generate_pdf_report(report: DepreciationResponse) -> bytes:
    """
    Generate a PDF report from the depreciation data - with multiple fallback options
    """
    try:
        logging.info("Starting PDF generation process")
        
        # Ensure the template directory has the PDF template
        pdf_template_path = template_dir / "pdf_report_template.html"
        if not pdf_template_path.exists():
            logging.info("PDF template not found, creating default template")
            create_default_pdf_template()
        else:
            logging.info(f"Found existing PDF template at {pdf_template_path}")
        
        # Resolve the logo path for the template
        duo_group_logo_path = Path(__file__).parent.parent / "templates" / "assets" / "duo-group-logo.svg"
        if not duo_group_logo_path.exists():
            logging.warning(f"Duo Group logo file not found at {duo_group_logo_path}")
            # Fallback to original logo if new logo not found
            duo_group_logo_path = Path(__file__).parent.parent / "templates" / "assets" / "duo-tax-logo.svg"
            if not duo_group_logo_path.exists():
                logging.warning(f"Duo Tax logo file not found at {duo_group_logo_path}")
                duo_group_logo_path = ""
        
        # Load the template
        template = jinja_env.get_template("pdf_report_template.html")
        logging.info("PDF template loaded successfully")
        
        # Prepare data for the template
        context = {
            "report": report,
            "current_year": datetime.now().year,
            "formatted_date": datetime.now().strftime("%d %B %Y"),
            "duo_group_logo_path": str(duo_group_logo_path) if duo_group_logo_path else ""
        }
        
        # Render the template with data
        logging.info("Rendering HTML content for PDF")
        html_content = template.render(**context)
        
        # Try multiple approaches for PDF generation
        
        # Approach 1: Try using WeasyPrint directly
        try:
            logging.info("Approach 1: Using WeasyPrint HTML string")
            from weasyprint import HTML
            pdf = HTML(string=html_content).write_pdf()
            logging.info(f"Approach 1 successful, PDF size: {len(pdf)} bytes")
            return pdf
        except Exception as e:
            logging.error(f"Approach 1 failed: {str(e)}")
            
            # Approach 2: Try using different constructor parameters
            try:
                logging.info("Approach 2: Using WeasyPrint with base_url")
                # Create a temporary HTML file
                with tempfile.NamedTemporaryFile(suffix='.html', delete=False) as temp_html:
                    temp_html.write(html_content.encode('utf-8'))
                    temp_html_path = temp_html.name
                
                base_dir = os.path.dirname(temp_html_path)
                from weasyprint import HTML
                pdf = HTML(filename=temp_html_path, base_url=base_dir).write_pdf()
                logging.info(f"Approach 2 successful, PDF size: {len(pdf)} bytes")
                
                # Clean up
                os.unlink(temp_html_path)
                return pdf
            except Exception as e:
                logging.error(f"Approach 2 failed: {str(e)}")
                
                # Approach 3: Try using command line
                try:
                    logging.info("Approach 3: Using command line WeasyPrint")
                    # Use subprocess
                    import subprocess
                    
                    # Write HTML to a temporary file
                    with tempfile.NamedTemporaryFile(suffix='.html', mode='w', delete=False) as temp_html:
                        temp_html.write(html_content)
                        temp_html_path = temp_html.name
                    
                    # Write to a temporary PDF file
                    pdf_output_path = temp_html_path + ".pdf"
                    
                    # Run WeasyPrint
                    subprocess.run(
                        ["weasyprint", temp_html_path, pdf_output_path],
                        check=True,
                        capture_output=True
                    )
                    
                    # Read the PDF file
                    with open(pdf_output_path, 'rb') as pdf_file:
                        pdf_data = pdf_file.read()
                    
                    # Clean up
                    os.unlink(temp_html_path)
                    os.unlink(pdf_output_path)
                    
                    if pdf_data and len(pdf_data) > 0:
                        logging.info(f"Approach 3 successful, PDF size: {len(pdf_data)} bytes")
                        return pdf_data
                    else:
                        raise Exception("Generated PDF is empty")
                except Exception as e:
                    logging.error(f"Approach 3 failed: {str(e)}")
                    
                    # Final fallback: Just return the HTML content as bytes
                    logging.info("All PDF generation approaches failed, sending HTML content as fallback")
                    html_with_styling = f"""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <title>Tax Depreciation Report</title>
                        <style>
                            body {{ font-family: Arial, sans-serif; margin: 20px; }}
                            h1 {{ color: #1a6cc3; }}
                            h2 {{ color: #1a6cc3; border-bottom: 2px solid #e87722; padding-bottom: 5px; }}
                            table {{ border-collapse: collapse; width: 100%; margin: 15px 0; }}
                            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                            th {{ background-color: #f2f2f2; color: #333; }}
                            .highlight {{ color: #e87722; font-weight: bold; }}
                            .footer {{ margin-top: 30px; text-align: center; font-size: 12px; color: #777; }}
                        </style>
                    </head>
                    <body>
                        {html_content}
                        <div class="footer">
                            <p>Note: This document is in HTML format because PDF generation failed.</p>
                        </div>
                    </body>
                    </html>
                    """
                    return html_with_styling.encode('utf-8')
    except Exception as e:
        logging.error(f"Error in generate_pdf_report: {str(e)}")
        # If all else fails, return a simple message
        return f"Error generating report: {str(e)}".encode('utf-8')


def create_default_email_template():
    """
    Create a default email template if none exists
    """
    default_email_template = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Your Tax Depreciation Report</title>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 0; }
            .header { background-color: #e87722; color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; background-color: #f5f7fa; padding: 20px; }
            .highlight { color: #e87722; font-weight: bold; }
            h1, h2, h3 { color: #1a6cc3; margin-top: 0; }
            .summary-box { background-color: #f5f7fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #e87722; }
            .summary-item { margin-bottom: 15px; }
            .btn { display: inline-block; background-color: #e87722; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 15px; }
            .btn:hover { background-color: #d16616; }
            a { color: #1a6cc3; text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="color: white;">Your Tax Depreciation Report</h1>
            </div>
            <div class="content">
                <p>Hello {{ name }},</p>
                
                <p>Thank you for using <span class="highlight">Duo Tax's Depreciation Calculator</span>. Attached is your complete tax depreciation schedule for your investment property.</p>
                
                <div class="summary-box">
                    <h3>Report Summary:</h3>
                    <div class="summary-item">
                        <strong>Property Type:</strong> 
                        {% if report.property_type == "residential" %}
                            Residential Property
                        {% elif report.property_type == "commercial" %}
                            Commercial Property
                        {% elif report.property_type == "industrial" %}
                            Industrial Property
                        {% else %}
                            {{ report.property_type }}
                        {% endif %}
                    </div>
                    <div class="summary-item">
                        <strong>First Year Deduction:</strong> <span class="highlight">${{ "{:,.2f}".format(report.first_year_depreciation) }}</span>
                    </div>
                    <div class="summary-item">
                        <strong>First 5 Years:</strong> <span class="highlight">${{ "{:,.2f}".format(report.five_year_depreciation) }}</span>
                    </div>
                    <div class="summary-item">
                        <strong>Total Depreciable Amount:</strong> <span class="highlight">${{ "{:,.2f}".format(report.total_depreciable_amount) }}</span>
                    </div>
                </div>
                
                <p>For a comprehensive tax depreciation schedule prepared by our quantity surveyors, please contact us at <a href="mailto:info@duotax.com.au">info@duotax.com.au</a>.</p>
                
                <a href="https://duotax.com.au" class="btn">Visit Our Website</a>
                
                <p>Best regards,<br>The Duo Tax Team</p>
            </div>
            <div class="footer">
                <p>&copy; {{ current_year }} Duo Tax Depreciation. All rights reserved.</p>
                <p>This email was sent on {{ formatted_date }}</p>
                <p>
                    <a href="https://duotax.com.au/privacy">Privacy Policy</a> | 
                    <a href="https://duotax.com.au/terms">Terms of Service</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    template_path = template_dir / "email_template.html"
    with open(template_path, "w") as f:
        f.write(default_email_template)


def create_default_pdf_template():
    """
    Create a default PDF template if none exists
    """
    default_pdf_template = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Tax Depreciation Report</title>
        <style>
            @page { size: A4; margin: 2cm; }
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 100%; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; }
            .logo { max-width: 180px; height: auto; display: block; margin: 0 auto 15px; }
            h1 { color: #1a6cc3; margin-top: 10px; margin-bottom: 5px; }
            h2 { color: #1a6cc3; border-bottom: 2px solid #e87722; padding-bottom: 8px; margin-top: 40px; margin-bottom: 20px; }
            h3 { color: #1a6cc3; }
            p.subtitle { color: #666; font-size: 14px; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            table, th, td { border: 1px solid #e5e7eb; }
            th, td { padding: 12px; text-align: left; }
            th { background-color: #f3f4f6; color: #1a6cc3; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            .summary-box { background-color: #f5f7fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #e87722; }
            .highlight { color: #e87722; font-weight: bold; }
            .chart-placeholder { height: 300px; background-color: #f9f9f9; display: flex; justify-content: center; align-items: center; border: 1px dashed #ccc; }
            .company-info { margin-top: 15px; font-size: 13px; color: #666; }
            .company-info p { margin: 3px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="file://{duo_group_logo_path}" alt="Duo Tax Logo" class="logo" />
                <h1>Tax Depreciation Report</h1>
                <p class="subtitle">Generated on {{ formatted_date }}</p>
            </div>
            
            <h2>Property Information</h2>
            <table>
                <tr>
                    <th>Property Type</th>
                    <td>{{ report.property_type }}</td>
                </tr>
                <tr>
                    <th>Purchase Price</th>
                    <td><span class="highlight">${{ "{:,.2f}".format(report.purchase_price) }}</span></td>
                </tr>
                <tr>
                    <th>Construction Date</th>
                    <td>{{ report.construction_date if hasattr(report, 'construction_date') else 'Not Specified' }}</td>
                </tr>
                <tr>
                    <th>Purchase Date</th>
                    <td>{{ report.purchase_date if hasattr(report, 'purchase_date') else 'Not Specified' }}</td>
                </tr>
            </table>
            
            <h2>Depreciation Summary</h2>
            <div class="summary-box">
                <table>
                    <tr>
                        <th>First Year Deduction</th>
                        <td><span class="highlight">${{ "{:,.2f}".format(report.first_year_depreciation) }}</span></td>
                    </tr>
                    <tr>
                        <th>First 5 Years</th>
                        <td><span class="highlight">${{ "{:,.2f}".format(report.five_year_depreciation) }}</span></td>
                    </tr>
                    <tr>
                        <th>Total Depreciable Amount</th>
                        <td><span class="highlight">${{ "{:,.2f}".format(report.total_depreciable_amount) }}</span></td>
                    </tr>
                </table>
            </div>
            
            <h2>Yearly Depreciation Schedule</h2>
            <table>
                <tr>
                    <th>Year</th>
                    <th>Diminishing Value ($)</th>
                    <th>Prime Cost ($)</th>
                    <th>Capital Works ($)</th>
                    <th>Total ($)</th>
                </tr>
                {% for year in report.yearly_breakdown %}
                <tr>
                    <td>{{ year.year }}</td>
                    <td>${{ "{:,.2f}".format(year.diminishing_value) }}</td>
                    <td>${{ "{:,.2f}".format(year.prime_cost) }}</td>
                    <td>${{ "{:,.2f}".format(year.capital_works) }}</td>
                    <td><span class="highlight">${{ "{:,.2f}".format(year.total) }}</span></td>
                </tr>
                {% endfor %}
            </table>
            
            <div class="footer">
                <p>This report was generated using Duo Tax's Depreciation Calculator.</p>
                <p>For a comprehensive tax depreciation schedule prepared by our quantity surveyors, please contact us at info@duotax.com.au</p>
                <div class="company-info">
                    <p>Duo Tax Depreciation | ABN: 12 345 678 901</p>
                    <p>Suite 123, 456 Business Street, Sydney NSW 2000</p>
                    <p>Phone: (02) 1234 5678 | Email: info@duotax.com.au</p>
                </div>
                <p>&copy; {{ current_year }} Duo Tax Depreciation. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Include the absolute path to the logo for PDF generation
    duo_group_logo_path = Path(__file__).parent.parent / "templates" / "assets" / "duo-group-logo.svg"
    default_pdf_template = default_pdf_template.format(duo_group_logo_path=duo_group_logo_path)
    
    template_path = template_dir / "pdf_report_template.html"
    with open(template_path, "w") as f:
        f.write(default_pdf_template) 