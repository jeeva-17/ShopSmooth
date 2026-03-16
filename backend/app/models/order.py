"""
ShopSmooth Order Models
Defines Order, OrderItem, Cart, and CartItem ORM models.
"""

import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Float, Text,
    ForeignKey, JSON, Enum
)
from sqlalchemy.orm import relationship

from app.database import Base


class PaymentStatus(str, enum.Enum):
    """Payment lifecycle states."""
    pending = "pending"
    paid = "paid"
    failed = "failed"
    refunded = "refunded"


class OrderStatus(str, enum.Enum):
    """Order fulfillment lifecycle states."""
    pending = "pending"
    confirmed = "confirmed"
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"
    returned = "returned"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    # Human-readable order reference e.g. #SM-1001
    order_number = Column(String(50), unique=True, nullable=False, index=True)

    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Snapshot of delivery address at time of order (JSON)
    address_snapshot = Column(JSON, nullable=True)

    # Financials
    subtotal = Column(Float, nullable=False, default=0.0)
    tax_amount = Column(Float, nullable=False, default=0.0)
    shipping_charge = Column(Float, nullable=False, default=0.0)
    discount_amount = Column(Float, nullable=False, default=0.0)
    total = Column(Float, nullable=False, default=0.0)

    # Coupon applied
    coupon_id = Column(Integer, ForeignKey("coupons.id"), nullable=True)

    # Payment
    payment_method = Column(String(50), nullable=True)   # "razorpay" | "cod"
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.pending, nullable=False)
    payment_id = Column(String(255), nullable=True)

    # Razorpay specific fields
    razorpay_order_id = Column(String(255), nullable=True)
    razorpay_payment_id = Column(String(255), nullable=True)
    razorpay_signature = Column(String(500), nullable=True)

    # Fulfillment
    status = Column(Enum(OrderStatus), default=OrderStatus.pending, nullable=False)
    tracking_number = Column(String(255), nullable=True)
    tracking_url = Column(String(500), nullable=True)
    delivery_method = Column(String(50), nullable=True)  # "delivery" | "pickup"

    # Notes
    customer_notes = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    shipped_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)

    # Relationships
    store = relationship("Store", back_populates="orders")
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    coupon = relationship("Coupon", back_populates="orders")

    def __repr__(self):
        return f"<Order id={self.id} order_number={self.order_number} total={self.total}>"


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=True)

    # Snapshot of product details at purchase time
    product_name = Column(String(500), nullable=False)
    variant_name = Column(String(255), nullable=True)
    sku = Column(String(100), nullable=True)
    quantity = Column(Integer, nullable=False, default=1)
    price = Column(Float, nullable=False)     # Unit price
    discount = Column(Float, nullable=False, default=0.0)
    total = Column(Float, nullable=False)     # quantity * price - discount
    image_url = Column(String(500), nullable=True)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
    variant = relationship("ProductVariant", back_populates="order_items")

    def __repr__(self):
        return f"<OrderItem id={self.id} product={self.product_name} qty={self.quantity}>"


class Cart(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="cart")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Cart id={self.id} user_id={self.user_id}>"


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=True)
    quantity = Column(Integer, nullable=False, default=1)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    cart = relationship("Cart", back_populates="items")
    product = relationship("Product", back_populates="cart_items")
    variant = relationship("ProductVariant", back_populates="cart_items")

    def __repr__(self):
        return f"<CartItem id={self.id} product_id={self.product_id} qty={self.quantity}>"
