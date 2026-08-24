# Traspaso de Contexto — Hacia la Sesión 4

**Estado de Proyecto:**
- Hemos completado con éxito todas las tareas hasta la **2.4 (Algoritmo Anti-Desahogo)**.
- El backend compila perfectamente y cuenta con el DTO `CreateReviewDto` blindado: Validaciones estrictas de texto condicional, Profanity Filter y Rate Limiting.
- La lógica de unicidad (1 alumno = 1 reseña por materia/profesor) está controlada de manera óptima mapeando el error `23505` de TypeORM/PostgreSQL.

**Tu Misión (Sesión 4):**
Debes ejecutar el siguiente grupo de tareas correspondientes al Backend, sin desviarte:
- **2.5 Moderación Comunitaria (Upvotes y Downvotes):** Implementar endpoint `POST /reviews/:id/vote`. Si un usuario cambia de opinión, su voto se actualiza, no se duplica. Implementar lógica matemática: Si el `netScore` de la reseña baja de un umbral (ej. -5), el `weight` cae a 0.
- **2.6 Hub Académico (Subida de PDFs):** Implementar `Multer`. Rechazar estrictamente todo lo que no sea `.pdf` y limitar tamaño a 10MB (D-005). Guardar localmente y registrar URL.
- **2.7 Sistema de Reportes (Botón de Pánico):** Endpoint `POST /reports`. Si una reseña o archivo alcanza 3 reportes distintos, su estado pasa automáticamente a `HIDDEN` (D-010).

**Instrucciones Iniciales para el Ejecutor de la Sesión 4:**
1. Lee `GEMINI.md` para comprender las reglas inquebrantables.
2. Lee `docs/CONTROL_SESIONES.md` y `PLAN.md` para entender tu enfoque.
3. Toma nota de `docs/decisiones/D-005-hub_academico_archivos.md` antes de implementar Multer.
4. Una vez entiendas este documento, informa qué archivos vas a crear o modificar.

**Reglas Operativas (Commits y Pausas):**
- **NUNCA hagas commits tú mismo.** Los commits los hace el usuario.
- **Pausa entre tareas:** Si una sesión abarca múltiples tareas (ej. 2.5, 2.6, 2.7), NO programes todo de corrido. Al terminar una tarea, detente, haz un resumen técnico de lo que se implementó y ofrécele al usuario una recomendación de comando o mensaje para el commit (ej. `git add . && git commit -m "feat(backend): tarea..."`). Espera a que el usuario confirme que hizo el commit antes de avanzar a la siguiente subtarea.
