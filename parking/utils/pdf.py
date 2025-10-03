from django.template.loader import render_to_string
from xhtml2pdf import pisa
import os

def generate_pdf_receipt(reservation, user, price):
    template = 'receipt.html'
    context = {
        "reservation": reservation,
        "user": user,
        "price": price,
    }
    html = render_to_string(template, context)

    receipt_dir = 'media/receipts/'
    os.makedirs(receipt_dir, exist_ok=True)

    # ✅ Use stripe_session_id instead of reservation.id
    filename = f"receipt_{reservation.stripe_session_id}.pdf"
    file_path = os.path.join(receipt_dir, filename)

    with open(file_path, "wb") as f:
        pisa.CreatePDF(html, dest=f)

    return file_path
