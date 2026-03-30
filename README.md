# MBST — Mobile Phone Catalog

E-commerce web application for browsing a mobile phone catalog. Built as part of the Zara Web Challenge.

## Live Demo

[https://zara-web-challenge-peach.vercel.app](https://zara-web-challenge-peach.vercel.app)

## Features

- **Product Listing** — Browse 20 smartphones with real-time search (debounced, API-powered) and result count indicator
- **Product Detail** — Full specs, color/storage selectors with real-time image & price updates. "Añadir al carrito" activates only when both options are selected
- **Shopping Cart** — Add/remove items, persistent across sessions (localStorage), total calculation, "Continue shopping" navigation
- **Similar Products** — Horizontal draggable carousel with custom scrollbar (mouse + touch)
- **Responsive Design** — Mobile-first approach, fluid from 320px to 1920px+
- **Accessible** — Semantic HTML (`<search>`, `<nav>`, `<article>`, `<dl>`), ARIA labels, keyboard navigation, radio groups
- **SEO & Social** — SSR metadata per product, Open Graph + Twitter Card tags
- **PWA** — Web manifest for Chrome install prompt, theme color
- **CSS Variables** — Design tokens in `:root` linked to Tailwind config for easy theming

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 14 (App Router) | SSR, Server Components, file-based routing |
| Language | TypeScript | Type safety across the codebase |
| Styling | Tailwind CSS 3.4 | Utility-first CSS — generates standard CSS output, chosen for speed and consistency. The spec mentions CSS/SASS/Styled Components; Tailwind compiles to standard CSS and pairs well with the component architecture. |
| State | React Context API + Zustand | Context API is the public interface (per spec requirement). Zustand powers the internals with `persist` middleware for localStorage. |
| Data Fetching | TanStack Query 5 | Caching, stale-while-revalidate, automatic retry |
| Unit Testing | Vitest + React Testing Library | 41 tests across 12 suites |
| E2E Testing | Playwright | 18 tests (9 mobile + 9 desktop) |
| Linting | ESLint + Prettier | Consistent code formatting |
| Node | 18 (enforced via `.nvmrc`) | Per spec requirement |

## Getting Started

### Prerequisites

- Node.js 18 (use `nvm use` if you have nvm installed)
- npm

### Installation

```bash
git clone https://github.com/Pizzahutt/zara-web-challenge.git
cd zara-web-challenge
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

### Testing

```bash
npm test          # Unit tests — watch mode
npm run test:run  # Unit tests — single run
npm run e2e       # E2E tests (Playwright, mobile + desktop)
npm run e2e:ui    # E2E tests with interactive UI
```

### Linting & Formatting

```bash
npm run lint
npm run format:check
npm run format
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (providers, Navbar, meta)
│   ├── page.tsx                # Product listing (home)
│   ├── globals.css             # Design tokens (CSS variables) + Tailwind
│   ├── error.tsx               # Global error boundary
│   ├── not-found.tsx           # Custom 404 page
│   ├── manifest.ts             # PWA web manifest
│   ├── icon.svg                # SVG favicon
│   ├── cart/page.tsx           # Shopping cart
│   └── product/[id]/page.tsx   # Product detail (SSR metadata)
├── components/
│   ├── layout/                 # Navbar, NavigationProgress, LoadingBar
│   ├── products/               # SearchBar, ProductCard, ProductGrid, ColorFilter
│   ├── detail/                 # ProductDetailClient, ProductImage, ColorSelector, StorageSelector, AddToCartButton, ProductSpecs, SimilarProducts, BackButton
│   └── cart/                   # CartItem, CartSummary
├── context/CartContext.tsx      # React Context (public API)
├── store/cartStore.ts          # Zustand store (persist to localStorage)
├── hooks/                      # useProducts, useProduct, useDebounce, useHydrated, useProductColors
├── lib/                        # api.ts, types.ts, constants.ts
├── providers/QueryProvider.tsx  # TanStack Query client
└── __tests__/                  # 41 unit tests (components, hooks, store)
e2e/                            # 9 Playwright E2E tests (run on mobile + desktop)
```

## Architecture Decisions

### Why Tailwind CSS?

The spec lists CSS, SASS, and Styled Components. Tailwind compiles to standard CSS utility classes — it's not a runtime library. It was chosen for:
- Rapid development matching Figma designs (spacing, colors, typography as utilities)
- Zero runtime overhead (CSS only)
- Built-in responsive prefixes (`md:`, `lg:`) for mobile-first design

### Why Zustand behind React Context?

The spec requires React Context API for state management. Our implementation uses Context as the public interface (`useCart` hook), with Zustand internally providing:
- `persist` middleware for automatic localStorage sync
- Simpler store logic without boilerplate reducers
- The consumer API is pure React Context — external code never imports Zustand directly

### Server vs Client Components

- **Server Components** (default): Layout, metadata generation, static content
- **Client Components** (when needed): Interactive pages (home search, product detail selectors, cart)

## API

All requests include the `x-api-key` header. Endpoints used:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/products` | List all products |
| GET | `/products?search={query}` | Search by name/brand |
| GET | `/products/{id}` | Product detail with specs, colors, storage, similar items |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm test` | Unit tests in watch mode |
| `npm run test:run` | Unit tests — single run |
| `npm run test:coverage` | Unit tests with coverage report |
| `npm run e2e` | E2E tests (Playwright, mobile + desktop) |
| `npm run e2e:ui` | E2E tests with interactive UI |
| `npm run lint` | ESLint check |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting without writing |
