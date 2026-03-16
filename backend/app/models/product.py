"""
ShopSmooth Product Models
Defines Category, Product, and ProductVariant ORM models.
"""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Float, Text,
    ForeignKey, JSON
)
from sqlalchemy.orm import relationship

from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)

    # Self-referential hierarchy
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)

    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    store = relationship("Store", back_populates="categories")
    parent = relationship("Category", remote_side=[id], back_populates="children")
    children = relationship("Category", back_populates="parent")
    products = relationship("Product", back_populates="category")

    def __repr__(self):
        return f"<Category id={self.id} name={self.name}>"


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True, index=True)

    # Basic info
    name = Column(String(500), nullable=False)
    slug = Column(String(500), nullable=False, index=True)
    description = Column(Text, nullable=True)
    short_description = Column(Text, nullable=True)
    sku = Column(String(100), unique=True, nullable=True, index=True)

    # Pricing
    price = Column(Float, nullable=False)
    compare_at_price = Column(Float, nullable=True)   # Original / strikethrough price
    cost_price = Column(Float, nullable=True)          # Cost of goods (for margin calc)

    # Media - stored as JSON array of URL strings
    images = Column(JSON, default=list, nullable=False)

    # Inventory
    stock = Column(Integer, default=0, nullable=False)
    low_stock_threshold = Column(Integer, default=5, nullable=False)
    weight = Column(Float, nullable=True)  # In grams

    # Flags
    is_active = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    is_digital = Column(Boolean, default=False, nullable=False)
    has_variants = Column(Boolean, default=False, nullable=False)

    # Stats
    average_rating = Column(Float, default=0.0, nullable=False)
    total_reviews = Column(Integer, default=0, nullable=False)

    # SEO
    seo_title = Column(String(500), nullable=True)
    seo_description = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    store = relationship("Store", back_populates="products")
    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")
    wishlist_entries = relationship("Wishlist", back_populates="product", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="product")

    def __repr__(self):
        return f"<Product id={self.id} name={self.name} price={self.price}>"


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)

    name = Column(String(255), nullable=False)
    sku = Column(String(100), nullable=True, index=True)
    price = Column(Float, nullable=False)
    compare_at_price = Column(Float, nullable=True)
    stock = Column(Integer, default=0, nullable=False)
    image_url = Column(String(500), nullable=True)

    # Variant options (e.g., option1_name="Size", option1_value="L")
    option1_name = Column(String(100), nullable=True)
    option1_value = Column(String(100), nullable=True)
    option2_name = Column(String(100), nullable=True)
    option2_value = Column(String(100), nullable=True)

    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    product = relationship("Product", back_populates="variants")
    cart_items = relationship("CartItem", back_populates="variant")
    order_items = relationship("OrderItem", back_populates="variant")

    def __repr__(self):
        return f"<ProductVariant id={self.id} name={self.name}>"
