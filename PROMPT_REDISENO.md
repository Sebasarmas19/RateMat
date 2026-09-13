# Sistema de Diseño y Rediseño de RateMat (SaaS Premium)

Eres el Diseñador UI/UX Senior y Frontend Engineer de RateMat. Tu misión es rediseñar por completo la interfaz de la aplicación en Angular + TailwindCSS, elevándola de un prototipo básico a una PWA de clase mundial (SaaS Premium), siguiendo estrictamente este sistema de especificación:

## Paso Obligatorio Previo
Antes de modificar cualquier componente, lee obligatoriamente la carpeta `docs/decisiones/` (especialmente `D-007-modulos_y_rutas.md`, `D-003-calificacion_y_moderacion.md`, `D-005-hub_academico_archivos.md` y `D-010-legales_y_filtros_contenido.md`). Cada módulo debe cumplir al pie de la letra con los flujos y requerimientos estipulados en esa documentación.

---

## Estética
**Modern Minimalist Academic SaaS** — [pulido, etéreo, tipográfico, táctil, espacioso, responsivo, sobrio, alta fidelidad].

## Referencias Visuales
- **Catálogo y Buscador:** Estilo Airbnb Melbourne (Sidebar de iconos ultra-limpio, filtros en píldoras interactivas con bordes finos, barra de búsqueda con tags y tarjetas horizontales elegantes con badges de recomendación).
- **Perfil del Profesor:** Layout híbrido con métricas destacadas estilo tarjeta "Aaron Zarraga" (Avatar centrado, puntaje 4.8 con estrellas, indicadores de Dificultad/Claridad, reseñas con badges de puntaje 5.0★, votos 👍/👎 y botón de acción "Calificar Profesor").
- **Dashboard Desktop:** Estilo Cascal a 3 columnas (Sidebar / Resumen con barras de distribución de 5★ a 1★ y "Lo que destacan los alumnos" / Muro de Reseñas / Hub de Archivos).

## Intención
La interfaz debe sentirse como un producto de Silicon Valley (estilo Linear, Airbnb o Vercel) adaptado al estudiante universitario de la UCAB. Debe eliminar cualquier apariencia de "plantilla genérica", convirtiéndose en una herramienta rápida, visualmente adictiva y perfectamente adaptativa tanto en la pantalla del celular como en una laptop.

---

## Sistema Visual

### Tipografía
- Tipografía moderna (Inter / Geist / SF Pro look).
- Jerarquía estricta:
  - Títulos contundentes: `text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900`
  - Subtítulos: `text-slate-500`
  - Micro-labels: `text-[11px] font-semibold uppercase tracking-wider text-slate-400`

### Colores (Regla 60-30-10)
- **60% Fondo:** `bg-slate-50/60` limpio, suave y etéreo.
- **30% Superficies:** Tarjetas `bg-white` con bordes ultrafinos (`border border-slate-100` o `border-slate-200/70`) y sombras difusas (`shadow-sm hover:shadow-md`).
- **10% Acento:** Botones y acciones en Índigo (`bg-indigo-600 hover:bg-indigo-700 text-white`) o Ámbar cálido para CTA de calificar (`bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold`).
- **Badges de Puntaje:** Píldoras con fondo esmeralda para notas altas (`bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded-lg`) y tonos cálidos para notas medias.
- **Cero negro puro:** Usar siempre `text-slate-900` y `text-slate-600`.

### Bordes y Formas
- `rounded-2xl` para tarjetas y modales.
- `rounded-xl` para botones e inputs.
- `rounded-full` para chips y filtros.

### Espaciado
- Whitespace generoso (`p-6` a `p-8` en desktop, `p-4` en móvil). Los elementos deben respirar.

### Iconografía
- Utiliza exclusivamente SVGs inline limpios mediante la herramienta/servidor MCP de Reicon con trazos consistentes (`stroke-width="1.75"` o `fill="currentColor"`).

---

## Restricciones

### SIEMPRE:
- **Mobile-First Nativo:** En pantallas móviles (<768px), barra de navegación inferior flotante con blur (`backdrop-blur-md pb-safe`), accesible con el pulgar.
- **Escritorio Adaptativo (≥768px):** La barra móvil muta en un Sidebar izquierdo elegante (estilo Airbnb/Cascal) con layout de 2 o 3 columnas. Nunca estirar tarjetas móviles horizontalmente.
- **Pantallas Fantasma:** Skeletons animados (`animate-pulse bg-slate-200 rounded`) durante la carga; nunca spinners genéricos.
- **Lógica de Reseñas (D-003):** En el formulario, el texto es OBLIGATORIO si la nota es 1 o 5 estrellas; opcional en 2, 3 y 4.
- **Filtro de Groserías (D-010):** Si el backend rechaza con 400 por lenguaje inapropiado, mostrar feedback visual en rojo pero NUNCA borrar el texto escrito del usuario.
- **Modal Legal (D-010):** Modal bloqueante con los 3 checkboxes obligatorios para onboarding.

### NUNCA:
- Fondos grises muertos o contrastes apagados.
- Botones sin estados de interacción (`hover`, `active:scale-95`).
- Tablas o listas planas sin jerarquía visual.

---

## Comportamiento
- **Hover:** `transition-all duration-200 ease-out`, elevación ligera con `hover:-translate-y-0.5` y `hover:border-slate-300`.
- **Clic / Táctil:** Efecto de presión inmediata `active:scale-[0.98]` en botones, chips y tarjetas interactivas.
- **Votación Optimista:** Actualización visual instantánea de votos 👍 y 👎 en reseñas (`netScore`) antes de que responda la red.

---

## Módulos a Rediseñar en `frontend/src/app/`

1. **Landing Page (`/` - D-007):**
   - Hero moderno con propuesta de valor, badges flotantes de métricas y botón de inicio de sesión con Google.
2. **Shell Principal (`Layout` - D-007):**
   - Sidebar en desktop (estilo Airbnb) + Bottom Bar en móvil con transiciones suaves.
3. **Home & Buscador (`/home` y `/search` - D-007):**
   - Barra con filtros interactivos tipo Airbnb (Facultad, Calificación, etc.) y feed de tarjetas pulidas.
4. **Perfil del Profesor (`/professor/:id` - D-007 & D-008):**
   - Cabecera estilo tarjeta "Aaron Zarraga": Avatar, nombre, materia, métrica 4.8 con estrellas, desglose de dificultad/claridad.
   - En Desktop: Grid de 3 columnas (Información y distribución de estrellas / Muro de reseñas con badges 5.0★ y votos 👍/👎 / Hub de Archivos PDF - D-005).
   - En Móvil: Scroll continuo vertical con botón inferior destacado "Calificar Profesor".
5. **Modal de Crear Reseña (D-003):**
   - Selector de 5 estrellas, tags rápidos, switch de anonimato (D-002) y validación estricta de notas extremas.

---

## Ejecución
Activa tus skills globales `ui-ux-pro-max`, `impeccable` y el MCP `reicon`. Aplica la disciplina de `i-have-adhd` (sin preámbulos, pasos concretos y código directo). Realiza los cambios directamente en los archivos correspondientes dentro de `frontend/src/app/` y compila con `npm run build` para validar que todo funcione sin errores.

## Informe Final Obligatorio para el Arquitecto
Al terminar de modificar y verificar los componentes, redacta un informe técnico completo en el archivo `INFORME_REDISENO.md` (en la raíz de `RateMat_code`).
Explica:
1. Qué cambios realizaste en cada componente (Landing, Layout, Home, Search, Professor Profile, Review Modal).
2. Cómo aplicaste las referencias visuales (Airbnb, Cascal, tarjeta Aaron Zarraga).
3. Cómo verificaste la compilación (`npm run build`).

Este informe será revisado y validado en la sesión del Arquitecto junto con el usuario antes de dar por cerrado el diseño.
