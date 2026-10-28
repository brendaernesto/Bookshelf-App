/**
 * Sanitization utilities to protect against XSS (Cross-Site Scripting)
 * and ensure safe HTML/string rendering in the application.
 */

/**
 * Escapes potentially dangerous HTML characters and removes malicious tags/scripts.
 */
export function sanitizeText(input: unknown): string {
  if (input === null || input === undefined) return '';
  let str = String(input);

  // 1. Strip script, iframe, object, embed, style tags and their contents
  str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  str = str.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  str = str.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  str = str.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  str = str.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // 2. Remove inline event handlers (e.g. onerror=..., onclick=..., onload=...)
  str = str.replace(/on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Remove javascript: or vbscript: pseudoprotocols
  str = str.replace(/javascript:[^\s"'>]*/gi, '');
  str = str.replace(/vbscript:[^\s"'>]*/gi, '');

  // 4. Strip any residual raw HTML brackets to prevent tag injection in text contexts
  str = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  return str.trim();
}

/**
 * Unescapes safe HTML entities for display in plain text inputs/textareas
 */
export function unescapeText(input: unknown): string {
  if (!input) return '';
  return String(input)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");
}

/**
 * Validates and sanitizes URLs to ensure they only use http:, https:
 * or safe base64 data URLs for images (png, jpeg, webp, gif).
 */
export function sanitizeUrl(url: unknown, fallback: string = ''): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();

  // Allow safe base64 data URLs for user image uploads
  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) {
    return trimmed;
  }

  // Allow standard http/https protocols
  if (/^https?:\/\/[^\s"'<>]+$/i.test(trimmed)) {
    return trimmed;
  }

  // Reject javascript:, file:, data:text/html, etc.
  return fallback;
}

/**
 * Sanitizes an array of tags, removing invalid characters, length limits, and XSS risks
 */
export function sanitizeTags(tags: unknown[]): string[] {
  if (!Array.isArray(tags)) return [];
  return tags
    .map(t => {
      const clean = sanitizeText(t).replace(/[^\w\sáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ#-]/g, '').trim();
      return clean.startsWith('#') ? clean : `#${clean}`;
    })
    .filter(t => t.length > 1 && t.length <= 40)
    .slice(0, 30);
}
