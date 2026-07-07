import smtplib

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..services.alerts import build_alert_summary, send_alert_email
from ..settings import Settings, get_settings

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("/summary", response_model=schemas.AlertSummaryRead)
def get_alerts_summary(
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    products = db.query(models.Product).order_by(models.Product.created_at.desc()).all()
    return build_alert_summary(products, email_configured=settings.email_configured)


@router.post("/send", response_model=schemas.AlertDispatchRead)
def dispatch_alerts_report(
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    products = db.query(models.Product).order_by(models.Product.created_at.desc()).all()
    summary = build_alert_summary(products, email_configured=settings.email_configured)

    try:
        recipient = send_alert_email(summary=summary, settings=settings)
    except RuntimeError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(error),
        ) from error
    except smtplib.SMTPException as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="No se pudo enviar el email de alertas. Revisa la configuracion SMTP.",
        ) from error

    return {
        "recipient": recipient,
        "critical_count": summary["totals"]["critical_products"],
        "warning_count": summary["totals"]["increased_products"]
        - summary["totals"]["critical_products"],
        "low_stock_count": summary["totals"]["low_stock_products"],
    }
