import { formatCurrency, formatDate } from "../utils/formatters";
import styles from "./ProductsTable.module.css";

export default function ProductsTable({
  products,
  getStatus,
  isLowStock,
  isCriticalStock,
  onEdit,
  onOpenHistory,
  onDelete,
}) {
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? (
              products.map((product) => {
                const status = getStatus(product);
                const toneClass = styles[status.tone];
                const stockClass = isCriticalStock(product.stock)
                  ? styles.stockCritical
                  : isLowStock(product.stock)
                    ? styles.stockWarning
                    : styles.stockStable;

                return (
                  <tr key={product.id}>
                    <td className={styles.productCell}>
                      <strong>{product.name}</strong>
                      <p className={styles.productMeta}>{product.supplier}</p>
                    </td>
                    <td>{product.category}</td>
                    <td>{formatCurrency(product.currentPrice)}</td>
                    <td>
                      <span className={`${styles.pill} ${toneClass}`}>
                        {status.variation > 0 ? "+" : ""}
                        {status.variation.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.stockTag} ${stockClass}`}>
                        {product.stock} u.
                      </span>
                    </td>
                    <td>{formatDate(product.lastRestock)}</td>
                    <td>
                      <span className={`${styles.pill} ${toneClass}`}>
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionButton}
                          type="button"
                          onClick={() => onEdit(product)}
                        >
                          Editar
                        </button>
                        <button
                          className={styles.actionButton}
                          type="button"
                          onClick={() => onOpenHistory(product)}
                        >
                          Historial
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          type="button"
                          onClick={() => onDelete(product)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className={styles.emptyState} colSpan="8">
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
