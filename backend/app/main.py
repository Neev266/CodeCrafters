# app/main.pyfrom fastapi import FastAPI
from app.api.routes import router
from fastapi import FastAPI

app = FastAPI(
    title="Cognitive State Detection API",
    description="Backend for detecting focus, distraction, and confusion",
    version="1.0"
)

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Cognitive Backend Running 🚀"}