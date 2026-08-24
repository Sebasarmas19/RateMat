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
   - *Por qué:* Incluso si un estudiante usa retardos en su script para evitar el bloqueo por IP, su cuenta quedará bloqueada de hacer acciones de escritura al llegar a su cuota diaria.

3. **Validación Estricta de Datos (Protección contra Inyecciones):**
   - Uso global de `ValidationPipe` con `class-validator` y `class-transformer`.
   - **Prohibido el paso de parámetros no definidos:** (`whitelist: true`, `forbidNonWhitelisted: true`).
   - Todos los campos de texto deben tener límites de longitud (`@MaxLength`). Ningún bot podrá enviar 1GB de texto en un campo de reseña para tumbar la base de datos.

4. **Seguridad de Cabeceras:**
   - Uso de `helmet` para protección contra XSS y configuración estricta de CORS (solo permitir peticiones desde el dominio en producción de la PWA).
