from pydantic import BaseModel
from datetime import date, datetime
from decimal import Decimal


class CurrentStockCreate(BaseModel):
    product_id: int
    quantity_available: int
    last_restocked: date | None = None


class CurrentStockUpdate(BaseModel):
    quantity_available: int | None = None
    last_restocked: date | None = None


class CurrentStockResponse(BaseModel):
    stock_id: int
    product_id: int
    quantity_available: int
    last_restocked: date | None
    last_updated: datetime

    class Config:
        from_attributes = True


class ProductWithStockResponse(BaseModel):
    product_id: int
    name: str
    description: str | None
    image_url: str | None
    base_price: Decimal
    category: str
    quantity_available: int

    class Config:
        from_attributes = True
