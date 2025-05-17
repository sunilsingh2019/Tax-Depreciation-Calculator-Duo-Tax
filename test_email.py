import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import sys

# Email configuration
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "sunil.singh.programmer@gmail.com"
SMTP_PASSWORD = "onor qvoo jaqk krxc"
FROM_EMAIL = "sunil.singh.programmer@gmail.com"
FROM_NAME = "Duo Tax Depreciation"

# Recipient email (can be passed as a command-line argument)
TO_EMAIL = sys.argv[1] if len(sys.argv) > 1 else "sunil.singh.programmer@gmail.com"

def send_test_email():
    try:
        # Create email message
        message = MIMEMultipart()
        message["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
        message["To"] = TO_EMAIL
        message["Subject"] = "Test Email from Duo Tax"
        
        # Add email body
        email_body = """
        <html>
        <body>
            <h1>Test Email</h1>
            <p>This is a test email to verify the SMTP connection is working.</p>
            <p>If you receive this, the email system is functioning correctly!</p>
        </body>
        </html>
        """
        message.attach(MIMEText(email_body, "html"))
        
        # Connect to SMTP server
        print(f"Connecting to SMTP server: {SMTP_HOST}:{SMTP_PORT}")
        smtp = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        
        # Start TLS for security
        print("Starting TLS")
        smtp.starttls()
        
        # Authenticate
        print(f"Authenticating with username: {SMTP_USERNAME}")
        smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
        
        # Send the email
        print(f"Sending email to: {TO_EMAIL}")
        smtp.send_message(message)
        
        # Close the connection
        smtp.quit()
        
        print(f"Email sent successfully to {TO_EMAIL}")
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

if __name__ == "__main__":
    send_test_email() 