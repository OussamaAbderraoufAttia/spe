from fastapi import FastAPI
from app.api.api_v1.api import api_router
from starlette.middleware.cors import CORSMiddleware

app = FastAPI(title="LeakControl API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to LeakControl API"}

