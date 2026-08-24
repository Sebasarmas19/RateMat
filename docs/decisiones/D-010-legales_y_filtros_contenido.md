# D-010 — Riesgos Legales y Filtros de Contenido

**Estado:** Tomada
**Decide:** Arquitecto y Usuario

## Contexto
Debido a que la plataforma maneja contenido generado por usuarios (UGC) sobre figuras de autoridad (profesores) y material académico, existen riesgos de difamación y derechos de autor. 

## Análisis de Riesgos Legales
1. **Difamación e Injurias (El mayor riesgo):** Si un estudiante usa la plataforma para insultar gravemente a un profesor o acusarlo de un delito (ej. acoso, sobornos), el profesor podría intentar acciones legales o pedir a la universidad que intervenga. 
2. **Derechos de Autor (Copyright):** En el Hub Académico, los estudiantes podrían subir libros enteros piratas o material con copyright de la universidad.
3. **Normativas Internas de la UCAB:** Si la app facilita hacer trampa masiva o "ciberacoso", la universidad podría bloquear el dominio en su red Wi-Fi o iniciar procesos disciplinarios.

## Soluciones Técnicas Obligatorias (Mitigación de Riesgos)

Para protegernos legalmente, el Ejecutor deberá implementar lo siguiente:

1. **Filtro Automático de Groserías (Profanity Filter):**
   - En el Backend, la API de crear reseñas debe pasar el texto por una librería de filtrado de palabras malsonantes (ej. `bad-words` adaptada al español/jerga local). 
   - Si detecta un insulto, la petición se rechaza con un mensaje: *"Tu reseña contiene lenguaje inapropiado y viola las normas de la comunidad"*.

2. **Botón de Pánico (Sistema de Reportes):**
   - Toda reseña y todo archivo PDF debe tener un botón de "Reportar".
   - **Regla de Ocultamiento Automático:** Si una reseña (o archivo) recibe **3 reportes distintos**, se oculta automáticamente del público y pasa al panel del Administrador para su revisión manual. Esto nos exime de responsabilidad por inacción.

3. **Términos y Condiciones (El Onboarding Modal):**
   - Para no arruinar la experiencia de usuario (UX) llenando las pantallas de advertencias, todos los textos legales se mostrarán **una sola vez** cuando el estudiante inicie sesión por primera vez. 
   - Deberán aceptar un manifiesto que incluya los tres textos clave:
     1. *"Soy el único responsable de mis comentarios. Acepto no usar lenguaje difamatorio ni insultos."*
     2. *"Todo archivo subido queda registrado con mi correo institucional. Subir material inapropiado (desnudos, burlas) resultará en la eliminación permanente de mi cuenta."*
     3. *"Solo subiré resúmenes propios, guías públicas o exámenes pasados. No subiré libros comerciales o presentaciones privadas del profesor."*

4. **Control del Hub Académico (Filtro de Archivos):**
   - **Técnico:** Restricción estricta en el Backend: solo se aceptan archivos tipo `application/pdf` (nada de imágenes JPG/PNG sueltas).
   - **Límite de tamaño:** El límite de 10MB corta de raíz el 90% de los problemas de Copyright (libros completos de editoriales pesan mucho más).
   - **UX de Subida:** En la pantalla de subir PDF, solo habrá un texto gris muy pequeño y sutil debajo del botón que diga *"Al subir, confirmas que cumples con las Políticas Comunitarias"*. Cero fricción visual.
