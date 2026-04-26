import styles from "./ProductsTable.module.css";

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export default function ProductsTable({ products, getStatus }) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <span className={styles.kicker}>Vista principal</span>
          <h2 className={styles.title}>Tabla de productos</h2>
        </div>
        <p className={styles.caption}>
          Controla precios, stock y prioridades del almacen desde una sola vista.
        </p>
      </div>

      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoria</th>
              <th>Precio actual</th>
              <th>Variacion</th>
              <th>Stock</th>
              <th>Ultima reposicion</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? (
              products.map((product) => {
                const status = getStatus(product);
                const toneClass = styles[status.tone];

                return (
                  <tr key={product.id}>
                    <td className={styles.productCell}>
                      <strong>{product.name}</strong>
                    </td>
                    <td>{product.category}</td>
                    <td>{formatCurrency(product.currentPrice)}</td>
                    <td>
                      <span className={`${styles.pill} ${toneClass}`}>
                        {status.variation > 0 ? "+" : ""}
                        {status.variation.toFixed(1)}%
                      </span>
                    </td>
                    <td>{product.stock} u.</td>
                    <td>{formatDate(product.lastRestock)}</td>
                    <td>
                      <span className={`${styles.pill} ${toneClass}`}>{status.label}</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className={styles.emptyState} colSpan="7">
                  No hay productos que coincidan con los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
