import { formatCurrency } from "../utils/formatters";
import styles from "./AttentionPanel.module.css";

function PanelList({ title, products, emptyMessage, renderMeta }) {
  return (
    <article className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.list}>
        {products.length ? (
          products.map((product) => (
            <div className={styles.item} key={product.id}>
              <div>
                <strong>{product.name}</strong>
                <p className={styles.category}>
                  {product.category} · {product.supplier}
                </p>
              </div>
              <span>{renderMeta(product)}</span>
            </div>
          ))
        ) : (
          <p className={styles.emptyState}>{emptyMessage}</p>
        )}
      </div>
    </article>
  );
}

export default function AttentionPanel({
  items,
  getStatus,
  onSendReport,
  sendingReport,
}) {
  return (
    <section className={styles.section} id="atencion">
      <div className={styles.header}>
        <div className={styles.heading}>
          <span className={styles.kicker}>Panel de atencion</span>
          <h2 className={styles.title}>Prioridades para revisar hoy</h2>
        </div>

        <button
          className={styles.reportButton}
          type="button"
          onClick={onSendReport}
          disabled={sendingReport}
        >
          {sendingReport ? "Enviando reporte..." : "Enviar resumen por email"}
        </button>
      </div>

      <div className={styles.grid}>
        <PanelList
          title="Productos con mayor aumento"
          products={items.byVariation}
          emptyMessage="Todavia no hay aumentos para destacar."
          renderMeta={(product) => {
            const status = getStatus(product);
            const toneClass = styles[status.tone];

            return (
              <span className={`${styles.pill} ${toneClass}`}>
                {status.variation > 0 ? "+" : ""}
                {status.variation.toFixed(1)}%
              </span>
            );
          }}
        />

        <PanelList
          title="Stock critico"
          products={items.lowStock}
          emptyMessage="No hay productos con stock bajo."
          renderMeta={(product) => <span className={styles.stock}>{product.stock} u.</span>}
        />

        <PanelList
          title="Revisar hoy"
          products={items.reviewToday}
          emptyMessage="No hay productos pendientes de revision."
          renderMeta={(product) => (
            <span className={styles.price}>{formatCurrency(product.currentPrice)}</span>
          )}
        />
      </div>
    </section>
  );
}
