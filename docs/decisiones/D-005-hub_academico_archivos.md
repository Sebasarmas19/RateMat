# D-005 — Hub Académico y Subida de Archivos

**Estado:** Tomada
**Fecha:** 2026-08-22
**Decide:** Arquitecto y Usuario

## Contexto
La funcionalidad de subir archivos (apuntes, modelos de parciales) agrega un valor gigantesco a la plataforma, pero conlleva riesgos de costos de almacenamiento en la nube y posibles problemas legales por derechos de autor.

## Decisión
Se implementará el módulo de subida de archivos, pero con **restricciones estrictas** para mitigar costos y riesgos en el MVP:
1. **Límite de tamaño:** Máximo 5MB o 10MB por archivo. (Suficiente para un PDF de un resumen, pero bloquea libros pesados).
2. **Formato:** Solo se permitirán documentos (`.pdf`).
3. **Moderación Legal:** Cada archivo tendrá un botón visible de "Reportar por Copyright o Spam" para que la comunidad denuncie material indebido y podamos eliminarlo rápidamente, protegiéndonos legalmente.

## Por qué
El beneficio en adopción (tráfico de estudiantes buscando resúmenes) supera el costo de almacenamiento si se imponen límites de tamaño estrictos desde el primer día. Archivos de texto/PDF pequeños son muy baratos de almacenar en servicios como AWS S3 o Firebase Storage.
