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
* Estamos abriendo la **Sesión <N>** del Control de Sesiones.
* Lo hecho hasta ahora: Hemos terminado hasta la subtarea <X.X>. Todo el código anterior funciona y está commiteado en Git.
* Último commit: `<hash o mensaje del último commit>`

### Tu misión en esta sesión
* Te toca ejecutar EXCLUSIVAMENTE las subtareas: **<X.Y a X.Z>** del `PLAN.md`.
* No toques ni te desvíes hacia otras tareas, ni siquiera si parecen necesarias (avísame primero).

### Contexto Crítico (Trampas o problemas abiertos)
* <Escribe aquí si la sesión anterior dejó un bug extraño, si falta una credencial, o algo específico que el Agente deba saber para no tropezar con la misma piedra>.

---
**Instrucción Final:** Comienza leyendo los 3 archivos indicados en el paso 1, 2 y 3. No hagas búsquedas ciegas (`grep`) en todo el repositorio para ahorrar tokens. Cuando estés listo, dime qué vas a hacer y arranca a programar.
```
