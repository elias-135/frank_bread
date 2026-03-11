from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal


class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    image_url: str | None = None
    base_price: Decimal
    category: str
    is_active: bool = True


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    image_url: str | None = None
    base_price: Decimal | None = None
    category: str | None = None
    is_active: bool | None = None


class ProductResponse(BaseModel):
    product_id: int
    name: str
    description: str | None
    image_url: str | None
    base_price: Decimal
    category: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
