import { Asurascans } from "@/lib/scrapers/asurascans";
import { Mangapill } from "@/lib/scrapers/mangapill";
import axios from "axios";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");
app.use("*", cors(), logger());

// Initialize scrapers
const mangapill = new Mangapill();
const asurascans = new Asurascans();

// Helper function to get proper status code
function getStatusCode(scraperStatus: number): 200 | 400 | 500 {
  if (scraperStatus >= 500) return 500;
  if (scraperStatus >= 400) return 400;
  return 200;
}

// ============ Home Route ============
app.get("/", (c) => {
  return c.json({
    message: "Welcome to the manga scrapers API",
    available_providers: ["mangapill", "asurascans"],
    endpoints: {
      mangapill: {
        search: "/mangapill/search/:query",
        info: "/mangapill/info/:id",
        pages: "/mangapill/pages/:id",
        newest: "/mangapill/newest",
        recent: "/mangapill/recent",
        images: "/mangapill/images/:imageUrl",
      },
      asurascans: {
        search: "/asurascans/search/:query",
        info: "/asurascans/info/:id",
        pages: "/asurascans/pages/:id",
        popular: "/asurascans/popular",
        latest: "/asurascans/latest/:page",
        genres: "/asurascans/genres/:type",
        "genre-list": "/asurascans/genre-list",
      },
    },
  });
});

// ============ Mangapill Routes ============
app.get("/mangapill/search/:query", async (c) => {
  const query = c.req.param("query");
  if (!query) {
    return c.json(
      {
        status: 400,
        results: "Query parameter is required",
      },
      400,
    );
  }
  const result = await mangapill.search(query);
  const statusCode = getStatusCode(result.status);
  return c.json(result, statusCode);
});

app.get("/mangapill/info/:id", async (c) => {
  const id = c.req.param("id");
  if (!id) {
    return c.json(
      {
        status: 400,
        results: "ID parameter is required",
      },
      400,
    );
  }
  const result = await mangapill.info(id);
  const statusCode = getStatusCode(result.status);
  return c.json(result, statusCode);
});

app.get("/mangapill/pages/:id", async (c) => {
  const id = c.req.param("id");
  if (!id) {
    return c.json(
      {
        status: 400,
        results: "ID parameter is required",
      },
      400,
    );
  }
  const result = await mangapill.pages(id);
  const statusCode = getStatusCode(result.status);
  return c.json(result, statusCode);
});

app.get("/mangapill/newest", async (c) => {
  const result = await mangapill.new();
  const statusCode = getStatusCode(result.status);
  return c.json(result, statusCode);
});

app.get("/mangapill/recent", async (c) => {
  const result = await mangapill.recent();
  const statusCode = getStatusCode(result.status);
  return c.json(result, statusCode);
});

app.get("/mangapill/images/:imageUrl", async (c) => {
  const imageUrl = c.req.param("imageUrl");
  if (!imageUrl) {
    return c.json(
      {
        status: 400,
        results: "Image URL is required",
      },
      400,
    );
  }

  try {
    const response = await axios.get(imageUrl, {
      headers: {
        Referer: "https://mangapill.com/",
      },
      responseType: "arraybuffer",
    });
    return new Response(response.data, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    return c.json(
      {
        status: 500,
        results:
          error instanceof Error ? error.message : "Failed to fetch image",
      },
      500,
    );
  }
});

// ============ Asurascans Routes ============
app.get("/asurascans/search/:query", async (c) => {
  const query = c.req.param("query");
  if (!query) {
    return c.json(
      {
        status: 400,
        results: "Query parameter is required",
      },
      400,
    );
  }
  const formattedQuery = query.replace(/ /g, "+");
  const result = await asurascans.search(formattedQuery);
  const statusCode = getStatusCode(result.status);
  return c.json(result, statusCode);
});

app.get("/asurascans/info/:id", async (c) => {
  const id = c.req.param("id");
  if (!id) {
    return c.json(
      {
        status: 400,
        results: "ID parameter is required",
      },
      400,
    );
  }
  const result = await asurascans.info(id);
  const statusCode = getStatusCode(result.status);
  return c.json(result, statusCode);
});

app.get("/asurascans/pages/:id", async (c) => {
  const id = c.req.param("id");
  if (!id) {
    return c.json(
      {
        status: 400,
        results: "ID parameter is required",
      },
      400,
    );
  }
  const result = await asurascans.pages(id);
  const statusCode = getStatusCode(result.status);
  return c.json(result, statusCode);
});

app.get("/asurascans/popular", async (c) => {
  const result = await asurascans.popular();
  const statusCode = getStatusCode(result.status);
  return c.json(result, statusCode);
});

app.get("/asurascans/latest/:page", async (c) => {
  const page = c.req.param("page") || "1";
  const result = await asurascans.latest(page);
  const statusCode = getStatusCode(result.status);
  return c.json(result, statusCode);
});

app.get("/asurascans/genres/:type", async (c) => {
  const type = c.req.param("type");
  if (!type) {
    return c.json(
      {
        status: 400,
        results: "Genre type parameter is required",
      },
      400,
    );
  }
  const result = await asurascans.genres(type);
  const statusCode = getStatusCode(result.status);
  return c.json(result, statusCode);
});

app.get("/asurascans/genre-list", (c) => {
  return c.json({
    endpoint: "asurascans",
    genres: "action, adventure, comedy, romance",
  });
});

export const GET = handle(app);
export const POST = handle(app);
