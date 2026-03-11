from pydantic import BaseModel
from datetime import datetime


class OrderStatusHistoryResponse(BaseModel):
    history_id: int
    order_id: int
    status: str
    changed_by: str
    notes: str | None
    changed_at: datetime

    class Config:
        from_attributes = True
