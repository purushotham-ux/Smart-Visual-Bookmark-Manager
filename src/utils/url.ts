/**
 * Validates if a string is a valid URL
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    // If the URL doesn't have a protocol, add https://
    let urlWithProtocol = urlString;
    if (!/^https?:\/\//i.test(urlString)) {
      urlWithProtocol = 'https://' + urlString;
    }
    
    new URL(urlWithProtocol);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Formats a URL by adding https:// if no protocol is present
 */
export const formatUrl = (url: string): string => {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

/**
 * Gets the favicon URL for a given URL
 */
export const getFaviconUrl = (url: string): string => {
  try {
    const formattedUrl = formatUrl(url);
    const domain = new URL(formattedUrl).hostname;
    return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
  } catch (error) {
    return '';
  }
}; 