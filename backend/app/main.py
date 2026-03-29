from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.api.chat import router as chat_router
from sys_monitor import monitor

app = FastAPI(
    title="Cognitive State Detection API",
    description="Backend for detecting focus, distraction, and confusion",
    version="1.0"
)

@app.on_event("startup")
def startup_event():
    monitor.start()

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

@app.get("/")
def root():
    return {"message": "Cognitive Backend Running 🚀", "system_monitor": "active"}