"""
ShopSmooth Cart Router
Manages shopping cart operations for customers.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Cart, CartItem
from app.models.product import Product
from app.models.user import User
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/cart", tags=["Cart"])


class CartItemRequest(BaseModel):
    product_id: int
    quantity: int
    variant_id: Optional[int] = None


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    variant_id: Optional[int]
    quantity: int
    price: float
    product_name: str

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    id: int
    user_id: int
    items: List[CartItemResponse]
    total: float

    class Config:
        from_attributes = True


def get_or_create_cart(user_id: int, db: Session) -> Cart:
    """Get or create a cart for the user."""
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


@router.get("/", response_model=CartResponse)
def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the current user's cart."""
    cart = get_or_create_cart(current_user.id, db)

    total = sum(item.price * item.quantity for item in cart.items)
    return CartResponse(
        id=cart.id,
        user_id=cart.user_id,
        items=cart.items,
        total=total,
    )


@router.post("/items", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    payload: CartItemRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add an item to the cart."""
    cart = get_or_create_cart(current_user.id, db)

    # Check if product exists
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if item already in cart
    existing_item = (
        db.query(CartItem)
        .filter(
            CartItem.cart_id == cart.id,
            CartItem.product_id == payload.product_id,
            CartItem.variant_id == payload.variant_id,
        )
        .first()
    )

    if existing_item:
        existing_item.quantity += payload.quantity
        db.commit()
        db.refresh(existing_item)
        return CartItemResponse(
            id=existing_item.id,
            product_id=existing_item.product_id,
            variant_id=existing_item.variant_id,
            quantity=existing_item.quantity,
            price=existing_item.price,
            product_name=product.name,
        )
    else:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=payload.product_id,
            variant_id=payload.variant_id,
            quantity=payload.quantity,
            price=product.price,
        )
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
        return CartItemResponse(
            id=cart_item.id,
            product_id=cart_item.product_id,
            variant_id=cart_item.variant_id,
            quantity=cart_item.quantity,
            price=cart_item.price,
            product_name=product.name,
        )


@router.put("/items/{item_id}", response_model=CartItemResponse)
def update_cart_item(
    item_id: int,
    payload: CartItemRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update quantity of a cart item."""
    cart = get_or_create_cart(current_user.id, db)

    cart_item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.cart_id == cart.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    cart_item.quantity = payload.quantity
    db.commit()
    db.refresh(cart_item)

    product = db.query(Product).filter(Product.id == cart_item.product_id).first()
    return CartItemResponse(
        id=cart_item.id,
        product_id=cart_item.product_id,
        variant_id=cart_item.variant_id,
        quantity=cart_item.quantity,
        price=cart_item.price,
        product_name=product.name if product else "Unknown",
    )


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove an item from the cart."""
    cart = get_or_create_cart(current_user.id, db)

    cart_item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.cart_id == cart.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()
    return None


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Clear the entire cart."""
    cart = get_or_create_cart(current_user.id, db)

    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    return None
