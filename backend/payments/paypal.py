import os
import requests
from django.conf import settings

def get_paypal_access_token():
    """Get PayPal OAuth access token"""
    client_id = getattr(settings, 'PAYPAL_CLIENT_ID', os.getenv('PAYPAL_CLIENT_ID'))
    client_secret = getattr(settings, 'PAYPAL_CLIENT_SECRET', os.getenv('PAYPAL_CLIENT_SECRET'))
    mode = getattr(settings, 'PAYPAL_MODE', os.getenv('PAYPAL_MODE', 'sandbox'))
    
    base_url = "https://api-m.sandbox.paypal.com" if mode == "sandbox" else "https://api-m.paypal.com"
    
    response = requests.post(
        f"{base_url}/v1/oauth2/token",
        headers={"Accept": "application/json", "Accept-Language": "en_US"},
        auth=(client_id, client_secret),
        data={"grant_type": "client_credentials"}
    )
    
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        raise Exception(f"Failed to get PayPal access token: {response.text}")


def create_order(amount, currency="USD"):
    """Create a PayPal order using v2 API.
    Returns the order ID and approval URL.
    """
    mode = getattr(settings, 'PAYPAL_MODE', os.getenv('PAYPAL_MODE', 'sandbox'))
    base_url = "https://api-m.sandbox.paypal.com" if mode == "sandbox" else "https://api-m.paypal.com"
    
    access_token = get_paypal_access_token()
    
    order_data = {
        "intent": "CAPTURE",
        "purchase_units": [{
            "amount": {
                "currency_code": currency,
                "value": f"{amount:.2f}"
            }
        }]
    }
    
    response = requests.post(
        f"{base_url}/v2/checkout/orders",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        },
        json=order_data
    )
    
    if response.status_code == 201:
        order = response.json()
        # Find approval link
        for link in order.get('links', []):
            if link.get('rel') == 'approve':
                return {"order_id": order['id'], "approval_url": link['href']}
        raise Exception("Approval URL not found in PayPal order response")
    else:
        raise Exception(f"PayPal order creation failed: {response.text}")


def capture_order(order_id):
    """Capture a PayPal order that has been approved by the buyer.
    Returns the capture details.
    """
    mode = getattr(settings, 'PAYPAL_MODE', os.getenv('PAYPAL_MODE', 'sandbox'))
    base_url = "https://api-m.sandbox.paypal.com" if mode == "sandbox" else "https://api-m.paypal.com"
    
    access_token = get_paypal_access_token()
    
    response = requests.post(
        f"{base_url}/v2/checkout/orders/{order_id}/capture",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
    )
    
    if response.status_code == 201:
        return response.json()
    else:
        raise Exception(f"PayPal order capture failed: {response.text}")
