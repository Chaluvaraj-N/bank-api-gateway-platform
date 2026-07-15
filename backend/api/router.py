from fastapi import APIRouter

from backend.apps.authentication.api.v1.router import router as authentication_router

from backend.apps.organizations.api.v1.router import router as organizations_router
from backend.apps.users.api.v1.router import router as users_router
from backend.apps.roles.api.v1.router import router as roles_router
from backend.apps.permissions.api.v1.router import router as permissions_router
from backend.apps.api_manager.api.v1.router import router as api_manager_router
from backend.apps.api_versions.api.v1.router import router as api_versions_router
from backend.apps.api_lifecycle.router import router as api_lifecycle_router
from backend.apps.gateway.router import router as gateway_router
from backend.apps.consumers.api.v1.router import router as consumers_router

api_router = APIRouter()

api_router.include_router(authentication_router)
api_router.include_router(organizations_router)
api_router.include_router(users_router)
api_router.include_router(roles_router)
api_router.include_router(permissions_router)
api_router.include_router(api_manager_router)
api_router.include_router(api_versions_router)
api_router.include_router(api_lifecycle_router)
api_router.include_router(gateway_router)
api_router.include_router(consumers_router)








