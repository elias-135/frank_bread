from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import *
from app.routers import bread_products, users, current_stock, stock_history, orders, order_items, order_status_history

Base.metadata.create_all(bind=engine)

app = FastAPI(title="frankBread API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bread_products.router)
app.include_router(users.router)
app.include_router(current_stock.router)
app.include_router(stock_history.router)
app.include_router(orders.router)
app.include_router(order_items.router)
app.include_router(order_status_history.router)


@app.get("/")
async def root():
    return {"message": "Welcome to frankBread API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
