import logging
import tempfile
import os
from weasyprint import HTML, CSS
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)

def test_pdf_generation():
    """Test PDF generation with WeasyPrint"""
    try:
        logging.info("Starting PDF test generation")
        
        # Simple HTML content
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test PDF</title>
            <style>
                body { font-family: Arial; }
                h1 { color: blue; }
            </style>
        </head>
        <body>
            <h1>Test PDF Document</h1>
            <p>This is a test document to verify PDF generation.</p>
        </body>
        </html>
        """
        
        # Create a temporary HTML file
        with tempfile.NamedTemporaryFile(suffix='.html', delete=False) as temp_html:
            temp_html.write(html_content.encode('utf-8'))
            temp_html_path = temp_html.name
            logging.info(f"Temporary HTML file created at {temp_html_path}")
        
        try:
            # Method 1: Using HTML with string
            logging.info("Method 1: Converting HTML from string")
            pdf1 = HTML(string=html_content).write_pdf()
            logging.info(f"Method 1 successful, PDF size: {len(pdf1)} bytes")
            
            # Method 2: Using direct file URL format
            logging.info("Method 2: Using direct file URL format")
            file_url = f"file://{temp_html_path}"
            pdf2 = HTML(url=file_url).write_pdf()
            logging.info(f"Method 2 successful, PDF size: {len(pdf2)} bytes")
            
            # Save a sample PDF for inspection
            with open('/app/test_output.pdf', 'wb') as f:
                f.write(pdf1)
                logging.info("Saved test PDF to /app/test_output.pdf")
                
            return True
        except Exception as e:
            logging.error(f"Error in HTML to PDF conversion: {str(e)}")
            return False
        finally:
            # Clean up temporary file
            logging.info(f"Cleaning up temporary HTML file: {temp_html_path}")
            os.remove(temp_html_path)
    except Exception as e:
        logging.error(f"Error in test_pdf_generation: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_pdf_generation()
    print(f"PDF generation test {'successful' if success else 'failed'}") 