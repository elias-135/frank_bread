from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.order import OrderCreate, GuestOrderCreate, OrderResponse, OrderStatusUpdate, OrderCancelRequest
from app.schemas.order_status_history import OrderStatusHistoryResponse
from app.services import order_service, order_status_history_service

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=OrderResponse, status_code=201)
def place_order(order: OrderCreate, db: Session = Depends(get_db)):
    return order_service.place_order(db, order)


@router.post("/guest", response_model=OrderResponse, status_code=201)
def place_guest_order(order: GuestOrderCreate, db: Session = Depends(get_db)):
    return order_service.place_guest_order(db, order)


@router.post("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(order_id: int, body: OrderCancelRequest, db: Session = Depends(get_db)):
    return order_service.cancel_order(db, order_id, body.phone)


@router.get("/user/{user_id}", response_model=list[OrderResponse])
def get_user_orders(user_id: int, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return order_service.get_orders_by_user(db, user_id, skip, limit)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = order_service.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.get("/", response_model=list[OrderResponse])
def get_all_orders(
    skip: int = 0,
    limit: int = 100,
    status: str | None = Query(None, description="Filter by status"),
    db: Session = Depends(get_db),
):
    return order_service.get_all_orders(db, skip, limit, status)


@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(order_id: int, status_update: OrderStatusUpdate, db: Session = Depends(get_db)):
    return order_service.update_order_status(db, order_id, status_update)


@router.get("/{order_id}/status-history", response_model=list[OrderStatusHistoryResponse])
def get_order_status_history(order_id: int, db: Session = Depends(get_db)):
    return order_status_history_service.get_status_history_by_order(db, order_id)
