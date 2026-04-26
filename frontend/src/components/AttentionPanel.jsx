import styles from "./AttentionPanel.module.css";

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function PanelList({ title, products, renderMeta }) {
  return (
    <article className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.list}>
        {products.map((product) => (
          <div className={styles.item} key={product.id}>
            <div>
              <strong>{product.name}</strong>
              <p className={styles.category}>{product.category}</p>
            </div>
            <span>{renderMeta(product)}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function AttentionPanel({ items, getStatus }) {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <span className={styles.kicker}>Panel de atencion</span>
        <h2 className={styles.title}>Prioridades para revisar hoy</h2>
      </div>

      <div className={styles.grid}>
        <PanelList
          title="Productos con mayor aumento"
          products={items.byVariation}
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
          renderMeta={(product) => <span className={styles.stock}>{product.stock} u.</span>}
        />

        <PanelList
          title="Revisar hoy"
          products={items.reviewToday}
          renderMeta={(product) => (
            <span className={styles.price}>{formatCurrency(product.currentPrice)}</span>
          )}
        />
      </div>
    </section>
  );
}
