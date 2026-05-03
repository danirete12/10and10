# Hoja de Ruta — 10and10
**Wiki de Referencia para la Relojería**
Versión 1.0 — Documento de planning del equipo completo

---

## Decisiones a tomar antes de empezar

Esta sección recoge los puntos de arquitectura y diseño que el equipo debe resolver antes de escribir la primera línea de código en producción. Algunos parecen pequeños, pero un error aquí se propaga a todo el proyecto.

---

### D1. Estructura del slug para relojes [Backend + SEO]

La URL `/watches/rolex-submariner-116610ln` es la apuesta del equipo de SEO, pero hay que decidir la convención exacta y hacer que sea inviolable desde el día uno.

**Opciones:**
- A: `[marca]-[nombre-comercial]-[referencia]` → `rolex-submariner-116610ln` (recomendado)
- B: `[marca]-[referencia]` → `rolex-116610ln` (más corto, menos legible)
- C: `[referencia]` solo → `116610ln` (SEO pobre, colisiones posibles)

**Decisión recomendada:** Opción A. El slug debe generarse automáticamente al crear el watch desde `brand.slug + watch.commercialName + watch.reference`, todo sanitizado a kebab-case. Si el reloj no tiene nombre comercial (muchas referencias no lo tienen), se omite esa parte. Esta regla debe estar encapsulada en una función de utilidad única y ser la única fuente de verdad.

**Por qué ahora:** Una vez que hay páginas indexadas por Google, cambiar la estructura de URLs requiere 301 redirects perfectos o pierdes el trabajo de SEO. Es irreversible en la práctica.

---

### D2. Schema Prisma: granularidad del movimiento [Backend + Experto Relojería]

El movimiento puede modelarse de dos formas:

- A: El movimiento es una entidad `Movement` propia, con relación `Watch -> Movement`. Un ETA 2824-2 es el mismo registro para los 400 relojes que lo usan.
- B: El movimiento es un objeto JSON embebido en `Watch`. Más simple, pero no permite búsqueda facetada por calibre ni páginas `/movements/eta-2824-2`.

**Decisión recomendada:** Opción A, con la entidad `Movement` separada. La página `/movements/[slug]` tiene potencial SEO alto (gente que busca "ETA 2824-2 características", "calibre 3235 reserva de marcha") y permite mostrar todos los relojes que usan ese calibre. Esto es la clase de dato interconectado que hace a Fragrantica poderosa.

**Por qué ahora:** Migrar de JSON embebido a tabla relacional cuando ya hay 1000 watches en la base de datos es un script de migración doloroso.

---

### D3. Estrategia de datos iniciales: manual vs scraping vs fuente estructurada [Backend + Experto Relojería + Marketing]

**Opciones:**
- A: Entrada manual curada — calidad perfecta, escala lenta
- B: Importación desde fuente pública — escala rápida, calidad inconsistente
- C: Híbrido: seed de 20 marcas + 100 referencias curadas a mano, luego contribuciones de usuarios

**Decisión recomendada:** Opción C. La curadura manual de las referencias más buscadas genera las páginas con mayor tráfico orgánico esperado y establece el estándar de calidad para contribuciones futuras.

---

### D4. Colecciones: privadas por defecto o públicas por defecto [Backend + UX + Brand]

**Decisión recomendada:** Colecciones privadas por defecto, con opción de hacerla pública perfil por perfil. Wishlist puede ser pública por defecto (no revela lo que ya tienes). La colección de relojes revela el valor patrimonial de una persona — hay un riesgo de seguridad percibido real.

---

### D5. Autenticación: cuándo pedir login [UX + Backend]

- Ver ficha, buscar, leer reviews: sin login
- Escribir review, añadir a colección/wishlist, editar datos: login requerido

Este mapa de permisos debe estar documentado y ser la guía para todos los middleware y guards de API desde el día uno.

---

### D6. Cloudinary: estructura de carpetas de imágenes [Backend + Director de Arte]

```
10and10/
  watches/[watch-slug]/main.jpg, gallery-01.jpg...
  brands/[brand-slug]/logo.svg, hero.jpg
  movements/[movement-slug]/main.jpg
```

Esta estructura permite generar URLs predecibles y usar Cloudinary transforms de forma consistente desde el código.

---

## Tensiones y Trade-offs identificados por el equipo

---

### T1. Velocidad de lanzamiento vs. calidad del schema [PM vs. Backend]
Resolución: diseñar el schema completo desde el principio, pero implementar solo las rutas necesarias para la Fase 1. No hacer schema mínimo y crecer sobre él.

### T2. SEO desde el día uno vs. deuda técnica de metadatos [SEO vs. Frontend]
Resolución: `generateMetadata` obligatorio en todas las páginas de reloj y marca desde que se crean. Schema markup JSON-LD en Fase 1, no después.

### T3. Densidad de información vs. experiencia mobile [UX vs. Director de Arte]
Resolución: tabs en mobile (specs / movimiento / reviews / dónde comprar), columna única con sticky sidebar en desktop.

### T4. Completar la base de datos vs. abrir contribuciones de usuarios [Marketing vs. Experto Relojería]
Resolución: Fase 2 habilita contribuciones con flujo de revisión. Datos "pendiente de verificación" visibles pero diferenciados.

### T5. Monetización temprana vs. confianza de la comunidad [Marketing vs. Brand]
Resolución: los links de afiliación se añaden en Fase 3, solo después de que la comunidad confíe en la imparcialidad de los datos.

---

## Fase 1 — Fundación

**Objetivo principal:** Producto demostrable con datos reales, búsqueda funcional y páginas base navegables en producción.

**Por qué ahora:** Sin datos no hay producto. Sin infraestructura no hay datos. Todo lo que viene después depende de que esta fase esté sólida.

**Duración estimada:** 3-4 semanas.

---

### Backend

**1.1 Inicializar el proyecto Next.js**
- `npx create-next-app@latest --typescript --tailwind --app`
- Instalar y configurar Shadcn/ui con paleta stone como base
- Configurar variables de entorno: `DATABASE_URL`, `MEILISEARCH_HOST`, `MEILISEARCH_API_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLOUDINARY_*`

**1.2 Schema Prisma completo**

```prisma
model Brand {
  id          String   @id @default(uuid())
  slug        String   @unique
  name        String
  country     String
  founded     Int?
  description String?
  logoUrl     String?
  heroUrl     String?
  watches     Watch[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Movement {
  id           String   @id @default(uuid())
  slug         String   @unique
  reference    String
  name         String?
  type         String   // automático, manual, cuarzo
  frequency    Int?     // vph
  powerReserve Int?     // horas
  jewels       Int?
  inHouse      Boolean  @default(false)
  certifications String[]
  description  String?
  watches      Watch[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Watch {
  id                 String   @id @default(uuid())
  slug               String   @unique
  reference          String
  commercialName     String?
  brandId            String
  brand              Brand    @relation(fields: [brandId], references: [id])
  collectionName     String?
  yearIntroduced     Int?
  yearDiscontinued   Int?
  movementId         String?
  movement           Movement? @relation(fields: [movementId], references: [id])
  dialColor          String?
  dialMaterial       String?
  caseMaterial       String?
  caseDiameter       Float?
  caseThickness      Float?
  waterResistance    Int?     // metros
  crystalType        String?
  strapType          String?
  strapMaterial      String?
  launchPrice        Int?     // EUR
  secondaryMarketPrice Int?
  description        String?
  averageRating      Float?
  reviewCount        Int      @default(0)
  images             WatchImage[]
  reviews            Review[]
  collections        Collection[]
  wishlists          Wishlist[]
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@index([brandId])
  @@index([movementId])
}

model WatchImage {
  id           String  @id @default(uuid())
  watchId      String
  watch        Watch   @relation(fields: [watchId], references: [id])
  url          String
  cloudinaryId String
  isPrimary    Boolean @default(false)
  order        Int     @default(0)
}

model User {
  id                 String      @id @default(uuid())
  clerkId            String      @unique
  username           String      @unique
  bio                String?
  avatarUrl          String?
  isCollectionPublic Boolean     @default(false)
  reviews            Review[]
  collections        Collection[]
  wishlists          Wishlist[]
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt
}

model Review {
  id        String   @id @default(uuid())
  watchId   String
  watch     Watch    @relation(fields: [watchId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  rating    Int      // 1-5
  title     String
  body      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, watchId])
}

model Collection {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  watchId     String
  watch       Watch     @relation(fields: [watchId], references: [id])
  acquiredAt  DateTime?
  notes       String?
  createdAt   DateTime  @default(now())

  @@unique([userId, watchId])
}

model Wishlist {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  watchId   String
  watch     Watch    @relation(fields: [watchId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, watchId])
}
```

**1.3 Configurar Railway**
- Provisionar PostgreSQL en Railway
- Provisionar Meilisearch en Railway
- `prisma migrate dev --name init` + `prisma generate`

**1.4 Configurar Meilisearch**
- Índice `watches`: searchable `[name, commercialName, reference, description, brandName]`, filterable `[brandId, caseMaterial, dialColor, yearIntroduced, movementType]`, sortable `[yearIntroduced, averageRating]`
- Índice `brands`: searchable `[name, country, description]`, filterable `[country]`

**1.5 API Routes base (solo lectura en Fase 1)**
- `GET /api/watches` — listado paginado con filtros
- `GET /api/watches/[slug]` — detalle
- `GET /api/brands` + `GET /api/brands/[slug]`
- `POST /api/search` — proxy a Meilisearch

**1.6 Configurar Clerk**
- `@clerk/nextjs` en middleware
- Webhook para sincronizar `User` en cada `user.created` de Clerk

---

### Contenido / Seed Data [Experto Relojería]

**1.7 20 marcas top**
Rolex, Omega, Patek Philippe, Audemars Piguet, IWC, TAG Heuer, Cartier, Breitling, Tudor, Seiko, Longines, Grand Seiko, Vacheron Constantin, A. Lange & Söhne, Jaeger-LeCoultre, Panerai, Zenith, Hamilton, Tissot, Casio.

Cada marca con: slug, nombre oficial, país, año fundación, 150-200 palabras de historia validadas por el experto.

**1.8 100 referencias icónicas**

Selección por criterio "lo que un coleccionista buscaría primero":
- **Rolex (20):** Submariner 116610LN/114060/124060, GMT-Master II Batman/Pepsi/Sprite, Daytona 116500LN, Datejust 41, Day-Date 40, Explorer, Explorer II, Milgauss, Sea-Dweller, Yacht-Master 40, Air-King, Oyster Perpetual 41...
- **Omega (15):** Speedmaster Professional, Seamaster 300M, Constellation, Planet Ocean, Aqua Terra, Speedmaster '57, Railmaster...
- **Patek Philippe (10):** Nautilus 5711/1A, Aquanaut 5167A, Calatrava, Annual Calendar, Perpetual Calendar...
- **Audemars Piguet (8):** Royal Oak 15500ST/15510ST, Royal Oak Offshore, Jules Audemars, Millenary...
- **IWC (8):** Portugieser Chronograph, Pilot's Mark XVIII, Big Pilot, Portofino, Aquatimer...
- **TAG Heuer (6):** Carrera Heuer 02, Monaco, Aquaracer Professional, Autavia...
- **Tudor (6):** Black Bay 58, Black Bay GMT, Pelagos, Black Bay Bronze, Ranger...
- **Seiko (5):** Prospex Samurai, Presage Sharp Edged, Seiko 5, Prospex Turtle...
- **Grand Seiko (5):** Snowflake SBGA211, Heritage, Elegance, Sport, White Birch...
- **Resto (17):** distribuidas entre Longines, Breitling, Cartier, Panerai, JLC, Lange, Vacheron, Zenith, Hamilton, Tissot

*El experto en relojería valida datos técnicos antes de cada insert.*

---

### Frontend

**1.9 Estructura de rutas base**
```
app/
├── layout.tsx          → RootLayout: ClerkProvider, Playfair Display + Inter, Tailwind
├── page.tsx            → Home: SearchBar prominente, marcas, relojes recientes
├── watches/
│   ├── page.tsx        → Listado con FilterPanel + WatchCards
│   └── [slug]/page.tsx → Ficha completa
├── brands/
│   ├── page.tsx        → Directorio de marcas
│   └── [slug]/page.tsx → Página de marca
└── search/page.tsx     → Búsqueda avanzada con facetas
```

**1.10 Componentes core**
- `SearchBar` — debounce 150ms, llamada a `/api/search`, dropdown instantáneo (Client Component)
- `WatchCard` — imagen cuadrada aspect 1:1 via Cloudinary, nombre, referencia, rating
- `BrandCard` — logo, nombre, número de referencias, país
- `FilterPanel` — checkboxes por marca/material/movimiento/año; collapsible en mobile (Client Component)
- `WatchDetail` — galería + specs + movimiento + reviews; tabs en mobile
- `SpecsTable` — dos columnas: label `stone-500 uppercase tracking-wide text-xs` / valor `stone-900`
- `BreadcrumbNav` — conectado al schema markup BreadcrumbList

**1.11 `generateStaticParams` y `generateMetadata`**
- Watches: pre-renderizar los 100 del seed. Title: `[Nombre Comercial] [Referencia] — [Marca] | 10and10`
- Brands: pre-renderizar las 20 marcas. Title: `Relojes [Marca] — Catálogo Completo | 10and10`

---

### SEO

**1.12 Schema markup JSON-LD**
- Página de reloj: `Product` con `name`, `brand`, `description`, `image` (sin `aggregateRating` todavía — no poner schema vacío)
- Página de marca: `Organization` con `name`, `foundingDate`, `foundingLocation`
- Todas las páginas: `BreadcrumbList`

**1.13 Sitemap dinámico** — `app/sitemap.ts` generado desde la BD. Prioridades: home `1.0`, watches `0.8`, brands `0.7`.

**1.14 Robots.txt** — `app/robots.ts`: permitir todo excepto `/api/*`.

---

### Sistema de diseño [Director de Arte + UI Designer]

**1.15 Tailwind config**
```js
fontFamily: {
  serif: ['Playfair Display', 'Georgia', 'serif'],  // títulos
  sans: ['Inter', 'system-ui', 'sans-serif'],        // UI y cuerpo
  mono: ['JetBrains Mono', 'monospace'],             // specs técnicas
}
// Base: escala stone de Tailwind
// Acento: amber-600/700 solo muy selectivamente
```

**1.16 Componentes Shadcn/ui a instalar**
`button`, `input`, `card`, `badge`, `separator`, `skeleton`, `avatar`, `dialog`, `sheet`, `tabs`, `breadcrumb`

**1.17 Layout aprobado para página de reloj**

Desktop:
```
[Galería 60%]  |  [Nombre · Referencia · Marca]
               |  [Rating medio]
               |  [Specs básicas: caja, cristal, agua]
               |  [Añadir a colección / wishlist]
──────────────────────────────────────────────
[Tabs: Specs completas | Movimiento | Reviews | Variantes]
```

Mobile: Tab 1 (imagen + básicos + CTAs) · Tab 2 (specs) · Tab 3 (movimiento) · Tab 4 (reviews)

---

### Criterio de salida — Fase 1

- [ ] Schema Prisma completo con migraciones aplicadas en Railway
- [ ] 20 marcas y 100 relojes en base de datos con datos completos
- [ ] Meilisearch indexando watches y brands con facetas configuradas
- [ ] Búsqueda instantánea funcionando (<100ms local, <300ms Railway)
- [ ] Páginas `/watches/[slug]` y `/brands/[slug]` navegables con datos reales
- [ ] `generateMetadata` y schema markup JSON-LD en páginas de watch y brand
- [ ] Clerk configurado (login funcional)
- [ ] Sitemap y robots.txt generados dinámicamente
- [ ] Deploy en Vercel + Railway
- [ ] Cloudinary sirviendo imágenes via `next/image`

### Métricas de éxito — Fase 1

| Métrica | Objetivo |
|---|---|
| Páginas de reloj con datos completos | 100 |
| Tiempo respuesta búsqueda Meilisearch | <300ms p95 |
| Core Web Vitals LCP en página de reloj | <2.5s |
| Schema markup validado sin errores | 100% páginas |
| URLs sin 404 | 0 errores |

---

## Fase 2 — Comunidad

**Objetivo principal:** Convertir la wiki de solo lectura en una plataforma donde los aficionados dejan huella: reviews, colecciones, perfiles públicos.

**Por qué ahora:** Sin la capa social no hay razón para registrarse, no hay datos diferenciados y no hay flywheel. La comunidad es lo que convierte 10and10 en Fragrantica y no en una web de specs más.

**Duración estimada:** 3-4 semanas.

---

### Backend

**2.1 API de reviews**
- `POST /api/reviews` — crear (auth required). Valida: rating 1-5, body ≥50 chars, título obligatorio. Unique constraint `userId + watchId`.
- `GET /api/watches/[slug]/reviews` — paginado
- `PUT /api/reviews/[id]` + `DELETE /api/reviews/[id]` — solo el autor
- Desnormalizar `averageRating` y `reviewCount` en `Watch` — actualizar en cada write de review

**2.2 API de colección y wishlist**
- `POST/DELETE /api/user/collection` y `POST/DELETE /api/user/wishlist`
- `GET /api/user/[username]/collection` — solo si `isCollectionPublic=true`

**2.3 API de perfil**
- `GET /api/user/[username]` — datos públicos
- `PUT /api/user/profile` — editar propio perfil

**2.4 Webhook Clerk → User**
- `user.created`: crear registro `User` con clerkId, username, avatarUrl
- `user.updated`: sincronizar cambios
- `user.deleted`: anonimizar (no borrar — las reviews quedan como "Usuario eliminado")

---

### Frontend

**2.5 Componentes de comunidad**
- `ReviewForm` — React Hook Form + Zod, StarRating interactivo, CTA de login si no autenticado
- `ReviewCard` — avatar, username, fecha, rating, título, cuerpo
- `ReviewsList` — paginado con "cargar más"
- `RatingDistribution` — barras 5-4-3-2-1 estrellas (estilo Fragrantica/Amazon)
- `CollectionToggle` y `WishlistToggle` — Client Components con optimistic update
- `UserProfilePage` — layout: avatar, bio, colección grid, reviews
- `CollectionGrid` — grid de WatchCards de la colección

**2.6 Rutas de usuario**
```
app/user/[username]/
  page.tsx          → Perfil público
  collection/       → Colección (si pública)
  reviews/          → Reviews del usuario
app/settings/page.tsx → Editar perfil (auth required)
```

---

### UX

**2.7 Flujo de onboarding post-registro**
1. Usuario clica "Añadir a colección" → Clerk modal (no redirección)
2. Tras login, vuelve automáticamente al contexto
3. La acción que quería hacer IS el onboarding
4. Banner sutil: "Bienvenido a 10and10. Añade tu primer reloj."

No hay wizard de onboarding — la acción ya iniciada es suficiente.

---

### Brand

**2.8 Tono en la capa social**
- Rating: "Tu valoración" (no "¿Te gusta?")
- Placeholder review: "¿Qué te parece? Habla de lo que llevas en la muñeca."
- Colección: "Mi colección" (no "Mis favoritos")
- Wishlist: "Lista de deseados" — directo

El tono del mundo de la relojería: preciso, sin exclamaciones.

---

### Criterio de salida — Fase 2

- [ ] Sistema de reviews funcional: crear, listar, paginar, promedio calculado
- [ ] `averageRating` y `reviewCount` desnormalizados y actualizados en tiempo real
- [ ] Schema markup `aggregateRating` activado cuando `reviewCount > 0`
- [ ] Colección y wishlist funcionales con privacidad respetada
- [ ] Perfiles públicos con colección y reviews
- [ ] Webhook Clerk sincronizando usuarios correctamente
- [ ] Login sin fricción (modal, vuelve al contexto)
- [ ] Optimistic update en Collection/WishlistToggle (<50ms feedback)

### Métricas de éxito — Fase 2

| Métrica | Objetivo |
|---|---|
| Reviews en primeras 2 semanas post-launch | >50 |
| Usuarios registrados | >100 |
| Relojes en colecciones de usuarios | >200 |
| `aggregateRating` en rich results | >10 fichas |

---

## Fase 3 — Visibilidad y Crecimiento

**Objetivo principal:** Escalar el contenido más allá del seed inicial, optimizar para posicionamiento orgánico y hacer el lanzamiento público.

**Duración estimada:** 3-4 semanas.

---

### SEO

**3.1 Auditoría SEO de las 100 páginas de Fase 1**
Usar la skill `auditoria-seo` en las páginas más importantes. Verificar titles (max 60 chars), descriptions (max 155), schema markup sin errores, alt descriptivos.

**3.2 Página de movimientos (calibres)**
```
app/movements/
  page.tsx          → Directorio de calibres
  [slug]/page.tsx   → Ficha de calibre + todos los relojes que lo usan
```
Alta oportunidad SEO: "ETA 2824-2 características", "calibre 3135 reserva de marcha".

**3.3 Páginas de comparativa**
Ruta: `/compare/[slug-a]-vs-[slug-b]`
Tabla de specs dos columnas, diferencias resaltadas en amber.
`generateStaticParams` para los pares más buscados: Submariner vs GMT, Speedmaster vs Seamaster...

**3.4 Páginas de colección/línea**
Ruta: `/collections/rolex-submariner` — todas las referencias de una línea.
Captura tráfico de "todas las referencias del Submariner".

**3.5 Sitemap ampliado**
Prioridades: home `1.0` · watches `0.8` · brands/collections `0.7` · movements `0.6` · comparativas `0.5` · perfiles `0.3`

---

### Contenido [Experto Relojería]

**3.6 Ampliar la base de datos: de 100 a 500 relojes**
- Prioridad 1: referencias con búsquedas comprobadas en español
- Prioridad 2: variantes y sub-referencias de los 100 existentes
- Prioridad 3: marcas con pocas referencias en el catálogo
- Validación del experto antes de publicar cada bloque

**3.7 20 fichas de calibres**
Rolex 3135/3235 · ETA 2824-2/2892-A2 · Sellita SW200 · Miyota 9015/8215 · Omega Co-Axial 8500/8800 · Patek 240 · AP Cal. 2385 · ETA 6497 · Valjoux 7750 · JLC 888 · Lange L051.1 · Seiko NH35A · Citizen 0S10

---

### Marketing

**3.8 Estrategia de lanzamiento en comunidades**

- **Semana 1:** Soft launch con early adopters (WhatsApp/Telegram de coleccionistas). Objetivo: 10-20 reviews reales.
- **Semana 2:** Reddit — post en r/Watches y r/relojes en contexto relevante (no spam).
- **Semana 3:** Foros españoles (relojesysueños.com, cronos-y-relojes.com) + primeros posts de Instagram.
- **Semana 4:** Product Hunt. Condición de entrada: ≥500 relojes + ≥50 reviews reales. Gancho: "Fragrantica para relojes — la referencia definitiva en español."

**3.9 Afiliación Chrono24 / WatchBox**
Sección "Dónde comprarlo" en fichas, claramente etiquetada. Solo en relojes disponibles actualmente. Condición: solo cuando la comunidad ya confíe en la imparcialidad del contenido.

---

### Criterio de salida — Fase 3

- [ ] 500 relojes en base de datos con fichas completas
- [ ] 20 fichas de movimientos publicadas y enlazadas
- [ ] Páginas `/movements/[slug]` y `/collections/[slug]` navegables
- [ ] ≥10 páginas de comparativa con `generateStaticParams`
- [ ] Lanzamiento en ≥2 comunidades
- [ ] Product Hunt preparado (hunter, texto, capturas)
- [ ] Afiliación Chrono24 activa en los 100 relojes más buscados
- [ ] Auditoría SEO sin errores críticos
- [ ] 500 páginas en sitemap sin errores 4xx

### Métricas de éxito — Fase 3

| Métrica | Objetivo |
|---|---|
| Relojes en base de datos | 500 |
| Tráfico orgánico mensual | >1.000 visitas/mes |
| Páginas indexadas en Google Search Console | >400 |
| Usuarios registrados acumulados | >500 |
| Reviews acumuladas | >200 |
| Revenue afiliación primer mes | >0 EUR |

---

## Fase 4 — Madurez y Escalado

**Objetivo principal:** Convertir el tráfico en comunidad duradera. Añadir features que refuercen la retención y los ingresos. Preparar la plataforma para miles de relojes y decenas de miles de usuarios.

**Por qué ahora:** Empieza cuando los datos de uso confirman retención real: usuarios que vuelven, que contribuyen, páginas con tráfico creciente.

---

### Backend

**4.1 Contribuciones de usuarios con revisión**
```prisma
model WatchEdit {
  id         String   @id @default(uuid())
  watchId    String
  userId     String
  field      String
  oldValue   String?
  newValue   String
  status     String   // pending / approved / rejected
  reviewedAt DateTime?
  reviewedBy String?
  createdAt  DateTime @default(now())
}
```
El experto en relojería define qué campos pueden editar los usuarios vs. cuáles son de moderación estricta.

**4.2 Historial de precios**
```prisma
model PriceHistory {
  id         String   @id @default(uuid())
  watchId    String
  price      Int
  currency   String   @default("EUR")
  source     String   // manual / community
  recordedAt DateTime @default(now())
}
```
Gráfica de evolución de precio en la ficha de reloj.

**4.3 API pública documentada**
`GET /api/v1/watches` y `GET /api/v1/watches/[slug]` con rate limiting via Vercel Edge Functions. Atrae developers y genera backlinks orgánicos.

---

### Frontend

**4.4 Dashboard de usuario**
Ruta `/dashboard` (auth required): estadísticas de colección (valor estimado total, distribución por marca), historial de reviews, contribuciones y su estado.

**4.5 Búsqueda avanzada completa**
Actualizar `/search` con todas las facetas de Meilisearch: filtros combinables, ordenación, URL con params compartibles.

**4.6 Performance audit**
Bundle analysis · lazy-load de componentes pesados · ISR `revalidate: 3600` en fichas con reviews activas · `generateStaticParams` ampliado a los 500 relojes más buscados.

---

### SEO

**4.7 Contenido editorial estructurado**
Ruta `app/guides/[slug]/page.tsx` para artículos temáticos interlinked con fichas:
- "Historia completa del Rolex Submariner"
- "Guía de compra del primer reloj automático"
- "ETA 2824-2: el calibre más copiado del mundo"

---

### Marketing

**4.8 Cuenta premium (evaluar)**
Propuesta: colección ilimitada (free = 20 relojes), historial completo de precios, alertas de precio en wishlist, perfil verificado con badge. Modelo: suscripción mensual/anual con Stripe.

**4.9 Newsletter mensual**
Herramienta: Resend (integra con Next.js). Contenido: nuevas referencias, reviews destacadas, tendencias de precio. Alta calidad — los aficionados distinguen el contenido de calidad del ruido.

---

### Criterio de salida — Fase 4

Señales de madurez (no binario):
- [ ] >1.000 relojes en base de datos
- [ ] >1.000 usuarios registrados
- [ ] >500 reviews publicadas
- [ ] Tráfico orgánico >5.000 visitas/mes sostenidas durante 4 semanas
- [ ] Sistema de contribuciones con moderación funcionando
- [ ] Primera factura de afiliación cobrada
- [ ] Decisión tomada sobre cuenta premium

---

## Dependencias críticas entre fases

```
Schema Prisma (1.2) ──────────────────────→ Todo lo demás
Seed data (1.7/1.8) → Meilisearch (1.4) → Páginas de contenido (1.9)
Clerk (1.6) ─────────→ Reviews (2.1) ──→ aggregateRating (2.x/3.x)
Reviews en prod ──────────────────────────→ Product Hunt (3.8)
500 relojes (3.6) ────────────────────────→ Product Hunt (3.8)
```

---

## Tabla de riesgos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| Datos del seed incorrectos | Alta | Alto | Validación del experto en relojería antes de cada insert |
| Railway con downtime o costes inesperados | Media | Alto | Documentar proceso de migración desde el principio |
| Meilisearch en Railway sin memoria con 1000+ docs | Media | Medio | Benchmark en Fase 3; evaluar plan de Railway |
| Google no indexa rápido | Media | Bajo | Submit manual en Search Console; enlaces desde comunidades |
| La comunidad no contribuye | Media | Alto | Gamificación ligera en Fase 4: badge "contribuidor" |
| Imágenes de relojes con derechos de autor | Alta | Alto | Solo imágenes de dominio público o press kits oficiales de marcas |

---

## Resumen ejecutivo del equipo

El equipo ha llegado a consenso en seis puntos:

1. **El schema es el producto.** El tiempo invertido en el schema Prisma se recupera muchas veces en todas las fases siguientes.

2. **SEO no es un plugin de última hora.** Los metadatos dinámicos y el schema markup JSON-LD son obligatorios desde la primera página que sube a producción.

3. **Mobile-first no es un eslogan.** El coleccionista consulta en la tienda desde el móvil. Tabs en mobile no es un compromiso — es el diseño correcto.

4. **La comunidad es el moat.** Los datos se pueden copiar. La comunidad de aficionados que ha puesto sus reviews y su colección en 10and10, no.

5. **Lanzar con menos pero terminado.** 100 relojes con fichas perfectas son más valiosos que 1000 relojes con campos vacíos.

6. **La monetización espera.** Los links de afiliación entran en Fase 3, cuando la comunidad ya confía. No en Fase 1.
