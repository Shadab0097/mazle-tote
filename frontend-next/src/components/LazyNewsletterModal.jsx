'use client';

import dynamic from 'next/dynamic';

const NewsletterModal = dynamic(() => import('@/components/NewsletterModal'), {
    ssr: false,
});

export default function LazyNewsletterModal() {
    return <NewsletterModal />;
}
