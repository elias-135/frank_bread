from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.current_stock import CurrentStockCreate, CurrentStockUpdate, CurrentStockResponse, ProductWithStockResponse
from app.services import current_stock_service

router = APIRouter(prefix="/stock", tags=["Stock"])


@router.get("/available", response_model=list[ProductWithStockResponse])
def get_available_stock(db: Session = Depends(get_db)):
    results = current_stock_service.get_all_available_stock(db)
    return [
        ProductWithStockResponse(
            product_id=product.product_id,
            name=product.name,
            description=product.description,
            image_url=product.image_url,
            base_price=product.base_price,
            category=product.category,
            quantity_available=stock.quantity_available,
        )
        for product, stock in results
    ]


@router.post("/", response_model=CurrentStockResponse, status_code=201)
def create_stock(stock: CurrentStockCreate, db: Session = Depends(get_db)):
    existing = current_stock_service.get_stock_by_product_id(db, stock.product_id)
    if existing:
        raise HTTPException(status_code=400, detail="Stock already exists for this product. Use PUT to update.")
    return current_stock_service.create_stock(db, stock)


@router.put("/{product_id}", response_model=CurrentStockResponse)
def update_stock(product_id: int, stock: CurrentStockUpdate, db: Session = Depends(get_db)):
    updated = current_stock_service.update_stock(db, product_id, stock)
    if not updated:
        raise HTTPException(status_code=404, detail="Stock entry not found for this product")
    return updated
