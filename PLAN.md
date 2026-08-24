# PLAN DE EJECUCIÓN RATEMAT (Backend & Base de Datos)

Este plan está diseñado basándose en las decisiones arquitectónicas documentadas en `docs/decisiones`. El orden respeta estrictamente las dependencias de base de datos relacional (TypeORM).

## Tarea 1: Entorno y Entidad de Autenticación (User)
- **Necesita:** Nada.
- **Entrega:** Configuración inicial de NestJS, conexión a PostgreSQL (TypeORM) y la Entidad `User`.
  - Columnas clave: `id`, `email`, `reputation`, `created_at`.
- **Terminado cuando:** El servidor NestJS inicie sin errores, TypeORM sincronice la tabla `user` en PostgreSQL y exista una ruta de prueba.
- **🔍 Punto de revisión:** Confirmar con el humano que la base de datos está disponible (credenciales de PostgreSQL local o servidor) y si el ID del usuario vendrá desde Supabase Auth (UUID) o será autogenerado en la BD.

## Tarea 2: Entidades Base de Catálogo (Subject y Professor)
- **Necesita:** Tarea 1 finalizada.
- **Entrega:** Entidades `Subject` (Materia) y `Professor` (Profesor).
  - `Subject`: `id`, `name`, `code`, `credits`.
  - `Professor`: `id`, `name`, `status` (PENDING/APPROVED), `created_by` (FK -> User).
- **Terminado cuando:** Tablas `subject` y `professor` existan con sus respectivas validaciones y la relación de autoría con `User` (Cold Start D-004).

## Tarea 3: El Núcleo del Sistema (ProfessorSubject)
- **Necesita:** Tarea 2 finalizada.
- **Entrega:** Entidad pivot `ProfessorSubject` (La intersección, según D-008).
  - Columnas: `id` (PK propia), `professor_id` (FK), `subject_id` (FK), `status` (PENDING/APPROVED).
- **Terminado cuando:** La tabla intermedia se genere correctamente.
- **🔍 Punto de revisión:** Verificar que la estrategia de consultar al profesor y sus materias desde esta tabla pivot sea óptima según el caso de uso principal (D-007).

## Tarea 4: Sistema de Reseñas y Moderación (Review, ReviewTag, ReviewVote)
- **Necesita:** Tarea 3 finalizada.
- **Entrega:** Entidad `Review` (La Reseña), `ReviewTag` (Etiquetas) y `ReviewVote` (Votos de la comunidad).
  - `Review`: `id`, `user_id` (FK), `professor_subject_id` (FK), `rating`, `text`, `is_anonymous`, `net_score`, `weight`, `status` (ACTIVE/HIDDEN).
  - `ReviewTag`: `id`, `review_id` (FK), `tag_name`.
  - `ReviewVote`: `id`, `review_id` (FK), `user_id` (FK), `vote_type` (UP/DOWN).
- **Terminado cuando:** Toda la lógica estructural del "Algoritmo Anti-Desahogo" esté reflejada en las tablas, asegurando un índice único (UniqueConstraint en `ReviewVote` por user_id + review_id) para evitar duplicados de votos.

## Tarea 5: Hub Académico y Reportes Legales (AcademicFile y Report)
- **Necesita:** Tareas 3 y 4 finalizadas.
- **Entrega:** Entidad `AcademicFile` y `Report`.
  - `AcademicFile`: `id`, `professor_subject_id` (FK), `user_id` (FK), `file_url`, `size`, `report_count`, `status`.
  - `Report`: `id`, `entity_type` (REVIEW / FILE), `entity_id`, `user_id` (FK), `reason`.
- **Terminado cuando:** Las entidades que mitigan los riesgos legales (D-010) y permiten subida de material (D-005) estén implementadas.
- **🔍 Punto de revisión final:** Revisión completa del diagrama generado. Al aprobar, procederemos a codificar los controladores y servicios, incluyendo las capas de seguridad y Rate Limiting (D-009).
