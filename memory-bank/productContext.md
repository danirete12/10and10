# Product Context — 10and10

## What is 10and10?
Wiki de referencia para el mundo de la relojería, inspirada en Fragrantica. El nombre viene de la posición 10:10, la hora estándar en publicidad relojera.

## Core Value Proposition
La referencia definitiva en español para el aficionado a la relojería. Base de datos estructurada de relojes + comunidad de coleccionistas. Think Fragrantica, but for watches.

## Target Audience
Coleccionista o aspirante a coleccionista hispanohablante. Conoce las marcas, sabe lo que es un calibre, quiere datos reales y comunidad seria.

## Tech Stack
- **Frontend**: Next.js 14+ App Router + Tailwind CSS + Shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Search**: Meilisearch
- **Auth**: Clerk
- **Images**: Cloudinary
- **Hosting**: Vercel (frontend) + Railway (PostgreSQL + Meilisearch)

## Key Features (by phase)
### Phase 1 — Foundation
- Watch catalog with full specs (brand, reference, movement, case, dial, strap)
- Brand directory
- Meilisearch-powered instant search with facets
- Static generation for SEO

### Phase 2 — Community
- User reviews and ratings
- Personal collections and wishlists
- Public user profiles

### Phase 3 — Growth
- Movement/caliber pages
- Watch comparisons
- Public launch (Reddit, forums, Product Hunt)
- Affiliate links (Chrono24)

### Phase 4 — Maturity
- User contributions with moderation
- Price history charts
- Public API
- Premium accounts

## Differentiators vs Competition
- **vs Chrono24**: wiki + community, not marketplace
- **vs WatchUSeek/Reddit**: structured database, not forum
- **vs HODINKEE**: accessible to all collectors, not luxury press
