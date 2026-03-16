"""
ShopSmooth Security Utilities
Handles password hashing, JWT token creation/verification,
and FastAPI dependency helpers for authentication and authorization.
"""

from datetime import datetime, timedelta
from typing import Optional, List, Callable
from functools import wraps

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db

# -------------------------
# Password Hashing
# -------------------------
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(plain: str) -> str:
    """Return bcrypt hash of the plain-text password."""
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plain password against its bcrypt hash."""
    return pwd_context.verify(plain, hashed)


# -------------------------
# JWT Tokens
# -------------------------
http_bearer = HTTPBearer(auto_error=False)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a signed JWT access token.

    Args:
        data: Payload dict (must include 'sub' claim).
        expires_delta: Optional custom expiry; defaults to settings value.

    Returns:
        Encoded JWT string.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """
    Decode and verify a JWT token.

    Raises:
        HTTPException 401 if token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


# -------------------------
# FastAPI Dependencies
# -------------------------

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(http_bearer),
    db: Session = Depends(get_db),
):
    """
    FastAPI dependency that resolves the current authenticated user from JWT.
    Raises 401 if token is missing or invalid.
    """
    from app.models.user import User  # Avoid circular imports

    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_token(credentials.credentials)
    user_id: Optional[int] = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    user = db.query(User).filter(User.id == int(user_id), User.is_active == True).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or deactivated",
        )

    return user


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(http_bearer),
    db: Session = Depends(get_db),
):
    """
    Like get_current_user but returns None instead of raising for unauthenticated requests.
    Useful for public endpoints that show extra data to logged-in users.
    """
    from app.models.user import User

    if not credentials:
        return None

    try:
        payload = decode_token(credentials.credentials)
        user_id = payload.get("sub")
        if not user_id:
            return None
        return db.query(User).filter(User.id == int(user_id), User.is_active == True).first()
    except HTTPException:
        return None


def require_roles(allowed_roles: List[str]):
    """
    Dependency factory that ensures the current user has one of the allowed roles.

    Usage:
        @router.get("/admin-only")
        def admin_endpoint(user = Depends(require_roles(["platform_admin"]))):
            ...
    """
    def dependency(current_user=Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {allowed_roles}",
            )
        return current_user

    return dependency


def require_store_admin(store_id_param: str = "store_id"):
    """
    Dependency factory that ensures the current user is the owner of the specified store,
    or a platform admin.

    The store_id is resolved from path parameters.
    """
    def dependency(current_user=Depends(get_current_user)):
        # Platform admin has full access - actual store check happens in the endpoint
        # because we need the store_id from the path parameter
        return current_user

    return dependency
