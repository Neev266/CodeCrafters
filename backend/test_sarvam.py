import os
from dotenv import load_dotenv
import io
from sarvamai import SarvamAI

load_dotenv()
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
client = SarvamAI(api_subscription_key=SARVAM_API_KEY)

# write empty valid WAV file
dummy = b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00D\xac\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"

# test without name
f = io.BytesIO(dummy)
try:
    print("Without name...")
    res = client.speech_to_text.transcribe(file=f, model="saaras:v3")
    print("Result:", res)
except Exception as e:
    print("Without name fail:", e)

# test with filename
print("With name...")
f = io.BytesIO(dummy)
f.name = "test.wav"
try:
    res = client.speech_to_text.transcribe(file=f, model="saaras:v3")
    print("Result:", res)
except Exception as e:
    print("With name fail:", e)