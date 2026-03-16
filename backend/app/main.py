"""
ShopSmooth FastAPI Main Application
Complete e-commerce platform backend with multi-tenant support.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.database import engine, Base
from app.routers import auth, stores, products

# Create all tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="ShopSmooth API",
    description="Multi-tenant e-commerce platform API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# CORS configuration - adjust for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trust only localhost and specified hosts in production
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*.shopsmooth.com"],
)

# Create uploads directory if it doesn't exist
Path("uploads").mkdir(exist_ok=True)

# Mount static files for uploads
try:
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
except Exception:
    pass  # If uploads dir doesn't exist, skip mounting

# Include routers
app.include_router(auth.router)
app.include_router(stores.router)
app.include_router(products.router)

# Import additional routers
from app.routers import cart, orders, payments
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(payments.router)

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Check if the API is running."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "shopsmooth-api"
    }

@app.get("/", tags=["Root"])
async def root():
    """Welcome endpoint."""
    return {
        "message": "Welcome to ShopSmooth API",
        "docs": "/api/docs",
        "api_version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
