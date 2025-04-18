// Function to parse URL parameters
export function getParameterByName(name: string, url: string) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp('#.*[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return url;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const sanitizeUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    return parsedUrl.href;
  } catch {
    throw new Error('Invalid URL provided for href command');
  }
};
