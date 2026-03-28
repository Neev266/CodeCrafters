import requests

N8N_WEBHOOK_URL = "https://your-n8n-url/webhook/cognitive"

def trigger_n8n(payload):
    try:
        print("\n📤 Sending to n8n:", payload)

        response = requests.post(N8N_WEBHOOK_URL, json=payload)
        print(f"Payload:{payload}")
        print("✅ n8n triggered:", response.status_code)

    except Exception as e:
        print("❌ n8n error:", e)