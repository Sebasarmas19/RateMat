# Plan de Ejecución General — RateMat PWA

Subtareas ordenadas por dependencia estricta. Cada una dice **qué necesita ya terminado**, **qué entrega** y **cuándo se da por hecha**. 

**Regla inquebrantable:** Si al desarrollar una subtarea esta resulta ser más compleja de lo descrito, se detiene, se divide y se avisa. Ningún commit debe tocar más de un módulo a la vez. Los puntos de revisión (🔍) son obligatorios antes de avanzar.

---

## Bloque 1 — Base de Datos y Entidades (✅ COMPLETADO)
*Ejecutado en la Sesión 1.*
Incluye la configuración de NestJS, TypeORM y las entidades `User`, `Subject`, `Professor`, `ProfessorSubject`, `Review`, `ReviewTag`, `ReviewVote`, `AcademicFile` y `Report`.

---

## Bloque 2 — Capa de API, Lógica de Negocio y Seguridad (Backend NestJS)

### 2.1 · Seguridad Base y Guards (Supabase Auth)
**Necesita:** Bloque 1.
**Entrega:** Guard global de autenticación JWT (`SupabaseAuthGuard`) y decorador `@CurrentUser()`.
**Terminado cuando:** Una ruta protegida `/users/me` rechaza peticiones sin token y acepta peticiones con un token válido de Supabase, extrayendo el UUID del usuario.

### 2.2 · Prevención de Abuso (Rate Limiting Global y de Negocio)
**Necesita:** 2.1
**Entrega:** Configuración de `@nestjs/throttler` y Guards personalizados para límites diarios (D-009).
**Terminado cuando:** 
- Un bot recibe error `429 Too Many Requests` si hace >100 peticiones por minuto.
- Un usuario autenticado recibe error si intenta crear >3 profesores al día o >10 reseñas al día.

### 2.3 · Catálogo y Búsqueda (Materias y Profesores)
**Necesita:** 2.1
**Entrega:** Controladores y Servicios de `Subjects` y `Professors`.
**Terminado cuando:** 
- Endpoint `GET /search` permite buscar por nombre de materia o profesor.
- Endpoint `POST /professors` permite sugerir un profesor (entra en estado `PENDING`).
- Se pueden listar todos los profesores aprobados de una materia específica usando la tabla pivot `ProfessorSubject`.

### 2.4 · El "Algoritmo Anti-Desahogo" (Crear Reseña y Profanity Filter)
**Necesita:** 2.2 y 2.3
**Entrega:** Controlador `ReviewsController`, `ReviewsService` y el filtro de malas palabras (D-010).
**Terminado cuando:** 
- Al crear una reseña, si contiene lenguaje inapropiado, la API devuelve error 400.
- Si pasa el filtro, se guarda con `weight: 1.0` y `netScore: 0`.
- Si el usuario ya había reseñado esa materia/profesor, la base de datos lanza error de unicidad (D-003) y la API lo maneja devolviendo un mensaje amigable.

### 2.5 · Moderación Comunitaria (Upvotes y Downvotes)
**Necesita:** 2.4
**Entrega:** Endpoint `POST /reviews/:id/vote`.
**Terminado cuando:** 
- Un voto positivo suma 1 al `netScore`; uno negativo resta 1.
- Si un usuario cambia de opinión (vota UP y luego DOWN), el voto se actualiza, no se duplica.
- **Lógica matemática:** Si el `netScore` baja de cierto umbral (ej. -5), el `weight` de la reseña baja a 0, anulando su impacto en el promedio del profesor.

### 2.6 · Hub Académico (Subida de PDFs)
**Necesita:** 2.3
**Entrega:** `AcademicFilesController` con manejo de `Multer` para carga de archivos.
**Terminado cuando:** 
- La API rechaza cualquier archivo >10MB o que no sea `.pdf` (D-005).
- El PDF se guarda (localmente por ahora) y su URL se registra en la entidad `AcademicFile`.

### 2.7 · Sistema de Reportes (Botón de Pánico)
**Necesita:** 2.4 y 2.6
**Entrega:** Endpoint `POST /reports`.
**Terminado cuando:** 
- Un alumno puede reportar un PDF o una Reseña.
- Si la entidad alcanza **3 reportes de 3 usuarios distintos**, su estado pasa automáticamente a `HIDDEN` (D-010).

---

## 🔍 Punto de Revisión A — Cierre del Backend
Se realiza una prueba de todos los endpoints usando Postman o Swagger. ¿El API permite abusos? ¿Se calculan bien los promedios ignorando las reseñas con `weight: 0`? No se inicia el frontend hasta que el backend sea un muro impenetrable.

---

## Bloque 3 — Cascarón del Frontend (Angular PWA)

### 3.1 · Proyecto Base y Entorno
**Necesita:** Revisión A.
**Entrega:** `package.json`, `angular.json`, TailwindCSS configurado y estructura `src/`.
**Terminado cuando:** `ng serve` levanta la app con Tailwind funcionando y el repositorio ignora correctamente las variables de entorno.

### 3.2 · Sistema Visual y Navegación Mobile-First
**Necesita:** 3.1
**Entrega:** Layout principal.
**Terminado cuando:** 
- En móvil (<768px): Existe una **Bottom Navigation Bar** flotante (Inicio, Buscar, Perfil).
- En escritorio (≥768px): La Bottom Bar desaparece y se muestra un **Sidebar** lateral izquierdo. 

### 3.3 · Cliente de Supabase Auth
**Necesita:** 3.1
**Entrega:** Servicio de Autenticación en Angular.
**Terminado cuando:** El usuario puede iniciar sesión mediante un *Magic Link* o Google a su correo `@est.ucab.edu.ve` y el JWT se inyecta automáticamente en todas las peticiones HTTP al backend (Interceptor).

### 3.4 · Manifiesto y PWA (Offline)
**Necesita:** 3.2
**Entrega:** `manifest.webmanifest` y configuración de Service Worker.
**Terminado cuando:** Al abrir en el navegador, sale la opción de "Instalar App". Si se apaga el Wi-Fi, la app muestra un layout de "Sin conexión" en lugar del dinosaurio de Chrome.

---

## Bloque 4 — Vistas Principales (Consumo de API)

### 4.1 · Landing Page y Modal Legal
**Necesita:** 3.3
**Terminado cuando:** La ruta `/` explica qué es RateMat. Al iniciar sesión por primera vez, un modal exige aceptar los Términos (D-010) con 3 checks obligatorios antes de continuar.

### 4.2 · Home (Buscador Principal)
**Necesita:** 4.1, 2.3
**Terminado cuando:** La barra de búsqueda consume el endpoint `GET /search`. Muestra un feed de reseñas recientes. En escritorio, los resultados de búsqueda se abren en un modal central o panel derecho para no perder el feed.

### 4.3 · Perfil del Profesor (El centro de la app)
**Necesita:** 4.2
**Terminado cuando:** 
- Muestra el promedio global calculado (respetando los `weights`).
- En móvil es un scroll vertical continuo (Info -> Reseñas -> Archivos).
- En escritorio se divide inteligentemente: Izquierda (Info y Promedios), Centro (Muro de Reseñas), Derecha (Hub de PDFs).

### 4.4 · Flujo de Creación de Reseña
**Necesita:** 4.3, 2.4
**Terminado cuando:** El formulario obliga a seleccionar calificación 1-5. Tiene un toggle para "Hacer Anónimo" (D-002). Si el usuario insulta, la UI captura el error 400 del Profanity Filter y muestra el mensaje rojo de rechazo sin limpiar el texto ingresado.

### 4.5 · Interacción Comunitaria (Votar y Reportar)
**Necesita:** 4.4, 2.5, 2.7
**Terminado cuando:** 
- Botones de "Estoy de acuerdo" actualizan su color instantáneamente (Optimistic UI update) y mandan el POST en background.
- Botón de "Reportar" en reseñas y PDFs pide una confirmación simple y envía el reporte.

---

## 🔍 Punto de Revisión B — Testing de Integración UI/UX
Se simula el flujo completo como si fuéramos 3 estudiantes distintos. Se verifica que en el teléfono los botones sean táctiles (≥44px), que las pantallas respondan rápido y que la Bottom Bar no estorbe en los teclados móviles.

---

## Bloque 5 — Producción y Despliegue

### 5.1 · VPS (Base de datos y Backend)
**Necesita:** Revisión B.
**Terminado cuando:** PostgreSQL y NestJS corren en un servidor Linux (ej. Ubuntu vía Docker o PM2). El backend tiene un dominio con HTTPS (Let's Encrypt).

### 5.2 · Vercel / Firebase Hosting (Frontend)
**Necesita:** 5.1
**Terminado cuando:** El proyecto de Angular compila con `ng build` configurando la variable de entorno a la URL del VPS de producción, y se despliega con éxito.

### 5.3 · QA Final en Producción
**Necesita:** 5.2
**Terminado cuando:** Se realiza una prueba de creación de profesor, subir un PDF de 2MB y calificarlo usando datos reales, comprobando que las subidas de archivos en el VPS no rompan por permisos de carpeta.
