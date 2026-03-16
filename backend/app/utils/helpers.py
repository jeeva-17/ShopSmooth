"""
ShopSmooth Helper Utilities
Provides slug generation, order number generation, file upload handling,
and image compression utilities.
"""

import os
import re
import uuid
import shutil
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import UploadFile, HTTPException, status
from PIL import Image

from app.config import settings

# Allowed image MIME types
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}
ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
}


def generate_slug(text: str) -> str:
    """
    Convert any text string into a URL-safe slug.

    Example:
        "Hello World! 123" -> "hello-world-123"
    """
    text = text.lower().strip()
    # Replace spaces and special chars with hyphens
    text = re.sub(r"[\s_]+", "-", text)
    # Remove characters that aren't alphanumeric or hyphens
    text = re.sub(r"[^\w-]", "", text)
    # Collapse multiple hyphens
    text = re.sub(r"-+", "-", text)
    # Strip leading/trailing hyphens
    text = text.strip("-")
    return text


def generate_order_number(store_id: int, db) -> str:
    """
    Generate the next sequential order number for a store.
    Format: #SM-<4-digit-number> starting at 1001.

    Args:
        store_id: The store's ID.
        db: Active SQLAlchemy session.

    Returns:
        String like "#SM-1001"
    """
    from app.models.order import Order

    # Count existing orders for this store to determine sequence
    count = db.query(Order).filter(Order.store_id == store_id).count()
    number = 1001 + count
    return f"#SM-{number}"


def allowed_file(filename: str) -> bool:
    """
    Check if an uploaded filename has an allowed image extension.

    Args:
        filename: Original filename from upload.

    Returns:
        True if extension is allowed.
    """
    ext = Path(filename).suffix.lower()
    return ext in ALLOWED_IMAGE_EXTENSIONS


def save_upload(file: UploadFile, folder: str) -> str:
    """
    Save an uploaded file to disk under static/uploads/{folder}/.
    Generates a unique filename to prevent collisions.

    Args:
        file: FastAPI UploadFile object.
        folder: Sub-folder name (e.g., "products", "logos").

    Returns:
        Relative URL path to the saved file (e.g., "/static/uploads/products/abc.jpg").

    Raises:
        HTTPException 400 if file type is not allowed.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided",
        )

    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}",
        )

    # Build the target directory
    upload_base = Path(settings.UPLOAD_DIR)
    target_dir = upload_base / folder
    target_dir.mkdir(parents=True, exist_ok=True)

    # Generate unique filename preserving the extension
    ext = Path(file.filename).suffix.lower()
    unique_name = f"{uuid.uuid4().hex}{ext}"
    target_path = target_dir / unique_name

    # Write the file content
    with open(target_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Compress if it's a raster image
    compress_image(str(target_path))

    # Return the URL-accessible path
    return f"/static/uploads/{folder}/{unique_name}"


def compress_image(filepath: str, max_size: int = 1920) -> None:
    """
    Resize and compress an image in-place if it exceeds max_size on either dimension.
    JPEG/WebP files are re-saved with quality=85 for additional size reduction.

    Args:
        filepath: Absolute or relative path to the image file.
        max_size: Maximum pixel dimension (width or height). Default 1920.
    """
    try:
        ext = Path(filepath).suffix.lower()
        if ext not in {".jpg", ".jpeg", ".png", ".webp", ".bmp"}:
            return  # GIFs and unsupported types are left untouched

        with Image.open(filepath) as img:
            # Convert RGBA/P mode images to RGB for JPEG compatibility
            if img.mode in ("RGBA", "P") and ext in (".jpg", ".jpeg"):
                img = img.convert("RGB")

            width, height = img.size
            if width > max_size or height > max_size:
                img.thumbnail((max_size, max_size), Image.LANCZOS)

            # Determine save format
            fmt = img.format or "JPEG"
            if ext in (".jpg", ".jpeg"):
                img.save(filepath, "JPEG", quality=85, optimize=True)
            elif ext == ".webp":
                img.save(filepath, "WEBP", quality=85)
            elif ext == ".png":
                img.save(filepath, "PNG", optimize=True)
            else:
                img.save(filepath, fmt)

    except Exception:
        # Image compression is non-critical; silently skip on error
        pass


def paginate(query, skip: int = 0, limit: int = 20):
    """
    Apply pagination to a SQLAlchemy query.

    Args:
        query: SQLAlchemy query object.
        skip: Number of records to skip.
        limit: Maximum records to return (capped at 100).

    Returns:
        Tuple of (items list, total_count).
    """
    limit = min(limit, 100)  # Safety cap
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total
