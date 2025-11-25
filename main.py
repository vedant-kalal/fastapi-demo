from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Product
from database import engine, SessionLocal
import database_models
from sqlalchemy.orm import Session

# Create tables
database_models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def greet():
    return "Hello world"

@app.get("/products")
def get_products(db: Session = Depends(get_db)):    
    return db.query(database_models.Product).all()

@app.get("/products/{id}")
def get_product_by_id(id: int, db: Session = Depends(get_db)):
    product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if product:
        return product
    return "product not found"

@app.post("/product")  
def add_product(product: Product, db: Session = Depends(get_db)):
    try:
        existing_product = db.query(database_models.Product).filter(database_models.Product.id == product.id).first()
        if existing_product:
            return f"Product with id {product.id} already exists"

        db_product = database_models.Product(**product.dict())
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return "product added successfully"
    except Exception as e:
        print(f"Error adding product: {e}")
        return f"Error adding product: {e}"

@app.put("/product/{id}")
def update_product(id: int, product: Product, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if not db_product:
        return "product not found"
    else:
        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.quantity = product.quantity
        db.commit()
        return "product updated successfully"

@app.delete("/product/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    try:
        db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
        if not db_product:
            return "product not found"
            
        db.delete(db_product)
        db.commit()
        return "product deleted successfully"
    except Exception as e:
        return f"Error deleting product: {e}"