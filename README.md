# Otaku Verse

A high-performance manga reader platform built with Next.js, Hono, and Convex.

## Core Stack

- **Framework**: Next.js 15 (App Router)
- **Backend**: Convex (Database/Auth), Hono (API Edge Routes)
- **Scraping**: Cheerio-based scrapers for Mangapill and Asurascans
- **Styling**: Tailwind CSS v4 + Shadcn UI (New York style)
- **Runtime**: Bun

## Project Architecture

- `app/api/[[...route]]/`: Hono API implementation for provider scrapers.
- `convex/`: Backend schema and database functions.
- `lib/scrapers/`: Core scraping logic and provider implementations.
- `lib/services/`: Server-side actions and data fetching wrappers.
- `components/custom/`: Feature-specific UI components (Reader, Info, Landing).

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) installed.
- [Convex](https://convex.dev) account/CLI for the backend.

### Setup

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   bun install
   ```

2. **Environment**
   Create a `.env.local` with your Convex and Clerk credentials.

3. **Development**
   ```bash
   bun run dev
   ```

## Development

### Adding a Scraper
New scrapers should be added to `lib/scrapers/` and implement the common interface defined in `types.ts`. Register the new routes in `app/api/[[...route]]/route.ts`.

### Linting
```bash
bun run lint
```

## API Overview

### Mangapill
- `GET /api/mangapill/search/:query`
- `GET /api/mangapill/info/:id`
- `GET /api/mangapill/pages/:id`

### Asurascans
- `GET /api/asurascans/search/:query`
- `GET /api/asurascans/info/:id`
- `GET /api/asurascans/pages/:id`

## License
MIT
