# Bitácora de RateMat

Este archivo registra cronológicamente los hitos, atajos tomados y cambios de rumbo importantes.

* **[2026-08-20] - Arranque del Proyecto:** 
  * Se decide utilizar la metodología de dos sesiones ("Arquitecto" y "Ejecutor") para proteger las reglas de negocio del código. 
  * Se aprueba el uso de Angular para el frontend y se elige NestJS para el backend por su alta compatibilidad con el ecosistema de TypeScript/Angular.
  * Se descarta el anonimato 100% obligatorio a favor de un sistema híbrido gamificado para fomentar la participación.

* **[2026-09-13] - Entrega de Frontend y Resolución de Brechas (Agente Ejecutor):**
  * El Ejecutor finalizó la implementación de las 6 brechas funcionales de negocio (D-002, D-003, D-004, D-005, D-007, D-009, D-010, D-011).
  * Se rediseñó la vista de carrera en `/search` (eliminando doble buscador, agregando selector Materias/Profesores y buscador contextual).
  * Se erradicaron todos los emojis de la interfaz, reemplazándolos por iconos oficiales `reicon` y fijando la regla en `CLAUDE.md`.
  * `npm run build` verificado con Exit Code 0.
  * **Documento para revisión:** Consulta el informe técnico completo en `RateMat_logica/ENTREGA_EJECUTOR.md` y `RateMat_code/REPORTE_PARA_LOGICA.md` para emitir la validación de arquitectura.
