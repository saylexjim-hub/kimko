# KIMKŌ · Medidor de Ki

Herramienta gratuita de gestión de carga de entrenamiento basada en el método ACWR,
gamificada con el sistema de niveles de Dragon Ball Z (doblaje latino).
Desarrollada por Saybor.

**Producción:** https://kimko-gold.vercel.app

## Uso

Visita la URL de producción. No requiere instalación ni cuenta.

## Stack

- Frontend: HTML + React (CDN) — `index.html`
- Backend: Vercel Serverless Function — `api/chat.js`
- IA: Claude API (Anthropic) via proxy seguro

## Deploy

```bash
vercel --prod
```

La API key de Anthropic vive en las variables de entorno de Vercel — nunca en el código.
