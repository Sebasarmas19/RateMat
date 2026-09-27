# RateMat 🎓

> **Plataforma Estudiantil de Calificación Docente, Pensums y Descubrimiento de Cátedras**  
> *Una iniciativa tecnológica independiente desarrollada por y para estudiantes de la Universidad Católica Andrés Bello (UCAB).*

---

![Angular](https://img.shields.io/badge/Frontend-Angular%2018-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![NestJS](https://img.shields.io/badge/Backend-NestJS%2010-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2015-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Styles-TailwindCSS%203-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/Platform-PWA%20Mobile--First-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

---

## 📖 Acerca de RateMat

**RateMat** transforma la experiencia de inscripción universitaria resolviendo la pregunta más crítica de cada semestre:  
*«Voy a cursar esta materia... ¿quién la dicta y cuál es el mejor docente para mi estilo de aprendizaje?»*

A diferencia de foros genéricos, RateMat orienta la evaluación **exclusivamente a la intersección Materia ↔ Profesor**, eliminando calificaciones en el vacío y garantizando un ecosistema pedagógico limpio, constructivo y libre de spam.

---

## ✨ Características Principales

### 🔍 1. Explorador de Carreras y Pensums
- **Catálogo Académico:** Navegación por facultades y escuelas con pensums organizados por semestres y unidades de crédito.
- **Búsqueda Omni Universal:** Búsqueda en tiempo real con selector dual *[ Materias ]* y *[ Profesores ]*.
- **Cold-Start Comunitario ([D-004](docs/decisiones/D-004-cold_start_profesores.md)):** Flujo integrado para que los estudiantes sugieran nuevos docentes o cátedras recién incorporadas.

### ⚖️ 2. Algoritmo Anti-Desahogo y Promedios Limpios ([D-008](docs/decisiones/D-008-modelo_datos_calificacion.md))
- **Promedio Ponderado por Reputación:** Las opiniones poseen un peso matemático (`weight`) que se calibra según los votos útiles de la comunidad.
- **Neutralización de Reseñas Tóxicas:** Si una opinión recibe votos negativos masivos (`netScore <= -5`), su peso baja a `0.00` y **deja de afectar el promedio del profesor**.
- **Justificación Obligatoria:** Las calificaciones extremas (1★ y 5★) exigen opinión escrita obligatoria, impidiendo el sabotaje silencioso con 1 estrella.
- **Unicidad Fuerte Anti-Spam:** Restricción a nivel de base de datos que garantiza **1 alumno = 1 reseña por cátedra** y **1 alumno = 1 voto por reseña**.

### 🛡️ 3. Blindaje Legal Activo y Protocolo 2.83 ([D-010](docs/decisiones/D-010-legales_y_filtros_contenido.md))
- **Filtro Anti-Imputación Delictiva:** Detección preventiva de términos de acusación penal (acoso, soborno, extorsión), bloqueando el envío con **HTTP 422** y orientando formalmente hacia el **Protocolo 2.83 de la Comisión Disciplinaria de la UCAB**.
- **Canal de Habeas Data Docente:** Derecho de información y exclusión en <48 horas para cualquier docente titular o contratado vía `legal@ratemat.app` (Arts. 28 y 60 CRBV).
- **Botón de Pánico Automático:** Si una reseña acumula 3 denuncias comunitarias, el sistema la oculta de inmediato de la vista pública.
- **Cero Archivos ([D-005](docs/decisiones/D-005-hub_academico_archivos.md)):** Supresión total de PDFs y exámenes pasados para erradicar cualquier riesgo de fraude académico y derechos de autor.

### 🔒 4. Privacidad Híbrida Zero-Leakage ([D-002](docs/decisiones/D-002-privacidad_gamificacion.md))
- **Anonimato en Red Garantizado:** En las reseñas anónimas, el backend entrega `user: null`, impidiendo la desanonimización por inspección de tráfico de red.
- **Acceso Institucional:** Autenticación mediante Google Workspace OAuth restringida a correos `@est.ucab.edu.ve` y `@ucab.edu.ve`.

### 📱 5. Experiencia Mobile-First (PWA)
- **Diseño Nativo:** Barra de navegación flotante inferior en teléfonos y Sidebar lateral en pantallas de escritorio.
- **Micro-interacciones Fluidas:** Animaciones GSAP ScrollTrigger en la Landing Page y físicas de resorte con **Morphicons** en botones interactivos.
- **Iconografía Vectorial:** 100% iconos oficiales de la biblioteca `reicon` (cero emojis en la interfaz).

---

## 🏛️ Arquitectura del Repositorio

```text
RateMat/
├── backend/                  # API RESTful en NestJS 10 & TypeORM
│   ├── src/
│   │   ├── auth/             # Supabase Auth, JWT Strategy y DailyLimitGuard
│   │   ├── database/seeds/   # Seeder maestro con carreras y docentes de la UCAB
│   │   ├── professors/       # Módulo de profesores y cálculo de notas ponderadas
│   │   ├── reviews/          # Reseñas, votos útiles y filtro de contenido
│   │   ├── reports/          # Sistema de denuncias y botón de pánico
│   │   └── subjects/         # Catálogo de materias y cátedras
│   ├── Dockerfile            # Contenedor multi-stage optimizado
│   └── docker-compose.yml    # Orquestación de API + PostgreSQL
│
├── frontend/                 # Single Page Application en Angular 18
│   ├── src/app/
│   │   ├── core/             # Layout (Sidebar / Bottom Nav), Auth y ApiService
│   │   ├── features/         # Landing, Login, Home (Feed), Search, Profile, Admin
│   │   └── shared/           # Modal legal de onboarding y componentes Morphicons
│   ├── vercel.json           # Configuración de rewrites SPA para Vercel
│   └── ngsw-config.json      # Configuración de Service Worker y PWA
│
├── docs/                     # Documentación arquitectónica viva
│   ├── decisiones/           # Architecture Decision Records (D-001 a D-011)
│   ├── DEPLOY_GUIDE.md       # Manual técnico para despliegue en VPS y Vercel
│   ├── 01_estado_del_proyecto.md
│   ├── 02_bitacora.md
│   └── archive/              # Historial de reportes y prompts de desarrollo
│
├── CLAUDE.md                 # Guía y restricciones para Claude Code
├── GEMINI.md                 # Directivas del sistema para Antigravity
└── README.md                 # Portada principal del proyecto
```

---

## 🚀 Puesta en Marcha Local

### Prerrequisitos
- **Node.js** >= 20.x
- **PostgreSQL** >= 15.x
- **Git**

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Sebasarmas19/RateMat.git
cd RateMat
```

### 2. Configurar y Levantar el Backend
```bash
cd backend
npm install

# Configurar variables de entorno (o usar valores por defecto para desarrollo local)
# Crear base de datos PostgreSQL llamada 'ratemat'

# Ejecutar el Seeder Maestro con materias y docentes reales:
npm run seed

# Iniciar servidor de desarrollo:
npm run start:dev
```
> La API estará disponible en `http://localhost:3001` y la documentación interactiva Swagger en `http://localhost:3001/api/docs`.

### 3. Configurar y Levantar el Frontend
```bash
cd ../frontend
npm install

# Iniciar la PWA en desarrollo:
npm start
```
> Abre tu navegador en `http://localhost:4200`.

---

## 🧪 Pruebas y Calidad (QA)
El proyecto cuenta con suites automatizadas de extremo a extremo (E2E) con Puppeteer:
- **Suite Funcional:** 30/30 pruebas superadas (100% cobertura de flujos críticos).
- **Suite de Seguridad (AppSec & WebSec):** 9/9 pruebas superadas (privacidad anónima, RBAC, límites de uso y Protocolo 2.83).

---

## ⚖️ Deslinde de Responsabilidad Legal
RateMat es una iniciativa tecnológica independiente desarrollada por estudiantes con fines informativos y pedagógicos. **No posee vinculación oficial, patrocinio, supervisión ni aval institucional de la Universidad Católica Andrés Bello (UCAB).**

Canal formal de atención a docentes y solicitudes de Habeas Data: [legal@ratemat.app](mailto:legal@ratemat.app).
