/**
 * Strips HTML tags, entities, and section titles from a description
 * to produce a clean plain-text preview for product cards.
 */
export const stripHtmlForPreview = (html) => {
    if (!html) return '';

    // Create a temporary DOM element to properly parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Remove all heading elements (h1-h6) entirely
    temp.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => el.remove());

    // Remove short bold/strong text (section titles like "Product Overview", "Material", "Size")
    temp.querySelectorAll('b, strong').forEach(el => {
        const text = el.textContent.trim();
        // If bold text is short (likely a section title), remove it
        if (text.length < 30) el.remove();
    });

    // Get clean text content (automatically strips all tags & decodes entities)
    return temp.textContent?.replace(/\s+/g, ' ').trim() || '';
};
