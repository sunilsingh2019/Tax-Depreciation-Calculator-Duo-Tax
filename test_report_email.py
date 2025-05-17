import requests
import json
import sys
from datetime import datetime, date

# API endpoint
BASE_URL = "http://localhost:8000"

# Recipient email (can be passed as a command-line argument)
TO_EMAIL = sys.argv[1] if len(sys.argv) > 1 else "test@example.com"

def test_report_email():
    """Send a test report email with the new Duo Group logo"""
    
    print(f"Sending test report email to: {TO_EMAIL}")
    
    # Create sample depreciation data
    sample_data = {
        "property_type": "residential",
        "purchase_price": 750000,
        "purchase_date": str(date.today()),
        "construction_date": "2015-01-01",
        "additional_assets": [
            {
                "name": "Carpet",
                "value": 5000,
                "effective_life": 10
            },
            {
                "name": "Air Conditioning",
                "value": 8000,
                "effective_life": 5
            }
        ]
    }
    
    # First calculate the depreciation report
    print("Calculating depreciation report...")
    calc_response = requests.post(f"{BASE_URL}/calculate", json=sample_data)
    
    if calc_response.status_code != 200:
        print(f"Error calculating report: {calc_response.status_code}")
        print(calc_response.text)
        return False
    
    # Get the report data from the calculation response
    report_data = calc_response.json()
    print("Report calculated successfully")
    
    # Now send the email with the report
    email_data = {
        "email": TO_EMAIL,
        "name": "Test User",
        "report": report_data
    }
    
    print("Sending email with report...")
    email_response = requests.post(f"{BASE_URL}/send-report", json=email_data)
    
    if email_response.status_code != 200:
        print(f"Error sending email: {email_response.status_code}")
        print(email_response.text)
        return False
    
    print("Email sent successfully")
    
    # Get the email response data
    email_result = email_response.json()
    print(f"Email response: {email_result}")
    
    return True

if __name__ == "__main__":
    print("\nTESTING REPORT EMAIL WITH NEW LOGO")
    print("=================================")
    
    result = test_report_email()
    
    if result:
        print("\n✅ Test completed successfully")
    else:
        print("\n❌ Test failed") 