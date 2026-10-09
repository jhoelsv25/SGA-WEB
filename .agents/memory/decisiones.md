# Decisiones y aprendizajes del proyecto

## 2026-10-08 · Mejoras UI/UX (rama desarrollo/mejoras-ui)

- Color institucional: #881337 (`--primary`). En oscuro se usa un tono aclarado con texto oscuro (contraste AA).
- Término único: "Año académico". Se dice "rol", nunca "perfil".
- El menú lateral sale de `menuDelUsuario` (`config/navigation/menu-del-usuario.ts`): catálogo filtrado por páginas existentes (`RUTAS_CON_PAGINA`) y, salvo el Administrador, por `user.menuRoutes` (Roles-Menú). Las opciones sin página se ocultan.
- Portal público: sin cifras ni funciones que no existen. Datos de contacto marcados `// EJEMPLO` en `config/site.ts`.
- Kiosko: entrada por teclado y biométrico; cola sin conexión (más de 10 docentes por minuto, 3G intermitente).
- Exportar = exactamente lo filtrado.

## Orquestación con agy

- `agy` exige el prompt pegado a la opción (`-p="<prompt>"`). Si `-p` va antes de otra opción, toma esa opción como prompt.
