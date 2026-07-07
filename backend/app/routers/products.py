from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/products", tags=["products"])


def get_product_or_404(product_id: int, db: Session) -> models.Product:
    product = db.get(models.Product, product_id)
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No existe un producto con id {product_id}",
        )
    return product


@router.get("", response_model=list[schemas.ProductRead])
def list_products(db: Session = Depends(get_db)):
    return db.query(models.Product).order_by(models.Product.created_at.desc()).all()


@router.post("", response_model=schemas.ProductRead, status_code=status.HTTP_201_CREATED)
def create_product(payload: schemas.ProductCreate, db: Session = Depends(get_db)):
    product = models.Product(
        name=payload.name.strip(),
        supplier=payload.supplier.strip(),
        category=payload.category.strip(),
        current_price=payload.current_price,
        stock=payload.stock,
        last_restock=payload.last_restock,
    )
    # El precio anterior y el vigente arrancan el historial: el semaforo
    # siempre se calcula contra datos registrados, no contra un valor suelto.
    product.history.append(models.PriceEntry(price=payload.previous_price))
    product.history.append(models.PriceEntry(price=payload.current_price))

    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=schemas.ProductRead)
def update_product(
    product_id: int, payload: schemas.ProductUpdate, db: Session = Depends(get_db)
):
    product = get_product_or_404(product_id, db)

    changes = payload.model_dump(exclude_unset=True)
    for field, value in changes.items():
        setattr(product, field, value.strip() if isinstance(value, str) else value)

    db.commit()
    db.refresh(product)
    return product


@router.patch("/{product_id}/price", response_model=schemas.ProductRead)
def update_price(
    product_id: int, payload: schemas.PriceUpdate, db: Session = Depends(get_db)
):
    product = get_product_or_404(product_id, db)

    if payload.current_price != product.current_price:
        product.current_price = payload.current_price
        product.history.append(models.PriceEntry(price=payload.current_price))
        db.commit()
        db.refresh(product)

    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = get_product_or_404(product_id, db)
    db.delete(product)
    db.commit()


@router.get("/{product_id}/history", response_model=list[schemas.PriceEntryRead])
def get_history(product_id: int, db: Session = Depends(get_db)):
    product = get_product_or_404(product_id, db)
    return product.history
