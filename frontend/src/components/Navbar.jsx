import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { FiShoppingBag, FiMenu, FiX, FiUser } from 'react-icons/fi';
import { logoutUser } from '../store/authSlice';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.info('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { name: 'Shop', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  // Smooth scroll to top when navigation link is clicked
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen
        ? 'bg-white py-4'
        : isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 py-2 shadow-[0_2px_20px_rgba(0,0,0,0.02)]'
          : 'bg-transparent py-4'
        }`}
    >
      <Container>
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Mazel Tote" className="h-16 md:h-20 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation - Clean & Professional */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={scrollToTop}
                className={`text-sm font-medium tracking-wide transition-colors relative group py-2 ${isActive(link.path)
                  ? 'text-[var(--color-text)]'
                  : 'text-gray-500 hover:text-[var(--color-text)]'
                  }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-px bg-[var(--color-text)] transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <FiUser size={18} />
                  <span>{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                <Link to="/login" className="text-sm font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
                  Log In
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-full px-6 text-xs font-bold uppercase tracking-wider">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
            >
              <FiShoppingBag size={20} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {items.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-4">
            <Link to="/cart" className="relative text-[var(--color-text)]">
              <FiShoppingBag size={20} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors z-50 relative"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex flex-col h-full pt-24 pb-10 px-8 overflow-y-auto">
          {/* Nav Links */}
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => { scrollToTop(); setIsOpen(false); }}
                className={`text-3xl font-bold tracking-tight transition-colors ${isActive(link.path) ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto border-t border-gray-100 pt-8 flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => { scrollToTop(); setIsOpen(false); }} className="flex items-center gap-3 text-lg font-medium">
                  <FiUser /> My Profile
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-left text-lg font-medium text-gray-500 hover:text-red-500">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link to="/login" onClick={() => { scrollToTop(); setIsOpen(false); }}>
                  <Button variant="secondary" className="w-full h-12 rounded-xl text-base">Log In</Button>
                </Link>
                <Link to="/register" onClick={() => { scrollToTop(); setIsOpen(false); }}>
                  <Button className="w-full h-12 rounded-xl text-base">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;