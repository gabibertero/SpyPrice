import { useEffect, useState } from "react";
import { getHistory } from "../services/api";
import { formatCurrency, formatDateTime } from "../utils/formatters";
import { getVariation } from "../utils/pricing";
import styles from "./HistoryModal.module.css";

function Sparkline({ prices }) {
  if (prices.length < 2) {
    return null;
  }

  const width = 420;
  const height = 96;
  const padding = 8;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const points = prices.map((price, index) => {
    const x = padding + (index / (prices.length - 1)) * (width - padding * 2);
    const y = height - padding - ((price - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <svg
      className={styles.sparkline}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Evolucion del precio"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((point) => {
        const [x, y] = point.split(",");
        return <circle key={point} cx={x} cy={y} r="3.5" fill="var(--accent-dark)" />;
      })}
    </svg>
  );
}

export default function HistoryModal({ product, onClose, onUpdatePrice }) {
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [priceError, setPriceError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setHistory(null);
    setError(null);

    getHistory(product.id)
      .then((entries) => active && setHistory(entries))
      .catch((cause) => active && setError(cause.message));

    return () => {
      active = false;
    };
  }, [product.id, product.currentPrice]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSubmit(event) {
    event.preventDefault();

    const value = Number(newPrice);
    if (newPrice === "" || Number.isNaN(value) || value <= 0) {
      setPriceError("Ingresa un precio mayor a 0");
      return;
    }

    if (value === product.currentPrice) {
      setPriceError("El precio nuevo debe ser distinto al actual");
      return;
    }

    setPriceError(null);
    setSaving(true);
    try {
      await onUpdatePrice(product.id, value);
      setNewPrice("");
    } catch (cause) {
      setPriceError(cause.message);
    } finally {
      setSaving(false);
    }
  }

  const entries = history ? [...history].reverse() : [];

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={`Historial de ${product.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <span className={styles.kicker}>Historial de precios</span>
            <h2 className={styles.title}>{product.name}</h2>
            <p className={styles.meta}>
              {product.supplier} · {product.category}
            </p>
          </div>
          <button className={styles.closeButton} type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <form className={styles.priceForm} onSubmit={handleSubmit}>
          <label className={styles.priceField}>
            <span>Registrar nuevo precio</span>
            <input
              className={styles.priceInput}
              type="number"
              min="0"
              step="0.01"
              placeholder={String(product.currentPrice)}
              value={newPrice}
              onChange={(event) => setNewPrice(event.target.value)}
            />
          </label>
          <button className={styles.priceButton} type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Actualizar"}
          </button>
        </form>

        {priceError ? <p className={styles.errorText}>{priceError}</p> : null}
        {error ? <p className={styles.errorText}>{error}</p> : null}
        {!history && !error ? (
          <p className={styles.loading}>Cargando historial...</p>
        ) : null}

        {history ? (
          <>
            <Sparkline prices={history.map((entry) => entry.price)} />

            <ul className={styles.list}>
              {entries.map((entry, index) => {
                const previous = entries[index + 1];
                const variation = previous
                  ? getVariation(previous.price, entry.price)
                  : null;

                return (
                  <li key={entry.id} className={styles.item}>
                    <span className={styles.itemDate}>
                      {formatDateTime(entry.recordedAt)}
                    </span>
                    <span className={styles.itemPrice}>
                      {formatCurrency(entry.price)}
                    </span>
                    {variation !== null ? (
                      <span
                        className={`${styles.itemVariation} ${
                          variation > 0
                            ? styles.up
                            : variation < 0
                              ? styles.down
                              : styles.flat
                        }`}
                      >
                        {variation > 0 ? "+" : ""}
                        {variation.toFixed(1)}%
                      </span>
                    ) : (
                      <span className={`${styles.itemVariation} ${styles.flat}`}>
                        precio inicial
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
