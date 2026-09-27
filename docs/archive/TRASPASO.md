# Traspaso de Contexto — Hacia la Sesión 7

**Estado del Proyecto (Fin Sesión 6):**
- **Bloque 3 COMPLETADO:** El "Cascarón del Frontend" está terminado.
- **UI/UX y Layout:** Se construyó el `LayoutComponent` *mobile-first* (Bottom Bar en móvil, Sidebar en escritorio) respetando al 100% las directivas de `impeccable` y `ui-ux-pro-max` (fondos suaves, sombras delicadas, sin colores negros puros).
- **SVGs Dinámicos:** Se extrajeron los íconos limpios (`home`, `search`, `user`) de *Reicon* (servidor MCP).
- **Autenticación (Supabase):** 
  - Se instaló `@supabase/supabase-js`.
  - Se configuró el `AuthService` (utilizando Angular Signals).
  - Se implementaron los archivos de entorno (esperando variables reales).
  - Se crearon el `authGuard` funcional (para proteger `/profile` y la creación de reseñas) y el `authInterceptor` para enviar el Bearer Token en peticiones HTTP.
- **PWA Lista:** El proyecto de Angular se ha transformado oficialmente en una *Progressive Web App* con `ng add @angular/pwa`, permitiendo caché local, estado *Offline* e instalación nativa (`manifest.webmanifest`).

**Tu Misión (Sesión 7):**
Esta sesión iniciará el **Bloque 4 — Vistas Principales (Consumo de API)**.
1. **4.1 Landing Page y Modal Legal:** Presentar qué es RateMat y asegurar que, tras el primer inicio de sesión, los usuarios firmen los términos y condiciones.
2. **4.2 Home (Buscador Principal):** Conectar la barra de búsqueda con el backend NestJS (GET `/search`) y mostrar el feed de reseñas recientes.
3. **4.3 Perfil del Profesor:** Diseñar el muro con lógica dividida según dispositivo (scroll continuo móvil vs. paneles escritorio) conectándolo con el cálculo de `weights` que diseñamos en backend.

**Reglas Operativas (Recordatorio para el Ejecutor):**
- Antes de comenzar, lee los detalles de los endpoints en Swagger o en `docs/`.
- Aplica SIEMPRE los principios de `superpowers` (piensa en casos extremos como fallos de red al consultar el API).
- Recuerda que todo componente nuevo debe mantener el nivel de pulido de `ui-ux-pro-max`.
