# D-002 — Privacidad, Gamificación y Filtro de Usuarios

**Estado:** Tomada
**Fecha:** 2026-08-22
**Decide:** Arquitecto y Usuario

## Contexto
El objetivo principal de RateMat es que los estudiantes puedan dejar reseñas honestas sin miedo a represalias por parte de los profesores. Sin embargo, un sistema 100% anónimo pierde *engagement* y no recompensa a los buenos aportadores. Además, debíamos definir cómo evitar que los profesores entren a la plataforma.

## Opciones

### Control de Acceso (Profesores)
1. **Mismo dominio de correo:** Obligaba a depender del anonimato, ya que cualquier profesor podía entrar.
2. **Dominio de correo distinto:** (Elegida) El usuario confirmó que la universidad usa correos diferentes para estudiantes y profesores.

### Modelo de Publicación
1. **100% Anónimo:** Seguro, pero aburrido. No hay incentivos para aportar calidad.
2. **100% Público:** Mucho engagement, pero alto riesgo de que los alumnos no evalúen honestamente por miedo.
3. **Híbrido Gamificado:** (Elegida) Los estudiantes tienen un perfil público con reputación, pero pueden elegir publicar de forma anónima en casos sensibles.

## Decisión
Se implementará el modelo **Híbrido Gamificado**. El acceso a la plataforma estará **estrictamente filtrado mediante validación del dominio del correo institucional**, permitiendo solo el dominio de los estudiantes.

Al escribir una reseña, el estudiante tendrá un switch:
- **Público:** Gana puntos de reputación y muestra su perfil.
- **Anónimo:** No suma reputación, pero protege su identidad.

## Por qué
Aprovechamos la ventaja técnica de los dominios separados para blindar la app contra profesores. El modelo híbrido balancea perfectamente la necesidad de contenido seguro con la necesidad psicológica de reconocimiento (gamificación) que mantiene vivas este tipo de plataformas.

## Consecuencias
- **Fácil:** El control de acceso. Solo es un `if (email.endsWith('@alumnos...'))`.
- **Difícil:** Hay que modelar la base de datos para que una reseña anónima siga vinculada al usuario (para que no pueda votar 2 veces o para moderación interna), pero que la API nunca exponga sus datos al frontend.
