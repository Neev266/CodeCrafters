# app/services/n8n_service.py

import requests   # 👈 THIS WAS MISSING
from app.core.config import N8N_WEBHOOK_URL

def trigger_n8n(payload):
    try:
        print("Sending to n8n:", payload)

        response = requests.post(N8N_WEBHOOK_URL, json=payload)

        print("n8n response:", response.status_code)
        print("n8n response body:", response.text)

        return response.status_code

    except Exception as e:
        print("Error sending to n8n:", e)
        return None