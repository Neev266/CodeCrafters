from fastapi import APIRouter, Request, UploadFile, File, Form
from app.services.memory import get_memory
from sarvamai import SarvamAI
from dotenv import load_dotenv
import asyncio
import io
import os
import re

load_dotenv()

router = APIRouter()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
print("🔑 SARVAM KEY:", "LOADED ✅" if SARVAM_API_KEY else "MISSING ❌")

sarvam_client = SarvamAI(api_subscription_key=SARVAM_API_KEY)


@router.post("/chat")
async def chat_endpoint(
    request: Request,
    audio: UploadFile = File(None),
):
    print("\n================ NEW REQUEST ================\n")

    session_id = "default"
    user_text = ""

    content_type = request.headers.get("content-type", "")

    # =====================
    # 🎤 VOICE INPUT
    # =====================
    if audio and audio.filename:
        print("🎤 Voice input detected")

        audio_bytes = await audio.read()
        print("🎤 AUDIO SIZE:", len(audio_bytes))

        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = "audio.webm"

        try:
            stt_response = sarvam_client.speech_to_text.transcribe(
                file=audio_file,
                model="saaras:v3",
                mode="transcribe"
            )
            print("📝 STT RESPONSE:", stt_response)
            user_text = getattr(stt_response, "transcript", "") or ""
        except Exception as e:
            print("❌ STT ERROR:", str(e))
            user_text = ""

        form_data = await request.form()
        session_id = form_data.get("session_id", "default")

    # =====================
    # 💬 TEXT INPUT
    # =====================
    else:
        print("💬 Text input detected")
        body = await request.json()
        print("📦 RAW BODY:", body)
        user_text = body.get("text", "")
        session_id = body.get("session_id", "default")

    # =====================
    # 🧠 HANDLE EMPTY INPUT
    # =====================
    if not user_text.strip():
        user_text = "[inaudible]"

    print("👉 USER TEXT:", user_text)
    print("👉 SESSION:", session_id)

    # =====================
    # 🧠 MEMORY
    # =====================
    memory = get_memory(session_id)

    system_prompt = (
        "You are a helpful multilingual AI assistant built into a cognitive productivity platform called CogniFlow. "
        "Reply in the SAME language the user uses. Keep responses short (2-4 sentences) and conversational. "
        "Maintain context from previous messages in this session."
    )

    memory.append({"role": "user", "content": user_text})

    # =====================
    # 🔥 SARVAM CALL
    # =====================
    try:
        print("📡 Sending request to Sarvam...")

        loop = asyncio.get_event_loop()
        response = await asyncio.wait_for(
            loop.run_in_executor(None, lambda: sarvam_client.chat.completions(
                model="sarvam-m",
                messages=[
                    {"role": "system", "content": system_prompt},
                    *memory
                ]
            )),
            timeout=15.0
        )

        print("🧾 RAW SARVAM RESPONSE:", response)

        reply = response.choices[0].message.content
        reply = re.sub(r"<think>.*?</think>", "", reply, flags=re.DOTALL).strip()
        reply = re.sub(r"\s+", " ", reply)

    except asyncio.TimeoutError:
        print("⏱️ SARVAM TIMEOUT")
        reply = "⚠️ The AI took too long to respond. Please try again."
    except Exception as e:
        print("❌ SARVAM ERROR:", str(e))
        reply = f"⚠️ AI error: {str(e)}"

    print("✅ FINAL REPLY:", reply)

    memory.append({"role": "assistant", "content": reply})

    return {
        "user_text": user_text,
        "reply": reply
    }
