# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Despliegue en Netlify con Neon (Postgres)

Pasos rápidos para desplegar y conectar con Neon:

- Crea una base de datos en Neon y copia la cadena de conexión (DATABASE_URL).
- En Netlify, en Site settings -> Build & deploy -> Environment, añade:
	- `DATABASE_URL` = (tu cadena de Neon)
	- `ADMIN_PASSWORD` = (contraseña administrativa para operaciones de venta/liberación)
- Conecta tu repositorio a Netlify (o sube manualmente). Netlify detectará Vite y usará `npm run build`.
- Verifica en Netlify que la carpeta de funciones sea `netlify/functions`.

Ramas y subida a GitHub (local):

```bash
git add .
git commit -m "Make responsive + add Netlify function for Neon"
git branch -M main
git remote add origin <url-de-tu-repo-en-github>
git push -u origin main
```

Notas de seguridad:
- Nunca pongas `DATABASE_URL` directamente en el frontend.
- Usa las variables de entorno en Netlify para mantener credenciales seguras.
