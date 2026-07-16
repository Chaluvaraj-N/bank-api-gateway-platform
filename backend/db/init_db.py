from backend.db.base import Base
from backend.db.session import engine

# Import all models
from backend.apps.users.models import *
from backend.apps.roles.models import *
from backend.apps.permissions.models import *
from backend.apps.organizations.models import *
from backend.apps.api_manager.models import *
from backend.apps.api_versions.models import *
from backend.apps.consumers.models import *
from backend.apps.gateway.models import *

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)