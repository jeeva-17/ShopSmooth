"""
ShopSmooth Auth Router
Handles user registration, login, profile management,
and store admin registration.
"""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserRole
from app.models.store import Store
from app.utils.security import (
    hash_password, verify_password, create_access_token, get_current_user
)
from app.utils.helpers import generate_slug

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# -------------------------
# Pydantic Schemas
# -------------------------

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class StoreAdminRegisterRequest(BaseModel):
    # User fields
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    # Store fields
    store_name: str = Field(..., min_length=2, max_length=255)
    store_email: Optional[EmailStr] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    role: str
    store_id: Optional[int] = None


class UserProfileResponse(BaseModel):
    id: int
    email: str
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    phone: Optional[str]
    avatar_url: Optional[str]
    role: str
    is_active: bool
    email_verified: bool
    store_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class UpdateProfileRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# -------------------------
# Endpoints
# -------------------------

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_customer(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new customer account.
    Returns a JWT token on success.
    """
    # Check uniqueness
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        email=payload.email,
        username=payload.username,
        password_hash=hash_password(payload.password),
        first_name=payload.first_name,
        last_name=payload.last_name,
        role=UserRole.customer,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        email=user.email,
        role=user.role,
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate with email + password and receive a JWT token.
    """
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        email=user.email,
        role=user.role,
        store_id=user.store_id,
    )


@router.get("/me", response_model=UserProfileResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    return current_user


@router.put("/me", response_model=UserProfileResponse)
def update_my_profile(
    payload: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update profile fields of the currently authenticated user."""
    if payload.username and payload.username != current_user.username:
        if db.query(User).filter(User.username == payload.username).first():
            raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = payload.username

    if payload.first_name is not None:
        current_user.first_name = payload.first_name
    if payload.last_name is not None:
        current_user.last_name = payload.last_name
    if payload.phone is not None:
        current_user.phone = payload.phone

    current_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/forgot-password", status_code=200)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Initiate a password reset flow.
    In production this would send an email; currently returns a success stub.
    """
    user = db.query(User).filter(User.email == payload.email).first()
    # Always return success to prevent email enumeration attacks
    return {"message": "If that email exists, a reset link has been sent."}


@router.post("/store-admin/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_store_admin(payload: StoreAdminRegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new store admin and automatically create their store.
    Returns a JWT token on success.
    """
    # Check uniqueness
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    # Generate a unique slug for the store
    base_slug = generate_slug(payload.store_name)
    slug = base_slug
    counter = 1
    while db.query(Store).filter(Store.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    # Generate a unique domain identifier
    domain = f"{slug}.shopsmooth.com"
    domain_counter = 1
    while db.query(Store).filter(Store.domain == domain).first():
        domain = f"{slug}-{domain_counter}.shopsmooth.com"
        domain_counter += 1

    # Create store first (owner_id assigned after user creation)
    store = Store(
        name=payload.store_name,
        slug=slug,
        domain=domain,
        email=payload.store_email or payload.email,
        owner_id=0,  # Temporary placeholder; updated below
    )
    db.add(store)
    db.flush()  # Get store.id without committing

    # Create the user with store association
    user = User(
        email=payload.email,
        username=payload.username,
        password_hash=hash_password(payload.password),
        first_name=payload.first_name,
        last_name=payload.last_name,
        role=UserRole.store_admin,
        store_id=store.id,
    )
    db.add(user)
    db.flush()

    # Assign owner
    store.owner_id = user.id
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        email=user.email,
        role=user.role,
        store_id=store.id,
    )
