from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.order_item import OrderItemResponse
from app.services import order_item_service

router = APIRouter(prefix="/order-items", tags=["Order Items"])


@router.get("/order/{order_id}", response_model=list[OrderItemResponse])
def get_order_items(order_id: int, db: Session = Depends(get_db)):
    return order_item_service.get_items_by_order(db, order_id)
