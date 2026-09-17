# D-007 — Módulos y Flujos Principales

**Estado:** Tomada
**Decide:** Arquitecto y Usuario

## Flujo Principal (Actualizado)
El sistema no gira únicamente en torno al profesor, sino en la **relación Materia -> Profesor**. El caso de uso más importante es: "Voy a cursar Materia X, ¿quién la da y cuál es el mejor?".

1. **Landing Page (Página Pública de Presentación - `/`):** 
   - Pantalla pública de bienvenida que explica qué es RateMat, sus beneficios (reseñas honestas y anónimas, catálogo de pensums) y botón de acceso con Google Workspace UCAB (`@est.ucab.edu.ve`).
2. **Módulo Buscador & Catálogo de Carreras (`/search` — Entrada Post-Login):**
   - **Es el centro neurálgico de búsqueda y descubrimiento:** Destino por defecto tras iniciar sesión.
   - Combina el buscador universal omni (por materia o profesor) con el catálogo sobrio y minimalista de Carreras y Facultades UCAB Guayana.
   - Permite explorar los pensums organizados por semestres y créditos, desplegando mediante un modal contextual a los profesores que dictan cada cátedra y sus promedios.
3. **Módulo Muro Comunitario de Reseñas (`/home`):**
   - Espacio dedicado exclusivamente al feed social/comunitario de opiniones estudiantiles recientes.
   - Sin barras de búsqueda redundantes para mantener la pureza visual del muro.
   - Incluye filtros por valoración (`Todas`, `4.5+ ★`, `Positivas`, `Críticas`) y botones de votación útil con Net Score comunitario (D-003).
4. **Módulo del Perfil de Profesor (`/professor/:id`):**
   - Promedio global ponderado y métricas de claridad/dificultad.
   - **Pestañas interactivas por cátedra:** Filtro para segmentar reseñas por materia dictada.
   - Muro de opiniones con votación útil, botón de reporte por difamación (D-010) y opción de sugerir nuevas cátedras (D-004).
5. **Módulo de Calificación (Regla de Oro):**
   - **Un profesor NUNCA se califica solo por su cuenta:** En el modal de reseña es **OBLIGATORIO seleccionar la materia** que el alumno cursó con ese profesor. No existen calificaciones globales en el aire.
   - Estrellas (1-5) con hover preview dinámico + Selector de Materia + Tags + Justificación obligatoria en 1★ y 5★ + Switch de Privacidad Híbrida (D-002).
6. **Módulo de Perfil del Estudiante (`/profile`):** 
   - Panel de estadísticas, gamificación, niveles de reputación estudiantil y explicación de la garantía de privacidad híbrida.

## Reglas de Interfaz (UX/UI Responsive)
- **Diseño Mobile-First Estricto:** La plataforma será consumida mayoritariamente en teléfonos móviles (PWA). El diseño base debe ser para móviles (ej. Bottom Navigation Bar en lugar de menús de hamburguesa complicados).
- **Adaptabilidad a Escritorio (Desktop):** La versión de escritorio/laptop no puede ser solo la versión móvil "estirada". Se deben usar los Breakpoints de Tailwind (`md:`, `lg:`) para cambiar la estructura (ej. Sidebar lateral en escritorio, aprovechar el espacio extra para mostrar el Feed y el Perfil en columnas adyacentes). La experiencia debe sentirse nativa en ambas resoluciones.
