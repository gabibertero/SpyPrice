from dataclasses import dataclass
from datetime import date

LOW_STOCK_THRESHOLD = 8
CRITICAL_VARIATION_THRESHOLD = 10


@dataclass(frozen=True)
class PriceStatus:
    tone: str
    label: str
    variation: float


def calculate_variation(previous_price: float, current_price: float) -> float:
    if previous_price <= 0:
        return 0.0
    return ((current_price - previous_price) / previous_price) * 100


def get_price_status(product) -> PriceStatus:
    variation = calculate_variation(product.previous_price, product.current_price)

    if variation > CRITICAL_VARIATION_THRESHOLD:
        return PriceStatus(tone="critical", label="Critico", variation=variation)

    if variation > 0:
        return PriceStatus(tone="warning", label="Atencion", variation=variation)

    return PriceStatus(tone="stable", label="Estable", variation=variation)


def is_low_stock(product) -> bool:
    return product.stock <= LOW_STOCK_THRESHOLD


def days_since_restock(last_restock: date) -> int:
    return (date.today() - last_restock).days
