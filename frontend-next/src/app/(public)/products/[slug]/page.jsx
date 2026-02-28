import ProductDetailClient from './ProductDetailClient';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { stripHtmlForPreview } from '@/utils/stripHtml';

async function getProduct(slug) {
    try {
        const apiUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/products/${slug}`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    const description = product.description
        ? stripHtmlForPreview(product.description).slice(0, 160)
        : `Shop ${product.name} at Mazel Tote. Premium handcrafted tote bag. 100% of profits donated to charity.`;

    return {
        title: `${product.name} — Mazel Tote`,
        description,
        openGraph: {
            title: `${product.name} — Mazel Tote`,
            description,
            images: product.images?.[0] ? [{ url: product.images[0] }] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.name} — Mazel Tote`,
            description,
            images: product.images?.[0] ? [product.images[0]] : [],
        },
    };
}

export default async function ProductDetail({ params }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 text-center bg-white">
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-[var(--color-text)]">Product Not Found</h2>
                    <p className="text-gray-500 mb-6">The product you&apos;re looking for doesn&apos;t seem to exist.</p>
                    <Link href="/products">
                        <Button size="lg">Back to Collection</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return <ProductDetailClient product={product} />;
}

// trigger rebuild