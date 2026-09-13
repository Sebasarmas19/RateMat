# INSTRUCCIÓN DE EJECUCIÓN: PULIDO UI, PROFUNDIDAD CROMÁTICA, HOVERS Y PERFECCIÓN MÓVIL

**Para:** Agente Ejecutor Frontend (`RateMat_code`)  
**De:** Sesión del Arquitecto / Diseñador Líder  
**Habilidades Requeridas:** Utiliza intensivamente las skills activas en tu entorno (`impeccable`, `ui-ux-pro-max` y `reicon`).  
**Objetivo:** Elevar la calidad estética y táctil de RateMat de "funcional" a "SaaS de nivel mundial (Linear/Airbnb/Vercel)", solucionando el exceso de blanco plano, inyectando micro-interacciones hover ricas y garantizando una experiencia móvil (375px a 430px) impecable y ergonómica.

---

## 1. El Problema del "Blanco muy Blanco": Arquitectura de Superficies y Calidez (Dimensional Layering)

### Contexto del Problema:
Actualmente el lienzo usa `bg-slate-50/60` (~98% de luminancia) y las tarjetas usan `bg-white` (`#ffffff`). El contraste entre fondo y tarjetas es menor a 2%, generando una "sábana blanca" estéril que cansa la vista y aplana la jerarquía.

### Directivas de Implementación:
1. **Nivel 0 — Canvas / Fondo General del Shell (`LayoutComponent`):**
   * Sustituir el fondo en `frontend/src/app/core/layout/layout.component.ts` por un neutro sobrio y calibrado:  
     `bg-[#f1f4f9]` (o `bg-slate-100/80`).
   * *Resultado esperado:* Las tarjetas blancas resaltarán con presencia física y relieve natural.
2. **Nivel 1 — Tarjetas y Superficies Principales (`search`, `home`, `professor-profile`, `profile`):**
   * Mantener `bg-white`, pero reforzar los bordes con `border border-slate-200/90` y sombras multicapa suaves:  
     `shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)]`.
3. **Nivel 2 — Insets y Metadatos dentro de Tarjetas:**
   * Usar `bg-slate-50/80` o `bg-slate-100/60` para barras de autor, footers de votación y badges secundarios, creando jerarquía visual interna.

---

## 2. Dinamismo y Micro-interacciones Táctiles ("Más Hover")

El usuario siente la interfaz estática. Aplica las siguientes micro-interacciones:

### A. Catálogo de Carreras y Materias (`search.component.html`):
* **Elevación suave al hover:**  
  En las tarjetas de carrera y materias del pensum:  
  `hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60 hover:border-indigo-300 transition-all duration-200 ease-out`.
* **Animación coordinada de iconos y texto (Group Hover):**
  * El contenedor del icono de la carrera:  
    `group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-105 transition-all duration-200`.
  * El texto *"Ver Pensum →"* o flecha de acción:  
    `group-hover:translate-x-1.5 transition-transform duration-200`.

### B. Selector de 5 Estrellas Interactivo en el Modal de Calificación (`professor-profile`):
* En `professor-profile.component.ts`, agregar la propiedad `hoverRating = 0` y los métodos:
  * `setHoverRating(rating: number) { this.hoverRating = rating; }`
  * `clearHoverRating() { this.hoverRating = 0; }`
* En `professor-profile.component.html`:
  * Escuchar `(mouseenter)="setHoverRating(star)"` y `(mouseleave)="clearHoverRating()"`.
  * Las estrellas deben iluminarse de dorado si `star <= (hoverRating || reviewForm.get('rating')?.value)`.  
  * *Efecto:* Al pasar el cursor por la 4ta estrella, **las estrellas 1, 2, 3 y 4 se encienden al mismo tiempo**, dando feedback dinámico profesional.

### C. Muro de Reseñas y Votación Útil (`home.component.html`):
* **Tarjetas de reseña:**  
  `hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200`.
* **Botones 👍 Útil / 👎:**
  * Añadir feedback táctil y visual:  
    `hover:bg-indigo-50/80 hover:text-indigo-700 hover:border-indigo-300 active:scale-90 active:bg-indigo-100 transition-all`.

---

## 3. Adaptabilidad Móvil de Primer Nivel (Mobile-First UX)

Simula y optimiza exhaustivamente para pantallas de 375px a 430px (iPhone / Android):

### A. Barra de Navegación Inferior Móvil (`layout.component.ts`):
* **Área táctil ergonómica (Apple HIG / Android Material):**
  * Cada enlace debe tener mínimo 48px de alto:  
    `min-h-[50px] py-1.5 px-3 flex flex-col items-center justify-center rounded-2xl active:scale-95 transition-all`.
* **Indicador de Pestaña Activa:**
  * Cuando una pestaña esté activa (`routerLinkActive`), darle un fondo de píldora sutil `bg-indigo-50 text-indigo-700 font-bold` y una pequeña marca superior de 2px (`border-t-2 border-indigo-600`), de forma que el estudiante sepa exactamente en qué módulo está.

### B. Barra de Filtros del Feed (`home.component.html`):
* **Problema:** Los 4 botones de filtro se rompen en 2 líneas en pantallas angostas.
* **Solución:**
  * Convertir la barra de filtros en un carrusel deslizable horizontal suave:  
    `flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 flex-nowrap -mx-4 px-4 sm:mx-0 sm:px-0`.
  * Asegurar la clase `.no-scrollbar` en `frontend/src/styles.css`:
    ```css
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    ```

### C. Modales Convertidos en Bottom Sheets Ergonómicos en Móvil:
Tanto el modal de profesores por cátedra (`search.component.html`) como el modal de calificación y el de subida de PDF (`professor-profile.component.html`):
* En móvil (`<sm`), no deben ser cajas flotantes centradas que se cortan con el teclado virtual.
* Deben ser **Bottom Sheets** anclados al fondo de la pantalla:
  * Contenedor:  
    `w-full sm:max-w-xl max-sm:fixed max-sm:bottom-0 max-sm:inset-x-0 max-sm:rounded-b-none max-sm:rounded-t-3xl max-sm:max-h-[88vh] flex flex-col shadow-2xl overflow-hidden`.
  * Cabecera fija con botón de cierre grande (área táctil min 40×40px).
  * Cuerpo con scroll suave: `overflow-y-auto p-5 sm:p-6 flex-1`.
  * Botones de acción pegados al fondo accesibles para el pulgar.

### D. Paddings Responsive en Tarjetas:
* Cambiar en todas las tarjetas de reseñas y pensum los paddings fijos de `p-6` a `p-4 sm:p-6`. Esto rescata más de 30px de espacio útil en pantallas de 375px.

### E. Pestañas de Cátedras en el Perfil del Profesor:
* Las pestañas por materia deben ser deslizables horizontalmente:  
  `flex items-center space-x-2 overflow-x-auto no-scrollbar whitespace-nowrap pb-1`.

---

## 4. Verificación y Entrega

1. Realiza las modificaciones en los componentes correspondientes.
2. Ejecuta `npm run build` dentro de `frontend/` y verifica que finalice con código de salida **0** (sin errores de compilación ni tipos).
3. Asegúrate de que los cambios se reflejen limpiamente en el dev server de Vite/Angular en `http://localhost:4200`.
4. Al finalizar, redacta un informe de confirmación en `REPORTE_EJECUTOR.md` resumiendo las mejoras aplicadas y avisa en la terminal para continuar con la supervisión.
