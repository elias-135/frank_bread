from pydantic import BaseModel
from datetime import date, datetime


class StockHistoryCreate(BaseModel):
    product_id: int
    stock_date: date
    quantity_added: int = 0
    quantity_sold: int = 0
    closing_balance: int
    notes: str | None = None


class StockHistoryResponse(BaseModel):
    history_id: int
    product_id: int
    stock_date: date
    quantity_added: int
    quantity_sold: int
    closing_balance: int
    notes: str | None
    recorded_at: datetime

    class Config:
        from_attributes = True
