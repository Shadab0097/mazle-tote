import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await api.post('/api/subscribers/subscribe', { email });
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      // If 400 (already subscribed), show error as info or error
      const msg = error.response?.data?.message || 'Subscription failed';
      if (msg.includes('already subscribed')) {
        toast.info(msg);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-[var(--color-bg-secondary)] pt-8 md:pt-12 pb-6 border-t border-[var(--color-border)]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-10">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" onClick={scrollToTop} className="inline-block mb-3">
              <img src="/logo.png" alt="Mazel Tote" className="h-20 w-auto object-contain" />
            </Link>
            <p className="text-gray-500 text-xs leading-relaxed mb-4 max-w-xs">
              Elevating everyday carry with sustainable luxury. Designed for the modern professional.
            </p>
            <div className="flex gap-3">
              {/* Social placeholders */}
              <div className="w-8 h-8 rounded-full bg-gray-100/80 hover:bg-[#8ABEE8] transition-colors"></div>
              <div className="w-8 h-8 rounded-full bg-gray-100/80 hover:bg-[#8ABEE8] transition-colors"></div>
              <div className="w-8 h-8 rounded-full bg-gray-100/80 hover:bg-[#8ABEE8] transition-colors"></div>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-bold text-sm text-[#2C2C2C] mb-4">Shop</h4>
            <ul className="space-y-2 text-xs text-gray-500 font-medium">
              <li><Link to="/products" onClick={scrollToTop} className="hover:text-[var(--color-primary)] transition-colors">All Products</Link></li>
              <li><Link to="/products" onClick={scrollToTop} className="hover:text-[var(--color-primary)] transition-colors">New Arrivals</Link></li>
              <li><Link to="/products" onClick={scrollToTop} className="hover:text-[var(--color-primary)] transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-sm text-[#2C2C2C] mb-4">Company</h4>
            <ul className="space-y-2 text-xs text-gray-500 font-medium">
              <li><Link to="/about" onClick={scrollToTop} className="hover:text-[var(--color-primary)] transition-colors">Our Story</Link></li>
              <li><Link to="/contact" onClick={scrollToTop} className="hover:text-[var(--color-primary)] transition-colors">Contact</Link></li>
              <li><Link to="/privacy" onClick={scrollToTop} className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-span-1">
            <h4 className="font-bold text-sm text-[#2C2C2C] mb-3">Stay Updated</h4>
            <p className="text-xs text-gray-400 mb-3">Subscribe for exclusive offers and design news.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <Input
                placeholder="Enter your email"
                type="email"
                className="h-9 text-xs bg-white border-gray-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <Button variant="primary" type="submit" disabled={loading} size="sm" className="h-9 text-xs font-bold">
                {loading ? '...' : 'Subscribe'}
              </Button>
            </form>
          </div>

        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 uppercase tracking-wider font-bold">
          <p>© {currentYear} Mazel Tote. All rights reserved.</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            {/* <Link to="/privacy" onClick={scrollToTop} className="hover:text-[var(--color-primary)] transition-colors">Privacy</Link>
            <Link to="/terms" onClick={scrollToTop} className="hover:text-[var(--color-primary)] transition-colors">Terms</Link> */}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;