# ESPECIFICACIÓN TÉCNICA: IMPLEMENTACIÓN DE BRECHAS FUNCIONALES Y PANEL DE MODERACIÓN (D-003, D-004, D-010 Y D-011)

**Para:** Agente Ejecutor Frontend (`RateMat_code`)  
**De:** Sesión del Arquitecto Líder  
**Habilidades Requeridas:** Utiliza intensivamente tus skills activas (`impeccable`, `ui-ux-pro-max`, `hallmark`, `reicon`).  
**Objetivo:** Completar al 100% las funcionalidades pactadas en la arquitectura documental que aún no contaban con componentes en la interfaz de usuario.

---

## 1. Brecha 1: Cold Start & Sugerencia de Profesores y Materias ([D-004](file:///C:/Users/sebastian/Desktop/Proyectos/Personales/RateMat/RateMat_code/docs/decisiones/D-004-cold_start_profesores.md) & [D-011](file:///C:/Users/sebastian/Desktop/Proyectos/Personales/RateMat/RateMat_code/docs/decisiones/D-011-rol_administrador_y_moderacion.md))

### A. Botón y Modal de "Sugerir Profesor" en `/search` (`search.component.html` & `.ts`):
* **Punto de Activación:**
  1. En el modal de profesores por materia (`selectedSubject`), cuando `subjectProfessors.length === 0`:
     * Reemplazar el texto pasivo por un botón prominente: `+ Sugerir Profesor para esta Cátedra`.
  2. En el catálogo cuando una búsqueda no encuentra al profesor: botón secundario `+ Proponer nuevo profesor`.
* **Modal de Sugerencia (Mobile Bottom Sheet en `<sm`, Diálogo Centrado en `≥sm`):**
  * Formulario reactivo:
    * **Nombre y Apellido:** `input text` con `Validators.required`.
    * **Escuela o Correo Institucional:** `input text` con placeholder `ej: ingenieria@ucab.edu.ve o Escuela de Informática` (`Validators.required`).
    * **Materia:** selector o campo de texto con la cátedra que dicta.
  * Botón de envío: `Enviar para Aprobación`.
  * Feedback: Al enviar, muestra un mensaje de éxito:  
    *"¡Gracias por tu aporte! Tu sugerencia ha sido enviada a la cola de moderación de los administradores estudiantiles."*

### B. Botón "Añadir Nueva Materia a este Profesor" en `/professor/:id` (`professor-profile.component.html` & `.ts`):
* Junto a las pestañas de cátedras o en la cabecera, añadir un botón sutil: `+ Sugerir Cátedra`.
* Abre un modal ligero para proponer una nueva materia dictada por ese profesor. Al enviar, muestra mensaje de confirmación.

---

## 2. Brecha 2: Colapso Visual de Reseñas por Votos Negativos ([D-003](file:///C:/Users/sebastian/Desktop/Proyectos/Personales/RateMat/RateMat_code/docs/decisiones/D-003-calificacion_y_moderacion.md) & [D-008](file:///C:/Users/sebastian/Desktop/Proyectos/Personales/RateMat/RateMat_code/docs/decisiones/D-008-modelo_datos_calificacion.md))

En [`home.component.html`](file:///C:/Users/sebastian/Desktop/Proyectos/Personales/RateMat/RateMat_code/frontend/src/app/features/home/home.component.html) y [`professor-profile.component.html`](file:///C:/Users/sebastian/Desktop/Proyectos/Personales/RateMat/RateMat_code/frontend/src/app/features/professor-profile/professor-profile.component.html):
* **Regla:** Si una reseña con texto tiene `netScore <= -3`:
  * Por defecto, el cuerpo del texto permanece oculto (`review.isCollapsed = true`).
  * En su lugar, se muestra una barra de aviso comunitaria sutil:
    ```html
    <div class="p-3 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs text-slate-500 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4 text-amber-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>Esta opinión recibió múltiples votos negativos de la comunidad.</span>
      </div>
      <button (click)="toggleCollapse(review)" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline whitespace-nowrap ml-2">
        {{ review.isCollapsed ? 'Mostrar opinión' : 'Ocultar' }}
      </button>
    </div>
    ```
  * Si el usuario pulsa "Mostrar opinión", el texto se despliega con opacidad tenue (`text-slate-600`).

---

## 3. Brecha 3: Botón de Reporte en el Feed Comunitario `/home` ([D-010](file:///C:/Users/sebastian/Desktop/Proyectos/Personales/RateMat/RateMat_code/docs/decisiones/D-010-legales_y_filtros_contenido.md))

* En [`home.component.html`](file:///C:/Users/sebastian/Desktop/Proyectos/Personales/RateMat/RateMat_code/frontend/src/app/features/home/home.component.html), en la esquina superior derecha de cada tarjeta de reseña (junto al rating badge), incluir el botón de reporte con el icono de bandera idéntico al de `professor-profile`:
  ```html
  <button (click)="reportReview(review)" title="Reportar reseña (D-010)" class="text-slate-300 hover:text-red-500 p-1 rounded-md transition-colors">
    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  </button>
  ```
* Al reportar, cambiar el icono a rojo y mostrar una alerta temporal confirmando: *"Reseña reportada para revisión de moderadores"*.

---

## 4. Brecha 4: Estado "Editar tu Reseña" ([D-003](file:///C:/Users/sebastian/Desktop/Proyectos/Personales/RateMat/RateMat_code/docs/decisiones/D-003-calificacion_moderacion.md))

* En [`professor-profile.component.ts`](file:///C:/Users/sebastian/Desktop/Proyectos/Personales/RateMat/RateMat_code/frontend/src/app/features/professor-profile/professor-profile.component.ts):
  * Comprobar si el usuario autenticado ya tiene una reseña para la materia seleccionada.
  * Si ya existe una reseña previa:
    * El botón de la cabecera/empty state muestra: `✏️ Editar mi reseña`.
    * Al abrir el modal, precargar los campos (`rating`, `tags`, `text`, `isAnonymous`) con los valores anteriores.
    * El botón de submit dice `Guardar Cambios` en vez de `Publicar Reseña`.

---

## 5. Brecha 5: Panel de Moderación para Administradores ([D-011](file:///C:/Users/sebastian/Desktop/Proyectos/Personales/RateMat/RateMat_code/docs/decisiones/D-011-rol_administrador_y_moderacion.md))

* En [`profile.component.ts`](file:///C:/Users/sebastian/Desktop/Proyectos/Personales/RateMat/RateMat_code/frontend/src/app/features/profile/profile.component.ts), agregar una sección o toggle accesible: **"Panel de Moderación (Admin)"** que muestre:
  1. **Cola de Profesores y Materias Pendientes (D-004):**
     * Lista de solicitudes simuladas (ej: *"Prof. María Rodríguez - Cátedra: Física I - Sugerida por: estudiante12@est.ucab.edu.ve"*).
     * Botón `✅ Aprobar` (agrega al profesor o cátedra) y botón `❌ Rechazar`.
  2. **Cola de Contenido Reportado (D-010):**
     * Reseñas o PDFs que alcanzaron el umbral de reportes comunitarios.
     * Botón `🗑️ Eliminar Contenido` y botón `🔄 Desestimar Denuncias / Restaurar`.
  * Toda acción debe ofrecer retroalimentación reactiva inmediata (toast o actualización de estado).

---

## 6. Brecha 6: Límite de Longitud y Contador en Reseñas ([D-009](file:///C:/Users/sebastian/Desktop/Proyectos/Personales/RateMat/RateMat_code/docs/decisiones/D-009-seguridad_y_limites.md))

* En el formulario de reseña de `professor-profile.component.ts`:
  * Agregar `Validators.maxLength(1000)`.
* En `professor-profile.component.html`, debajo del textarea:
  * Mostrar contador sutil con números tabulares:  
    `<span class="text-[11px] text-slate-400 tabular-nums">{{ reviewForm.get('text')?.value?.length || 0 }} / 1000 caracteres</span>`.

---

## 7. Verificación y Compilación

1. Ejecuta `npm run build` en `RateMat_code/frontend` y verifica **Exit Code 0** (sin errores de TypeScript ni sintaxis de plantillas).
2. Valida que el servidor `http://localhost:4200` recargue los componentes fluidamente.
3. Actualiza `REPORTE_EJECUTOR.md` documentando la finalización de estas brechas.
