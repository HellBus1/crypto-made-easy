import { siteConfig } from '../config/site';

/**
 * Returns a normalized canonical URL given a path or full URL.
 */
export function getCanonicalUrl(path?: string, baseUrl: string = siteConfig.url): string {
  if (!path) {
    return baseUrl.replace(/\/+$/, '');
  }

  // If path is already a full URL, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}

/**
 * Formats the document title with consistent branding.
 */
export function formatPageTitle(pageTitle?: string, fallback: string = siteConfig.name): string {
  if (!pageTitle) {
    return siteConfig.title;
  }
  if (pageTitle === fallback || pageTitle === siteConfig.title) {
    return pageTitle;
  }
  return `${pageTitle} | ${fallback}`;
}
