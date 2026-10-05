from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Engine configuration with fallback to sqlite for lightweight testing if postgres is unreachable
engine = create_engine(
    settings.DATABASE_URL if "postgresql" in settings.DATABASE_URL else "sqlite:///./omnisurv.db",
    echo=False,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
