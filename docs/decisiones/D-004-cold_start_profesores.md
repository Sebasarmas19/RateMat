# D-004 — Cold Start y Registro de Profesores (Caso UCAB)

**Estado:** Tomada
**Fecha:** 2026-08-22
**Decide:** Arquitecto y Usuario

## Contexto
Al iniciar la app, la base de datos de profesores estará vacía. La universidad objetivo inicial (UCAB) no tiene un directorio global, centralizado y de fácil acceso automatizado. 

## Opciones
1. **Scraping manual:** Entrar escuela por escuela a copiar nombres (Muy lento, difícil de mantener actualizado).
2. **User Generated Content (Libre):** Cualquier estudiante crea a cualquier profesor (Riesgo alto de spam o nombres falsos como "Profesor Batman").
3. **User Generated Content (Moderado):** (Elegida) Los estudiantes proponen a los profesores, pero pasan por un filtro.

## Decisión
Los estudiantes serán los encargados de crear los perfiles de los profesores que falten. Para evitar spam e información falsa:
- **Estado Pendiente:** Cuando un estudiante crea un profesor, este entra en estado "Pendiente de Aprobación".
- **Validación:** Solo los usuarios administradores (o estudiantes con muy alta reputación) podrán aprobar la creación de ese perfil.
- **Campo obligatorio:** Al sugerir un profesor, el estudiante deberá proporcionar el correo institucional del profesor (`@ucab.edu.ve`) o la Escuela a la que pertenece.
- **Actualización Dinámica de Materias:** Si un profesor ya existe pero empezó a dar una materia nueva, cualquier estudiante puede presionar "Añadir nueva materia a este profesor". Esta acción también pasa a estado "Pendiente" para que el administrador la apruebe.

## Por qué
Es la única manera escalable de construir la base de datos sin tener acceso a los sistemas internos de la UCAB, delegando el trabajo a la comunidad pero manteniendo un control de calidad estricto para no "ensuciar" la plataforma.
