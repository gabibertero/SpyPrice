# SpyPrice - Monitor de precios para proveedores

> Aplicacion web para registrar precios de proveedores, detectar variaciones y mostrar alertas visuales antes de que impacten en el margen del negocio.

![Status](https://img.shields.io/badge/status-en%20desarrollo-yellow)
![React](https://img.shields.io/badge/frontend-react-blue)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Sobre el proyecto

SpyPrice apunta a comercios y PyMEs que necesitan seguir la evolucion de precios de sus insumos sin depender de planillas desactualizadas o controles manuales. La idea es cargar precios, detectar cambios rapidamente y usar un semaforo visual para priorizar que productos requieren atencion.

## Vision de portfolio

Este proyecto no se va a construir como una practica mas. La meta es que SpyPrice sea una pieza de portfolio fuerte, profesional y creible, capaz de destacar frente a reclutadores, lideres tecnicos y empresas grandes.

Eso significa que cada decision del proyecto deberia apuntar a estos criterios:

- interfaz cuidada y visualmente profesional
- codigo ordenado, entendible y mantenible
- decisiones tecnicas que se puedan justificar en una entrevista
- experiencia de usuario clara, solida y consistente
- sensacion de producto real, no de ejercicio academico

## Semaforo visual

| Estado | Significado |
| --- | --- |
| Verde | El precio se mantuvo o bajo |
| Amarillo | El precio subio hasta un 10 % |
| Rojo | El precio subio mas de un 10 % |

## Tecnologias

- Frontend: React + Vite
- Backend: Python 3.11+ + FastAPI
- Base de datos: SQLite
- Alertas: SMTP

## Como vamos a trabajar

La idea de este proyecto no es solo terminar una app funcional, sino usarla como camino de aprendizaje real. Vos vas a implementar cada parte y yo te voy a acompanar para:

- desarmar cada etapa en pasos chicos y concretos
- explicarte por que conviene hacer cada cosa
- revisar decisiones, estructura y errores
- proponerte mejoras y siguientes pasos
- mantener el foco en calidad de portfolio, no solo en que funcione
- escribir codigo solo cuando vos me lo pidas

## Roadmap paso a paso

### Fase 0 - Base del proyecto

Objetivo: tener el repo ordenado, entender la estructura y dejar claro que hace cada carpeta.

Tareas:

- revisar la estructura general de `frontend` y `backend`
- entender para que sirve cada archivo principal
- definir una convencion simple de nombres
- dejar el README como guia del proyecto
- alinear desde el inicio el proyecto con un estandar profesional de portfolio

Criterio de cierre:

- sabes explicar la estructura del proyecto sin ayuda
- el repo tiene un objetivo claro y una organizacion minima consistente
- la vision del proyecto esta orientada a destacar profesionalmente

### Fase 1 - Interfaz inicial en React

Objetivo: construir una primera pantalla clara, usable y visualmente fuerte para portfolio.

Tareas:

- revisar como se divide la UI en componentes
- mejorar formulario, lista y layout general
- ordenar los estilos para que la interfaz se vea profesional
- hacer que el semaforo visual se entienda de inmediato
- evitar que la pantalla se sienta como una maqueta basica o escolar

Criterio de cierre:

- se puede cargar un producto desde la interfaz
- la lista se ve clara en desktop y mobile
- cada componente tiene una responsabilidad facil de entender
- la primera impresion visual transmite seriedad y criterio de diseno

### Fase 2 - Estado y logica del frontend

Objetivo: dominar como se manejan los datos dentro de React antes de conectarlo al backend.

Tareas:

- entender `useState` y flujo de datos entre componentes
- validar inputs del formulario
- calcular correctamente la variacion de precio
- mostrar estados utiles en pantalla: vacio, error, carga, exito

Criterio de cierre:

- entendes de donde sale cada dato y quien lo modifica
- la app responde bien a entradas validas e invalidas
- la logica del frontend se siente prolija y predecible

### Fase 3 - Modelo de datos

Objetivo: definir bien que informacion guarda SpyPrice y como se relaciona.

Tareas:

- decidir que datos tiene un producto
- decidir si el historial de precios va en la misma tabla o separado
- definir proveedor, producto, precio, fecha y alertas
- pensar casos reales: productos repetidos, cambios de nombre, fechas faltantes

Criterio de cierre:

- tenes claro que entidades existen y que guarda cada una
- el modelo de datos representa un caso real de negocio
- podes justificar el diseño con criterio tecnico

### Fase 4 - Backend con FastAPI

Objetivo: crear una API simple, clara y bien organizada.

Tareas:

- preparar la estructura inicial del backend
- entender rutas, controladores, esquemas y servicios
- crear endpoints para listar, crear, editar y eliminar productos
- probar la API con una herramienta como Swagger o Postman

Criterio de cierre:

- podes explicar que hace cada endpoint
- la API responde correctamente a operaciones basicas
- la estructura del backend se ve profesional y mantenible

### Fase 5 - Base de datos con SQLite

Objetivo: persistir la informacion para que no se pierda al cerrar la app.

Tareas:

- conectar FastAPI con SQLite
- crear tablas necesarias
- guardar productos e historial de precios
- consultar y actualizar datos desde la API

Criterio de cierre:

- los datos quedan guardados en la base
- la app puede reiniciarse sin perder informacion
- el modelo persistido refleja decisiones coherentes de negocio

### Fase 6 - Conexion frontend + backend

Objetivo: reemplazar los datos de prueba del frontend por datos reales de la API.

Tareas:

- consumir endpoints desde React
- cargar productos al iniciar la app
- enviar formularios al backend
- sincronizar altas, bajas y ediciones sin romper la UI

Criterio de cierre:

- el frontend deja de depender de datos hardcodeados
- las acciones del usuario impactan en la base real
- la integracion se siente fluida y consistente

### Fase 7 - Historial de precios

Objetivo: convertir SpyPrice en una herramienta de seguimiento y no solo de carga actual.

Tareas:

- guardar cada cambio de precio con fecha
- mostrar precio actual y precio anterior
- permitir ver evolucion de un producto
- preparar el terreno para reportes o graficos

Criterio de cierre:

- cada producto conserva su historial
- el semaforo se basa en informacion real y no en un dato aislado
- la app empieza a sentirse como un producto util de verdad

### Fase 8 - Alertas y reglas de negocio

Objetivo: detectar subas importantes y mostrar avisos utiles.

Tareas:

- definir cuando una suba pasa de normal a importante
- mostrar alertas visuales en el frontend
- pensar alertas por porcentaje, frecuencia o proveedor
- preparar el envio por email como mejora posterior

Criterio de cierre:

- el sistema detecta cambios relevantes automaticamente
- las alertas tienen sentido de negocio
- la funcionalidad agrega valor real y diferenciacion al proyecto

### Fase 9 - Calidad y experiencia de usuario

Objetivo: hacer que la app se sienta seria, estable y comoda de usar.

Tareas:

- mejorar mensajes de error y confirmacion
- revisar accesibilidad basica
- mejorar responsive design
- ordenar estilos, nombres y estructura de carpetas
- eliminar detalles que hagan ver el proyecto como incompleto

Criterio de cierre:

- la app se siente prolija y consistente
- alguien mas puede usarla sin que vos expliques todo
- la experiencia transmite madurez tecnica y atencion al detalle

### Fase 10 - Testing y validacion

Objetivo: aprender a comprobar que lo que construiste funciona de verdad.

Tareas:

- probar manualmente cada flujo importante
- definir casos borde
- agregar tests cuando tenga sentido
- verificar que los calculos del semaforo sean correctos

Criterio de cierre:

- sabes que partes del sistema estan verificadas
- los errores mas comunes se detectan rapido
- podes defender la confiabilidad del proyecto en una entrevista

### Fase 11 - Deploy y presentacion final

Objetivo: dejar el proyecto listo para mostrar en portfolio o usar como base real.

Tareas:

- preparar una version desplegable
- definir variables de entorno y configuracion
- documentar instalacion y uso
- mejorar README con capturas, flujo y decisiones tecnicas
- preparar como contar el proyecto en CV, portfolio y entrevistas

Criterio de cierre:

- el proyecto puede ejecutarse fuera de tu maquina
- tenes material para explicarlo en una entrevista o portfolio
- SpyPrice se presenta como un proyecto profesional y competitivo

## Estado actual

Avance al 2026-04-26:

- Fase 0 (estructura base): completada
- Fase 1 (interfaz inicial en React): completada — Header, SummaryCards, FiltersBar, ProductsTable, AttentionPanel y ProductForm con CSS Modules
- Fase 2 (estado y logica del frontend): en curso
  - listo: `useState` y `useMemo` en App, calculo de variacion y semaforo, filtros por busqueda/categoria/estado
  - listo: formulario de alta con validacion profesional (errores por campo, feedback en vivo despues del primer submit, borde rojo en inputs invalidos, reglas de negocio reales)
  - pendiente: estado vacio en ProductsTable cuando los filtros no devuelven resultados
  - pendiente: mensaje de exito al agregar un producto
  - pendiente (refactor): mover `getStatus` y `getVariation` a `src/utils/pricing.js`

Proximos pasos despues de cerrar Fase 2:

1. Definir el modelo de datos (Fase 3).
2. Construir el backend con FastAPI (Fase 4).
3. Persistir con SQLite (Fase 5).
4. Conectar frontend y backend (Fase 6).
5. Historial, alertas y calidad (Fases 7 a 11).

## Regla de trabajo

Para mantener el aprendizaje como prioridad:

- yo no voy a escribir codigo salvo que vos me lo pidas explicitamente
- si queres, puedo explicarte primero la teoria y despues ayudarte a implementarla
- tambien puedo revisar tu codigo, marcar mejoras y decirte el siguiente paso
- si una decision no suma nivel profesional al portfolio, te lo voy a decir con claridad

## Desarrollo del frontend

```bash
cd frontend
npm install
npm run dev
```

## Autor

**Gabriel Bertero** - Estudiante de Ingenieria en Sistemas, UTN Cordoba  
[GitHub](https://github.com/gabibertero)

## Licencia

Distribuido bajo licencia MIT. Ver [LICENSE](./LICENSE).
