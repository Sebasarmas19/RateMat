# D-005 — Eliminación del Hub Académico y Archivos

**Estado:** DESCARTADA / ELIMINADA  
**Fecha de Modificación:** 2026-09-16  
**Decide:** Arquitecto y Usuario  

## Contexto
Originalmente se contempló un "Hub Académico" para permitir a los estudiantes subir y descargar archivos PDF (guías, resúmenes y modelos de parciales pasados). 

Tras una investigación legal exhaustiva sobre la normativa de la Universidad Católica Andrés Bello (UCAB) y la legislación venezolana de derechos de autor y delitos informáticos, se analizó el balance entre valor real vs. riesgo legal y operativo.

## Decisión
**Se elimina completamente el Hub Académico y toda funcionalidad de subida y almacenamiento de archivos del proyecto RateMat.**

RateMat pasa a ser de manera exclusiva un **directorio universitario, buscador de cátedras y sistema de calificación pedagógica de profesores**.

## Justificación Legal y Operativa
1. **Riesgo de Fraude Académico (Art. 5, Num. 1 del Reglamento Disciplinario UCAB):**  
   La difusión, tráfico o publicación no autorizada de evaluaciones oficiales pasadas o en curso tipifica como falta grave en el reglamento universitario. La existencia de un repositorio de archivos expondría a la plataforma y a sus creadores a procesos disciplinarios y bloqueo institucional.
2. **Propiedad Intelectual y Derechos de Autor (Ley sobre el Derecho de Autor):**  
   Previene la subida de libros comerciales pirateados, guías con membrete protegido o material intelectual de profesores sin su consentimiento.
3. **Inviabilidad Operativa de la Moderación:**  
   Revisar manualmente cada archivo subido para verificar marcas de agua, autorías y ausencia de material indebido o malware es técnicamente insostenible y costoso para un equipo estudiantil.
4. **Optimización de Costos y Complejidad Técnica:**  
   Se elimina la necesidad de almacenamiento en la nube (Supabase Storage / AWS S3), manejo de cargas multipart, procesamiento de PDFs y gestión de cuotas de gigabytes.
5. **Foco del Producto:**  
   RateMat se mantiene 100% enfocado en su propuesta de valor nuclear: calificar con honestidad, orientar la toma de materias y encontrar a los mejores docentes de la UCAB.
