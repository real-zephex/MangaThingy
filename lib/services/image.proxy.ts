const BASE_URL = 'https://manga-scrapers.onrender.com';


export const ImageProxy = (url: string) => {
    return `${BASE_URL}/mangapill/images/${encodeURIComponent(url)}`;
};
