import importlib
import sys

from fastapi.testclient import TestClient


def build_client(tmp_path, monkeypatch):
    db_path = tmp_path / "spyprice-test.db"
    monkeypatch.setenv("SPYPRICE_DATABASE_URL", f"sqlite:///{db_path}")
    monkeypatch.setenv("SPYPRICE_ENABLE_SEED", "false")
    monkeypatch.delenv("SPYPRICE_SMTP_HOST", raising=False)
    monkeypatch.delenv("SPYPRICE_SMTP_FROM", raising=False)
    monkeypatch.delenv("SPYPRICE_ALERT_RECIPIENT", raising=False)

    for module_name in [
        "app.main",
        "app.database",
        "app.models",
        "app.schemas",
        "app.seed",
        "app.migrations",
        "app.settings",
        "app.routers.products",
        "app.routers.alerts",
        "app.services.pricing",
        "app.services.alerts",
    ]:
        if module_name in sys.modules:
            del sys.modules[module_name]

    app_main = importlib.import_module("app.main")
    app = app_main.create_app()
    return TestClient(app)


def test_product_crud_and_history(tmp_path, monkeypatch):
    client = build_client(tmp_path, monkeypatch)

    payload = {
        "supplier": "Cafe Serrano",
        "name": "Cafe tostado",
        "category": "Bebidas",
        "previousPrice": 5400,
        "currentPrice": 5900,
        "stock": 7,
        "lastRestock": "2026-07-06",
    }

    created = client.post("/api/products", json=payload)
    assert created.status_code == 201
    created_body = created.json()
    assert created_body["supplier"] == "Cafe Serrano"
    assert created_body["previousPrice"] == 5400

    updated = client.put(
        f"/api/products/{created_body['id']}",
        json={
            "supplier": "Cafe Serrano",
            "name": "Cafe tostado especial",
            "category": "Bebidas",
            "stock": 6,
            "lastRestock": "2026-07-06",
        },
    )
    assert updated.status_code == 200
    assert updated.json()["name"] == "Cafe tostado especial"

    repriced = client.patch(
        f"/api/products/{created_body['id']}/price",
        json={"currentPrice": 6700},
    )
    assert repriced.status_code == 200
    assert repriced.json()["previousPrice"] == 5900

    history = client.get(f"/api/products/{created_body['id']}/history")
    assert history.status_code == 200
    assert len(history.json()) == 3

    deleted = client.delete(f"/api/products/{created_body['id']}")
    assert deleted.status_code == 204


def test_alerts_summary_separates_price_and_stock(tmp_path, monkeypatch):
    client = build_client(tmp_path, monkeypatch)

    stable_low_stock = {
        "supplier": "Distribuidora Norte",
        "name": "Fideos mostachol",
        "category": "Almacen",
        "previousPrice": 1800,
        "currentPrice": 1800,
        "stock": 4,
        "lastRestock": "2026-07-05",
    }
    critical_by_price = {
        "supplier": "Mayorista Centro",
        "name": "Harina 000",
        "category": "Almacen",
        "previousPrice": 1000,
        "currentPrice": 1200,
        "stock": 20,
        "lastRestock": "2026-07-05",
    }

    assert client.post("/api/products", json=stable_low_stock).status_code == 201
    assert client.post("/api/products", json=critical_by_price).status_code == 201

    summary = client.get("/api/alerts/summary")
    assert summary.status_code == 200
    body = summary.json()

    assert body["totals"]["criticalProducts"] == 1
    assert body["totals"]["lowStockProducts"] == 1
    assert body["critical"][0]["name"] == "Harina 000"
    assert body["lowStock"][0]["name"] == "Fideos mostachol"


def test_send_alerts_requires_smtp_configuration(tmp_path, monkeypatch):
    client = build_client(tmp_path, monkeypatch)

    response = client.post("/api/alerts/send")
    assert response.status_code == 503
    assert "SMTP" in response.json()["detail"]
