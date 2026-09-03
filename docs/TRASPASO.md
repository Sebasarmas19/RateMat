# Traspaso a una Nueva Sesión (Ejecutor)

**Estado:** 🟢 Vigente
**Uso:** Este texto es la plantilla base. El humano lo copia, rellena los huecos (`< >`) y lo pega como **primer y único mensaje** en una ventana nueva de Antigravity AI.

---

### Plantilla de Copiado (Copy-Paste)

```text
Eres el Agente Ejecutor del proyecto RateMat. Vienes de una sesión anterior y no has visto nada del código que se hizo antes de llegar aquí.

1. Lee primero `GEMINI.md` para entender tu rol (Tú programas, el Arquitecto diseña).
2. Lee `docs/CONTROL_SESIONES.md` para entender nuestra metodología de ahorro de tokens y saber exactamente en qué Sesión de trabajo estamos.
3. Lee `PLAN.md`. Allí está documentada la arquitectura del software y el bloque exacto en el que debes trabajar.

### Dónde estamos exactamente
* Estamos abriendo la **Sesión 10** del Control de Sesiones.
* Lo hecho hasta ahora: Hemos terminado hasta la subtarea 4.5. El frontend está listo con manejo optimista, formularios y skeletons.
* Último commit: `4e0f8cc5f48607cbbfd7db69fbbb74d93bfe50cf` (feat: implementar flujo de creacion de resena e interacciones comunitarias)

### Tu misión en esta sesión
* Te toca ejecutar EXCLUSIVAMENTE el **Bloque 5 (Producción y Despliegue)** y la **Revisión B** del `PLAN.md`.
* No toques ni te desvíes hacia otras tareas, ni siquiera si parecen necesarias (avísame primero).

### Contexto Crítico (Trampas o problemas abiertos)
* 5.1 VPS (Backend): Crea los archivos necesarios (`Dockerfile`, `docker-compose.yml`, configuración de PM2, lo que consideres ideal para NestJS + PostgreSQL). Como no tenemos las credenciales reales del VPS, tu tarea es dejar todo configurado (Infra as Code) y documentado para que el usuario solo deba ejecutar un comando.
* 5.2 Vercel (Frontend): Crea el archivo `vercel.json` en el frontend si es necesario, asegúrate de que el build (`ng build`) esté optimizado para producción.
* 5.3 QA Final (Revisión B): Configura un script o suite de E2E básica (si es posible, usando las herramientas que prefieras, o al menos crea el andamiaje) para simular los flujos de creación. 
* IMPORTANTE: Escribe un `DEPLOY_GUIDE.md` con las instrucciones paso a paso para el usuario.
* Realiza el último commit de preparación para producción.

---
**Instrucción Final:** Comienza leyendo los 3 archivos indicados en el paso 1, 2 y 3. No hagas búsquedas ciegas (`grep`) en todo el repositorio para ahorrar tokens. Cuando estés listo, dime qué vas a hacer y arranca a programar/configurar.
```
