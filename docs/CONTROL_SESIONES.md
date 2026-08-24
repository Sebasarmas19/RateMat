# El Ciclo de Sesiones — Control de Traspasos

**Estado:** 🟢 Vigente
**Objetivo:** Evitar la degradación del contexto (alucinaciones) y ahorrar tokens. Cortar la conversación de Antigravity en los momentos exactos garantiza que cada agente trabaje con la mente limpia y enfocada solo en el código que importa.

---

## Dónde se corta el relevo

La unidad de trabajo no es una subtarea suelta, es un **grupo de subtareas que modifican la misma capa arquitectónica**. 

| Sesión | Subtareas a Ejecutar | Esfuerzo | Por qué |
|---|---|---|---|
| **1** | Bloque 1 (Entidades DB) | 🟠 Medio | *(Ya Completada)*. Creación del esquema y conexión a TypeORM. |
| **2** | 2.1 – 2.3 | 🟢 Bajo | Trabajo mecánico. Auth, configuración de Throttler y endpoints CRUD básicos del catálogo. |
| **3** | **2.4 sola** | 🔴 Alto | **"El algoritmo anti-desahogo"**. Aquí vive la lógica matemática de pesos, el filtro de groserías y la unicidad de las reseñas. Un error aquí destruye la credibilidad de la app. |
| **4** | 2.5 – 2.7 | 🟠 Medio | Sistema de votos, subida de archivos (Multer) y reportes legales. |
| **5** | 🔍 **Revisión A** | 🔴 Alto | Sesión exclusiva para revisar y corregir bugs de la API mediante scripts o Swagger antes de tocar el frontend. |
| **6** | 3.1 – 3.4 | 🟢 Bajo | Trabajo mecánico. Scaffold de Angular, Tailwind, PWA y el guard de rutas en el cliente. |
| **7** | 4.1 – 4.2 | 🟠 Medio | Landing page y buscador. Involucra UI y conexión HTTP básica. |
| **8** | **4.3 sola** | 🔴 Alto | **El Perfil del Profesor**. La vista más compleja. Tiene lógica de layout distinta en Móvil (Scroll continuo) y Escritorio (Grid a 3 columnas). Requiere CSS perfecto. |
| **9** | 4.4 – 4.5 | 🔴 Alto | Flujos de escritura en UI (Formularios). Manejo de errores 400 (Profanity) en pantalla y Actualización Optimista (Optimistic UI) para los votos. |
| **10** | 🔍 **Revisión B y Blq. 5** | 🟠 Medio | Pruebas de integración E2E, compilación y despliegue al servidor VPS y Vercel. |

---

## El Esfuerzo (Alto, Medio, Bajo)

El esfuerzo no mide cuántas líneas de código se escribirán, sino **qué tan caro sale equivocarse**.

- **🔴 Alto:** Tareas críticas (Como 2.4 y 4.3). Si se hacen al final de una sesión larga, el Agente arrastrará basura en el contexto, fallará, y corregir el error en 5 mensajes costará miles de tokens. **Van solas en su propia sesión.**
- **🟠 Medio:** Involucran lógica, pero sus errores son ruidosos (se notan de inmediato). Se pueden agrupar en pares.
- **🟢 Bajo:** Tareas mecánicas o repetitivas (Configurar Tailwind, hacer un CRUD sencillo). Si sale mal, el compilador avisa. Agrupar varias ahorra los costos fijos de iniciar una sesión.

---

## Reglas de Cierre

Una sesión **DEBE** cortarse antes de tiempo si:
1. **Ocurren 3 intentos fallidos seguidos.** El contexto ya está sucio. Haz commit de lo que sirva, cierra la sesión y abre una nueva pasándole el error exacto en el Traspaso.
2. **Una subtarea se desborda.** Si implementar la subida de archivos (2.6) requirió instalar 4 librerías inesperadas y modificar 8 archivos, corta la sesión y avisa.

El traspaso es el commit más este documento. Nunca copies todo el historial del chat a la nueva sesión.
