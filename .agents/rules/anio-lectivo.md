---
title: Año lectivo de trabajo
trigger: always_on
---

# Año lectivo de trabajo

El año elegido en el encabezado es el año de trabajo de todo el panel. No lo guardes en el estado de una sola pantalla.

## De dónde sale

- `AnioLectivoProvider` envuelve el layout del panel. `useAnioLectivo()` devuelve el año activo.
- Se puede elegir el año `en_curso`, el `reabierto` y los `cerrado` anteriores a ese. Un `planificado` no se elige.
- Si no hay año en curso ni reabierto, los cerrados sí se pueden elegir.
- La elección distinta del año de referencia se guarda en `localStorage` (`sga:anio-lectivo:v1`). Quien no es administrador solo ve el año vigente, sin selector.

## Cómo viaja al API

- `apiClient` adjunta `x-anio-academico-id` en cada petición cuando hay un año activo. Lo toma de `idAnioLectivoActivo()`.
- No pongas ese header ni el id del año en cada llamada. El interceptor ya lo envía.
- Si una query depende del año, incluye su id en la `queryKey` para no reutilizar la caché de otro año.
