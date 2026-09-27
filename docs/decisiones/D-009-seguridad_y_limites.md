# D-009 — Seguridad de API y Prevención de Abusos

**Estado:** Tomada
**Decide:** Arquitecto y Usuario

## Contexto
El público inicial de la plataforma incluye estudiantes de Ingeniería Informática. Es altamente probable que intenten "probar" la seguridad del sistema escribiendo scripts para hacer solicitudes masivas (Spam de peticiones, inyecciones de datos o ataques DoS básicos).

## Decisiones y Reglas de Implementación

Para el Ejecutor (Programador en NestJS), es **OBLIGATORIO** implementar las siguientes capas de seguridad:

1. **Global Rate Limiting (Protección contra DoS):**
   - Implementar `@nestjs/throttler` de forma global.
   - Límite estricto por IP (Ej: máximo 100 peticiones por minuto). Si un bot supera esto, el servidor devuelve error `429 Too Many Requests`.

2. **Límites de Negocio por Usuario (Quotas):**
   - **Creación de Profesores/Materias:** Un usuario autenticado solo puede hacer un máximo de **3 sugerencias al día**.
   - **Creación de Reseñas:** Un usuario autenticado solo puede publicar un máximo de **10 reseñas al día**.
   - **Reportes Comunitarios:** Un usuario autenticado solo puede emitir un máximo de **5 reportes al día** (`DailyLimitGuard(Report, 5, 'user')`), operando bajo fallo cerrado (*fail-closed* si no hay autenticación).
   - *Por qué:* Previene el spam de denuncias coordinadas y ataques de denegación de servicio lógico a la moderación.

3. **Validación Estricta de Datos (Protección contra Inyecciones):**
   - Uso global de `ValidationPipe` con `class-validator` y `class-transformer`.
   - **Prohibido el paso de parámetros no definidos:** (`whitelist: true`, `forbidNonWhitelisted: true`).
   - Todos los campos de texto deben tener límites de longitud: `@MaxLength(1000)` en reseñas y `@MaxLength(300)` en motivos de reporte. Ningún bot podrá enviar payloads desmedidos para saturar la memoria o base de datos.

4. **Seguridad de Cabeceras y Red:**
   - Uso de `helmet` para protección contra XSS y configuración estricta de CORS (restringido a dominios oficiales y localhost/LAN autorizados).
   - Verificación estricta de dominios institucionales en JWT Strategy (`@est.ucab.edu.ve` y `@ucab.edu.ve`).

5. **Privacidad de Respuestas API (Zero-Leakage D-002):**
   - **Reseñas Anónimas:** Supresión total del objeto `user` (`user: null`) en el serializador de la API para impedir la fuga de correos o UUIDs en el tráfico de red.
   - **Reseñas Públicas:** Exposición exclusiva de `name` y `reputation`, omitiendo correos institucionales e identificadores internos.

6. **Control de Acceso Basado en Roles (RBAC & D-011):**
   - Protección estricta de la ruta `/admin` en Angular mediante `adminGuard`.
   - Ocultamiento de componentes y botones de moderación administrativa para usuarios con rol de estudiante.
