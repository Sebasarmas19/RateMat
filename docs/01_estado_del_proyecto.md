# Estado del Proyecto: RateMat

**Fase Actual:** 🟢 MVP Full-Stack 100% Desarrollado, Auditado en Seguridad y Listo para Producción
**Última Actualización:** 27 de Septiembre de 2026

---

## 1. Resumen Ejecutivo del Estado del Sistema
El proyecto RateMat ha superado exitosamente todas las fases de diseño arquitectónico, desarrollo full-stack, QA automatizado integral y blindaje de seguridad (AppSec & WebSec). La plataforma cuenta con una suite de 30 pruebas funcionales superadas (30/30) y 9 pruebas automatizadas de seguridad aprobadas (9/9), operando sobre Angular 18, NestJS 10 y PostgreSQL viva poblada con datos maestros de la UCAB Guayana.

---

## 2. Lo que está Cerrado, Construido y Verificado

### A. Capa de Datos y Backend (NestJS + TypeORM + PostgreSQL)
- [x] **Base de Datos Relacional:** Tablas `users`, `professors`, `subjects`, `professor_subjects`, `reviews`, `reports` y tabla pivote con índices únicos contra duplicidad y spam.
- [x] **Seeder Maestro (`backend/src/database/seeds/seed.js`):** Población completa de carreras, pensums por semestre y docentes reales de UCAB Guayana.
- [x] **Endpoints Vivos y Paginados:**
  - `GET /api/search?q=X`: Búsqueda omni universal paralela por Materias y Profesores.
  - `GET /api/reviews/recent?page=X&limit=Y`: Feed de reseñas paginado con TypeORM `findAndCount` (`{ data, total, page, limit, hasMore }`).
  - `GET /api/professors/:id`: Perfil docente con cátedras y métricas cuantitativas consolidadas.
  - `POST /api/reviews`: Creación con validación estricta (justificación obligatoria para 1★ y 5★, filtro de groserías y rechazo HTTP 422 para delitos del Protocolo 2.83).
  - `POST /api/reviews/:id/vote`: Votación útil (👍/👎) con recálculo inteligente de Net Score (+2/-2 en cambios de opinión) y neutralización de peso al llegar a -5.
  - `POST /api/reports`: Sistema de pánico con cuota de 5 reportes diarios (`DailyLimitGuard`) y ocultamiento automático al acumular 3 denuncias.
  - `POST /api/users/accept-terms`: Registro probatorio digital de aceptación de términos con marca temporal (`terms_accepted_at`).
  - `GET /api/users/me`: Sincronización transparente con Supabase Auth.
- [x] **Seguridad y Resiliencia Backend (D-009):**
  - `@nestjs/throttler`: Protección DoS global (100 req/min por IP).
  - `DailyLimitGuard`: Cuotas diarias en PostgreSQL (máx. 3 sugerencias de profesor, 10 reseñas y 5 reportes al día por usuario) en modo *fail-closed*.
  - `ValidationPipe`: Whitelist estricto contra inyección de payloads y `@MaxLength` en DTOs.
  - **Zero-Leakage (D-002):** Supresión total del objeto `user` (`user: null`) en reseñas anónimas y exclusión de correos o UUIDs en públicas.

### B. Capa de Frontend e Interfaz de Usuario (Angular 18 + TailwindCSS + Reicon)
- [x] **Arquitectura de Rutas Completa:**
  - `/` (Landing Page): Hero interactivo, beneficios, métricas de transparencia y animaciones GSAP ScrollTrigger.
  - `/login`: Vista dedicada con selector Google Workspace OAuth (`@est.ucab.edu.ve` y `@ucab.edu.ve`).
  - `/search`: Centro neurálgico post-login con selector dual Materias/Profesores, exploración de pensums por semestres y sugerencia en cold-start (D-004).
  - `/home`: Feed comunitario independiente de reseñas con filtros de opinión, paginación incremental GSAP stagger y botón ergonómico *"Cargar más opiniones"*.
  - `/professor/:id`: Perfil a 2 columnas en desktop (móvil scroll unificado) con pestañas interactivas por cátedra.
  - `/profile`: Panel de reputación estudiantil, niveles de gamificación y garantía de privacidad híbrida (D-002).
  - `/admin`: Panel ejecutivo independiente de moderación con colas de cold-start y denuncias comunitarias, protegido por `adminGuard` (D-011).
- [x] **Estándar Visual Impeccable & Mobile-First:**
  - Layout mutante: Floating Bottom Bar en móvil (<768px) y Sidebar en escritorio (≥768px) con corrección de scroll vertical.
  - Desaturación visual: eliminación de micro-textos redundantes y tarjetas limpias sobre fondo `#f1f4f9`.
  - Iconografía oficial Reicon por carrera (`carrera-informatica`, `carrera-derecho`, etc.) y erradicación total de emojis.
  - Modales convertidos en Bottom Sheets ergonómicos en pantallas táctiles con drag bar y cierre por backdrop.
  - Micro-animaciones con físicas de resorte (Morphicons en votos 👍/👎 y botón ver opinión).
  - Cifras tabulares suizas (`tabular-nums`).

### C. Blindaje Legal e Institucional (D-005 y D-010)
- [x] **D-005 Descartada:** Supresión total del Hub Académico y descargas de PDFs, neutralizando el riesgo de sanciones por fraude académico (Art. 5 Reglamento UCAB) y derechos de autor.
- [x] **Deslinde Institucional:** Footer permanente en todas las vistas declarando que RateMat es una iniciativa independiente no avalada oficialmente por la UCAB.
- [x] **Canal de Habeas Data Docente:** Enlace y modal para docentes con canal directo `legal@ratemat.app` y compromiso de exclusión en <48h (Art. 28 CRBV) visible en la Landing pública.
- [x] **Filtro Preventivo de Delitos Graves (Protocolo 2.83 UCAB):** Detección de términos de acusación penal (acoso, soborno, extorsión) con regex `\b` en frontend y rechazo HTTP 422 en backend con modal educativo.
- [x] **Onboarding Legal:** Modal bloqueante con 3 checkboxes obligatorios respaldados en base de datos.

---

## 3. Estado de Calidad y Pruebas Automatizadas
- **Suite QA Full-Stack:** 30/30 pruebas superadas (100% cobertura E2E en flujos críticos).
- **Suite de Seguridad (AppSec & WebSec):** 9/9 pruebas superadas (anonimato garantizado, bloqueo institucional, RBAC adminGuard, Protocolo 2.83).
- **Backend NestJS:** `nest build` -> **Exit Code 0** (Compilación limpia).
- **Frontend Angular:** `ng build` -> **Exit Code 0** (Compilación limpia, 0 errores AOT).

---

## 4. Próximos Pasos (Fase de Producción)
1. **Carga y Verificación de Datos Reales:** Verificación final del pensum y asignación docente en PostgreSQL.
2. **Infraestructura Backend (VPS Linux):**
   - Despliegue con Docker Compose (`docker-compose.yml`) multi-stage configurado en `DEPLOY_GUIDE.md`.
   - Configuración de Nginx con SSL obligatorio (HTTPS) para el funcionamiento de Service Workers PWA.
3. **Infraestructura Frontend (Vercel):**
   - Despliegue con `vercel.json` (`/*` -> `/index.html`) y variables de entorno hacia el backend de producción.
