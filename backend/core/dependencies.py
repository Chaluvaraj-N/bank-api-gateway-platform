from backend.db.session import get_db


async def get_async_session():
    async for session in get_db():
        yield session