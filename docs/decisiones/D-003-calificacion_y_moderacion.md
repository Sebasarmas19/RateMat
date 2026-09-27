# D-003 — Sistema de Calificación y Moderación

**Estado:** Tomada
**Fecha:** 2026-08-22
**Decide:** Arquitecto y Usuario

## Contexto
Teníamos que definir qué parámetros evaluaría un estudiante al dejar una reseña y cómo se ordenaría y moderaría este contenido para asegurar la calidad.

## Decisión
1. **Calificación:** Se usará un enfoque estructurado pero de baja fricción:
   - Calificación general de 1 a 5 estrellas (Obligatorio).
   - "Etiquetas Rápidas" / Tags opcionales (ej: #MuchaLectura, #ExámenesDifíciles).
   - Campo de texto libre para la opinión general (**Opcional en puntuaciones 2, 3 y 4. Obligatorio si la puntuación es 1 o 5**). Esto previene que trolls pongan 1 estrella sin justificación, obligándolos a escribir para que la comunidad pueda votar en su contra si es falso.
2. **Moderación Condicionada:** Los botones de "Estoy de acuerdo / No estoy de acuerdo" **solo aparecerán en las reseñas que tengan texto**. 
   - *Por qué:* Si un estudiante solo deja 4 estrellas (sin texto), no hay ningún argumento subjetivo con el cual debatir o estar en desacuerdo. Es simple data estadística. Solo las opiniones escritas requieren moderación comunitaria.
3. **Ordenamiento:** Las reseñas con texto se ordenarán por el "Net Score". Las reseñas sin texto simplemente sumarán al promedio matemático.
4. **Colapso por baja reputación:** Si una reseña *con texto* alcanza un límite de votos negativos (`netScore <= -3`), se ocultará visualmente con un botón para expandirla y su peso matemático bajará a `0.00` si llega a `-5`.
5. **Paginación Incremental del Feed:** Para evitar la degradación de rendimiento y el consumo excesivo de memoria en móviles, el feed comunitario utiliza paginación por demanda (`/api/reviews/recent?page=X&limit=Y`), entregando lotes de 10 opiniones con animaciones fluidas GSAP stagger y botón ergonómico *"Cargar más opiniones"*.

## Reglas de Unicidad (Anti-Spam)
- **1 Alumno = 1 Reseña:** Un estudiante solo puede tener UNA reseña activa por cada `ProfessorSubject` (Profesor + Materia). Si cambia de opinión o quiere añadir más texto a lo largo del semestre, debe **EDITAR** su reseña existente. No puede crear varias reseñas distintas para la misma materia, ya que eso distorsionaría el promedio.
- **1 Alumno = 1 Voto Comunitario:** En la moderación, un estudiante solo puede tener UN voto (De acuerdo/En desacuerdo) por reseña. Si se equivoca o cambia de opinión, al volver a votar el sistema **ACTUALIZARÁ** su voto anterior, no sumará uno nuevo.

## Por qué
Este sistema minimiza la fricción para que el usuario deje una reseña (es rápido), pero las etiquetas nos permiten tener data estructurada. El ordenamiento y colapso por Net Score hace que la comunidad se automodere, escondiendo a los "trolls" sin necesidad de que un administrador lea cada comentario.
