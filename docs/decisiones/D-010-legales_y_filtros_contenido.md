# D-010 — Blindaje Legal, Filtros Preventivos y Términos de Servicio

**Estado:** Tomada (Actualizada con Blindaje Legal Definitivo)  
**Fecha de Modificación:** 2026-09-16  
**Decide:** Arquitecto y Usuario  

## Contexto
Debido a que la plataforma maneja contenido generado por usuarios (UGC) sobre docentes y la comunidad universitaria, se requiere una arquitectura legal y técnica que neutralice cualquier riesgo de difamación, acusaciones penales infundadas, conflictos con normativas de la UCAB o reclamos de datos personales.

---

## Soluciones Técnicas Obligatorias de Blindaje

### 1. Filtro Preventivo contra Imputaciones Delictivas (Acoso / Soborno)
* **Riesgo:** Que un estudiante use una reseña pública para imputar delitos penales graves (ej. acoso sexual, cobro de dinero por notas, abusos físicos), lo cual tipifica como difamación penal (Art. 442 Código Penal) y compromete la integridad del canal.
* **Implementación en Backend (`ReviewsService`):**
  * Lista negra de palabras y patrones de imputación delictiva:  
    `['acoso', 'acosador', 'acosó', 'soborno', 'cobró', 'cobro', 'plata por nota', 'dólares para pasar', 'tocó', 'abuso', 'violó', 'extorsión']`.
  * Si la reseña contiene alguna de estas acusaciones, la API rechaza la publicación y devuelve un código específico (`422 Unprocessable Entity`).
* **Respuesta en Frontend:** Se despliega un modal educativo y orientador:  
  > *"⚠️ En RateMat evaluamos exclusivamente el desempeño pedagógico y académico de las cátedras. Si has sido víctima o testigo de acoso, sobornos o faltas graves, debes formalizar tu denuncia a través de los canales institucionales de la UCAB (Protocolo 2.83 de la Comisión Disciplinaria y Defensoría Universitaria). La imputación de delitos en foros públicos constituye difamación legal."*

### 2. Filtro Automático de Groserías e Injurias (Profanity Filter)
* En el backend, el texto de la reseña pasa por un diccionario estricto de vocabulario obsceno y descalificaciones personales locales.
* Si se detecta lenguaje ofensivo, la solicitud se rechaza con error 400 sin borrar el borrador del estudiante para que pueda corregir su redacción.

### 3. Mecanismo de Takedown y Habeas Data Docente (Art. 28 CRBV)
* **Legalidad de los Nombres:** Publicar el nombre profesional del docente y sus materias asignadas es 100% legal (información profesional pública de servicio educativo). Queda terminantemente prohibido publicar datos íntimos (cédula, teléfonos privados, domicilios, redes personales).
* **Canal de Exclusión (Habeas Data):**  
  * La entidad `Professor` en la base de datos incluye el campo `is_active: boolean (default true)`.
  * En el pie de página de la aplicación se incluye el enlace:  
    `"Contacto y Reclamos Docentes"` que apunta a `legal@ratemat.app` o a un formulario de contacto.
  * Si un profesor solicita formalmente no figurar en la plataforma, su perfil se desactiva (`is_active = false`) en un plazo máximo de 48 horas sin confrontación.

### 4. Protección de Marca y Disclaimer de Independencia
* **Prohibición de Simbología Oficial:** RateMat utiliza exclusivamente su identidad gráfica independiente (isotipo índigo 'R'). Queda prohibido el uso del escudo oficial de la UCAB, sus lemas o tipografías registradas.
* **Disclaimer en el Footer (Obligatorio en todas las pantallas):**  
  > *"RateMat es una iniciativa tecnológica independiente desarrollada por estudiantes. No posee vinculación oficial, patrocinio ni aval institucional de la Universidad Católica Andrés Bello (UCAB)."*

### 5. Registro Digital de Términos y Condiciones
* Al iniciar sesión por primera vez, el estudiante debe aceptar obligatoriamente el Onboarding Modal con sus 3 cláusulas de responsabilidad civil e indemnidad.
* En la tabla `users` (PostgreSQL) se almacena:
  * `terms_accepted: boolean (default false)`
  * `terms_accepted_at: timestamp with time zone`
* El backend no permite crear reseñas ni interactuar si el usuario no tiene registrado `terms_accepted: true`.

### 6. Botón de Pánico y Reportes Comunitarios
* Toda reseña cuenta con un botón de reportar tipificado (lenguaje ofensivo, falsedad, spam).
* Si una reseña acumula 3 reportes comunitarios, se oculta automáticamente del público y pasa a la cola del Panel de Moderación de Administradores (D-011).
