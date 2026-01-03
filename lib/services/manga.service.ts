"use server";

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

export const fetchWrapper = async (endpoint: string) => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api${endpoint}`, {
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
