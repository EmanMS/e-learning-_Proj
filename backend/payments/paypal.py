import os
import paypalrestsdk
from django.conf import settings

# Initialize PayPal SDK with settings or environment variables
paypalrestsdk.configure({
    "mode": getattr(settings, 'PAYPAL_MODE', os.getenv("PAYPAL_MODE", "sandbox")),
    "client_id": getattr(settings, 'PAYPAL_CLIENT_ID', os.getenv("PAYPAL_CLIENT_ID", "your_paypal_client_id")),
    "client_secret": getattr(settings, 'PAYPAL_CLIENT_SECRET', os.getenv("PAYPAL_CLIENT_SECRET", "your_paypal_client_secret")),
})


def create_order(amount, currency="USD"):
    """Create a PayPal order.
    Returns the order ID and approval URL.
    """
    order = paypalrestsdk.Order({
        "intent": "CAPTURE",
        "purchase_units": [{
            "amount": {
                "currency_code": currency,
                "value": f"{amount:.2f}",
            }
        }]
    })
    if order.create():
        # Find approval link
        for link in order.links:
            if link.rel == "approve":
                return {"order_id": order.id, "approval_url": link.href}
        raise Exception("Approval URL not found in PayPal order response.")
    else:
        raise Exception(f"PayPal order creation failed: {order.error}")


def capture_order(order_id):
    """Capture a PayPal order that has been approved by the buyer.
    Returns the capture details.
    """
    order = paypalrestsdk.Order.find(order_id)
    if order is None:
        raise Exception("PayPal order not found.")
    if order.capture():
        return order.to_dict()
    else:
        raise Exception(f"PayPal order capture failed: {order.error}")
