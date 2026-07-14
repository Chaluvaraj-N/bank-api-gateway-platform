from __future__ import annotations

import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from backend.apps.authentication.repository import AuthenticationRepository
from backend.apps.authentication.schemas import (
    CurrentUserResponse,
    LoginRequest,
    RegisterRequest,
    TokenResponse,
)
from backend.apps.users.models import User
from backend.core.config import JWT_AUDIENCE, JWT_ISSUER


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@dataclass(frozen=True)
class TokenSettings:
    access_expires: timedelta
    refresh_expires: timedelta


default_token_settings = TokenSettings(
    access_expires=timedelta(minutes=30),
    refresh_expires=timedelta(days=7),
)


class AuthenticationServiceError(Exception):
    pass


class InvalidCredentials(AuthenticationServiceError):
    pass


class TokenValidationError(AuthenticationServiceError):
    pass


class AuthenticationService:
    def __init__(
        self,
        session: AsyncSession,
        *,
        token_settings: TokenSettings = default_token_settings,
    ):
        self.repo = AuthenticationRepository(session)
        self.session = session
        self.token_settings = token_settings

    def _hash_password(self, password: str) -> str:
        return pwd_context.hash(password)

    def _verify_password(self, password: str, hashed_password: str) -> bool:
        return pwd_context.verify(password, hashed_password)

    def _build_access_token(self, user: User) -> str:
        now = datetime.now(timezone.utc)
        payload = {
            "sub": str(user.email),
            "token_type": "access",
            "jti": str(uuid.uuid4()),
            "iss": JWT_ISSUER,
            "aud": JWT_AUDIENCE,
            "iat": int(now.timestamp()),
            "exp": int((now + self.token_settings.access_expires).timestamp()),
        }
        return jwt.encode(payload, self._jwt_secret(), algorithm="HS256")

    def _build_refresh_token(self, user: User) -> str:
        now = datetime.now(timezone.utc)
        jti = str(uuid.uuid4())
        payload = {
            "sub": str(user.email),
            "token_type": "refresh",
            "jti": jti,
            "iss": JWT_ISSUER,
            "aud": JWT_AUDIENCE,
            "iat": int(now.timestamp()),
            "exp": int((now + self.token_settings.refresh_expires).timestamp()),
        }
        return jwt.encode(payload, self._jwt_secret(), algorithm="HS256")

    def _jwt_secret(self) -> str:
        # Production-grade systems should use strong env-based secrets.
        # Current project skeleton doesn't expose them; fall back to a placeholder.
        # Replace with secure secret management when available.
        return "CHANGE_ME_JWT_SECRET"

    def _decode_token(self, token: str) -> dict:
        try:
            payload = jwt.decode(
                token,
                self._jwt_secret(),
                algorithms=["HS256"],
                audience=JWT_AUDIENCE,
                issuer=JWT_ISSUER,
            )
            return payload
        except JWTError as e:
            raise TokenValidationError(str(e))

    async def register_user(self, payload: RegisterRequest) -> TokenResponse:
        # Validate uniqueness + existing user
        existing = await self.repo.get_user_by_email(payload.email)
        if existing is not None:
            raise AuthenticationServiceError("Email already exists")

        user = User(
            organization_id=payload.organization_id,
            role_id=payload.role_id,
            email=payload.email,
            hashed_password=self._hash_password(payload.password),
            first_name=payload.first_name,
            last_name=payload.last_name,
            designation=payload.designation,
            status=payload.status,
            is_active=True,
            is_deleted=False,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)

        access = self._build_access_token(user)
        refresh = self._build_refresh_token(user)

        return TokenResponse(
            access_token=access,
            refresh_token=refresh,
            access_expires_in_seconds=int(self.token_settings.access_expires.total_seconds()),
            refresh_expires_in_seconds=int(
                self.token_settings.refresh_expires.total_seconds()
            ),
        )

    async def login_user(self, payload: LoginRequest) -> TokenResponse:
        user = await self.repo.get_user_by_email(payload.email)
        if user is None or not self._verify_password(payload.password, user.hashed_password):
            raise InvalidCredentials("Invalid email or password")

        access = self._build_access_token(user)
        refresh = self._build_refresh_token(user)
        return TokenResponse(
            access_token=access,
            refresh_token=refresh,
            access_expires_in_seconds=int(self.token_settings.access_expires.total_seconds()),
            refresh_expires_in_seconds=int(
                self.token_settings.refresh_expires.total_seconds()
            ),
        )

    async def refresh_token(self, refresh_token: str) -> TokenResponse:
        payload = self._decode_token(refresh_token)
        if payload.get("token_type") != "refresh":
            raise TokenValidationError("Invalid token type")

        email = payload.get("sub")
        if not email:
            raise TokenValidationError("Missing subject")

        user = await self.repo.get_user_by_email(email)
        if user is None:
            raise TokenValidationError("User not found")

        access = self._build_access_token(user)
        # Optional refresh rotation: keeping existing refresh token for now.
        return TokenResponse(
            access_token=access,
            refresh_token=refresh_token,
            access_expires_in_seconds=int(self.token_settings.access_expires.total_seconds()),
            refresh_expires_in_seconds=int(
                self.token_settings.refresh_expires.total_seconds()
            ),
        )

    async def get_current_user(self, access_token: str) -> CurrentUserResponse:
        payload = self._decode_token(access_token)
        if payload.get("token_type") != "access":
            raise TokenValidationError("Invalid token type")

        email = payload.get("sub")
        if not email:
            raise TokenValidationError("Missing subject")

        user = await self.repo.get_user_by_email(email)
        if user is None:
            raise TokenValidationError("User not found")

        return CurrentUserResponse.model_validate(user)

