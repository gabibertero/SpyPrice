"""Datos de demo: se cargan solo si la base esta vacia."""

from datetime import date, datetime, time, timedelta, timezone

from sqlalchemy.orm import Session

from . import models

DEMO_PRODUCTS = [
    {
        "name": "Yerba mate suave 1 kg",
        "supplier": "Molinos del Centro",
        "category": "Almacen",
        "prices": [3900, 4200, 4650],
        "stock": 18,
        "last_restock": 4,
    },
    {
        "name": "Aceite girasol 900 ml",
        "supplier": "Distribuidora San Martin",
        "category": "Despensa",
        "prices": [3250, 3100, 3100],
        "stock": 9,
        "last_restock": 7,
    },
    {
        "name": "Galletitas surtidas",
        "supplier": "Mayorista Tandil",
        "category": "Kiosco",
        "prices": [1500, 1600, 1760],
        "stock": 5,
        "last_restock": 9,
    },
    {
        "name": "Leche entera 1 l",
        "supplier": "Lacteos del Valle",
        "category": "Lacteos",
        "prices": [1380, 1450, 1540],
        "stock": 22,
        "last_restock": 2,
    },
    {
        "name": "Azucar 1 kg",
        "supplier": "Ingenio Norte",
        "category": "Almacen",
        "prices": [1150, 1200, 1390],
        "stock": 4,
        "last_restock": 10,
    },
]


def seed_if_empty(db: Session) -> None:
    if db.query(models.Product).first() is not None:
        return

    today = date.today()

    for item in DEMO_PRODUCTS:
        product = models.Product(
            name=item["name"],
            supplier=item["supplier"],
            category=item["category"],
            current_price=item["prices"][-1],
            stock=item["stock"],
            last_restock=today - timedelta(days=item["last_restock"]),
        )
        # Cada precio historico queda registrado con una fecha pasada,
        # separado por semanas, para que la evolucion tenga sentido.
        for index, price in enumerate(item["prices"]):
            weeks_ago = len(item["prices"]) - 1 - index
            recorded = datetime.combine(
                today - timedelta(weeks=weeks_ago), time(9, 0), tzinfo=timezone.utc
            )
            product.history.append(
                models.PriceEntry(price=price, recorded_at=recorded)
            )
        db.add(product)

    db.commit()
