import styles from "./SummaryCards.module.css";

export default function SummaryCards({ items }) {
  return (
    <section className={styles.grid} aria-label="Resumen general">
      {items.map((item) => (
        <article className={styles.card} key={item.label}>
          <p className={styles.label}>{item.label}</p>
          <strong className={styles.value}>{item.value}</strong>
          <p className={styles.detail}>{item.detail}</p>
        </article>
      ))}
    </section>
  );
}
