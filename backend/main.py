from fastapi import FastAPI
from backend.api.router import api_router

app = FastAPI(
    title="Bank API Gateway Platform"
)

app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "Bank API Gateway Platform Running"}