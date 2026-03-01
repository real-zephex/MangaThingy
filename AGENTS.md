# AGENTS.md

Coding agent guidelines for the Otaku Verse manga reader platform.

## Build, Lint, and Test Commands

```bash
# Development
bun run dev              # Start Next.js dev server on port 3000

# Production
bun run build            # Build for production
bun run start            # Start production server

# Linting
bun run lint             # Run ESLint on the codebase
npx eslint <file>        # Lint a specific file
npx eslint --fix <file>  # Auto-fix linting issues

# Testing
# No test framework is currently configured
```

## Project Overview

- **Framework**: Next.js 16.1.1 with App Router
- **React**: v19.2.3
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4 + Shadcn/ui (new-york style)
- **Package Manager**: Bun
- **Backend**: Convex for database, Clerk for authentication
- **API**: Hono framework for REST endpoints

## Directory Structure

```
app/                     # Next.js App Router pages
  api/[[...route]]/      # Hono API routes
  manga/[provider]/[id]/ # Dynamic manga pages
components/
  custom/                # Project-specific components
  ui/                    # Shadcn/ui components (auto-generated)
hooks/                   # Custom React hooks
lib/
  scrapers/              # Manga scraper implementations
  services/              # API client services
  utils.ts               # Utility functions (cn helper)
providers/               # React context providers
convex/                  # Convex backend functions
```

## Code Style Guidelines

### Imports

- Use `@/` path alias for all internal imports
- Group imports: external packages first, then internal modules
- Use named imports from barrel exports

```typescript
// External
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

// Internal
import { MangaCard } from "@/components/custom/landing/cards";
import { Button } from "@/components/ui/button";
import { MangapillService } from "@/lib/services/manga.actions";
```

### Formatting

- Tab width: 2 spaces (no tabs)
- Use Prettier for formatting
- Trailing commas in multi-line structures

### TypeScript
  - Strict mode is enabled - avoid `any` when possible
  - Define types in separate files when reusable (see `lib/scrapers/types.ts`)
  - Use Zod schemas for runtime validation
- Prefer interfaces for object shapes, types for unions/primitives

```typescript
// Type definition pattern
export interface MangaChapter {
  title: string;
  id: string;
  date?: string;
}

// Zod schema pattern
export const MangaChapterSchema = z.object({
  title: z.string(),
  id: z.string(),
  date: z.string().optional(),
});
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `MangaCard`, `HeroSlider` |
| Functions | camelCase | `fetchAPI`, `handleSearch` |
| Variables | camelCase | `mangaList`, `isLoading` |
| Constants | SCREAMING_SNAKE | `API_BASE`, `MOBILE_BREAKPOINT` |
| Files | kebab-case or PascalCase | `manga-actions.ts`, `Navbar.tsx` |
| CSS classes | kebab-case | `bg-primary`, `text-muted-foreground` |

### React Components

- Server components by default (no "use client" directive)
- Add "use client" only when using hooks, events, or browser APIs
- Use arrow functions for component definitions
- Export default for page components, named exports for reusable components

```typescript
// Server component (default)
const HomePage = async () => {
  const data = await fetchData();
  return <div>{/* render */}</div>;
};
export default HomePage;

// Client component
"use client";
import { useState } from "react";

export const SearchComponent = () => {
  const [query, setQuery] = useState("");
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
};
```

### Error Handling

- Use custom `ScraperError` class for scraper-related errors
- Wrap async operations in try-catch blocks
- Log errors with context prefix: `[ScraperName Method] Error:`
- Return consistent error response format:

```typescript
// Scraper pattern
try {
  // operation
} catch (error) {
  console.error("[Mangapill Search] Error:", error);
  return {
    status: 500,
    results: error instanceof Error ? error.message : "Unknown error",
  };
}

// React pattern
try {
  await someAsyncOperation();
} catch (error) {
  toast.error("Operation failed: " + (error as Error).message);
}
```

### API Routes (Hono)

- Define routes in `app/api/[[...route]]/route.ts`
- Use meaningful HTTP status codes (200, 400, 500)
- Validate parameters before processing

```typescript
app.get("/mangapill/search/:query", async (c) => {
  const query = c.req.param("query");
  if (!query) {
    return c.json({ status: 400, results: "Query is required" }, 400);
  }
  const result = await mangapill.search(query);
  return c.json(result, getStatusCode(result.status));
});
```

### Services Pattern

- Use object literal with methods for service exports
- Wrap with React `cache()` for server component caching

```typescript
export const MangapillService = {
  search: cache((query: string): Promise<Results<Manga>> =>
    fetchWrapper(`/mangapill/search/${encodeURIComponent(query)}`)),
  getInfo: cache((id: string): Promise<MangaInfoResults<MangaInfo>> =>
    fetchWrapper(`/mangapill/info/${encodeURIComponent(id)}`)),
};
```

### Scraper Classes

- Use class-based approach for scrapers
- Private properties for URLs and configuration
- Async methods returning `ScraperResponse<T>`

```typescript
export class Mangapill {
  private proxyUrl = "https://...";
  private parentUrl = "https://mangapill.com";

  async search(query: string): Promise<ScraperResponse<MangaSearchResult[]>> {
    // implementation
  }
}
```

### UI Components (Shadcn/ui)

- Components in `components/ui/` are auto-generated by shadcn CLI
- Add new components via: `npx shadcn@latest add <component>`
- Custom components go in `components/custom/`
- Use the `cn()` utility for conditional class merging:

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)} />
```

### Convex Functions

- Define schemas in `convex/schema.ts`
- Mutations and queries in `convex/functions/`
- Use `ConvexError` for throwing errors

```typescript
export const myMutation = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      // operation
    } catch (error) {
      throw new ConvexError(`Error: ${(error as Error).message}`);
    }
  },
});
```

## Important Files

| File | Purpose |
|------|---------|
| `lib/scrapers/types.ts` | Zod schemas and TypeScript types |
| `lib/api-client.ts` | Type-safe frontend API client |
| `lib/services/manga.actions.ts` | Cached server-side data fetching |
| `app/api/[[...route]]/route.ts` | All Hono API endpoints |
| `convex/schema.ts` | Database schema definition |

## Notes

- Images from external sources use the image proxy to handle CORS
- URL encode parameters that may contain special characters
- Use `encodeURIComponent()` when constructing API URLs
- Dark theme is default; use Tailwind CSS variables for theming
