import { siteConfig } from '../config/site';

/**
 * Formats a Date object or ISO date string into a localized human-readable date.
 */
export function formatDate(
  date: Date | string,
  locale: string = siteConfig.defaultLocale,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return '';
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(d);
}

/**
 * Formats a Date object into an ISO 8601 string for HTML time elements and metadata.
 */
export function toISODate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return '';
  }
  return d.toISOString();
}
