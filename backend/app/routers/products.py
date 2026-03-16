"""
ShopSmooth Products Router
Handles product and category CRUD for a given store,
with search, filtering, sorting, and image uploads.
"""

from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from pydantic import BaseModel
from sqlalchemy import or_, asc, desc
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product, ProductVariant, Category
from app.models.store import Store
from app.models.user import User, UserRole
from app.utils.security import get_current_user, get_optional_user
from app.utils.helpers import generate_slug, save_upload, paginate

router = APIRouter(prefix="/api/stores/{store_id}/products", tags=["Products"])


# -------------------------
# Pydantic Schemas
# -------------------------

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    parent_id: Optional[int] = None
    display_order: int = 0


class CategoryResponse(BaseModel):
    id: int
    store_id: int
    name: str
    slug: str
    description: Optional[str]
    image_url: Optional[str]
    parent_id: Optional[int]
    display_order: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class VariantCreate(BaseModel):
    name: str
    sku: Optional[str] = None
    price: float
    compare_at_price: Optional[float] = None
    stock: int = 0
    image_url: Optional[str] = None
    option1_name: Optional[str] = None
    option1_value: Optional[str] = None
    option2_name: Optional[str] = None
    option2_value: Optional[str] = None


class VariantResponse(BaseModel):
    id: int
    product_id: int
    name: str
    sku: Optional[str]
    price: float
    compare_at_price: Optional[float]
    stock: int
    image_url: Optional[str]
    option1_name: Optional[str]
    option1_value: Optional[str]
    option2_name: Optional[str]
    option2_value: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    sku: Optional[str] = None
    price: float
    compare_at_price: Optional[float] = None
    cost_price: Optional[float] = None
    category_id: Optional[int] = None
    stock: int = 0
    low_stock_threshold: int = 5
    weight: Optional[float] = None
    is_active: bool = True
    is_featured: bool = False
    is_digital: bool = False
    has_variants: bool = False
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    images: List[str] = []
    variants: List[VariantCreate] = []


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = None
    compare_at_price: Optional[float] = None
    cost_price: Optional[float] = None
    category_id: Optional[int] = None
    stock: Optional[int] = None
    low_stock_threshold: Optional[int] = None
    weight: Optional[float] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_digital: Optional[bool] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    images: Optional[List[str]] = None


class ProductResponse(BaseModel):
    id: int
    store_id: int
    category_id: Optional[int]
    name: str
    slug: str
    description: Optional[str]
    short_description: Optional[str]
    sku: Optional[str]
    price: float
    compare_at_price: Optional[float]
    cost_price: Optional[float]
    images: List[str]
    stock: int
    low_stock_threshold: int
    weight: Optional[float]
    is_active: bool
    is_featured: bool
    is_digital: bool
    has_variants: bool
    average_rating: float
    total_reviews: int
    seo_title: Optional[str]
    seo_description: Optional[str]
    created_at: datetime
    updated_at: datetime
    variants: List[VariantResponse] = []

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    skip: int
    limit: int


# -------------------------
# Helper
# -------------------------

def get_store_or_404(store_id: int, db: Session) -> Store:
    store = db.query(Store).filter(Store.id == store_id, Store.is_active == True).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store


def assert_store_admin(store_id: int, user: User):
    """Ensure user is the store admin or a platform admin."""
    if user.role == UserRole.platform_admin:
        return
    if user.role != UserRole.store_admin or user.store_id != store_id:
        raise HTTPException(status_code=403, detail="Store admin access required")


# -------------------------
# Category Endpoints
# -------------------------

@router.get("/categories", response_model=List[CategoryResponse])
def list_categories(store_id: int, db: Session = Depends(get_db)):
    """List all active categories for the store."""
    get_store_or_404(store_id, db)
    categories = (
        db.query(Category)
        .filter(Category.store_id == store_id, Category.is_active == True)
        .order_by(Category.display_order, Category.name)
        .all()
    )
    return categories


@router.post("/categories", response_model=CategoryResponse, status_code=201)
def create_category(
    store_id: int,
    payload: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new category. Requires store admin."""
    get_store_or_404(store_id, db)
    assert_store_admin(store_id, current_user)

    slug = generate_slug(payload.name)
    # Ensure slug uniqueness within store
    base_slug, counter = slug, 1
    while db.query(Category).filter(Category.store_id == store_id, Category.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    cat = Category(
        store_id=store_id,
        slug=slug,
        **payload.model_dump(),
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/categories/{category_id}", response_model=CategoryResponse)
def update_category(
    store_id: int,
    category_id: int,
    payload: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing category."""
    get_store_or_404(store_id, db)
    assert_store_admin(store_id, current_user)

    cat = db.query(Category).filter(
        Category.id == category_id, Category.store_id == store_id
    ).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(cat, field, value)

    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/categories/{category_id}", status_code=204)
def delete_category(
    store_id: int,
    category_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Soft-delete a category by marking it inactive."""
    get_store_or_404(store_id, db)
    assert_store_admin(store_id, current_user)

    cat = db.query(Category).filter(
        Category.id == category_id, Category.store_id == store_id
    ).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    cat.is_active = False
    db.commit()


# -------------------------
# Product Endpoints
# -------------------------

@router.get("/featured", response_model=List[ProductResponse])
def get_featured_products(
    store_id: int,
    limit: int = 8,
    db: Session = Depends(get_db),
):
    """Return featured products for the store."""
    get_store_or_404(store_id, db)
    products = (
        db.query(Product)
        .filter(
            Product.store_id == store_id,
            Product.is_active == True,
            Product.is_featured == True,
        )
        .limit(min(limit, 50))
        .all()
    )
    return products


@router.get("/", response_model=ProductListResponse)
def list_products(
    store_id: int,
    search: Optional[str] = Query(None, description="Search by product name"),
    category_id: Optional[int] = Query(None),
    sort_by: Optional[str] = Query("newest", description="price_asc|price_desc|newest|popular"),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    List products with full filtering, search, sorting, and pagination support.
    """
    get_store_or_404(store_id, db)

    query = db.query(Product).filter(
        Product.store_id == store_id,
        Product.is_active == True,
    )

    # Text search
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    # Category filter
    if category_id is not None:
        query = query.filter(Product.category_id == category_id)

    # Price range
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Sorting
    sort_map = {
        "price_asc": asc(Product.price),
        "price_desc": desc(Product.price),
        "newest": desc(Product.created_at),
        "popular": desc(Product.total_reviews),
    }
    order_clause = sort_map.get(sort_by, desc(Product.created_at))
    query = query.order_by(order_clause)

    items, total = paginate(query, skip, limit)
    return ProductListResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    store_id: int,
    product_id: int,
    db: Session = Depends(get_db),
):
    """Get detailed product information including variants."""
    get_store_or_404(store_id, db)
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.store_id == store_id,
        Product.is_active == True,
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/", response_model=ProductResponse, status_code=201)
def create_product(
    store_id: int,
    payload: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new product with optional variants. Requires store admin."""
    get_store_or_404(store_id, db)
    assert_store_admin(store_id, current_user)

    # Unique SKU check
    if payload.sku and db.query(Product).filter(Product.sku == payload.sku).first():
        raise HTTPException(status_code=400, detail="SKU already exists")

    slug = generate_slug(payload.name)
    base_slug, counter = slug, 1
    while db.query(Product).filter(Product.store_id == store_id, Product.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    variants_data = payload.variants
    product_data = payload.model_dump(exclude={"variants"})

    product = Product(store_id=store_id, slug=slug, **product_data)
    db.add(product)
    db.flush()

    for v in variants_data:
        variant = ProductVariant(product_id=product.id, **v.model_dump())
        db.add(variant)

    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    store_id: int,
    product_id: int,
    payload: ProductUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update product details. Requires store admin."""
    get_store_or_404(store_id, db)
    assert_store_admin(store_id, current_user)

    product = db.query(Product).filter(
        Product.id == product_id, Product.store_id == store_id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(product, field, value)

    product.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=204)
def delete_product(
    store_id: int,
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Soft-delete a product by marking it inactive. Requires store admin."""
    get_store_or_404(store_id, db)
    assert_store_admin(store_id, current_user)

    product = db.query(Product).filter(
        Product.id == product_id, Product.store_id == store_id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.is_active = False
    product.updated_at = datetime.utcnow()
    db.commit()


@router.post("/{product_id}/images")
def upload_product_images(
    store_id: int,
    product_id: int,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload one or more images for a product.
    Returns a list of saved image URLs and appends them to the product.
    """
    get_store_or_404(store_id, db)
    assert_store_admin(store_id, current_user)

    product = db.query(Product).filter(
        Product.id == product_id, Product.store_id == store_id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    saved_urls = []
    for file in files:
        url = save_upload(file, "products")
        saved_urls.append(url)

    # Append to existing images
    existing = product.images or []
    product.images = existing + saved_urls
    product.updated_at = datetime.utcnow()
    db.commit()

    return {"images": product.images, "new_uploads": saved_urls}
