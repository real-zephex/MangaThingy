const BASE_URL = 'https://manga-scrapers.onrender.com';


export const ImageProxy = (url: string) => {
    const finalUrl = `https://goodproxy.dramaflix.workers.dev/fetch?url=${encodeURIComponent(url)}&ref=https://mangapill.com/`;
    return finalUrl;
    // return `${BASE_URL}/mangapill/images/${encodeURIComponent(url)}`;
};
