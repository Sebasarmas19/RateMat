# D-007 — Módulos y Flujos Principales

**Estado:** Tomada
**Decide:** Arquitecto y Usuario

## Flujo Principal (Actualizado)
El sistema no gira únicamente en torno al profesor, sino en la **relación Materia -> Profesor**. El caso de uso más importante es: "Voy a cursar Materia X, ¿quién la da y cuál es el mejor?".

1. **Landing Page (Página Pública de Presentación - `/`):** 
   - Pantalla pública de bienvenida que explica qué es RateMat, sus beneficios (reseñas anónimas, hub académico) y botón de acceso con correo UCAB.
2. **Módulo Home / Explorador Principal (`/home`):**
   - **La Home ES el centro de búsqueda y descubrimiento:** Combina la barra de búsqueda universal (por materia o profesor) con el catálogo de carreras y materias.
   - Permite explorar por Carreras (con diseño sobrio, limpio y minimalista) y entrar al pensum para ver qué profesores dictan cada materia.
   - Feed de reseñas recientes ubicado como sección complementaria o pestaña, sin quitarle el protagonismo al buscador.
3. **Módulo del Perfil de Profesor (`/professor/:id`):**
   - Promedio global ponderado y métricas de claridad/dificultad.
   - **Pestañas por materia cursada:** Filtro interactivo para ver reseñas y estadísticas por cátedra específica.
   - Hub de PDFs asociados al profesor con botón para subir nuevo material (D-005).
4. **Módulo de Calificación (Regla de Oro):**
   - **Un profesor NUNCA se califica solo por su cuenta:** En el modal de reseña es **OBLIGATORIO seleccionar la materia** que el alumno cursó con ese profesor. No existen calificaciones globales en el aire.
   - Estrellas (1-5) + Selector de Materia + Tags + Texto Libre (obligatorio en 1★ y 5★) + Opción de Anonimato.
5. **Módulo de Perfil del Estudiante (`/profile`):** Estadísticas de gamificación y reputación.

## Reglas de Interfaz (UX/UI Responsive)
- **Diseño Mobile-First Estricto:** La plataforma será consumida mayoritariamente en teléfonos móviles (PWA). El diseño base debe ser para móviles (ej. Bottom Navigation Bar en lugar de menús de hamburguesa complicados).
- **Adaptabilidad a Escritorio (Desktop):** La versión de escritorio/laptop no puede ser solo la versión móvil "estirada". Se deben usar los Breakpoints de Tailwind (`md:`, `lg:`) para cambiar la estructura (ej. Sidebar lateral en escritorio, aprovechar el espacio extra para mostrar el Feed y el Perfil en columnas adyacentes). La experiencia debe sentirse nativa en ambas resoluciones.
