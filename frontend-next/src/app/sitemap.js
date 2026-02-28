export default async function sitemap() {
    const baseUrl = 'https://mazeltote.com';

    // Static pages with their priorities
    const staticPages = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
        { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ];

    // Dynamically fetch all product slugs for individual product pages
    let productPages = [];
    try {
        const apiUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/products`, {
            next: { revalidate: 3600 }, // Rebuild sitemap hourly
        });
        if (res.ok) {
            const products = await res.json();
            productPages = products.map((product) => ({
                url: `${baseUrl}/products/${product.slug}`,
                lastModified: new Date(product.updatedAt || product.createdAt),
                changeFrequency: 'weekly',
                priority: 0.8,
            }));
        }
    } catch {
        // Silently fail — static pages will still be indexed
    }

    return [...staticPages, ...productPages];
}
