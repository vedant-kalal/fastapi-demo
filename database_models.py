from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float   
Base = declarative_base()
class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    description = Column(String(100))
    price = Column(Float)
    quantity = Column(Integer)