"use server";

/**
 * Get the base URL for API calls
 * Uses localhost in development, production URL in production
 */
function getBaseUrl(): string {
  // In production (Vercel), use the production domain
  if (process.env.NODE_ENV === "production") {
    return "https://manga-thingy.vercel.app";
  }

  // In development, use localhost
  if (typeof window === "undefined") {
    // Server-side: use localhost with dynamic port detection if needed
    return "http://localhost:3000";
  }

  // Client-side in development
  return typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
}

export const fetchWrapper = async (endpoint: string) => {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api${endpoint}`;
    
    console.debug(`[fetchWrapper] Fetching from: ${url}`);
    
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate for 1 hour
    });
    
    if (!response.ok) {
      console.error(
        `Fetch error for ${endpoint}: ${response.status} ${response.statusText}`,
      );
      return { status: response.status, results: null };
    }
    
    const data = await response.json();
    if (!data.results) {
      console.warn(`No results returned from ${endpoint}`);
      return { status: 200, results: null };
    }

    return data;
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    return { status: 500, results: null };
  }
};
