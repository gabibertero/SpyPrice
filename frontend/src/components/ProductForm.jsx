import { useState } from "react";
import styles from "./ProductForm.module.css";

const emptyForm = {
  name: "",
  category: "Almacen",
  previousPrice: "",
  currentPrice: "",
  stock: "",
  lastRestock: "",
};

export default function ProductForm({ onAddProduct }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate(data) {
    const newErrors = {};

    const trimmedName = data.name.trim();
    if (!trimmedName) {
      newErrors.name = "El nombre es obligatorio";
    } else if (trimmedName.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (data.previousPrice === "") {
      newErrors.previousPrice = "Ingresa el precio anterior";
    } else {
      const value = Number(data.previousPrice);
      if (Number.isNaN(value) || value <= 0) {
        newErrors.previousPrice = "Debe ser un numero mayor a 0";
      }
    }

    if (data.currentPrice === "") {
      newErrors.currentPrice = "Ingrese el precio actual";
    } else {
      const value = Number(data.currentPrice);
      if (Number.isNaN(value) || value <= 0) {
        newErrors.currentPrice = "Debe ser un numero mayor a 0";
      }
    }

    if (data.stock === "") {
      newErrors.stock = "Ingrese el stock";
    } else {
      const value = Number(data.stock);
      if (Number.isNaN(value) || value < 0) {
        newErrors.stock = "No puede ser negativo";
      } else if (!Number.isInteger(value)) {
        newErrors.stock = "Debe ser un numero entero";
      }
    }

    if (data.lastRestock === "") {
      newErrors.lastRestock = "Ingrese la fecha de reposicion";
    } else {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const restockDate = new Date(data.lastRestock);
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

  function handleSubmit(event) {
    event.preventDefault();

    setSubmitted(true);

    const newErrors = validate(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onAddProduct({
      name: formData.name.trim(),
      category: formData.category,
      previousPrice: Number(formData.previousPrice),
      currentPrice: Number(formData.currentPrice),
      stock: Number(formData.stock),
      lastRestock: formData.lastRestock,
    });

    setFormData(emptyForm);
    setErrors({});
    setSubmitted(false);
  }

  return (
    <section className={styles.card}>
      <div className={styles.heading}>
        <span className={styles.kicker}>Carga manual</span>
        <h2 className={styles.title}>Agregar producto</h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
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
          {errors.name && <p className={styles.errorText}>{errors.name}</p>}
        </label>

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
            {errors.previousPrice && (
              <p className={styles.errorText}>{errors.previousPrice}</p>
            )}
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
            {errors.currentPrice && (
              <p className={styles.errorText}>{errors.currentPrice}</p>
            )}
          </label>
        </div>

        <div className={styles.row}>
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
            {errors.stock && <p className={styles.errorText}>{errors.stock}</p>}
          </label>

          <label className={styles.field}>
            <span>Ultima reposicion</span>
            <input
              className={`${styles.input} ${errors.lastRestock ? styles.inputError : ""}`}
              type="date"
              name="lastRestock"
              value={formData.lastRestock}
              onChange={handleChange}
            />
            {errors.lastRestock && (
              <p className={styles.errorText}>{errors.lastRestock}</p>
            )}
          </label>
        </div>

        <button className={styles.button} type="submit">
          Guardar producto
        </button>
      </form>
    </section>
  );
}
