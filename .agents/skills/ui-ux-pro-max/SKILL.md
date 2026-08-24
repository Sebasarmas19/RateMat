---
name: ui-ux-pro-max
description: Reglas estrictas de diseño, paletas de colores y tipografía para interfaces profesionales.
---

# Skill: UI-UX Pro Max

Esta skill transforma al agente en un Diseñador UI Senior. Cuando construyas interfaces en Angular + TailwindCSS, debes aplicar estas reglas inquebrantables:

## 1. Jerarquía Visual y Espaciado (Whitespace)
- **Respira:** Usa padding abundante (`p-4`, `p-6`, `p-8`). Las interfaces apretadas se ven baratas.
- **Jerarquía Tipográfica:** Diferencia claramente los títulos (`text-xl font-bold text-gray-900`) del texto secundario (`text-sm text-gray-500`).
- **Mobile-First:** Diseña siempre asumiendo pantallas de 375px primero. Usa componentes amigables para el pulgar (Bottom Navigations, botones de ancho completo `w-full`).

## 2. Paletas de Colores que Funcionan
- **Regla del 60-30-10:** 60% color de fondo (usualmente `bg-gray-50` o `bg-white`), 30% color secundario (superficies como `bg-white` en tarjetas), 10% color de acento (Botones primarios).
- **Nunca uses negro puro:** Usa `text-gray-900` o `text-slate-900`. El negro puro (`#000000`) cansa la vista.
- **Estados Semánticos:** Usa rojos suaves (`bg-red-50 text-red-700`) para errores y verdes (`bg-green-50 text-green-700`) para éxito.

## 3. Accesibilidad
- Asegura contraste suficiente entre el fondo y el texto.
- Los botones deben tener un área táctil mínima de 44x44px en móviles.
