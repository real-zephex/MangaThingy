"use server"

const BASE_URL = 'https://manga-scrapers.onrender.com';

export const fetchWrapper = async (endpoint: string) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      next: { revalidate: 3600 }, // Hash revalidate for 1 hour
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }
    const data = await response.json()
    if (!data.results) {
      throw new Error(`Invalid data format from ${endpoint}`);
    };

    return data;
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    return null;
  }
};
