from fastapi import FastAPI

from backend.api.router import api_router


def create_app() -> FastAPI:
    app = FastAPI(title="Bank API Gateway", version="0.1.0")
    app.include_router(api_router, prefix="/api")
    return app


app = create_app()

