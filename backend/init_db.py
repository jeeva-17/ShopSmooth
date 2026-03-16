#!/usr/bin/env python3
"""
ShopSmooth Database Initialization
Creates tables and seeds with sample data for development.
"""

from sqlalchemy.orm import Session
from datetime import datetime

from app.database import SessionLocal, engine, Base
from app.models.user import User, UserRole
from app.models.store import Store
from app.models.product import Category, Product, ProductVariant
from app.utils.security import hash_password

# Create all tables
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully")

db = SessionLocal()

try:
    # Check if demo data already exists
    existing_store = db.query(Store).first()
    if existing_store:
        print("⚠️  Demo data already exists. Skipping initialization.")
        db.close()
        exit(0)

    # Create demo store admin user
    admin_user = User(
        email="admin@shopsmooth.local",
        username="admin",
        password_hash=hash_password("admin123"),
        first_name="Shop",
        last_name="Admin",
        role=UserRole.store_admin,
        is_active=True,
        email_verified=True,
    )
    db.add(admin_user)
    db.flush()
    print(f"✅ Created admin user: {admin_user.email}")

    # Create demo store
    store = Store(
        name="Fashion Corner",
        slug="fashion-corner",
        domain="fashion-corner.shopsmooth.com",
        description="Your one-stop shop for trendy fashion and accessories",
        email="store@fashioncorner.local",
        phone="+1-800-FASHION",
        address="123 Fashion Street",
        city="New York",
        state="NY",
        pincode="10001",
        country="USA",
        currency="USD",
        timezone="America/New_York",
        owner_id=admin_user.id,
        is_active=True,
        is_published=True,
        navbar_primary_color="#FF6B6B",
        navbar_secondary_color="#4ECDC4",
        navbar_text_color="#FFFFFF",
        accent_color="#FFE66D",
        enable_delivery=True,
        enable_pickup=False,
        delivery_charge=5.00,
        free_delivery_above=50.00,
        estimated_delivery_days=3,
        enable_online_payment=True,
        enable_cod=True,
        tax_rate=0.08,
        tax_label="Sales Tax",
        about_us="Welcome to Fashion Corner! We curate the latest fashion trends for style-conscious customers.",
        privacy_policy="Your privacy is important to us...",
        terms_conditions="By using our service, you agree to our terms...",
        return_policy="We offer 30-day returns on all items.",
        shipping_policy="We ship within 2-3 business days.",
    )
    db.add(store)
    admin_user.store_id = store.id
    db.flush()
    print(f"✅ Created demo store: {store.name}")

    # Create demo customer user
    customer = User(
        email="customer@shopsmooth.local",
        username="customer",
        password_hash=hash_password("customer123"),
        first_name="John",
        last_name="Doe",
        role=UserRole.customer,
        is_active=True,
        email_verified=True,
    )
    db.add(customer)
    print(f"✅ Created demo customer: {customer.email}")

    # Create demo categories
    categories = [
        Category(
            store_id=store.id,
            name="T-Shirts",
            slug="t-shirts",
            description="Casual and comfortable t-shirts",
            display_order=1,
            is_active=True,
        ),
        Category(
            store_id=store.id,
            name="Dresses",
            slug="dresses",
            description="Elegant and stylish dresses",
            display_order=2,
            is_active=True,
        ),
        Category(
            store_id=store.id,
            name="Accessories",
            slug="accessories",
            description="Complete your look with our accessories",
            display_order=3,
            is_active=True,
        ),
    ]
    db.add_all(categories)
    db.flush()
    print(f"✅ Created {len(categories)} demo categories")

    # Create demo products
    products = [
        Product(
            store_id=store.id,
            category_id=categories[0].id,
            name="Classic White T-Shirt",
            slug="classic-white-tshirt",
            description="Premium quality white t-shirt made from 100% organic cotton",
            price=29.99,
            compare_at_price=49.99,
            sku="TSH-001",
            stock=50,
            is_active=True,
            is_featured=True,
        ),
        Product(
            store_id=store.id,
            category_id=categories[0].id,
            name="Vintage Black T-Shirt",
            slug="vintage-black-tshirt",
            description="Cool vintage style black t-shirt with authentic prints",
            price=34.99,
            compare_at_price=59.99,
            sku="TSH-002",
            stock=30,
            is_active=True,
            is_featured=True,
        ),
        Product(
            store_id=store.id,
            category_id=categories[1].id,
            name="Summer Floral Dress",
            slug="summer-floral-dress",
            description="Perfect for warm days - breathable floral print dress",
            price=59.99,
            compare_at_price=99.99,
            sku="DRS-001",
            stock=25,
            is_active=True,
            is_featured=True,
        ),
        Product(
            store_id=store.id,
            category_id=categories[2].id,
            name="Leather Crossbody Bag",
            slug="leather-crossbody-bag",
            description="Elegant leather bag perfect for everyday use",
            price=89.99,
            compare_at_price=149.99,
            sku="ACC-001",
            stock=15,
            is_active=True,
            is_featured=False,
        ),
    ]
    db.add_all(products)
    db.flush()
    print(f"✅ Created {len(products)} demo products")

    # Create demo product variants
    variants = [
        ProductVariant(
            product_id=products[0].id,
            name="Size: S",
            sku="TSH-001-S",
            price=29.99,
            stock=10,
            option1_name="Size",
            option1_value="S",
        ),
        ProductVariant(
            product_id=products[0].id,
            name="Size: M",
            sku="TSH-001-M",
            price=29.99,
            stock=20,
            option1_name="Size",
            option1_value="M",
        ),
        ProductVariant(
            product_id=products[0].id,
            name="Size: L",
            sku="TSH-001-L",
            price=29.99,
            stock=20,
            option1_name="Size",
            option1_value="L",
        ),
    ]
    db.add_all(variants)
    print(f"✅ Created {len(variants)} demo product variants")

    # Commit all changes
    db.commit()
    print("\n✅ Database initialization complete!")
    print("\n📝 Demo Credentials:")
    print("   Store Admin:")
    print("      Email: admin@shopsmooth.local")
    print("      Password: admin123")
    print("   Customer:")
    print("      Email: customer@shopsmooth.local")
    print("      Password: customer123")

except Exception as e:
    db.rollback()
    print(f"❌ Error during initialization: {e}")
    raise
finally:
    db.close()
