"""
ShopSmooth Payments Router
Handles Razorpay payment processing and webhooks.
"""

import hashlib
import hmac
import os
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
import razorpay

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order, PaymentStatus
from app.models.user import User
from app.models.store import Store
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/payments", tags=["Payments"])


class PaymentRequest(BaseModel):
    order_id: int
    amount: float


class PaymentVerifyRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str


class PaymentResponse(BaseModel):
    order_id: int
    payment_id: Optional[str]
    status: str
    amount: float
    created_at: datetime

    class Config:
        from_attributes = True


def get_razorpay_client():
    """Initialize Razorpay client."""
    key_id = os.getenv("RAZORPAY_KEY_ID")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")

    if not key_id or not key_secret:
        raise HTTPException(
            status_code=500,
            detail="Razorpay credentials not configured"
        )

    return razorpay.Client(auth=(key_id, key_secret))


@router.post("/create-razorpay-order", status_code=status.HTTP_201_CREATED)
def create_razorpay_order(
    payload: PaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a Razorpay order for payment.
    Returns order details for frontend payment form.
    """
    order = db.query(Order).filter(Order.id == payload.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check ownership
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Check payment status
    if order.payment_status == PaymentStatus.paid:
        raise HTTPException(status_code=400, detail="Order already paid")

    try:
        client = get_razorpay_client()

        # Create Razorpay order
        razorpay_order = client.order.create({
            "amount": int(order.total * 100),  # Amount in paise
            "currency": "INR",  # Default currency
            "receipt": order.order_number,
            "notes": {
                "order_id": order.id,
                "customer_email": current_user.email,
                "store_id": order.store_id,
            }
        })

        # Store Razorpay order ID
        order.razorpay_order_id = razorpay_order["id"]
        db.commit()

        return {
            "razorpay_order_id": razorpay_order["id"],
            "order_id": order.id,
            "amount": order.total,
            "currency": "INR",
            "customer_name": f"{current_user.first_name} {current_user.last_name}",
            "customer_email": current_user.email,
            "key_id": os.getenv("RAZORPAY_KEY_ID"),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment processing error: {str(e)}")


@router.post("/verify-payment")
def verify_payment(
    payload: PaymentVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Verify Razorpay payment signature and update order status.
    """
    try:
        # Get Razorpay credentials
        key_secret = os.getenv("RAZORPAY_KEY_SECRET")
        if not key_secret:
            raise HTTPException(status_code=500, detail="Razorpay not configured")

        # Verify signature
        signature_data = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}"
        signature = hmac.new(
            key_secret.encode(),
            signature_data.encode(),
            hashlib.sha256
        ).hexdigest()

        if signature != payload.razorpay_signature:
            raise HTTPException(status_code=400, detail="Invalid payment signature")

        # Find order by Razorpay order ID
        order = db.query(Order).filter(
            Order.razorpay_order_id == payload.razorpay_order_id
        ).first()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        # Check ownership
        if order.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")

        # Update payment status
        order.payment_status = PaymentStatus.paid
        order.razorpay_payment_id = payload.razorpay_payment_id
        order.paid_at = datetime.utcnow()
        db.commit()
        db.refresh(order)

        return {
            "status": "success",
            "message": "Payment verified successfully",
            "order_id": order.id,
            "payment_id": payload.razorpay_payment_id,
            "amount": order.total,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification error: {str(e)}")


@router.post("/webhook")
async def payment_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Razorpay webhook endpoint for payment notifications.
    """
    try:
        # Get request body
        body = await request.body()
        body_str = body.decode()

        # Verify webhook signature
        key_secret = os.getenv("RAZORPAY_KEY_SECRET")
        if not key_secret:
            return {"status": "error", "message": "Razorpay not configured"}

        signature_header = request.headers.get("X-Razorpay-Signature", "")
        signature = hmac.new(
            key_secret.encode(),
            body_str.encode(),
            hashlib.sha256
        ).hexdigest()

        if signature != signature_header:
            return {"status": "error", "message": "Invalid signature"}

        # Parse event
        import json
        event = json.loads(body_str)

        if event.get("event") == "payment.authorized":
            payment_data = event.get("payload", {}).get("payment", {}).get("entity", {})
            razorpay_order_id = payment_data.get("order_id")

            order = db.query(Order).filter(
                Order.razorpay_order_id == razorpay_order_id
            ).first()

            if order:
                order.payment_status = PaymentStatus.paid
                order.razorpay_payment_id = payment_data.get("id")
                order.paid_at = datetime.utcnow()
                db.commit()

        elif event.get("event") == "payment.failed":
            payment_data = event.get("payload", {}).get("payment", {}).get("entity", {})
            razorpay_order_id = payment_data.get("order_id")

            order = db.query(Order).filter(
                Order.razorpay_order_id == razorpay_order_id
            ).first()

            if order:
                order.payment_status = PaymentStatus.failed
                db.commit()

        return {"status": "success"}

    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/order/{order_id}")
def get_payment_status(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get payment status for an order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return {
        "order_id": order.id,
        "payment_status": order.payment_status,
        "amount": order.total,
        "paid_at": order.paid_at,
    }
