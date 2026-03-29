from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.api.chat import router as chat_router
from sys_monitor import monitor
from app.api.queue_routes import router as queue_router


app = FastAPI(
    title="Cognitive State Detection API",
    description="Backend for detecting focus, distraction, and confusion",
    version="1.0"
)
app.include_router(queue_router)
# ✅ CORS FIX (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ STARTUP EVENTS
@app.on_event("startup")
def startup_event():
    monitor.start()

# ✅ SHUTDOWN EVENTS
@app.on_event("shutdown")
def shutdown_event():
    monitor.stop()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(chat_router)

# ✅ ROOT ENDPOINT
@app.get("/")
def root():
    return {
        "message": "Cognitive Backend Running 🚀",
        "system_monitor": "active"
    }

# ✅ FIX FOR /metrics ERROR (optional but recommended)
@app.get("/metrics")
def metrics():
    return {
        "status": "ok",
        "service": "cognitive-backend"
    }

# ✅ TEST ENDPOINT (for n8n debugging)
@app.post("/test")
def test(data: dict):
    return {
        "received": data,
        "status": "success"
    }