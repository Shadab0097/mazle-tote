import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import NewsletterModal from '@/components/NewsletterModal';
import JsonLd from '@/components/JsonLd';

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <JsonLd />
            <ScrollToTop />
            <NewsletterModal />
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}

