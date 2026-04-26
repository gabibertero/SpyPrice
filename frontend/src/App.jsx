import { useMemo, useState } from "react";
import styles from "./App.module.css";
import AttentionPanel from "./components/AttentionPanel";
import FiltersBar from "./components/FiltersBar";
import Header from "./components/Header";
import ProductForm from "./components/ProductForm";
import ProductsTable from "./components/ProductsTable";
import SummaryCards from "./components/SummaryCards";

const initialProducts = [
  {
    id: 1,
    name: "Yerba mate suave 1 kg",
    category: "Almacen",
    previousPrice: 4200,
    currentPrice: 4650,
    stock: 18,
    lastRestock: "2026-04-23",
  },
  {
    id: 2,
    name: "Aceite girasol 900 ml",
    category: "Despensa",
    previousPrice: 3100,
    currentPrice: 3100,
    stock: 9,
    lastRestock: "2026-04-20",
  },
  {
    id: 3,
    name: "Galletitas surtidas",
    category: "Kiosco",
    previousPrice: 1600,
    currentPrice: 1760,
    stock: 5,
    lastRestock: "2026-04-18",
  },
  {
    id: 4,
    name: "Leche entera 1 l",
    category: "Lacteos",
    previousPrice: 1450,
    currentPrice: 1540,
    stock: 22,
    lastRestock: "2026-04-25",
  },
  {
    id: 5,
    name: "Azucar 1 kg",
    category: "Almacen",
    previousPrice: 1200,
    currentPrice: 1390,
    stock: 4,
    lastRestock: "2026-04-17",
  },
];

function getVariation(previousPrice, currentPrice) {
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}

function getStatus(product) {
  const variation = getVariation(product.previousPrice, product.currentPrice);

  if (product.stock <= 5 || variation > 10) {
    return {
      tone: "critical",
      label: "Critico",
      variation,
    };
  }

  if (variation > 0) {
    return {
      tone: "warning",
      label: "Atencion",
      variation,
    };
  }

  return {
    tone: "stable",
    label: "Estable",
    variation,
  };
}

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [status, setStatus] = useState("Todos");
  const [showProductForm, setShowProductForm] = useState(false);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map((product) => product.category));
    return ["Todas", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesCategory =
        category === "Todas" || product.category === category;
      const productStatus = getStatus(product).label;
      const matchesStatus = status === "Todos" || productStatus === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [category, products, search, status]);

  const summary = useMemo(() => {
    const increasedProducts = products.filter(
      (product) => getVariation(product.previousPrice, product.currentPrice) > 0
    ).length;
    const lowStockProducts = products.filter((product) => product.stock <= 8).length;
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
        label: "Productos con aumento",
        value: increasedProducts,
        detail: "Cambios detectados frente al ultimo precio",
      },
      {
        label: "Stock bajo",
        value: lowStockProducts,
        detail: "Productos que conviene reponer pronto",
      },
      {
        label: "Productos criticos",
        value: criticalProducts,
        detail: "Requieren atencion prioritaria hoy",
      },
    ];
  }, [products]);

  const attentionItems = useMemo(() => {
    const byVariation = [...products]
      .sort(
        (first, second) =>
          getVariation(second.previousPrice, second.currentPrice) -
          getVariation(first.previousPrice, first.currentPrice)
      )
      .slice(0, 3);

    const lowStock = products
      .filter((product) => product.stock <= 8)
      .sort((first, second) => first.stock - second.stock)
      .slice(0, 3);

    const reviewToday = [...products]
      .sort(
        (first, second) =>
          new Date(first.lastRestock).getTime() - new Date(second.lastRestock).getTime()
      )
      .slice(0, 3);

    return {
      byVariation,
      lowStock,
      reviewToday,
    };
  }, [products]);

  function handleAddProduct(product) {
    setProducts((currentProducts) => [
      {
        id: crypto.randomUUID(),
        ...product,
      },
      ...currentProducts,
    ]);
    setShowProductForm(false);
  }

  return (
    <div className={styles.shell}>
      <main className={styles.app}>
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

        <SummaryCards items={summary} />

        <FiltersBar
          categories={categories}
          search={search}
          category={category}
          status={status}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onStatusChange={setStatus}
          onToggleForm={() => setShowProductForm((currentValue) => !currentValue)}
          showProductForm={showProductForm}
        />

        {showProductForm ? <ProductForm onAddProduct={handleAddProduct} /> : null}

        <ProductsTable products={filteredProducts} getStatus={getStatus} />

        <AttentionPanel items={attentionItems} getStatus={getStatus} />
      </main>
    </div>
  );
}
