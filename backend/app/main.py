from fastapi import FastAPI
from app.api.routes import router
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

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Cognitive Backend Running 🚀", "system_monitor": "active"}