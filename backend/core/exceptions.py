"""Application exceptions (skeleton)."""

from fastapi import HTTPException, status


class AppException(HTTPException):
    """Base HTTP exception for the gateway."""


def not_implemented(detail: str = "Not implemented yet") -> HTTPException:
    return AppException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=detail)

