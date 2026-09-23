# Estado del Proyecto: RateMat

**Fase Actual:** 🟢 MVP Full-Stack 100% Desarrollado y Sincronizado (Listo para Despliegue a Producción)
**Última Actualización:** 23 de Septiembre de 2026

---

## 1. Resumen Ejecutivo del Estado del Sistema
El proyecto RateMat ha superado todas las fases de diseño arquitectónico, desarrollo backend y desarrollo frontend. El sistema se encuentra completamente conectado entre Angular 18 y NestJS 10 con una base de datos PostgreSQL viva y poblada con datos maestros de la UCAB Guayana.

---

## 2. Lo que está Cerrado, Construido y Verificado

### A. Capa de Datos y Backend (NestJS + TypeORM + PostgreSQL)
- [x] **Base de Datos Relacional:** Tablas `users`, `professors`, `subjects`, `professor_subjects`, `reviews`, `reports` y tabla pivote con índices únicos contra spam.
- [x] **Seeder Maestro (`backend/src/database/seeds/seed.js`):** Población completa de carreras, pensums por semestre y docentes reales de UCAB Guayana.
- [x] **Endpoints Vivos:**
  - `GET /search?q=X`: Búsqueda omni universal paralela por Materias y Profesores.
  - `GET /reviews/recent`: Feed de reseñas activas con relaciones pobladas.
  - `GET /professors/:id`: Perfil docente con cátedras y métricas cuantitativas consolidadas.
  - `POST /reviews`: Creación con validación estricta (justificación obligatoria para 1★ y 5★, filtro de groserías).
  - `POST /reviews/:id/vote`: Votación útil (👍/👎) con recálculo inteligente de Net Score (+2/-2 en cambios de opinión) y neutralización de peso al llegar a -5.
  - `POST /reports`: Sistema de pánico con ocultamiento automático al acumular 3 denuncias.
  - `POST /users/accept-terms`: Registro probatorio digital de aceptación de términos con marca temporal (`terms_accepted_at`).
  - `GET /users/me`: Sincronización transparente con Supabase Auth.
- [x] **Seguridad y Resiliencia (D-009):**
  - `@nestjs/throttler`: Protección DoS global (100 req/min por IP).
  - `DailyLimitGuard`: Cuotas diarias en PostgreSQL (máx. 3 sugerencias de profesor y 10 reseñas al día por usuario).
  - `ValidationPipe`: Whitelist estricto contra inyección de payloads.

### B. Capa de Frontend e Interfaz de Usuario (Angular 18 + TailwindCSS + Reicon)
- [x] **Arquitectura de Rutas Completa:**
  - `/` (Landing Page): Hero interactivo, beneficios, métricas de transparencia y animaciones GSAP ScrollTrigger.
  - `/login`: Vista dedicada con selector Google Workspace OAuth (`@est.ucab.edu.ve` y `@ucab.edu.ve`).
  - `/search`: Centro neurálgico post-login con selector dual Materias/Profesores, exploración de pensums por semestres y sugerencia en cold-start (D-004).
  - `/home`: Feed comunitario independiente de reseñas con filtros de opinión y votación optimista.
  - `/professor/:id`: Perfil a 2 columnas en desktop (móvil scroll unificado) con pestañas interactivas por cátedra.
  - `/profile`: Panel de reputación estudiantil, niveles de gamificación y garantía de privacidad híbrida (D-002).
  - `/admin`: Panel ejecutivo independiente de moderación con colas de cold-start y denuncias comunitarias (D-011).
- [x] **Estándar Visual Impeccable & Mobile-First:**
  - Layout mutante: Floating Bottom Bar en móvil (<768px) y Sidebar en escritorio (≥768px).
  - Modales convertidos en Bottom Sheets ergonómicos en pantallas táctiles con drag bar y cierre por backdrop.
  - Micro-animaciones con físicas de resorte (Morphicons en votos 👍/👎 y botón ver opinión).
  - Erradicación 100% de emojis; iconografía unificada con la biblioteca oficial `reicon`.
  - Cifras tabulares suizas (`tabular-nums`) y eliminación de blancos planos con fondo `#f1f4f9`.

### C. Blindaje Legal e Institucional (D-005 y D-010)
- [x] **D-005 Descartada:** Supresión total del Hub Académico y descargas de PDFs, neutralizando el riesgo de sanciones por fraude académico (Art. 5 Reglamento UCAB) y derechos de autor.
- [x] **Deslinde Institucional:** Footer permanente en todas las vistas declarando que RateMat es una iniciativa independiente no avalada oficialmente por la UCAB.
- [x] **Canal de Habeas Data:** Enlace y modal para docentes con canal directo `legal@ratemat.app` y compromiso de exclusión en <48h (Art. 28 CRBV).
- [x] **Filtro Preventivo de Delitos Graves:** Detección de términos de acusación penal (acoso, soborno, extorsión) con modal educativo orientando a formalizar denuncias ante la Comisión Disciplinaria UCAB (Protocolo 2.83).
- [x] **Onboarding Legal:** Modal bloqueante con 3 checkboxes obligatorios respaldados en base de datos.

---

## 3. Estado de Compilación y Servidores
- **Backend NestJS:** `nest build` -> **Exit Code 0** (Compilación limpia).
- **Frontend Angular:** `ng build` -> **Exit Code 0** (Compilación limpia, 0 errores AOT).
- **Servidores Locales:**
  - Backend API: `http://localhost:3001` (o `:3000` con Swagger en `/api/docs`).
  - Frontend PWA: `http://localhost:4200`.

---

## 4. Próximos Pasos (Fase de Producción)
1. **Infraestructura Backend (VPS Linux):**
   - Despliegue con Docker Compose (`docker-compose.yml`) multi-stage configurado en `DEPLOY_GUIDE.md`.
   - Configuración de Proxy Inverso (Nginx) con certificado SSL obligatorio para el funcionamiento de Service Workers de la PWA.
2. **Infraestructura Frontend (Vercel):**
   - Conexión del repositorio y despliegue con la regla de reescritura `vercel.json` (`/*` -> `/index.html`).
3. **Auditoría de Dominio y Google OAuth:**
   - Configuración de pantalla de consentimiento de Google Cloud Console con el dominio definitivo de producción.
