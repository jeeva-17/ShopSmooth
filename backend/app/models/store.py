"""
ShopSmooth Store Model
Represents a merchant's storefront with all configuration options.
"""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Float, Text, ForeignKey
)
from sqlalchemy.orm import relationship

from app.database import Base


class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)

    # Basic info
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    domain = Column(String(255), unique=True, nullable=True, index=True)
    description = Column(Text, nullable=True)

    # Branding
    logo_url = Column(String(500), nullable=True)
    favicon_url = Column(String(500), nullable=True)

    # Contact
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)

    # Address
    address = Column(String(500), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    pincode = Column(String(20), nullable=True)
    country = Column(String(100), default="India", nullable=True)

    # Locale
    currency = Column(String(10), default="INR", nullable=False)
    timezone = Column(String(100), default="Asia/Kolkata", nullable=True)

    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_published = Column(Boolean, default=False, nullable=False)

    # -------------------------
    # Appearance / Theme
    # -------------------------
    navbar_primary_color = Column(String(20), default="#667eea", nullable=True)
    navbar_secondary_color = Column(String(20), default="#764ba2", nullable=True)
    navbar_text_color = Column(String(20), default="#ffffff", nullable=True)
    accent_color = Column(String(20), default="#6366f1", nullable=True)

    # -------------------------
    # Delivery Settings
    # -------------------------
    enable_delivery = Column(Boolean, default=True, nullable=False)
    enable_pickup = Column(Boolean, default=False, nullable=False)
    delivery_charge = Column(Float, default=0.0, nullable=False)
    free_delivery_above = Column(Float, default=0.0, nullable=False)
    estimated_delivery_days = Column(Integer, default=5, nullable=False)

    # -------------------------
    # Payment Settings
    # -------------------------
    enable_online_payment = Column(Boolean, default=False, nullable=False)
    enable_cod = Column(Boolean, default=True, nullable=False)
    razorpay_key_id = Column(String(255), nullable=True)
    razorpay_key_secret = Column(String(255), nullable=True)

    # -------------------------
    # SMTP / Email Settings
    # -------------------------
    smtp_host = Column(String(255), nullable=True)
    smtp_port = Column(Integer, default=587, nullable=True)
    smtp_user = Column(String(255), nullable=True)
    smtp_pass = Column(String(255), nullable=True)

    # -------------------------
    # Policy Pages (HTML content)
    # -------------------------
    about_us = Column(Text, nullable=True)
    privacy_policy = Column(Text, nullable=True)
    terms_conditions = Column(Text, nullable=True)
    return_policy = Column(Text, nullable=True)
    shipping_policy = Column(Text, nullable=True)

    # -------------------------
    # Tax Settings
    # -------------------------
    tax_rate = Column(Float, default=0.0, nullable=False)
    tax_label = Column(String(50), default="GST", nullable=True)

    # -------------------------
    # Custom Domain
    # -------------------------
    custom_domain = Column(String(255), nullable=True)
    domain_verified = Column(Boolean, default=False, nullable=False)

    # Owner FK
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    owner = relationship("User", foreign_keys=[owner_id], back_populates="owned_store")
    staff = relationship("User", foreign_keys="User.store_id", back_populates="store")
    categories = relationship("Category", back_populates="store", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="store", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="store", cascade="all, delete-orphan")
    coupons = relationship("Coupon", back_populates="store", cascade="all, delete-orphan")
    banners = relationship("Banner", back_populates="store", cascade="all, delete-orphan")
    email_logs = relationship("EmailLog", back_populates="store", cascade="all, delete-orphan")
    domain_mappings = relationship("DomainMapping", back_populates="store", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Store id={self.id} name={self.name} slug={self.slug}>"
