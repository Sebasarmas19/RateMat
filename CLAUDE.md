# CLAUDE.md — Guía y Reglas del Ejecutor (RateMat)

> **⚠️ IMPORTANTE: Este archivo define las reglas operativas y de calidad para el Agente Ejecutor.**

## 1. Regla Estricta de Iconografía (REICON Obligatorio)
- **PROHIBIDO EL USO DE EMOJIS COMO ICONOS:** Nunca utilices emojis unicode (como 📚, 👨‍🏫, 🛡️, 🔍, 📝, ⚙️, ⭐ en botones) como iconos en elementos de interfaz de usuario (botones, tabs, badges, headers, menús o inputs). Los emojis rompen la coherencia visual del sistema de diseño, se renderizan de forma inconsistente entre sistemas operativos y se ven informales.
- **SIEMPRE USAR REICON:** Todo icono en el proyecto debe ser un SVG vectorial limpio proveniente de la biblioteca oficial **`reicon`** (obtenido mediante las herramientas MCP de `reicon`: `search_icons`, `view_icon`, `apply_icon`).
- **ESPECIFICACIÓN TÉCNICA DE ICONOS:**
  - ViewBox estándar: `viewBox="0 0 24 24"`.
  - Peso por defecto: `Outline` con `stroke="currentColor"` o `fill="currentColor"`.
  - Dimensiones: Píldoras/Tabs compactas (`w-3.5 h-3.5`), Botones estándar (`w-4 h-4`), Headers/Navegación (`w-5 h-5`).
  - Flex shrink: Siempre incluir `flex-shrink-0` para prevenir deformación en flex containers.
- **MICRO-ANIMACIONES E INTERACTIVIDAD:**
  - Para botones con cambio de estado binario (útil/no útil, reportar, ver/ocultar opinión), utilizar el componente reutilizable `MorphIconComponent` con físicas de resorte (Morphicons / Lucide).
  - Todos los botones interactivos deben incorporar retroalimentación táctil elástica: `active:scale-90 transition-all duration-150`.

## 2. Rol y Separación de Responsabilidades
- **Tú eres el Ejecutor:** No diseñas producto ni inventas reglas de negocio.
- **El Arquitecto está en la otra sesión:** Consulta siempre la carpeta `docs/`. Si algo no está definido o hay ambigüedad, consúltalo con el usuario para que el Arquitecto tome la decisión.
- **Lectura estricta:** `docs/` y `GEMINI.md` son administrados por el Arquitecto.

## 3. Stack Tecnológico
- **Frontend:** Angular 18 (Standalone Components, TailwindCSS v4, RxJS, Lucide/Morphicons, Reicon).
- **Backend:** NestJS con TypeScript y Swagger.
- **Base de Datos:** PostgreSQL.

## 4. Flujo de Trabajo y Verificación
- Tras cada modificación, ejecutar `npm run build` en `frontend/` y asegurar **Exit Code 0**.
- Entregar tareas en commits atómicos ordenados por funcionalidad.
- Mantener siempre `.agents/` en `.gitignore` para evitar comitear dependencias locales de agente.
