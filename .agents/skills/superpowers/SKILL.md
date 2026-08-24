---
name: superpowers
description: Planifica y depura mentalmente antes de escribir. Obliga al agente a pensar en casos extremos, arquitectura y dependencias antes de emitir código fuente.
---

# Skill: Superpowers (Planificación y Depuración)

Esta skill está diseñada para evitar que el agente escriba código de forma precipitada ("Vibe-coding"). 

## Reglas de Operación
1. **Piensa antes de actuar:** Antes de modificar un archivo, debes emitir un bloque de pensamiento detallando QUÉ vas a cambiar y POR QUÉ.
2. **Casos Extremos (Edge Cases):** Siempre pregúntate: "¿Qué pasa si el payload es nulo?", "¿Qué pasa si la base de datos devuelve un error?", "¿Qué pasa si el usuario hace doble clic?".
3. **Paso a Paso:** No intentes construir 5 archivos de una vez. Divide el trabajo, construye uno, verifica que compila y luego pasa al siguiente.
4. **Cero Suposiciones:** Si una dependencia o regla no está clara, no la inventes. Detente y exige claridad.
