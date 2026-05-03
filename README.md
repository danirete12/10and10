# 10and10

Wiki de referencia para el mundo de la relojería. Inspirada en Fragrantica, construida para el aficionado al reloj.

El nombre viene de la posición 10:10 — la hora estándar en publicidad relojera: las agujas forman una sonrisa, enmarcan la esfera, y dejan ver la marca.

## Estructura

```
10and10/
├── docs/          ← Arquitectura, decisiones, roadmap
├── db/            ← Esquema de base de datos y modelos
├── app/           ← Código fuente (Next.js)
├── content/       ← Seed de datos iniciales (marcas, referencias)
└── design/        ← Wireframes y sistema de diseño
```

## Stack

- **Frontend**: Next.js (App Router)
- **Base de datos**: PostgreSQL + Prisma
- **Búsqueda**: Meilisearch
- **Auth**: Clerk
- **Imágenes**: Cloudinary
- **Hosting**: Vercel + Railway
