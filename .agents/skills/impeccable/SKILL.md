---
name: impeccable
description: El toque final de pulido. Sombras, bordes, transiciones y micro-interacciones para un acabado SaaS Premium.
---

# Skill: Impeccable (Pulido UI)

Esta skill garantiza que la interfaz no solo funcione, sino que se sienta costosa, suave y nativa (SaaS Premium). Aplica esto en tus componentes TailwindCSS:

## 1. Sombras y Bordes (Depth)
- **Sombras suaves:** Evita sombras duras. Usa `shadow-sm` para tarjetas planas, `shadow-md` para elementos flotantes y dropdowns, y `shadow-xl` para modales.
- **Bordes sutiles:** Define las tarjetas con bordes súper finos en lugar de solo sombras (`border border-gray-200 bg-white shadow-sm`).
- **Esquinas redondeadas:** Mantén consistencia. Usa `rounded-xl` o `rounded-2xl` para contenedores grandes y modales, y `rounded-lg` para botones e inputs.

## 2. Micro-interacciones y Transiciones
- **Todo debe tener transición:** Usa `transition-all duration-200 ease-in-out` en botones, enlaces y tarjetas.
- **Estados Hover y Active:** Todo botón debe reaccionar al cursor (`hover:bg-blue-600`) y al clic (`active:scale-95`).
- **Focus Rings:** Los inputs y botones seleccionados por teclado deben tener focus rings bonitos (`focus:ring-2 focus:ring-blue-500 focus:outline-none`).

## 3. Empty States y Carga (Skeletons)
- Las listas vacías no pueden ser una pantalla en blanco. Deben tener un ícono, un título en gris y un botón de llamada a la acción.
- Mientras se cargan datos, usa "Skeletons" (`animate-pulse bg-gray-200`) en lugar de simples spinners giratorios siempre que sea posible.
