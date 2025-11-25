from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine    

engine = create_engine("mysql+pymysql://root:vedank10@localhost:3306/medical_products_db") 
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)   