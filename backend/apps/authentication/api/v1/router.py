from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer

from backend.apps.authentication.schemas import (
    CurrentUserResponse,
    LoginRequest,
    RefreshTokenRequest,
    RegisterRequest,
    TokenResponse,
)
from backend.apps.authentication.service import (
    AuthenticationService,
    InvalidCredentials,
    TokenValidationError,
    AuthenticationServiceError,
)
from backend.core.dependencies import get_async_session


router = APIRouter(prefix="/auth", tags=["authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_auth_service(session=Depends(get_async_session)) -> AuthenticationService:
    return AuthenticationService(session)


async def get_access_token_user(
    token: str = Depends(oauth2_scheme),
    service: AuthenticationService = Depends(get_auth_service),
) -> CurrentUserResponse:
    try:
        return await service.get_current_user(token)
    except TokenValidationError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest,
    service: AuthenticationService = Depends(get_auth_service),
):
    try:
        return await service.register_user(payload)
    except AuthenticationServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    service: AuthenticationService = Depends(get_auth_service),
):
    try:
        return await service.login_user(payload)
    except InvalidCredentials as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    payload: RefreshTokenRequest,
    service: AuthenticationService = Depends(get_auth_service),
):
    try:
        return await service.refresh_token(payload.refresh_token)
    except TokenValidationError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.get("/me", response_model=CurrentUserResponse)
async def me(current_user: CurrentUserResponse = Depends(get_access_token_user)):
    return current_user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout():
    # Stateless JWT: server-side logout requires token revocation/blacklist.
    # For this phase we treat logout as client-side token disposal.
    return None

