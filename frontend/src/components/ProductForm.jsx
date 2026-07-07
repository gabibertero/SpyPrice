import { useEffect, useState } from "react";
import styles from "./ProductForm.module.css";

function createEmptyForm() {
  return {
    supplier: "",
    name: "",
    category: "Almacen",
    previousPrice: "",
    currentPrice: "",
    stock: "",
    lastRestock: "",
  };
}

function getInitialFormData(product) {
  if (!product) {
    return createEmptyForm();
  }

  return {
    supplier: product.supplier ?? "",
    name: product.name ?? "",
    category: product.category ?? "Almacen",
    previousPrice: product.previousPrice ? String(product.previousPrice) : "",
    currentPrice: product.currentPrice ? String(product.currentPrice) : "",
    stock: product.stock ?? "",
    lastRestock: product.lastRestock ?? "",
  };
}

export default function ProductForm({
  mode = "create",
  initialProduct = null,
  onSubmitProduct,
  onCancel,
}) {
  const [formData, setFormData] = useState(() => getInitialFormData(initialProduct));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(getInitialFormData(initialProduct));
    setErrors({});
    setSubmitted(false);
    setSubmitError(null);
  }, [initialProduct, mode]);

  function validate(data) {
    const newErrors = {};

    const trimmedSupplier = data.supplier.trim();
    if (!trimmedSupplier) {
      newErrors.supplier = "El proveedor es obligatorio";
    } else if (trimmedSupplier.length < 2) {
      newErrors.supplier = "El proveedor debe tener al menos 2 caracteres";
    }

    const trimmedName = data.name.trim();
    if (!trimmedName) {
      newErrors.name = "El nombre es obligatorio";
    } else if (trimmedName.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (mode === "create") {
      if (data.previousPrice === "") {
        newErrors.previousPrice = "Ingresa el precio anterior";
      } else {
        const value = Number(data.previousPrice);
        if (Number.isNaN(value) || value <= 0) {
          newErrors.previousPrice = "Debe ser un numero mayor a 0";
        }
      }

      if (data.currentPrice === "") {
        newErrors.currentPrice = "Ingresa el precio actual";
      } else {
        const value = Number(data.currentPrice);
        if (Number.isNaN(value) || value <= 0) {
          newErrors.currentPrice = "Debe ser un numero mayor a 0";
        }
      }
    }

    if (data.stock === "") {
      newErrors.stock = "Ingresa el stock";
    } else {
      const value = Number(data.stock);
      if (Number.isNaN(value) || value < 0) {
        newErrors.stock = "No puede ser negativo";
      } else if (!Number.isInteger(value)) {
        newErrors.stock = "Debe ser un numero entero";
      }
    }

    if (data.lastRestock === "") {
      newErrors.lastRestock = "Ingresa la fecha de reposicion";
    } else {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const restockDate = new Date(`${data.lastRestock}T12:00:00`);
      if (restockDate > today) {
        newErrors.lastRestock = "La fecha no puede ser futura";
      }
    }

    return newErrors;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    const updatedData = { ...formData, [name]: value };

    setFormData(updatedData);

    if (submitted) {
      setErrors(validate(updatedData));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitted(true);
    setSubmitError(null);

    const newErrors = validate(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const payload = {
      supplier: formData.supplier.trim(),
      name: formData.name.trim(),
      category: formData.category,
      stock: Number(formData.stock),
      lastRestock: formData.lastRestock,
    };

    if (mode === "create") {
      payload.previousPrice = Number(formData.previousPrice);
      payload.currentPrice = Number(formData.currentPrice);
    }

    setSaving(true);
    try {
      await onSubmitProduct(payload);

      if (mode === "create") {
        setFormData(createEmptyForm());
        setErrors({});
        setSubmitted(false);
      }
    } catch (cause) {
      setSubmitError(cause.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.card}>
      <div className={styles.heading}>
        <span className={styles.kicker}>
          {mode === "edit" ? "Edicion" : "Carga manual"}
        </span>
        <h2 className={styles.title}>
          {mode === "edit" ? "Actualizar producto" : "Agregar producto"}
        </h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label className={styles.field}>
            <span>Proveedor</span>
            <input
              className={`${styles.input} ${errors.supplier ? styles.inputError : ""}`}
              type="text"
              name="supplier"
              placeholder="Ej. Distribuidora San Martin"
              value={formData.supplier}
              onChange={handleChange}
            />
            {errors.supplier ? (
              <p className={styles.errorText}>{errors.supplier}</p>
            ) : null}
          </label>

          <label className={styles.field}>
            <span>Producto</span>
            <input
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              type="text"
              name="name"
              placeholder="Ej. Arroz largo fino 1 kg"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name ? <p className={styles.errorText}>{errors.name}</p> : null}
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>Categoria</span>
            <select
              className={styles.input}
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Almacen">Almacen</option>
              <option value="Despensa">Despensa</option>
              <option value="Kiosco">Kiosco</option>
              <option value="Lacteos">Lacteos</option>
              <option value="Bebidas">Bebidas</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Stock</span>
            <input
              className={`${styles.input} ${errors.stock ? styles.inputError : ""}`}
              type="number"
              name="stock"
              placeholder="0"
              min="0"
              value={formData.stock}
              onChange={handleChange}
            />
            {errors.stock ? <p className={styles.errorText}>{errors.stock}</p> : null}
          </label>
        </div>

        {mode === "create" ? (
          <div className={styles.row}>
            <label className={styles.field}>
              <span>Precio anterior</span>
              <input
                className={`${styles.input} ${errors.previousPrice ? styles.inputError : ""}`}
                type="number"
                name="previousPrice"
                placeholder="0"
                min="0"
                step="0.01"
                value={formData.previousPrice}
                onChange={handleChange}
              />
              {errors.previousPrice ? (
                <p className={styles.errorText}>{errors.previousPrice}</p>
              ) : null}
            </label>

            <label className={styles.field}>
              <span>Precio actual</span>
              <input
                className={`${styles.input} ${errors.currentPrice ? styles.inputError : ""}`}
                type="number"
                name="currentPrice"
                placeholder="0"
                min="0"
                step="0.01"
                value={formData.currentPrice}
                onChange={handleChange}
              />
              {errors.currentPrice ? (
                <p className={styles.errorText}>{errors.currentPrice}</p>
              ) : null}
            </label>
          </div>
        ) : (
          <p className={styles.helperText}>
            El precio actual y el historial se actualizan desde el modal de
            historial para no perder trazabilidad.
          </p>
        )}

        <label className={styles.field}>
          <span>Ultima reposicion</span>
          <input
            className={`${styles.input} ${errors.lastRestock ? styles.inputError : ""}`}
            type="date"
            name="lastRestock"
            value={formData.lastRestock}
            onChange={handleChange}
          />
          {errors.lastRestock ? (
            <p className={styles.errorText}>{errors.lastRestock}</p>
          ) : null}
        </label>

        {submitError ? <p className={styles.errorText}>{submitError}</p> : null}

        <div className={styles.actions}>
          <button className={styles.button} type="submit" disabled={saving}>
            {saving
              ? "Guardando..."
              : mode === "edit"
                ? "Guardar cambios"
                : "Guardar producto"}
          </button>

          {onCancel ? (
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={onCancel}
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
