"""
ShopSmooth Models Package
Import all models here so SQLAlchemy's metadata knows about them
before table creation is called.
"""

from app.models.store import Store          # noqa: F401 - must be before User (FK target)
from app.models.user import User            # noqa: F401
from app.models.product import Category, Product, ProductVariant  # noqa: F401
from app.models.order import Order, OrderItem, Cart, CartItem     # noqa: F401
from app.models.extras import (             # noqa: F401
    Address,
    Review,
    Coupon,
    Banner,
    Wishlist,
    EmailLog,
    DomainMapping,
)

__all__ = [
    "Store",
    "User",
    "Category",
    "Product",
    "ProductVariant",
    "Order",
    "OrderItem",
    "Cart",
    "CartItem",
    "Address",
    "Review",
    "Coupon",
    "Banner",
    "Wishlist",
    "EmailLog",
    "DomainMapping",
]
