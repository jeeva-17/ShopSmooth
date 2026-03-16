"""
ShopSmooth Orders Router
Manages order creation, retrieval, and status management.
"""

from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.order import Order, OrderItem, OrderStatus, Cart, CartItem
from app.models.product import Product
from app.models.user import User
from app.models.store import Store
from app.utils.security import get_current_user
from app.utils.helpers import generate_slug

router = APIRouter(prefix="/api/orders", tags=["Orders"])


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    price: float
    total: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    order_number: str
    store_id: int
    user_id: int
    status: str
    payment_status: str
    subtotal: float
    tax: float
    shipping: float
    total: float
    items: List[OrderItemResponse]
    created_at: datetime

    class Config:
        from_attributes = True


class CreateOrderRequest(BaseModel):
    store_id: int
    address_id: Optional[int] = None
    notes: Optional[str] = None


class UpdateOrderStatusRequest(BaseModel):
    status: OrderStatus


def generate_order_number(db: Session) -> str:
    """Generate unique order number like SM-10001."""
    last_order = db.query(Order).order_by(desc(Order.id)).first()
    next_number = (last_order.id if last_order else 0) + 1001
    return f"SM-{next_number}"


@router.get("/", response_model=List[OrderResponse])
def list_orders(
    store_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List orders for the current user or all orders for store admin."""
    query = db.query(Order)

    if current_user.role.value == "customer":
        query = query.filter(Order.user_id == current_user.id)
    elif current_user.role.value == "store_admin" and store_id:
        query = query.filter(Order.store_id == store_id)
    elif store_id:
        query = query.filter(Order.store_id == store_id)

    if status_filter:
        query = query.filter(Order.status == status_filter)

    orders = query.order_by(desc(Order.created_at)).offset(skip).limit(min(limit, 100)).all()
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check authorization
    if current_user.role.value == "customer" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return order


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new order from the shopping cart."""
    # Get cart
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Get store
    store = db.query(Store).filter(Store.id == payload.store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    # Calculate totals
    subtotal = sum(item.price * item.quantity for item in cart.items)
    tax = subtotal * (store.tax_rate / 100)
    shipping = store.delivery_charge
    total = subtotal + tax + shipping

    # Create order
    order = Order(
        order_number=generate_order_number(db),
        store_id=payload.store_id,
        user_id=current_user.id,
        status=OrderStatus.pending,
        subtotal=subtotal,
        tax=tax,
        shipping=shipping,
        total=total,
        notes=payload.notes,
    )
    db.add(order)
    db.flush()

    # Create order items from cart
    for cart_item in cart.items:
        product = db.query(Product).filter(Product.id == cart_item.product_id).first()
        order_item = OrderItem(
            order_id=order.id,
            product_id=cart_item.product_id,
            product_name=product.name if product else "Unknown",
            quantity=cart_item.quantity,
            price=cart_item.price,
            total=cart_item.price * cart_item.quantity,
        )
        db.add(order_item)

    # Clear cart
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()

    db.commit()
    db.refresh(order)
    return order


@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    payload: UpdateOrderStatusRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update order status (admin only)."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check authorization
    store = db.query(Store).filter(Store.id == order.store_id).first()
    if store.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    order.status = payload.status
    order.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(order)
    return order


@router.post("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel an order (customer or admin)."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check authorization
    if current_user.role.value == "customer" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    if order.status in [OrderStatus.shipped, OrderStatus.delivered]:
        raise HTTPException(status_code=400, detail="Cannot cancel shipped/delivered orders")

    order.status = OrderStatus.cancelled
    order.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(order)
    return order
