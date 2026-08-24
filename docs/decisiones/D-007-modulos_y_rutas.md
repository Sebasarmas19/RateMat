# D-007 — Módulos y Flujos Principales

**Estado:** Tomada
**Decide:** Arquitecto y Usuario

## Flujo Principal (Corrección Crítica)
El sistema no gira únicamente en torno al profesor, sino en la **relación Materia -> Profesor**. El caso de uso más importante es: "Voy a cursar Materia X, ¿quién la da y cuál es el mejor?".

1. **Landing Page (Página Pública de Presentación):** 
   - Una pantalla web de inicio (sin necesidad de estar logueado) que explica qué es RateMat, sus beneficios (Reviews anónimos, Hub Académico) y contiene el botón principal de "Iniciar Sesión / Registrarse con tu correo institucional".
2. **Módulo de Autenticación:** Login con Supabase (redirigido desde la Landing Page).
3. **Módulo Home (Buscador y Novedades):**
   - **Barra de Búsqueda Principal:** Por Materia (camino principal) o por Profesor.
   - **Reseñas Recientes/Tendencia:** Para que la pantalla de inicio no esté vacía y fomentar votos rápidos, pero **limitado estrictamente a reseñas**. No se construirán funciones de red social abierta (foros/tweets) en el MVP para mantener el foco en la utilidad principal.
4. **Módulo del Perfil de Profesor:**
   - Promedio global ponderado.
   - Pestañas por materia cursada.
   - Hub de PDFs asociados al profesor.
4. **Módulo de Reseñas:** Formulario anclado *obligatoriamente* a una materia. Estrellas + Tags + Texto Libre + Opción de Anonimato.
5. **Módulo de Perfil del Estudiante:** Estadísticas de gamificación (Puntos por aportar, historial).

## Reglas de Interfaz (UX/UI Responsive)
- **Diseño Mobile-First Estricto:** La plataforma será consumida mayoritariamente en teléfonos móviles (PWA). El diseño base debe ser para móviles (ej. Bottom Navigation Bar en lugar de menús de hamburguesa complicados).
- **Adaptabilidad a Escritorio (Desktop):** La versión de escritorio/laptop no puede ser solo la versión móvil "estirada". Se deben usar los Breakpoints de Tailwind (`md:`, `lg:`) para cambiar la estructura (ej. Sidebar lateral en escritorio, aprovechar el espacio extra para mostrar el Feed y el Perfil en columnas adyacentes). La experiencia debe sentirse nativa en ambas resoluciones.
