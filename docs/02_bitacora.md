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
  * Se integró la librería `morphicons` para micro-animaciones elásticas en votaciones y botones interactivos.
  * `npm run build` verificado con Exit Code 0.

* **[2026-09-16] - Blindaje Legal Definitivo y Rediseño Visual Avanzado:**
  * **D-005 DESCARTADA:** Tras exhaustivo análisis legal del Reglamento Disciplinario UCAB (Art. 5, Num. 1) y la Ley de Derecho de Autor, se eliminó completamente el Hub Académico y descargas de PDF para prevenir contingencias por fraude académico y piratería.
  * **D-010 REFORZADA:**
    * Se incorporó el Disclaimer de No Afiliación en el pie de página de la aplicación deslindando a la UCAB.
    * Se habilitó el canal de Habeas Data docente (`legal@ratemat.app`) con soporte en base de datos (`Professor.isActive`) para excluir docentes en <48h (Art. 28 CRBV).
    * Se implementó el filtro preventivo de delitos graves (acoso, soborno, extorsión) con modal orientador hacia el Protocolo 2.83 de la Comisión Disciplinaria UCAB.
    * Trazabilidad probatoria digital: el onboarding legal ahora persiste la marca de tiempo en PostgreSQL (`User.terms_accepted_at`).
  * **Landing Page de Alta Gama:** Rediseño completo con animaciones fluidas GSAP y ScrollTrigger.
  * Rebalanceo ergonómico del perfil de profesor a 2 columnas limpias en desktop.

* **[2026-09-22] - Sincronización Full-Stack Viva, Seeder Maestro y Acceso Institucional:**
  * **Limpieza de Backend:** Retiro definitivo del módulo `academic-files` y actualización de la entidad polimórfica `Report` para enfocarse exclusivamente en reseñas.
  * **Seeder Maestro de Base de Datos:** Creación de script de siembra en PostgreSQL (`backend/src/database/seeds/seed.js`) con catálogo real de materias, semestres, créditos y profesores de UCAB Guayana.
  * **Endpoints Vivos:** Conexión de `/professors/:id` con relaciones reales de cátedras y promedios cuantitativos consolidados.
  * **Sincronización Frontend:** `ApiService` conectado a base de datos PostgreSQL viva en lugar de mocks.
  * **Módulo de Login Institucional (`/login`):** Vista dedicada para autenticación Google Workspace con restricción para dominios `@est.ucab.edu.ve` y `@ucab.edu.ve`.
  * **Navegación y Cierre de Sesión:** Botón de Logout con modal nativo de confirmación y corrección de solapamiento en tabs de cátedras.
  * **Buscador Omni Dual:** Simplificación en `/search` con selector rápido Materias/Profesores y búsqueda universal unificada.

* **[2026-09-23] - Auditoría de Sincronización de la Sesión de Lógica (Arquitecto):**
  * La sesión del Arquitecto realizó una auditoría forense completa de la rama `master`.
  * Se sincronizó la carpeta `RateMat_logica` con todas las decisiones, módulos y cambios de infraestructura implementados en el código.
  * Se constató que tanto Backend como Frontend compilan con Exit Code 0 y están listos para la fase final de despliegue a producción.

* **[2026-09-27] - QA Integral, Paginación Escalable y Blindaje AppSec/WebSec (Agente Ejecutor):**
  * **Limpieza UI/UX:** Retiro de micro-textos redundantes, asignación de iconos vectoriales Reicon oficiales para cada carrera y corrección del scroll vertical en dispositivos móviles.
  * **Paginación Incremental:** Endpoint paginado `/api/reviews/recent` con TypeORM `findAndCount` (`page`, `limit`, `hasMore`), adaptado en Angular con animaciones GSAP stagger y botón ergonómico *"Cargar más opiniones"*.
  * **QA Full-Stack 100%:** Suite automatizada de 30 pruebas integrales de extremo a extremo con Puppeteer (`30/30 PASS`), resolviendo prefijo `/api` y sincronización JWT.
  * **Blindaje de Privacidad y AppSec (9/9 PASS):**
    * Supresión total del objeto `user` (`user: null`) en reseñas anónimas (D-002).
    * Control de acceso RBAC con `adminGuard` para `/admin` y ocultamiento de controles para estudiantes (D-011).
    * Rechazo HTTP 422 a acusaciones delictivas (Protocolo 2.83 UCAB) y corrección de regex `\b` en frontend (D-010).
    * Cuota de 5 reportes diarios por estudiante con `DailyLimitGuard` en modo *fail-closed* y `@MaxLength` en DTOs.
  * Frontend y Backend verificados con compilación limpia (Exit Code 0).

