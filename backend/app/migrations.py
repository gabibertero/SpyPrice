from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine


def run_migrations(engine: Engine) -> None:
    inspector = inspect(engine)
    tables = set(inspector.get_table_names())

    if "products" in tables:
        columns = {column["name"] for column in inspector.get_columns("products")}
        if "supplier" not in columns:
            with engine.begin() as connection:
                connection.execute(
                    text(
                        """
                        ALTER TABLE products
                        ADD COLUMN supplier VARCHAR(120) NOT NULL DEFAULT 'Sin proveedor'
                        """
                    )
                )
