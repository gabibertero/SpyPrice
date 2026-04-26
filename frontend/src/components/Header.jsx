import styles from "./Header.module.css";

const navigationItems = ["Home", "Productos", "Analisis", "Sobre SpyPrice"];

export default function Header() {
  return (
    <header className={styles.topbar}>
      <div className={styles.brandBlock}>
        <div className={styles.storeMark}>AB</div>
        <div>
          <p className={styles.storeName}>Almacen Barrio Norte</p>
          <p className={styles.poweredBy}>
            Powered by <span>SpyPrice</span>
          </p>
        </div>
      </div>

      <nav className={styles.topnav} aria-label="Secciones principales">
        {navigationItems.map((item) => (
          <a
            className={item === "Home" ? `${styles.navLink} ${styles.active}` : styles.navLink}
            href="/"
            key={item}
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
