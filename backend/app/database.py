from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from .settings import get_settings

engine: Engine | None = None
SessionLocal = sessionmaker(autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def build_engine(database_url: str) -> Engine:
    connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}
    return create_engine(database_url, connect_args=connect_args)


def configure_database(database_url: str) -> Engine:
    global engine
    engine = build_engine(database_url)
    SessionLocal.configure(bind=engine)
    return engine


def ensure_database_configured() -> None:
    if SessionLocal.kw.get("bind") is None:
        settings = get_settings()
        configure_database(settings.database_url)


def get_db():
    ensure_database_configured()

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
