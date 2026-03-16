"""
ShopSmooth Stores Router
Manages store CRUD, settings (appearance, delivery, payment, pages),
logo upload, and dashboard analytics.
"""

from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from pydantic import BaseModel, EmailStr
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.store import Store
from app.models.user import User, UserRole
from app.models.order import Order, OrderStatus
from app.models.product import Product
from app.utils.security import get_current_user
from app.utils.helpers import save_upload

router = APIRouter(prefix="/api/stores", tags=["Stores"])


# -------------------------
# Pydantic Schemas
# -------------------------

class StoreResponse(BaseModel):
    id: int
    name: str
    slug: str
    domain: Optional[str]
    description: Optional[str]
    logo_url: Optional[str]
    favicon_url: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    pincode: Optional[str]
    country: Optional[str]
    currency: str
    timezone: Optional[str]
    is_active: bool
    is_published: bool
    navbar_primary_color: Optional[str]
    navbar_secondary_color: Optional[str]
    navbar_text_color: Optional[str]
    accent_color: Optional[str]
    enable_delivery: bool
    enable_pickup: bool
    delivery_charge: float
    free_delivery_above: float
    estimated_delivery_days: int
    enable_online_payment: bool
    enable_cod: bool
    tax_rate: float
    tax_label: Optional[str]
    about_us: Optional[str]
    privacy_policy: Optional[str]
    terms_conditions: Optional[str]
    return_policy: Optional[str]
    shipping_policy: Optional[str]
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class StoreUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    country: Optional[str] = None
    currency: Optional[str] = None
    timezone: Optional[str] = None
    is_published: Optional[bool] = None


class AppearanceUpdateRequest(BaseModel):
    navbar_primary_color: Optional[str] = None
    navbar_secondary_color: Optional[str] = None
    navbar_text_color: Optional[str] = None
    accent_color: Optional[str] = None


class DeliveryUpdateRequest(BaseModel):
    enable_delivery: Optional[bool] = None
    enable_pickup: Optional[bool] = None
    delivery_charge: Optional[float] = None
    free_delivery_above: Optional[float] = None
    estimated_delivery_days: Optional[int] = None


class PaymentUpdateRequest(BaseModel):
    enable_online_payment: Optional[bool] = None
    enable_cod: Optional[bool] = None
    razorpay_key_id: Optional[str] = None
    razorpay_key_secret: Optional[str] = None


class PagesUpdateRequest(BaseModel):
    about_us: Optional[str] = None
    privacy_policy: Optional[str] = None
    terms_conditions: Optional[str] = None
    return_policy: Optional[str] = None
    shipping_policy: Optional[str] = None


class AnalyticsResponse(BaseModel):
    total_orders: int
    total_revenue: float
    total_customers: int
    pending_orders: int
    top_products: List[dict]


# -------------------------
# Helper
# -------------------------

def verify_store_owner(store_id: int, current_user: User, db: Session) -> Store:
    """
    Retrieve a store and verify the current user is its owner
    or a platform admin. Raises 403/404 as appropriate.
    """
    store = db.query(Store).filter(Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    if current_user.role == UserRole.platform_admin:
        return store

    if store.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied: you do not own this store")

    return store


# -------------------------
# Endpoints
# -------------------------

@router.get("/", response_model=List[StoreResponse])
def list_stores(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    """List all active, published stores (public endpoint)."""
    stores = (
        db.query(Store)
        .filter(Store.is_active == True, Store.is_published == True)
        .offset(skip)
        .limit(min(limit, 100))
        .all()
    )
    return stores


@router.get("/{slug}", response_model=StoreResponse)
def get_store_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get a store's public profile by slug."""
    store = db.query(Store).filter(Store.slug == slug, Store.is_active == True).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store


@router.put("/{store_id}", response_model=StoreResponse)
def update_store(
    store_id: int,
    payload: StoreUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update basic store information. Requires store ownership or platform admin."""
    store = verify_store_owner(store_id, current_user, db)

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(store, field, value)

    store.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(store)
    return store


@router.put("/{store_id}/appearance", response_model=StoreResponse)
def update_appearance(
    store_id: int,
    payload: AppearanceUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update store theme/appearance settings."""
    store = verify_store_owner(store_id, current_user, db)

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(store, field, value)

    store.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(store)
    return store


@router.put("/{store_id}/delivery", response_model=StoreResponse)
def update_delivery(
    store_id: int,
    payload: DeliveryUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update store delivery/shipping settings."""
    store = verify_store_owner(store_id, current_user, db)

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(store, field, value)

    store.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(store)
    return store


@router.put("/{store_id}/payment", response_model=StoreResponse)
def update_payment(
    store_id: int,
    payload: PaymentUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update store payment gateway settings."""
    store = verify_store_owner(store_id, current_user, db)

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(store, field, value)

    store.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(store)
    return store


@router.put("/{store_id}/pages", response_model=StoreResponse)
def update_pages(
    store_id: int,
    payload: PagesUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update store policy pages (about us, privacy, terms, etc.)."""
    store = verify_store_owner(store_id, current_user, db)

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(store, field, value)

    store.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(store)
    return store


@router.post("/{store_id}/logo")
def upload_store_logo(
    store_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload or replace the store logo image."""
    store = verify_store_owner(store_id, current_user, db)

    url = save_upload(file, "logos")
    store.logo_url = url
    store.updated_at = datetime.utcnow()
    db.commit()

    return {"logo_url": url, "message": "Logo updated successfully"}


@router.get("/{store_id}/analytics", response_model=AnalyticsResponse)
def get_analytics(
    store_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get dashboard analytics for the store:
    total orders, revenue, customers, pending orders, top 5 products by sales.
    """
    verify_store_owner(store_id, current_user, db)

    total_orders = db.query(Order).filter(Order.store_id == store_id).count()

    total_revenue_row = (
        db.query(func.sum(Order.total))
        .filter(
            Order.store_id == store_id,
            Order.status.notin_([OrderStatus.cancelled, OrderStatus.returned]),
        )
        .scalar()
    )
    total_revenue = float(total_revenue_row or 0.0)

    # Distinct customers who placed orders in this store
    total_customers = (
        db.query(func.count(func.distinct(Order.user_id)))
        .filter(Order.store_id == store_id)
        .scalar()
        or 0
    )

    pending_orders = (
        db.query(Order)
        .filter(Order.store_id == store_id, Order.status == OrderStatus.pending)
        .count()
    )

    # Top 5 products by number of times they appear in order items
    from app.models.order import OrderItem
    from sqlalchemy import desc

    top_products_raw = (
        db.query(
            Product.id,
            Product.name,
            func.sum(OrderItem.quantity).label("total_sold"),
            func.sum(OrderItem.total).label("total_revenue"),
        )
        .join(OrderItem, OrderItem.product_id == Product.id)
        .join(Order, Order.id == OrderItem.order_id)
        .filter(Order.store_id == store_id)
        .group_by(Product.id, Product.name)
        .order_by(desc("total_sold"))
        .limit(5)
        .all()
    )

    top_products = [
        {
            "id": row.id,
            "name": row.name,
            "total_sold": int(row.total_sold or 0),
            "total_revenue": float(row.total_revenue or 0),
        }
        for row in top_products_raw
    ]

    return AnalyticsResponse(
        total_orders=total_orders,
        total_revenue=total_revenue,
        total_customers=total_customers,
        pending_orders=pending_orders,
        top_products=top_products,
    )
