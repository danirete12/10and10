# Decision Log — 10and10

## 2026-05-02 22:00:00 — Arquitectura de agentes
**Decision**: Adaptar los agentes de the-noir-studio al dominio de relojería en lugar de crear agentes nuevos desde cero.
**Rationale**: Los agentes de the-noir-studio tienen una estructura probada (brand-manager, frontend, backend, SEO, marketing, PM, UX, UI + experto de dominio). Solo había que cambiar el contexto.
**Outcome**: 10 agentes creados en `.claude/agents/`: brand-manager, desarrollador-backend, desarrollador-frontend, director-de-arte, experto-relojeria, experto-seo, jefe-de-marketing, project-manager, ui-designer, ux-designer.

## 2026-05-02 23:00:00 — Hoja de ruta en 4 fases
**Decision**: Estructurar el desarrollo en 4 fases: Fundación → Comunidad → Visibilidad → Madurez.
**Rationale**: La wiki necesita datos antes de tener usuarios, y usuarios antes de lanzar. El SEO se planta en Fase 1 y cosecha en Fase 3.
**Key insight**: "El schema es el producto" — errores en el schema Prisma son costosos de migrar.
**Document**: `docs/roadmap.md`

## 2026-05-02 23:30:00 — Slug structure para watches (D1)
**Decision**: `[brand]-[commercial-name]-[reference]` → `rolex-submariner-116610ln`
**Rationale**: URLs indexadas por Google son irreversibles en la práctica. El nombre comercial mejora el SEO long-tail.
**Rule**: Si no hay nombre comercial, omitir: `rolex-116610ln`. Encapsulado en función de utilidad única.
**Status**: Decidido, pendiente de implementar.

## 2026-05-02 23:30:00 — Movement como entidad separada (D2)
**Decision**: `Movement` es un modelo Prisma propio, con relación `Watch -> Movement`.
**Rationale**: Permite páginas `/movements/[slug]` (SEO) y facetas de búsqueda por calibre. Un ETA 2824-2 es el mismo registro para todos los relojes que lo usan.
**Status**: Decidido, pendiente de implementar en schema.

## 2026-05-02 23:30:00 — Estrategia de datos iniciales (D3)
**Decision**: Híbrido — 20 marcas + 100 referencias curadas manualmente, luego contribuciones de usuarios.
**Rationale**: Calidad del dato establece confianza. Las 100 referencias más buscadas generan el mayor tráfico orgánico inicial.
**Status**: Decidido, pendiente de seed data.

## 2026-05-02 23:30:00 — Privacidad de colecciones (D4)
**Decision**: Colecciones privadas por defecto, opción de hacerla pública.
**Rationale**: La colección revela valor patrimonial. Riesgo de seguridad percibido diferente al de los perfumes en Fragrantica.
**Status**: Decidido, implementar en Prisma con `isCollectionPublic Boolean @default(false)`.

## 2026-05-03 11:00:00 — Integración RooFlow
**Decision**: Integrar RooFlow para persistencia de contexto cross-session con Roo Code.
**Components**: `.roo/` system prompts (5 modos), `.roomodes`, `modules/`, `memory-bank/` (este directorio).
**Status**: Instalado y Memory Bank inicializado.
