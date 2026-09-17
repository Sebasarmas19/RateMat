# INSTRUCCIÓN DE EJECUCIÓN: BLINDAJE LEGAL DEFINITIVO Y RETIRO DEL HUB ACADÉMICO (D-005, D-010)

**Para:** Agente Ejecutor Frontend (`RateMat_code`)  
**De:** Sesión del Arquitecto Líder  
**Habilidades Requeridas:** `impeccable`, `ui-ux-pro-max`, `reicon`.  
**Objetivo:** Adaptar el frontend a las decisiones de blindaje legal aprobadas: erradicación total del Hub de PDFs (D-005 eliminada), inclusión del Disclaimer de No Afiliación y canal de Habeas Data docente en el layout (D-010), y modal educativo contra imputación de delitos penales (Protocolo 2.83 UCAB).

---

## 1. Retiro Total del Hub Académico y Archivos PDF (D-005 Descartada)

Para neutralizar al 100% el riesgo de fraude académico (Art. 5 Reglamento UCAB) y derechos de autor:

### A. En `professor-profile.component.html`:
1. **Eliminar la Columna 3:** Retirar el bloque completo del `Hub Académico` (botón `+ Subir PDF`, lista de archivos, skeletons y botón de reporte de PDFs).
2. **Rebalanceo de Columnas (Desktop):**
   * Anterior: Columna 1 (4 cols), Columna 2 (5 cols), Columna 3 (3 cols).
   * **Nuevo Layout:** Distribución limpia de 2 columnas:
     * **Columna Izquierda (`lg:col-span-5`):** Tarjeta de identidad del docente, métricas cuantitativas (claridad, dificultad, recomendación), distribución de estrellas y tags rápidos.
     * **Columna Derecha (`lg:col-span-7`):** Pestañas interactivas de cátedras cursadas, botón `Escribir / Editar reseña` y muro de opiniones ordenadas por Net Score con colapso de votos negativos.
3. **Eliminar el Modal de Subida de PDFs:**
   * Retirar el `<div *ngIf="showUploadModal">...</div>` y su formulario asociado.

### B. En `professor-profile.component.ts` y `professor-profile.service.ts`:
1. Retirar variables y métodos huérfanos: `showUploadModal`, `uploadForm`, `selectedFileObj`, `selectedFileSizeMB`, `isUploadingFile`, `uploadError`, `onFileSelected`, `submitUpload`, `reportFile`, etc.
2. Limpiar interfaces y métodos en `professor-profile.service.ts` relacionados con `AcademicFileItem` o carga de archivos.

---

## 2. Disclaimer de No Afiliación y Canal de Habeas Data Docente (D-010)

En [`layout.component.ts`](file:///C:/Users/sebastian/Desktop/Proyectos/Personales/RateMat/RateMat_code/frontend/src/app/core/layout/layout.component.ts):

1. **Disclaimer de No Afiliación en el Footer:**
   * Agregar un footer sobrio y minimalista visible en la parte inferior del área de contenido principal (`<main>`):
     ```html
     <footer class="mt-16 pt-8 pb-12 border-t border-slate-200/80 text-center space-y-2 text-xs text-slate-400 max-w-4xl mx-auto px-4">
       <p class="font-medium text-slate-500">
         RateMat es una iniciativa tecnológica independiente desarrollada por y para estudiantes. No posee vinculación oficial, patrocinio ni aval institucional de la Universidad Católica Andrés Bello (UCAB).
       </p>
       <div class="flex items-center justify-center space-x-4 text-[11px] pt-1">
         <button (click)="openTakedownModal()" class="hover:text-indigo-600 hover:underline transition-colors">
           Docentes: Solicitud de Exclusión (Habeas Data)
         </button>
         <span>•</span>
         <a routerLink="/admin" class="hover:text-slate-600 hover:underline transition-colors">
           Moderación
         </a>
         <span>•</span>
         <span>UCAB Guayana 2026</span>
       </div>
     </footer>
     ```
2. **Modal Ligero de Takedown / Habeas Data:**
   * Si un docente pulsa "Docentes: Solicitud de Exclusión (Habeas Data)", se despliega un diálogo informativo claro:
     * Título: *"Canal de Atención Docente y Privacidad"*
     * Explicación: *"Respetamos el derecho de autodeterminación informativa (Art. 28 CRBV). Si eres docente titular o contratado de la UCAB y deseas actualizar tus cátedras o solicitar la exclusión formal de tu perfil en nuestra plataforma estudiantil, escríbenos a legal@ratemat.app o completa este formulario. Atendemos todas las solicitudes en un plazo máximo de 48 horas."*

---

## 3. Filtro Preventivo contra Imputaciones Delictivas (Acoso / Soborno / Protocolo 2.83)

En `professor-profile.component.ts` (al validar la reseña antes de enviarla):

1. **Detección Preventiva de Delitos:**
   * Lista de términos de acusación penal:
     ```typescript
     const CRIME_KEYWORDS = [
       'acoso', 'acosador', 'acosó', 'soborno', 'cobró', 'cobro', 
       'plata por nota', 'dólares para pasar', 'tocó', 'abuso', 'violó', 'extorsión'
     ];
     ```
   * Si el texto de la opinión contiene alguno de estos términos (en minúsculas e ignorando acentos):
     * Bloquear el envío de la reseña.
     * Desplegar el **Modal Educativo e Institucional (Protocolo 2.83)**.
2. **Modal Educativo de Orientación:**
   * **Encabezado:** Ícono oficial `shield` o `alert-circle` con fondo ámbar/índigo.
   * **Título:** *"Atención: Denuncias de Acoso o Delitos Graves"*
   * **Cuerpo:**  
     > *"En RateMat evaluamos únicamente el desempeño pedagógico y académico de las cátedras. Si has sido víctima o presenciado hechos de acoso, violencia, sobornos o delitos, debes formalizar tu denuncia a través de los canales institucionales de la UCAB (Protocolo 2.83 de la Comisión Disciplinaria y Defensoría Universitaria). La imputación de delitos en foros públicos constituye difamación legal."*
   * **Botón de Acción:** *"Entendido, modificaré mi opinión"* (cierra el modal y preserva el texto para que el alumno lo ajuste).

---

## 4. Verificación Técnica

1. Ejecutar `npm run build` en `RateMat_code/frontend` y comprobar **Exit Code 0** (0 errores de TypeScript, 0 errores de plantillas).
2. Asegurarse de que el servidor en `http://localhost:4200` continúe respondiendo sin errores.
3. Actualizar `REPORTE_EJECUTOR.md` documentando la finalización del blindaje legal.
