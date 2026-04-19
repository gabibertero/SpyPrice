# $pyPrice — Monitor de precios para proveedores

> Aplicación web que ayuda a negocios chicos a detectar automáticamente subas de precios de sus proveedores y recibir alertas antes de que afecten su margen.

![Status](https://img.shields.io/badge/status-en%20desarrollo-yellow)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Sobre el proyecto

$pyPrice es una herramienta pensada para comercios y PyMEs que trabajan con múltiples proveedores y necesitan controlar la evolución de los precios de sus insumos. La app registra el historial de precios, detecta variaciones automáticamente y muestra un **semáforo visual** que permite al dueño del negocio identificar de un vistazo qué insumos están subiendo.

### ¿Qué problema resuelve?

Los negocios chicos suelen llevar el control de precios de proveedores en planillas de Excel desactualizadas o directamente en la cabeza del dueño. Cuando un proveedor sube los precios de a poco, el cambio pasa desapercibido hasta que el margen se evaporó. $pyPrice detecta esas subas apenas se cargan y las hace visibles.

### ¿Cómo funciona el semáforo?

| Color | Significado |
|-------|-------------|
| 🟢 Verde | El precio se mantiene o bajó |
| 🟡 Amarillo | El precio subió hasta un 10 % |
| 🔴 Rojo | El precio subió más de un 10 % |

---

## Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Backend**: Python 3.11+, FastAPI
- **Base de datos**: SQLite
- **Alertas**: envío automático por correo electrónico (SMTP)

---

## Estado actual

Este proyecto se está construyendo por etapas como parte de mi formación en Ingeniería en Sistemas (UTN Córdoba) y como Desarrollador Junior. El progreso actual:

- [x] Configuración del repositorio
- [x] Estructura de carpetas
- [x] Interfaz HTML
- [.] Estilos CSS y semáforo visual (En progreso - body y form listos)
- [ ] Lógica de frontend con JavaScript
- [ ] Backend con FastAPI
- [ ] Integración con base de datos SQLite
- [ ] Sistema de alertas por email

---

## Instalación

> Las instrucciones de instalación se completarán cuando el proyecto esté en estado funcional.

---

## Autor

**Gabriel Bertero** — Estudiante de Ingeniería en Sistemas, UTN Córdoba
[GitHub](https://github.com/gabibertero)

---

## Licencia

Distribuido bajo licencia MIT. Ver [`LICENSE`](./LICENSE) para más detalles.