# D-008 — Modelo de Datos y Matemáticas de Calificación

**Estado:** Tomada
**Decide:** Arquitecto y Usuario

## Contexto
Teníamos que definir cómo se calcula la nota del profesor y si el "peso académico" (Unidades de Crédito) de una materia influye en su reputación.

## Decisión y Regla de Negocio
1. **La Reseña va a la Intersección:** Una reseña (Review) nunca se le hace solo al Profesor. Se hace al `Professor_Id` + `Subject_Id`.
2. **Cálculo de Nota Ponderada (El Algoritmo Anti-Desahogo):** 
   - El promedio global no es un promedio simple. El peso de una calificación (1 a 5) depende de la **reputación de esa reseña** otorgada por la comunidad.
   - **Peso Base:** Toda reseña nueva tiene un peso de `1.0`.
   - **Mitigación (Downvotes):** Si una reseña comienza a recibir "No estoy de acuerdo" y su Net Score se vuelve negativo, su peso disminuye matemáticamente (ej. baja a `0.5`, `0.2`).
   - **Anulación:** Si la reseña llega al límite de colapso (ej. `-10` votos), su peso se vuelve `0.0`. Es decir, la reseña se oculta y sus estrellas **ya no afectan** el promedio del profesor.
   - *Por qué:* Esto soluciona de raíz el problema de los alumnos que califican con 1 estrella por desquite personal al reprobar. La comunidad identifica el "berrinche", lo vota negativo, y el sistema automáticamente le quita el poder destructivo a esa calificación falsa.
   - **(Funcionalidad Post-MVP) Caducidad (Time Decay):** En versiones futuras, las reseñas de más de 2 años de antigüedad perderán peso matemático automáticamente, para reflejar la calidad actual del profesor y no su pasado.
3. **Entidades Principales para el Ejecutor:**
   - `User`, `Professor`, `Subject`, `ProfessorSubject`, `Review` (con FK a Professor y Subject), `ReviewTag`, `AcademicFile`.
