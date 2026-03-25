# Zara Challenge — Copilot Instructions

## Project Overview
E-commerce web app for a mobile phone catalog. Three views: product listing, product detail, and shopping cart.

## Stack
- **Framework:** Next.js 14+ (App Router, SSR)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** React Context API (spec requirement)
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint + Prettier
- **Node:** 18 (spec requirement — use `.nvmrc` to enforce)
- **Fonts:** `font-family: Helvetica, Arial, sans-serif;`

## API
- Base URL: `https://prueba-tecnica-api-tienda-moviles.onrender.com`
- Auth: Header `x-api-key: 87909682e6cd74208f41a6ef39fe4191` on every request
- Endpoints:
  - `GET /products` — returns array of `{ id, brand, name, basePrice, imageUrl }`
  - `GET /products?search={query}` — filters by name/brand
  - `GET /products/{id}` — returns full product detail with `specs`, `colorOptions`, `storageOptions`, `similarProducts`

## Conventions
- Use Server Components by default; Client Components only when needed (interactivity, hooks)
- Cart state persisted in `localStorage` via React Context
- All API calls must include the `x-api-key` header
- Responsive design is mandatory — mobile-first approach
- Accessibility (a11y) is mandatory: semantic HTML, ARIA labels, keyboard navigation
- No console errors or warnings in production
- Keep components small and focused
- Use Context7 MCP (`/vercel/next.js`, `/tailwindlabs/tailwindcss.com`, `/vitest-dev/vitest`) for up-to-date docs when unsure about API usage

## Figma
- Design file: `k4tfMXmOSAudq5tlW9n7g5` (node `0-1`) — user's duplicate
- Prototype: same file, node `20620-406` (view in browser for navigation flows)
- Original file (read-only): `Nuic7ePgOfUQ0hcBrUUQrb`
- Plan: Pro (200 calls/day)

## File Structure (planned)
```
src/
  app/
    layout.tsx          # Root layout with navbar
    page.tsx            # Product listing (home)
    cart/
      page.tsx          # Cart view
    product/
      [id]/
        page.tsx        # Product detail
  components/
    Navbar.tsx
    ProductCard.tsx
    ProductGrid.tsx
    SearchBar.tsx
    CartItem.tsx
    ColorSelector.tsx
    StorageSelector.tsx
    SimilarProducts.tsx
  context/
    CartContext.tsx
  lib/
    api.ts              # API client with x-api-key
    types.ts            # TypeScript interfaces
  __tests__/            # Test files
```
