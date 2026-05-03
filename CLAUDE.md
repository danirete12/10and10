# 10and10 — Wiki de Relojería

Wiki de referencia para el mundo de la relojería. Inspirada en Fragrantica, construida para el aficionado al reloj.

El nombre viene de la posición 10:10 — la hora estándar en publicidad relojera: las agujas forman una sonrisa, enmarcan la esfera, y dejan ver la marca.

## Stack

- **Frontend**: Next.js (App Router) + Tailwind CSS + Shadcn/ui
- **Base de datos**: PostgreSQL + Prisma
- **Búsqueda**: Meilisearch
- **Auth**: Clerk
- **Imágenes**: Cloudinary
- **Hosting**: Vercel (frontend) + Railway (DB + Meilisearch)

## Agentes especializados

Viven en `.claude/agents/`. Invocarlos cuando la tarea encaje con su especialidad:

- `director-de-arte` — decisiones visuales, paleta, tipografía
- `brand-manager` — posicionamiento, tono, naming
- `jefe-de-marketing` — canales, comunidades, copy, monetización
- `experto-relojeria` — validación técnica de datos de relojes, terminología
- `ux-designer` — flujos, interacción, arquitectura de información
- `ui-designer` — componentes, estados, sistema de diseño con Tailwind
- `desarrollador-frontend` — Next.js, React, componentes, rendimiento
- `desarrollador-backend` — Prisma, PostgreSQL, Meilisearch, APIs
- `experto-seo` — keywords de relojería, metadatos, schema markup, URLs

## Skills disponibles

Viven en `.claude/skills/`. Activar con `/[nombre]`:

- `web-scrolling` — genera webs HTML premium con animaciones de scroll
- `instagram-a-web` — convierte perfil de Instagram en web de marca personal
- `auditoria-seo` — auditoría SEO completa de cualquier URL
- `dashboard-facturas` — analiza PDFs de facturas y genera dashboard financiero
- `automatizaciones-n8n` — crea y gestiona workflows en n8n
- `prospeccion` — encuentra clientes potenciales y analiza su presencia digital
- `auditoria-negocio` — auditoría completa de presencia digital de un negocio
- `auditoria-meta-ads` — audita campañas de Meta Ads + landing pages
- `extension-chrome` — crea extensiones de Chrome desde cero
- `crear-skill` — crea nuevas skills personalizadas

## Estructura del proyecto

```
10and10/
├── CLAUDE.md              ← Este archivo
├── docs/                  ← Arquitectura, decisiones, roadmap
├── db/                    ← Schema Prisma y modelos
├── app/                   ← Código fuente (Next.js)
├── content/               ← Seed de datos iniciales (marcas, referencias)
└── design/                ← Wireframes y sistema de diseño
```

## Fase actual: Fundación

El proyecto está en scaffold inicial. Próximos pasos:
1. Inicializar Next.js en `app/`
2. Definir schema Prisma en `db/`
3. Seed data: marcas top + referencias icónicas en `content/`
4. Configurar Railway (PostgreSQL + Meilisearch)
