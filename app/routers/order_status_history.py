from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.order_status_history import OrderStatusHistoryResponse
from app.services import order_status_history_service

router = APIRouter(prefix="/order-status-history", tags=["Order Status History"])


@router.get("/order/{order_id}", response_model=list[OrderStatusHistoryResponse])
def get_status_history(order_id: int, db: Session = Depends(get_db)):
    return order_status_history_service.get_status_history_by_order(db, order_id)
