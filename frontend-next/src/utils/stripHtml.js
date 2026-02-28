/**
 * Strips HTML tags, entities, and section titles from a description
 * to produce a clean plain-text preview for product cards.
 * Works in both server and client environments.
 */
export const stripHtmlForPreview = (html) => {
    if (!html) return '';

    return html
        // 1. Remove headings entirely so their text isn't in the preview
        .replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, '')
        // 2. Remove strong/b tags entirely if they are short (e.g. "Material:")
        .replace(/<(b|strong)[^>]*>([^<]{1,30})<\/\1>/gi, '')
        // 3. Remove all other HTML tags WITHOUT adding spaces (matches browser textContent exact behavior)
        .replace(/<[^>]+>/g, '')
        // 4. Decode common HTML entities
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&nbsp;/g, ' ')
        // 5. Normalize whitespace
        .replace(/\s+/g, ' ')
        .trim();
};
