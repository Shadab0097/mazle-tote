'use client';

import { usePathname } from 'next/navigation';

/**
 * JSON-LD structured data component.
 * Tells Google exactly what your business is so it shows rich results.
 */
export default function JsonLd() {
    const pathname = usePathname();

    // Organization schema — shows on all pages
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Mazel Tote",
        "url": "https://mazeltote.com",
        "logo": "https://mazeltote.com/logo.png",
        "description": "Premium handcrafted tote bags with vibrant sublimation printing. 100% of profits donated to charity.",
        "foundingDate": "2026",
        "founder": {
            "@type": "Person",
            "name": "Brielle H."
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "support@mazeltote.com",
            "contactType": "customer service"
        },
        "sameAs": []
    };

    // WebSite schema — helps Google show sitelinks
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Mazel Tote",
        "alternateName": ["Mazel", "MazelTote", "Mazel Tote Bags"],
        "url": "https://mazeltote.com",
    };

    // Only show on homepage
    if (pathname !== '/') {
        return (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
        );
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
        </>
    );
}
