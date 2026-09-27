# Guía de Despliegue - RateMat (Producción)

Esta guía detalla los pasos para desplegar el proyecto RateMat en producción, compuesto por un servidor backend (NestJS + PostgreSQL) alojado en un VPS y un frontend (Angular PWA) desplegado en Vercel.

## 1. Backend en VPS (Docker)

El backend utiliza Docker y Docker Compose para facilitar el despliegue de la API y la Base de Datos PostgreSQL.

### 1.1 Preparación del Servidor
1. Conéctate por SSH a tu VPS (Ubuntu/Debian recomendado).
2. Instala Docker y Docker Compose en el servidor.
3. Clona el repositorio del proyecto y navega hasta la carpeta `backend`.

### 1.2 Variables de Entorno
Crea un archivo `.env` en la raíz de la carpeta `backend` dentro de tu VPS con el siguiente contenido:

```env
NODE_ENV=production
DB_USERNAME=postgres
DB_PASSWORD=una_contrasena_segura_para_db
DB_DATABASE=ratemat
SUPABASE_URL=tu_supabase_project_url
SUPABASE_JWT_SECRET=tu_supabase_jwt_secret
```

### 1.3 Levantar la Infraestructura
Estando dentro de la carpeta `backend`, ejecuta:

```bash
docker-compose up -d --build
```
Esto compilará la API y arrancará:
- Un contenedor PostgreSQL llamado `ratemat-db`
- Un contenedor NestJS llamado `ratemat-api` expuesto en el puerto 3000.

> [!WARNING]
> Asegúrate de configurar un Proxy Inverso (Nginx o Caddy) en el VPS para exponer el puerto 3000 al exterior con un certificado SSL (HTTPS Let's Encrypt). El frontend requiere que la API funcione bajo HTTPS (contexto seguro).
> Vigila los permisos de almacenamiento si guardas los PDFs localmente; si falla la subida de archivos de 2MB, revisa que el contenedor Docker tenga permisos de escritura en la carpeta de subidas.

## 2. Frontend en Vercel

### 2.1 Preparación
1. Ve al panel de Vercel y selecciona "Add New -> Project".
2. Importa tu repositorio Git de RateMat.

### 2.2 Configuración del Proyecto en Vercel
- **Framework Preset**: Angular.
- **Root Directory**: `frontend`.
- **Build Command**: `npm run build` (Por defecto. Toma en cuenta que `vercel.json` ya enruta correctamente la salida hacia `dist/frontend/browser`).

### 2.3 Variables de Entorno (Vercel)
En la configuración de Vercel (Sección Environment Variables), añade la URL pública de tu VPS (con HTTPS) para que el frontend apunte a la API de producción.
Por ejemplo:
- `API_URL`: `https://api.tu-dominio.com`
- Claves públicas de Supabase para la autenticación cliente.

Luego, haz clic en **Deploy**.

## 3. QA Final en Producción (Revisión B)

Una vez desplegados Frontend y Backend, realiza el siguiente flujo de pruebas para certificar la plataforma en vivo:

1. **Simulación de 3 Estudiantes**: Crea o inicia sesión con 3 cuentas distintas (preferiblemente correos `@est.ucab.edu.ve` si está restringido). 
2. **Alta de Profesor**: Entra al buscador y añade un Profesor Nuevo. Revisa en la base de datos o API que el profesor se haya guardado con estado `PENDING`.
3. **Carga y Persistencia de Archivos**: Selecciona un perfil de profesor existente y sube un archivo `.pdf` de aproximadamente 2MB. Si el backend da error 500, revisa los permisos de volumen en Docker. El archivo debe mostrarse en la pestaña "Archivos".
4. **Filtro Anti-Desahogo**: Intenta escribir una reseña llena de insultos. La UI de Vercel debe capturar el error `400 Bad Request` devuelto por el VPS y mostrar la alerta roja sin vaciar la caja de texto. 
5. **Reportes Concurrentes**: Inicia sesión con las 3 cuentas y haz que reporten el mismo PDF. Tras el 3er reporte, refresca la página: el PDF debe estar en estado `HIDDEN` y ya no debería aparecer en la UI.
6. **Mobile-First UX**: Entra a Vercel desde tu teléfono celular. Instala la PWA mediante "Agregar a la pantalla de inicio". Entra a escribir una reseña y verifica que el teclado táctil de Android/iOS no tape los botones principales ni desajuste la *Bottom Navigation Bar*.
