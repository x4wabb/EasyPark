from twilio.rest import Client
from django.conf import settings


def send_sms(to_number, message):
    """
    Sends an SMS using the Twilio API.
    
    Args:
        to_number (str): The recipient's phone number (in E.164 format, e.g., +905xxxxxxxxx).
        message (str): The message content.

    Returns:
        str: The SID of the sent message if successful.
    """
    account_sid = settings.TWILIO_ACCOUNT_SID
    auth_token = settings.TWILIO_AUTH_TOKEN
    from_number = settings.TWILIO_PHONE_NUMBER

    client = Client(account_sid, auth_token)

    try:
        sms = client.messages.create(
            body=message,
            from_=from_number,
            to=to_number
        )
        return sms.sid
    except Exception as e:
        print(f"❌ SMS sending failed: {e}")
        return None
