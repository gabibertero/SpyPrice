from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, SessionLocal, configure_database
from .migrations import run_migrations
from .routers import alerts, products
from .seed import seed_if_empty
from .settings import get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    engine = configure_database(settings.database_url)

    Base.metadata.create_all(bind=engine)
    run_migrations(engine)

    if settings.enable_seed:
        with SessionLocal() as db:
            seed_if_empty(db)

    app = FastAPI(
        title=settings.app_name,
        description=settings.app_description,
        version=settings.app_version,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.cors_origins),
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(products.router)
    app.include_router(alerts.router)
    return app


app = create_app()


@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok"}
