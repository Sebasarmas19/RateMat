# D-011 — Rol de Administrador y Panel de Moderación

**Estado:** Tomada  
**Fecha:** 2026-09-13  
**Decide:** Arquitecto y Usuario  

## Contexto
En D-004 y D-010 se definieron dos flujos que requieren intervención humana para proteger la plataforma del spam, información falsa y difamación:
1. **Cold Start de Profesores (D-004):** Cuando un estudiante sugiere a un profesor no registrado o propone que un profesor dicta una materia nueva, la solicitud entra en estado `PENDING`.
2. **Sistema de Reportes y Pánico (D-010):** Cuando una reseña o archivo PDF recibe 3 reportes distintos de la comunidad, se oculta automáticamente del público y pasa a una cola de revisión.

Para mantener la autonomía estudiantil y descentralizar el mantenimiento de RateMat, se introduce formalmente el **Rol de Administrador Estudiantil**.

---

## Decisiones y Reglas de Negocio

### 1. Modelo de Roles de Usuario
- **`student` (Estudiante Regular):**
  - Puede buscar, consultar pensums, ver perfiles, subir reseñas, votar útil 👍/👎, subir PDFs y reportar contenido indebido.
  - Puede **sugerir nuevos profesores** y **proponer nuevas cátedras** para profesores existentes.
- **`admin` (Estudiante Moderador / Administrador):**
  - Posee todas las capacidades de un estudiante regular.
  - Tiene acceso a la pestaña/panel exclusivo **"Panel de Moderación"** en su perfil o navegación.
  - Es designado inicialmente por los creadores de RateMat o promovido por alcanzar el rango más alto de reputación comunitaria (Nivel 3 / Mentor UCAB con alta confiabilidad).

### 2. Funcionalidades del Administrador
El panel de moderación gestiona dos colas operativas:

#### A. Cola de Profesores y Materias Pendientes (Cold Start D-004)
* **Información que visualiza el admin:**
  - Nombre y Apellido sugerido del profesor.
  - Correo institucional (`@ucab.edu.ve`) o Escuela a la que pertenece.
  - Cátedra inicial que dicta.
  - Estudiante que realizó la sugerencia.
* **Acciones del admin:**
  - ✅ **Aprobar:** El profesor pasa a estado `ACTIVE` y se publica inmediatamente en el buscador y catálogo de la carrera.
  - ❌ **Rechazar:** La sugerencia se descarta (con opción de indicar motivo: "Datos incorrectos / No pertenece a la UCAB").

#### B. Cola de Contenido Reportado (Reseñas y Archivos D-010)
* **Información que visualiza el admin:**
  - Reseña o archivo PDF que alcanzó el umbral de 3 reportes comunitarios.
  - Motivos de denuncia registrados (Lenguaje inapropiado, difamación, datos falsos, violación de derechos de autor).
* **Acciones del admin:**
  - 🗑️ **Eliminar Definitivamente:** Borrado permanente del contenido por violar las normas de la comunidad.
  - 🔄 **Desestimar Reportes / Restaurar:** Si el contenido es legítimo y las denuncias fueron un boicot infundado, se limpian los reportes y vuelve a ser visible públicamente.

---

## Consideraciones de UX/UI
* Los estudiantes regulares no ven botones de administración que ensucien su interfaz. Solo ven los disparadores claros:
  * Botón `+ Sugerir Profesor` (en `/search` cuando no hay resultados o en el modal de materia vacía).
  * Botón `+ Sugerir Materia` (en `/professor/:id`).
  * Botón `Reportar 🚩` en cada tarjeta de reseña y archivo académico.
* Los usuarios con rol `admin` ven un acceso directo a su **Panel de Moderación** con contadores de solicitudes pendientes.
