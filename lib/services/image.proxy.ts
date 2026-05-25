export const ImageProxy = (url: string) => {
  return `/api/mangapill/images/${encodeURIComponent(url)}`;
};
