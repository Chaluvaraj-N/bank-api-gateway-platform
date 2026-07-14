from __future__ import annotations

import uuid

from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=10, max_length=128)

    organization_id: uuid.UUID
    role_id: uuid.UUID

    first_name: str = Field(min_length=1, max_length=255)
    last_name: str = Field(min_length=1, max_length=255)
    designation: str = Field(min_length=1, max_length=255)
    status: str = Field(min_length=1, max_length=64)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    access_expires_in_seconds: int
    refresh_expires_in_seconds: int


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class CurrentUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
    first_name: str
    last_name: str
    designation: str
    status: str
    is_active: bool

    organization_id: uuid.UUID
    role_id: uuid.UUID


class AuthClaims(BaseModel):
    # Internal use (not required by API), kept for clarity/testing.
    sub: str
    token_type: str
    jti: str
    iss: str
    aud: str
    iat: int
    exp: int


class ErrorResponse(BaseModel):
    detail: str
    timestamp: datetime | None = None

