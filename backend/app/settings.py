from dataclasses import dataclass
from pathlib import Path
import os

DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent / "spyprice.db"
DEFAULT_CORS_ORIGINS = (
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
)


def _parse_bool(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _parse_csv(value: str | None, default: tuple[str, ...]) -> tuple[str, ...]:
    if not value:
        return default
    return tuple(item.strip() for item in value.split(",") if item.strip())


@dataclass(frozen=True)
class Settings:
    app_name: str
    app_description: str
    app_version: str
    database_url: str
    cors_origins: tuple[str, ...]
    enable_seed: bool
    smtp_host: str | None
    smtp_port: int
    smtp_username: str | None
    smtp_password: str | None
    smtp_from: str | None
    smtp_use_tls: bool
    alert_recipient: str | None

    @property
    def email_configured(self) -> bool:
        return bool(self.smtp_host and self.smtp_from and self.alert_recipient)


def get_settings() -> Settings:
    return Settings(
        app_name="SpyPrice API",
        app_description=(
            "Monitor de precios de proveedores: productos, historial y semaforo de variaciones."
        ),
        app_version="1.0.0",
        database_url=os.getenv("SPYPRICE_DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}"),
        cors_origins=_parse_csv(
            os.getenv("SPYPRICE_CORS_ORIGINS"),
            DEFAULT_CORS_ORIGINS,
        ),
        enable_seed=_parse_bool(os.getenv("SPYPRICE_ENABLE_SEED"), True),
        smtp_host=os.getenv("SPYPRICE_SMTP_HOST"),
        smtp_port=int(os.getenv("SPYPRICE_SMTP_PORT", "587")),
        smtp_username=os.getenv("SPYPRICE_SMTP_USERNAME"),
        smtp_password=os.getenv("SPYPRICE_SMTP_PASSWORD"),
        smtp_from=os.getenv("SPYPRICE_SMTP_FROM"),
        smtp_use_tls=_parse_bool(os.getenv("SPYPRICE_SMTP_USE_TLS"), True),
        alert_recipient=os.getenv("SPYPRICE_ALERT_RECIPIENT"),
    )
