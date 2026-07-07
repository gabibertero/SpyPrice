from datetime import date, datetime, timezone

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    supplier: Mapped[str] = mapped_column(String(120), nullable=False, default="Sin proveedor")
    category: Mapped[str] = mapped_column(String(60), nullable=False)
    current_price: Mapped[float] = mapped_column(Float, nullable=False)
    stock: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_restock: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    history: Mapped[list["PriceEntry"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
        order_by="PriceEntry.recorded_at",
    )

    @property
    def previous_price(self) -> float:
        """Precio anterior al vigente, tomado del historial real."""
        if len(self.history) < 2:
            return self.current_price
        return self.history[-2].price


class PriceEntry(Base):
    __tablename__ = "price_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    price: Mapped[float] = mapped_column(Float, nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    product: Mapped[Product] = relationship(back_populates="history")
