# D-006 — Stack Tecnológico Definitivo

**Estado:** Tomada
**Decide:** Arquitecto y Usuario

## Decisiones
1. **Frontend:** Angular + TailwindCSS + Signals.
2. **Backend:** NestJS.
3. **ORM (Manejo de Base de Datos):** TypeORM. 
   - *Por qué:* Se descartó Prisma debido a posibles cuellos de botella en consultas complejas a futuro. TypeORM es el estándar nativo de NestJS y altamente eficiente.
4. **Base de Datos:** PostgreSQL (Alojado en el VPS).
5. **Autenticación:** Supabase Auth.
   - *Por qué:* Delegamos la validación de correos (`@est.ucab.edu.ve`) y el envío de tokens (OTP/Links) a un servicio de nivel empresarial, garantizando que no existan cuentas falsas ni vulnerabilidades en el manejo de contraseñas.
6. **Almacenamiento de Archivos (PDFs):** Disco local del VPS (Temporalmente en Fase 1 para reducir costos).
