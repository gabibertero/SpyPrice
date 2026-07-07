from datetime import datetime, timezone
from email.message import EmailMessage
import smtplib

from .pricing import get_price_status, is_low_stock


def serialize_alert_item(product):
    status = get_price_status(product)
    return {
        "id": product.id,
        "name": product.name,
        "supplier": product.supplier,
        "category": product.category,
        "previous_price": product.previous_price,
        "current_price": product.current_price,
        "stock": product.stock,
        "last_restock": product.last_restock,
        "variation": status.variation,
        "status_label": status.label,
        "status_tone": status.tone,
    }


def build_alert_summary(products, *, email_configured: bool):
    critical = []
    warning = []
    low_stock = []

    for product in products:
        status = get_price_status(product)
        item = serialize_alert_item(product)

        if status.tone == "critical":
            critical.append(item)
        elif status.tone == "warning":
            warning.append(item)

        if is_low_stock(product):
            low_stock.append(item)

    critical.sort(key=lambda item: item["variation"], reverse=True)
    warning.sort(key=lambda item: item["variation"], reverse=True)
    low_stock.sort(key=lambda item: (item["stock"], -item["variation"]))

    return {
        "email_configured": email_configured,
        "generated_at": datetime.now(timezone.utc),
        "totals": {
            "total_products": len(products),
            "increased_products": len(critical) + len(warning),
            "low_stock_products": len(low_stock),
            "critical_products": len(critical),
        },
        "critical": critical[:5],
        "warning": warning[:5],
        "low_stock": low_stock[:5],
    }


def build_alert_email(summary) -> str:
    lines = [
        "Resumen diario de SpyPrice",
        "",
        f"Productos con aumento: {summary['totals']['increased_products']}",
        f"Productos criticos: {summary['totals']['critical_products']}",
        f"Productos con stock bajo: {summary['totals']['low_stock_products']}",
        "",
        "Criticos por precio:",
    ]

    if summary["critical"]:
        lines.extend(
            [
                (
                    f"- {item['name']} | {item['supplier']} | "
                    f"{item['variation']:+.1f}% | stock {item['stock']}"
                )
                for item in summary["critical"]
            ]
        )
    else:
        lines.append("- Sin aumentos criticos hoy.")

    lines.append("")
    lines.append("Stock bajo:")

    if summary["low_stock"]:
        lines.extend(
            [f"- {item['name']} | {item['supplier']} | stock {item['stock']}" for item in summary["low_stock"]]
        )
    else:
        lines.append("- Sin alertas de stock bajo.")

    return "\n".join(lines)


def send_alert_email(*, summary, settings) -> str:
    if not settings.email_configured:
        raise RuntimeError(
            "El reporte por email no esta configurado. Completa las variables SMTP."
        )

    message = EmailMessage()
    message["Subject"] = "SpyPrice | Resumen diario de alertas"
    message["From"] = settings.smtp_from
    message["To"] = settings.alert_recipient
    message.set_content(build_alert_email(summary))

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
        if settings.smtp_use_tls:
            smtp.starttls()
        if settings.smtp_username and settings.smtp_password:
            smtp.login(settings.smtp_username, settings.smtp_password)
        smtp.send_message(message)

    return settings.alert_recipient
