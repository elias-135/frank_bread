from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from app.schemas.order_item import OrderItemCreate, OrderItemResponse


class OrderCreate(BaseModel):
    user_id: int
    items: list[OrderItemCreate]


class GuestOrderCreate(BaseModel):
    name: str
    phone: str
    address: str
    items: list[OrderItemCreate]


class OrderCancelRequest(BaseModel):
    phone: str


class OrderStatusUpdate(BaseModel):
    status: str
    changed_by: str
    notes: str | None = None


class OrderResponse(BaseModel):
    order_id: int
    user_id: int
    order_date: datetime
    current_status: str
    total_amount: Decimal
    created_at: datetime
    order_items: list[OrderItemResponse] = []

    class Config:
        from_attributes = True
