import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import LazyNewsletterModal from '@/components/LazyNewsletterModal';
import JsonLd from '@/components/JsonLd';

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <JsonLd />
            <ScrollToTop />
            <LazyNewsletterModal />
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
