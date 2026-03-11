from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.stock_history import StockHistoryCreate, StockHistoryResponse
from app.services import stock_history_service

router = APIRouter(prefix="/stock-history", tags=["Stock History"])


@router.post("/", response_model=StockHistoryResponse, status_code=201)
def create_stock_history(entry: StockHistoryCreate, db: Session = Depends(get_db)):
    return stock_history_service.create_stock_history_entry(db, entry)


@router.get("/product/{product_id}", response_model=list[StockHistoryResponse])
def get_product_stock_history(product_id: int, db: Session = Depends(get_db)):
    return stock_history_service.get_history_by_product(db, product_id)
