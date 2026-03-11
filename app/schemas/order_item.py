from pydantic import BaseModel
from decimal import Decimal


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderItemResponse(BaseModel):
    order_item_id: int
    order_id: int
    product_id: int
    product_name: str = ""
    quantity: int
    unit_price: Decimal
    subtotal: Decimal

    class Config:
        from_attributes = True
