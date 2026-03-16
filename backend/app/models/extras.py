"""
ShopSmooth Extra Models
Covers: Address, Review, Coupon, Banner, Wishlist, EmailLog, DomainMapping.
"""

import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Float, Text,
    ForeignKey, JSON, Enum
)
from sqlalchemy.orm import relationship

from app.database import Base


class DiscountType(str, enum.Enum):
    percentage = "percentage"
    fixed = "fixed"


class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    label = Column(String(100), nullable=True)        # Home, Work, etc.
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)

    line1 = Column(String(500), nullable=False)
    line2 = Column(String(500), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(20), nullable=False)
    country = Column(String(100), default="India", nullable=False)

    is_default = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="addresses")

    def __repr__(self):
        return f"<Address id={self.id} user_id={self.user_id} city={self.city}>"


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    rating = Column(Integer, nullable=False)          # 1-5
    title = Column(String(255), nullable=True)
    content = Column(Text, nullable=True)

    is_verified = Column(Boolean, default=False, nullable=False)  # Verified purchase
    is_approved = Column(Boolean, default=True, nullable=False)   # Moderation flag
    helpful_count = Column(Integer, default=0, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

    def __repr__(self):
        return f"<Review id={self.id} product_id={self.product_id} rating={self.rating}>"


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)

    code = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)

    discount_type = Column(Enum(DiscountType), nullable=False)
    discount_value = Column(Float, nullable=False)
    max_discount = Column(Float, nullable=True)         # Cap for percentage discounts
    min_order_value = Column(Float, default=0.0, nullable=False)

    usage_limit = Column(Integer, nullable=True)        # Null = unlimited
    used_count = Column(Integer, default=0, nullable=False)

    valid_from = Column(DateTime, nullable=True)
    valid_until = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    store = relationship("Store", back_populates="coupons")
    orders = relationship("Order", back_populates="coupon")

    def __repr__(self):
        return f"<Coupon id={self.id} code={self.code}>"


class Banner(Base):
    __tablename__ = "banners"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)

    title = Column(String(255), nullable=True)
    subtitle = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=False)
    link_url = Column(String(500), nullable=True)
    button_text = Column(String(100), nullable=True)

    position = Column(String(50), default="hero", nullable=True)  # hero, sidebar, footer
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    starts_at = Column(DateTime, nullable=True)
    ends_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    store = relationship("Store", back_populates="banners")

    def __repr__(self):
        return f"<Banner id={self.id} title={self.title}>"


class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="wishlist")
    product = relationship("Product", back_populates="wishlist_entries")

    def __repr__(self):
        return f"<Wishlist id={self.id} user_id={self.user_id} product_id={self.product_id}>"


class EmailLog(Base):
    __tablename__ = "email_logs"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=True, index=True)

    recipient = Column(String(255), nullable=False)
    subject = Column(String(500), nullable=False)
    body = Column(Text, nullable=True)
    email_type = Column(String(100), nullable=True)   # order_confirm, reset_password, etc.
    status = Column(String(50), default="sent", nullable=False)
    error = Column(Text, nullable=True)

    sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    store = relationship("Store", back_populates="email_logs")

    def __repr__(self):
        return f"<EmailLog id={self.id} recipient={self.recipient} status={self.status}>"


class DomainMapping(Base):
    __tablename__ = "domain_mappings"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)

    domain = Column(String(255), nullable=False, index=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    ssl_status = Column(String(50), default="pending", nullable=True)  # pending/active/failed

    # Required DNS records shown to user
    dns_records = Column(JSON, default=dict, nullable=True)

    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    store = relationship("Store", back_populates="domain_mappings")

    def __repr__(self):
        return f"<DomainMapping id={self.id} domain={self.domain}>"
