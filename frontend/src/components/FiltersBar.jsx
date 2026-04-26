import styles from "./FiltersBar.module.css";

const statusOptions = ["Todos", "Estable", "Atencion", "Critico"];

export default function FiltersBar({
  categories,
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onToggleForm,
  showProductForm,
}) {
  return (
    <section className={styles.bar}>
      <div className={styles.copy}>
        <span className={styles.kicker}>Control rapido</span>
        <h2 className={styles.title}>Productos y alertas del dia</h2>
      </div>

      <div className={styles.actions}>
        <label className={styles.field}>
          <span>Buscar producto</span>
          <input
            className={styles.input}
            type="search"
            placeholder="Ej. yerba, leche, azucar..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Categoria</span>
          <select
            className={styles.input}
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Estado</span>
          <select
            className={styles.input}
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            {statusOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <button className={styles.button} type="button" onClick={onToggleForm}>
          {showProductForm ? "Ocultar formulario" : "Agregar producto"}
        </button>
      </div>
    </section>
  );
}
