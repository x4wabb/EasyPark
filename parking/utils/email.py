from django.core.mail import send_mail

def send_reservation_email(user_email, subject, message):
    send_mail(
        subject,
        message,
        None, 
        [user_email],
        fail_silently=False,
    )
