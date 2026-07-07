import { useEffect, useMemo, useState } from "react";
import styles from "./App.module.css";
import AttentionPanel from "./components/AttentionPanel";
import FiltersBar from "./components/FiltersBar";
import Header from "./components/Header";
import HistoryModal from "./components/HistoryModal";
import ProductForm from "./components/ProductForm";
import ProductsTable from "./components/ProductsTable";
import SummaryCards from "./components/SummaryCards";
import * as api from "./services/api";
import {
  getStatus,
  getVariation,
  isCriticalStock,
  isLowStock,
} from "./utils/pricing";

function getRestockTime(value) {
  return new Date(`${value}T12:00:00`).getTime();
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [status, setStatus] = useState("Todos");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [historyProduct, setHistoryProduct] = useState(null);
  const [sendingReport, setSendingReport] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  async function loadProducts() {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (cause) {
      setLoadError(cause.message);
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map((product) => product.category));
    return ["Todas", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.trim().toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchValue) ||
        product.supplier.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue);
      const matchesCategory =
        category === "Todas" || product.category === category;
      const productStatus = getStatus(product).label;
      const matchesStatus = status === "Todos" || productStatus === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [category, products, search, status]);

  const summary = useMemo(() => {
    const supplierCount = new Set(products.map((product) => product.supplier)).size;
    const increasedProducts = products.filter(
      (product) => getVariation(product.previousPrice, product.currentPrice) > 0
    ).length;
    const lowStockProducts = products.filter((product) => isLowStock(product.stock)).length;
    const criticalProducts = products.filter(
      (product) => getStatus(product).label === "Critico"
    ).length;

    return [
      {
        label: "Productos totales",
        value: products.length,
        detail: "Catalogo cargado en el sistema",
      },
      {
        label: "Proveedores activos",
        value: supplierCount,
        detail: "Canales de compra monitoreados en la app",
      },
      {
        label: "Productos con aumento",
        value: increasedProducts,
        detail: `${criticalProducts} con alerta critica por precio`,
      },
      {
        label: "Stock bajo",
        value: lowStockProducts,
        detail: "Productos que conviene reponer pronto",
      },
    ];
  }, [products]);

  const attentionItems = useMemo(() => {
    const byVariation = products
      .filter(
        (product) => getVariation(product.previousPrice, product.currentPrice) > 0
      )
      .slice()
      .sort(
        (first, second) =>
          getVariation(second.previousPrice, second.currentPrice) -
          getVariation(first.previousPrice, first.currentPrice)
      )
      .slice(0, 3);

    const lowStock = products
      .filter((product) => isLowStock(product.stock))
      .sort((first, second) => first.stock - second.stock)
      .slice(0, 3);

    const reviewToday = [...products]
      .sort(
        (first, second) =>
          getRestockTime(first.lastRestock) - getRestockTime(second.lastRestock)
      )
      .slice(0, 3);

    return {
      byVariation,
      lowStock,
      reviewToday,
    };
  }, [products]);

  function openCreateForm() {
    setEditingProduct(null);
    setShowProductForm(true);
  }

  function closeProductForm() {
    setEditingProduct(null);
    setShowProductForm(false);
  }

  function handleToggleForm() {
    if (showProductForm) {
      closeProductForm();
      return;
    }

    openCreateForm();
  }

  function handleStartEdit(product) {
    setEditingProduct(product);
    setShowProductForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleCreateProduct(product) {
    const created = await api.createProduct(product);
    setProducts((currentProducts) => [created, ...currentProducts]);
    setShowProductForm(false);
    setToast({ tone: "success", message: `"${created.name}" se agrego al catalogo.` });
  }

  async function handleEditProduct(product) {
    if (!editingProduct) {
      return;
    }

    const updated = await api.updateProduct(editingProduct.id, product);
    setProducts((currentProducts) =>
      currentProducts.map((item) => (item.id === updated.id ? updated : item))
    );
    closeProductForm();
    setToast({ tone: "success", message: `"${updated.name}" se actualizo.` });
  }

  async function handleUpdatePrice(productId, currentPrice) {
    const updated = await api.updatePrice(productId, currentPrice);
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === updated.id ? updated : product
      )
    );
    setHistoryProduct(updated);
    setToast({ tone: "success", message: `Precio de "${updated.name}" actualizado.` });
  }

  async function handleDeleteProduct(product) {
    const confirmed = window.confirm(
      `Eliminar "${product.name}" y todo su historial de precios?`
    );
    if (!confirmed) {
      return;
    }

    try {
      await api.deleteProduct(product.id);
      setProducts((currentProducts) =>
        currentProducts.filter((item) => item.id !== product.id)
      );
      setToast({ tone: "success", message: `"${product.name}" se elimino.` });
    } catch (cause) {
      setToast({ tone: "error", message: cause.message });
    }
  }

  async function handleSendReport() {
    setSendingReport(true);
    try {
      const report = await api.sendAlertsReport();
      setToast({
        tone: "success",
        message: `Reporte enviado a ${report.recipient}.`,
      });
    } catch (cause) {
      setToast({ tone: "error", message: cause.message });
    } finally {
      setSendingReport(false);
    }
  }

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#dashboard">
        Saltar al contenido
      </a>

      {toast ? (
        <div
          className={`${styles.toast} ${toast.tone === "error" ? styles.toastError : ""}`}
          role="status"
        >
          {toast.message}
        </div>
      ) : null}

      <main className={styles.app} id="dashboard">
        <Header />

        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Monitoreo diario del almacen</span>
            <h1 className={styles.title}>
              <span className={styles.brandMark}>$</span>pyPrice
            </h1>
            <p className={styles.description}>
              Una vista simple para controlar precios, stock y productos que
              necesitan atencion sin perder tiempo entre planillas.
            </p>
          </div>

          <div className={styles.heroNote}>
            <span className={styles.heroBadge}>Home</span>
            <p className={styles.heroText}>
              Gestion central del negocio con una interfaz clara, cercana y lista
              para crecer.
            </p>
          </div>
        </section>

        {loading ? (
          <section className={styles.stateCard}>
            <p>Cargando productos...</p>
          </section>
        ) : loadError ? (
          <section className={styles.stateCard}>
            <p className={styles.stateError}>{loadError}</p>
            <button
              className={styles.retryButton}
              type="button"
              onClick={loadProducts}
            >
              Reintentar
            </button>
          </section>
        ) : (
          <>
            <SummaryCards items={summary} />

            <FiltersBar
              categories={categories}
              search={search}
              category={category}
              status={status}
              formMode={editingProduct ? "edit" : "create"}
              onSearchChange={setSearch}
              onCategoryChange={setCategory}
              onStatusChange={setStatus}
              onToggleForm={handleToggleForm}
              showProductForm={showProductForm}
            />

            {showProductForm ? (
              <section id="catalogo">
                <ProductForm
                  mode={editingProduct ? "edit" : "create"}
                  initialProduct={editingProduct}
                  onSubmitProduct={
                    editingProduct ? handleEditProduct : handleCreateProduct
                  }
                  onCancel={closeProductForm}
                />
              </section>
            ) : (
              <div id="catalogo" />
            )}

            <ProductsTable
              products={filteredProducts}
              getStatus={getStatus}
              isLowStock={isLowStock}
              isCriticalStock={isCriticalStock}
              onEdit={handleStartEdit}
              onOpenHistory={setHistoryProduct}
              onDelete={handleDeleteProduct}
            />

            <AttentionPanel
              items={attentionItems}
              getStatus={getStatus}
              onSendReport={handleSendReport}
              sendingReport={sendingReport}
            />

            <footer className={styles.footer} id="recursos">
              <div>
                <p className={styles.footerLabel}>Stack y trazabilidad</p>
                <p className={styles.footerText}>
                  React + Vite en frontend, FastAPI + SQLite en backend, historial
                  de precios persistente y reportes SMTP opcionales.
                </p>
              </div>

              <div className={styles.footerLinks}>
                <a href={`${api.API_URL}/docs`} rel="noreferrer" target="_blank">
                  Swagger
                </a>
                <a
                  href="https://github.com/gabibertero/SpyPrice"
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
              </div>
            </footer>
          </>
        )}
      </main>

      {historyProduct ? (
        <HistoryModal
          product={historyProduct}
          onClose={() => setHistoryProduct(null)}
          onUpdatePrice={handleUpdatePrice}
        />
      ) : null}
    </div>
  );
}
