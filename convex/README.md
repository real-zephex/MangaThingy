# Convex Setup and Usage

## Overview

This directory contains the Convex backend configuration for the manga site, including schema definitions, queries, and mutations for managing reading history.

## File Structure

```
convex/
├── schema.ts           # Database schema definitions
├── types/
│   └── index.ts       # Type definitions and validators
├── functions/
│   ├── query.ts       # Query functions for reading data
│   └── mutations.ts   # Mutation functions for writing data
└── _generated/        # Auto-generated TypeScript types
```

## Important: Regenerating Types

After making changes to `schema.ts`, you **MUST** run the following command to regenerate TypeScript types:

```bash
npx convex dev
```

Or for a one-time generation:

```bash
npx convex dev --once
```

This will update the `_generated/` directory with proper types for your schema, including table names and indexes.

## Schema

The `reading_history` table stores manga reading progress for users:

- **Fields:**
  - `user_id`: User identifier
  - `id`: Manga identifier
  - `title`: Manga title
  - `image`: Manga cover image URL
  - `provider`: Manga source provider (optional)
  - `status`: Reading status
  - `chapter`: Current chapter (optional)
  - `totalChapter`: Total chapters (optional)

- **Indexes:**
  - `by_user`: Indexed on `user_id` for fast user lookups
  - `by_manga`: Indexed on `id` for fast manga lookups

## Query Functions

### `getReadingHistory`
Retrieves all reading history entries for a specific user.

**Args:**
- `user_id`: String

**Returns:** Array of reading history entries

**Example:**
```typescript
const history = await convex.query(api.functions.query.getReadingHistory, {
  user_id: "user_123"
});
```

### `getExistingEntry`
Checks if a specific manga entry exists for a user.

**Args:**
- `user_id`: String
- `manga_id`: String

**Returns:** Entry object or null

**Example:**
```typescript
const entry = await convex.query(api.functions.query.getExistingEntry, {
  user_id: "user_123",
  manga_id: "manga_456"
});
```

### `getMangaHistory`
Gets reading history for a specific manga across all users.

**Args:**
- `manga_id`: String

**Returns:** Array of reading history entries

### `checkExistingEntries`
Batch check for multiple manga entries for a user.

**Args:**
- `user_id`: String
- `manga_ids`: Array of strings

**Returns:** Map of manga_id to entry objects

## Mutation Functions

### `syncReadingHistory`
Syncs reading history entries. **Automatically checks for existing entries and updates them instead of creating duplicates.**

**Args:**
- `entries`: Array of track objects

**Returns:** Array of results with action type ("created" or "updated") and ID

**Example:**
```typescript
const results = await convex.mutation(api.functions.mutations.syncReadingHistory, {
  entries: [
    {
      user_id: "user_123",
      id: "manga_456",
      title: "One Piece",
      image: "https://example.com/image.jpg",
      provider: "MangaDex",
      status: "reading",
      chapter: "1000",
      totalChapter: "1100"
    }
  ]
});
// Returns: [{ action: "updated", id: "..." }] or [{ action: "created", id: "..." }]
```

### `updateReadingHistory`
Updates a single reading history entry.

**Args:**
- `user_id`: String
- `manga_id`: String
- `updates`: Object with optional fields to update

**Example:**
```typescript
await convex.mutation(api.functions.mutations.updateReadingHistory, {
  user_id: "user_123",
  manga_id: "manga_456",
  updates: {
    chapter: "1001",
    status: "completed"
  }
});
```

### `deleteReadingHistory`
Deletes a reading history entry.

**Args:**
- `user_id`: String
- `manga_id`: String

**Example:**
```typescript
await convex.mutation(api.functions.mutations.deleteReadingHistory, {
  user_id: "user_123",
  manga_id: "manga_456"
});
```

## Preventing Duplicates

The `syncReadingHistory` mutation automatically prevents duplicates by:

1. Checking if an entry exists for the combination of `user_id` and `manga_id`
2. If it exists, it **updates** the existing entry with new values
3. If it doesn't exist, it **creates** a new entry

This ensures that each user can only have one entry per manga in the reading history.

## Type Safety

All validators and types are defined in `types/index.ts` using Convex's `v` validator and `Infer` type utility:

```typescript
import { Infer, v } from "convex/values";

export const trackObject = v.object({
  user_id: v.string(),
  id: v.string(),
  // ... other fields
});

export type TrackObject = Infer<typeof trackObject>;
```

This ensures type safety across your queries, mutations, and schema definitions.

## Deployment

To deploy your Convex functions:

```bash
npx convex deploy
```

Make sure you have configured your Convex project with:

```bash
npx convex dev
```

Follow the prompts to set up your project if you haven't already.