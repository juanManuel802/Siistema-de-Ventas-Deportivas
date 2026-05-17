# Implementación del Laboratorio 2: Colas de Markov y PageRank

El objetivo de este plan es integrar los modelos matemáticos y estocásticos (Teoría de Colas y PageRank) en la interfaz de React para cumplir con todos los requerimientos del laboratorio.

## ⚠️ User Review Required

El laboratorio requiere que los **usuarios perfilados sean los integrantes de tu grupo**. Necesito que me proporciones en el chat los **nombres (o IDs)** de los integrantes de tu grupo para poder añadirlos al sistema y crearles sus perfiles de gustos.

## Arquitectura de la Solución

### 1. Colas de Markov (Teoría de Colas - Modelo M/M/1)
¡Tienes toda la razón! En un laboratorio de estocásticos, "Colas" se refiere a la **Teoría de Colas**. 
Para implementarlo visualmente y que el profesor lo evalúe, propongo simular que nuestro "Motor de Búsqueda" es un servidor que procesa consultas.
- **Implementación:** Crearemos un componente visual (un panel de control) que muestre el estado de una cola M/M/1 en tiempo real. 
- **Estructura de Datos:** Usaremos una estructura `Queue` (FIFO) real en el código. Cada vez que escribes en la barra de búsqueda, la consulta "llega" a la cola (Tasa de llegada $\lambda$).
- **Servidor:** Un proceso simulará el servidor procesando las búsquedas con un tiempo exponencial (Tasa de servicio $\mu$). Si la cola está llena, el usuario verá un pequeño retraso en obtener los resultados. Mostraremos métricas como $L_q$ (longitud de cola) y $W_q$ (tiempo de espera).

### 2. Motor de Búsqueda (PageRank / SOR-JOR)
- **Implementación:** Crearemos un módulo `pagerank.ts`. 
- **Grafo de Productos:** Construiremos un grafo donde los nodos son los productos. Habrá "enlaces" (aristas) entre productos que comparten la misma categoría o palabras clave similares.
- **Algoritmo:** Usaremos el método iterativo **SOR-JOR** (Jacobi Over-Relaxation) para resolver el sistema de ecuaciones y calcular la distribución estacionaria (el PageRank de cada producto).
- **Resultados:** Al buscar, el sistema filtrará los productos y los ordenará multiplicando su puntaje de PageRank por el "peso" del perfil del usuario (híbrido).

### 3. Sistema de Publicidad Diferenciada
- **Implementación:** Modificaremos la página principal (`Home.tsx`).
- **Sección de Anuncios:** Añadiremos un carrusel o sección superior llamada "Recomendados para ti". Esta sección tomará el archivo `.csv` del usuario logueado y mostrará imágenes/banners de los 3 productos con mayor prioridad según *sus gustos*, completamente separado de los resultados de búsqueda generales.

## Archivos a Modificar

#### [NEW] `src/data/pagerank.ts`
Contendrá la lógica matemática para generar la matriz de adyacencia y calcular el PageRank iterativamente usando SOR-JOR.

#### [NEW] `src/app/components/queue-simulator.tsx`
Un componente visual que mostrará la animación de la cola de procesamiento, las tasas $\lambda$ y $\mu$, y las métricas de la Teoría de Colas.

#### [MODIFY] `src/app/components/search-bar.tsx`
En lugar de buscar instantáneamente, enviará la consulta a la estructura de la Cola para que sea procesada por el servidor simulado.

#### [MODIFY] `src/app/components/home.tsx`
Integrará el simulador de colas, usará el algoritmo de PageRank para los resultados, y añadirá la sección de "Publicidad" basada en el perfil del usuario.

#### [MODIFY] `src/data/users.ts`
**[PENDIENTE]** Actualizar con los integrantes reales de tu grupo.

## Verification Plan

1. Iniciar sesión con diferentes usuarios reales del grupo y verificar que la sección de **Publicidad** cambie mostrando imágenes distintas según sus gustos.
2. Escribir rápidamente en la barra de búsqueda para "saturar" el servidor y observar cómo las métricas de la **Cola de Markov** ($\lambda, L_q$) aumentan en el panel visual.
3. Revisar el código fuente de `pagerank.ts` para asegurar que el cálculo matemático iterativo (SOR-JOR) sea legible y correcto para la revisión del profesor.
