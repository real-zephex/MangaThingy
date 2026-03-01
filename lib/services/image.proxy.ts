export const ImageProxy = (url: string) => {
  const finalUrl = `https://goodproxy.goodproxy.workers.dev/fetch?url=${encodeURIComponent(url)}&ref=https://mangapill.com/`;
  return finalUrl;
};
