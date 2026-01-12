import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeExternalUrl(rawUrl?: string | null): string | undefined {
  if (!rawUrl) return undefined;

  let url = String(rawUrl).trim();
  if (!url) return undefined;

  url = url
    .replace(/https:\/\//gi, 'https://')
    .replace(/http:\/\//gi, 'http://')
    .replace(/https\/\//gi, 'https://')
    .replace(/http\/\//gi, 'http://');

  const httpsIndex = url.lastIndexOf('https://');
  const httpIndex = url.lastIndexOf('http://');
  const startIndex = Math.max(httpsIndex, httpIndex);

  if (startIndex > 0) {
    url = url.slice(startIndex);
  }

  const lower = url.toLowerCase();
  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    if (lower.startsWith('https://example.com') || lower.startsWith('http://example.com')) {
      return undefined;
    }
    return url;
  }

  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/|\?|#)/i.test(url)) {
    if (url.toLowerCase().startsWith('example.com')) return undefined;
    return `https://${url}`;
  }

  return undefined;
}
