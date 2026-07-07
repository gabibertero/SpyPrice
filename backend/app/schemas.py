from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Base para exponer la API en camelCase sin renunciar a snake_case en Python."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class ProductCreate(CamelModel):
    name: str = Field(min_length=3, max_length=120)
    supplier: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=60)
    previous_price: float = Field(gt=0)
    current_price: float = Field(gt=0)
    stock: int = Field(ge=0)
    last_restock: date


class ProductUpdate(CamelModel):
    name: str | None = Field(default=None, min_length=3, max_length=120)
    supplier: str | None = Field(default=None, min_length=2, max_length=120)
    category: str | None = Field(default=None, min_length=2, max_length=60)
    stock: int | None = Field(default=None, ge=0)
    last_restock: date | None = None


class PriceUpdate(CamelModel):
    current_price: float = Field(gt=0)


class ProductRead(CamelModel):
    id: int
    name: str
    supplier: str
    category: str
    previous_price: float
    current_price: float
    stock: int
    last_restock: date


class PriceEntryRead(CamelModel):
    id: int
    price: float
    recorded_at: datetime


class AlertItemRead(CamelModel):
    id: int
    name: str
    supplier: str
    category: str
    previous_price: float
    current_price: float
    stock: int
    last_restock: date
    variation: float
    status_label: str
    status_tone: str


class AlertTotalsRead(CamelModel):
    total_products: int
    increased_products: int
    low_stock_products: int
    critical_products: int


class AlertSummaryRead(CamelModel):
    email_configured: bool
    generated_at: datetime
    totals: AlertTotalsRead
    critical: list[AlertItemRead]
    warning: list[AlertItemRead]
    low_stock: list[AlertItemRead]


class AlertDispatchRead(CamelModel):
    recipient: str
    critical_count: int
    warning_count: int
    low_stock_count: int
