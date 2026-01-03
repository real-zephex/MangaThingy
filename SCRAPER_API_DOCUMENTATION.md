# Manga Scrapers API Documentation

## Overview

This document describes the integrated manga scraper API endpoints that have been ported from Python to TypeScript and integrated into the Next.js application using Hono.

## Architecture

### Components

1. **Scrapers** (`lib/scrapers/`)
   - `mangapill.ts` - Mangapill scraper implementation
   - `asurascans.ts` - Asurascans scraper implementation
   - `types.ts` - TypeScript type definitions and Zod schemas
   - `errors.ts` - Error handling utilities
   - `index.ts` - Module exports

2. **API Routes** (`app/api/[[...route]]/route.ts`)
   - Hono-based REST API endpoints
   - CORS and logging middleware enabled
   - Type-safe request/response handling

3. **API Client** (`lib/api-client.ts`)
   - Type-safe client for frontend consumption
   - Helper functions for each endpoint
   - Error handling and request serialization

## API Endpoints

### Base URL
```
/api
```

### Root Endpoint

#### GET `/api/`
Returns API status and available endpoints.

**Response:**
```json
{
  "message": "Welcome to the manga scrapers API",
  "available_providers": ["mangapill", "asurascans"],
  "endpoints": {
    "mangapill": {
      "search": "/mangapill/search/:query",
      "info": "/mangapill/info/:id",
      "pages": "/mangapill/pages/:id",
      "newest": "/mangapill/newest",
      "recent": "/mangapill/recent",
      "images": "/mangapill/images/:imageUrl"
    },
    "asurascans": {
      "search": "/asurascans/search/:query",
      "info": "/asurascans/info/:id",
      "pages": "/asurascans/pages/:id",
      "popular": "/asurascans/popular",
      "latest": "/asurascans/latest/:page",
      "genres": "/asurascans/genres/:type",
      "genre-list": "/asurascans/genre-list"
    }
  }
}
```

---

## Mangapill Endpoints

### Search Manga

#### GET `/api/mangapill/search/:query`

Search for manga by title.

**Parameters:**
- `query` (string, required) - Search query (spaces will be converted to `+`)

**Response:**
```json
{
  "status": 200,
  "results": [
    {
      "id": "manga-id",
      "title": "Manga Title",
      "image": "https://example.com/image.jpg",
      "subheading": "Alternative title",
      "type": "Manga",
      "year": "2023",
      "status": "Ongoing"
    }
  ]
}
```

**Example:**
```
GET /api/mangapill/search/one piece
```

---

### Get Manga Info

#### GET `/api/mangapill/info/:id`

Get detailed information about a manga.

**Parameters:**
- `id` (string, required) - Manga ID from search results

**Response:**
```json
{
  "status": 200,
  "results": {
    "id": "manga-id",
    "title": "Manga Title",
    "image": "https://example.com/image.jpg",
    "description": "Long description...",
    "type": "Manga",
    "status": "Ongoing",
    "year": "2023",
    "genres": ["Action", "Adventure", "Fantasy"],
    "chapters": [
      {
        "title": "Chapter 1",
        "id": "chapter-id"
      }
    ]
  }
}
```

---

### Get Chapter Pages

#### GET `/api/mangapill/pages/:id`

Get image URLs for a specific chapter.

**Parameters:**
- `id` (string, required) - Chapter ID

**Response:**
```json
{
  "status": 200,
  "results": [
    "https://example.com/page1.jpg",
    "https://example.com/page2.jpg",
    "https://example.com/page3.jpg"
  ]
}
```

---

### Get Newest Manga

#### GET `/api/mangapill/newest`

Get the newest manga added to Mangapill.

**Response:**
```json
{
  "status": 200,
  "results": [
    {
      "id": "manga-id",
      "title": "New Manga",
      "image": "https://example.com/image.jpg",
      "subheading": "Alternative title",
      "type": "Manga",
      "year": "2024",
      "status": "Ongoing"
    }
  ]
}
```

---

### Get Recent Chapters

#### GET `/api/mangapill/recent`

Get recently updated manga chapters.

**Response:**
```json
{
  "status": 200,
  "results": [
    {
      "id": "manga-id",
      "title": "Manga With Recent Chapter",
      "image": "https://example.com/image.jpg"
    }
  ]
}
```

---

### Proxy Image

#### GET `/api/mangapill/images/:imageUrl`

Proxy images from Mangapill (handles referer requirements).

**Parameters:**
- `imageUrl` (string, required) - URL-encoded image URL

**Response:** Image binary data with `Content-Type: image/jpeg`

**Example:**
```
GET /api/mangapill/images/https%3A%2F%2Fexample.com%2Fimage.jpg
```

---

## Asurascans Endpoints

### Search Manga

#### GET `/api/asurascans/search/:query`

Search for manga on Asurascans.

**Parameters:**
- `query` (string, required) - Search query

**Response:**
```json
{
  "status": 200,
  "results": [
    {
      "id": "manga-id",
      "title": "Manga Title",
      "image": "https://example.com/image.jpg",
      "chapters": "120 Chapters"
    }
  ]
}
```

---

### Get Manga Info

#### GET `/api/asurascans/info/:id`

Get detailed information about a manga.

**Parameters:**
- `id` (string, required) - Manga ID

**Response:**
```json
{
  "status": 200,
  "results": {
    "id": "manga-id",
    "title": "Manga Title",
    "image": "https://example.com/image.jpg",
    "description": "Long description...",
    "status": "Ongoing",
    "type": "Manga",
    "year": "2023",
    "author": ["Author Name"],
    "artists": ["Artist Name"],
    "serialization": ["Magazine"],
    "genres": "Action, Adventure, Fantasy",
    "chapters": [
      {
        "title": "Chapter 1",
        "date": "2024-01-01",
        "id": "chapter-id"
      }
    ]
  }
}
```

---

### Get Chapter Pages

#### GET `/api/asurascans/pages/:id`

Get image URLs for a specific chapter.

**Parameters:**
- `id` (string, required) - Chapter ID

**Response:**
```json
{
  "status": 200,
  "results": [
    "https://example.com/page1.jpg",
    "https://example.com/page2.jpg"
  ]
}
```

---

### Get Popular Manga

#### GET `/api/asurascans/popular`

Get popular manga from Asurascans.

**Response:**
```json
{
  "status": 200,
  "results": [
    {
      "id": "manga-id",
      "title": "Popular Manga",
      "image": "https://example.com/image.jpg",
      "chapters": "150 Chapters"
    }
  ]
}
```

---

### Get Latest Updates

#### GET `/api/asurascans/latest/:page`

Get latest updated manga with pagination.

**Parameters:**
- `page` (string, optional, default: "1") - Page number

**Response:**
```json
{
  "status": 200,
  "results": [
    {
      "id": "manga-id",
      "title": "Recently Updated",
      "image": "https://example.com/image.jpg",
      "chapters": "200 Chapters"
    }
  ]
}
```

---

### Get Manga by Genre

#### GET `/api/asurascans/genres/:type`

Get manga filtered by genre.

**Parameters:**
- `type` (string, required) - Genre type (see genre-list endpoint)

**Response:**
```json
{
  "status": 200,
  "results": [
    {
      "id": "manga-id",
      "title": "Action Manga",
      "image": "https://example.com/image.jpg",
      "chapters": "100 Chapters"
    }
  ]
}
```

---

### Get Available Genres

#### GET `/api/asurascans/genre-list`

Get list of available genres.

**Response:**
```json
{
  "endpoint": "asurascans",
  "genres": "action, adventure, comedy, romance"
}
```

---

## Frontend Usage

### Using the API Client

The `lib/api-client.ts` provides a type-safe client for consuming the API:

```typescript
import { scrapersAPI } from '@/lib/api-client';

// Mangapill search
const results = await scrapersAPI.mangapill.search('one piece');

// Asurascans info
const info = await scrapersAPI.asurascans.info('manga-id');

// Get chapter pages
const pages = await scrapersAPI.mangapill.pages('chapter-id');
```

### In React Components

```typescript
'use client';

import { useState, useEffect } from 'react';
import { scrapersAPI } from '@/lib/api-client';

export function SearchComponent() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const data = await scrapersAPI.mangapill.search(query);
      setResults(data.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your UI here */}
    </div>
  );
}
```

---

## Error Handling

All endpoints return a consistent error response structure:

```json
{
  "status": 500,
  "results": "Error message describing what went wrong"
}
```

Common status codes:
- `200` - Success
- `400` - Bad request (missing required parameters)
- `500` - Server error (scraper error, network error)

---

## Response Format

All successful responses follow this structure:

```typescript
interface ScraperResponse<T> {
  status: number;      // HTTP status code
  results: T | string; // The actual data or error message
}
```

---

## Proxy Configuration

Both scrapers use a Cloudflare Workers proxy to bypass CORS restrictions:

```
https://sup-proxy.zephex0-f6c.workers.dev/api-text?url=
```

This allows scraping from Mangapill and Asurascans without CORS errors.

---

## Type Definitions

All types are defined in `lib/scrapers/types.ts` with Zod schemas for validation:

```typescript
export interface MangaSearchResult {
  id: string;
  title: string;
  image: string;
  subheading?: string;
  type?: string;
  year?: string;
  status?: string;
  chapters?: string;
}

export interface MangaInfo {
  id: string;
  title: string;
  image: string;
  description: string;
  type: string;
  status: string;
  year: string;
  genres: string[];
  chapters: MangaChapter[];
}

export interface MangaChapter {
  title: string;
  id: string;
  date?: string;
}
```

---

## Environment Variables

No additional environment variables are required. The API uses publicly available proxy services.

---

## Performance Considerations

1. **Caching**: Consider implementing caching for frequently requested endpoints
2. **Rate Limiting**: The proxy service may have rate limits; implement backoff strategies
3. **Timeouts**: Set appropriate timeouts for long-running requests
4. **Pagination**: Use the `latest` and `genres` endpoints with page parameters to manage large result sets

---

## Troubleshooting

### Timeout Errors
- The target websites may be slow or temporarily unavailable
- Implement retry logic with exponential backoff

### No Results
- Verify the query/ID is correct and formatted properly
- Check the target website directly to ensure the data exists
- URL-encode special characters in queries

### Image Proxy Not Working
- Ensure the image URL is properly URL-encoded
- Verify the original image URL is accessible
- Check network/CORS issues with the Cloudflare worker

---

## Future Improvements

1. Add rate limiting middleware
2. Implement response caching with Redis
3. Add request validation schemas
4. Implement pagination for all list endpoints
5. Add webhook support for updates
6. Implement retry logic with exponential backoff
7. Add monitoring and error tracking