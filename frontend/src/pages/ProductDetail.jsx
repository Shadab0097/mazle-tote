import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductBySlug, clearCurrentProduct } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import { useToast } from '../context/ToastContext';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import {
  FiChevronLeft,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiShield,
  FiGlobe,
} from 'react-icons/fi';

// Image Zoom Component
const ImageZoom = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className="relative aspect-square rounded-2xl overflow-hidden cursor-zoom-in bg-gray-100 group"
      onClick={() => setIsZoomed(!isZoomed)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsZoomed(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300"
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
          transform: isZoomed ? 'scale(2)' : 'scale(1)',
        }}
      />
      {!isZoomed && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            Click to zoom
          </span>
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct: product, loading, error } = useSelector((state) => state.products);
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    window.scrollTo(0, 0);
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, slug]);

  useEffect(() => {
    if (product?.images?.[0]) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  const handleQuantity = (type) => {
    if (type === 'minus' && quantity > 1) setQuantity((q) => q - 1);
    if (type === 'plus' && quantity < (product?.stock || 10)) setQuantity((q) => q + 1);
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          product: product._id,
          name: product.name,
          price: product.price,
          image: activeImage || product.images?.[0] || '',
          quantity,
        })
      );
      toast.success(`Added ${product.name} to cart`);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center bg-white">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-[var(--color-text)]">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't seem to exist.</p>
          <Link to="/products">
            <Button size="lg">Back to Collection</Button>
          </Link>
        </div>
      </div>
    );
  }

  const features = [
    '100% Organic Cotton Canvas',
    'Reinforced Handles',
    'Internal Laptop Sleeve',
    'Waterproof Lining',
  ];

  return (
    <div className="pt-24 pb-24 lg:pt-32 lg:pb-32 bg-white min-h-screen">
      <Container>
        {/* Breadcrumb / Back */}
        <Link
          to="/products"
          className="group inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary)] mb-8 font-medium transition-colors"
        >
          <div className="p-2 rounded-full bg-gray-100 group-hover:bg-[var(--color-primary)]/10 transition-colors">
            <FiChevronLeft size={20} />
          </div>
          Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column: Images */}
          <div className="space-y-6">
            <ImageZoom src={activeImage || product.images?.[0]} alt={product.name} />

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === img
                      ? 'border-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/10 scale-95'
                      : 'border-transparent hover:border-gray-200'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div className="flex flex-col h-full">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {product.stock > 0 ? (
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Out of Stock
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--color-text)] mb-6 leading-tight">
                {product.name}
              </h1>
              <p className="text-2xl md:text-3xl text-gray-500 font-medium">${product.price}</p>
            </div>

            <div className="prose prose-base md:prose-lg text-gray-600 mb-10 leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Features */}
            <div className="mb-8 py-6 border-y border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Quantity */}
                <div className="flex items-center border border-gray-200 rounded-full px-4 h-14 w-full md:w-auto justify-between md:justify-start">
                  <button
                    onClick={() => handleQuantity('minus')}
                    className="p-2 hover:text-[var(--color-primary)] transition-colors"
                  >
                    <FiMinus size={18} />
                  </button>
                  <span className="w-8 text-center font-bold text-[var(--color-text)]">{quantity}</span>
                  <button
                    onClick={() => handleQuantity('plus')}
                    className="p-2 hover:text-[var(--color-primary)] transition-colors"
                  >
                    <FiPlus size={18} />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-[var(--color-text)] text-white rounded-full font-bold text-lg h-16 md:h-14 px-12 hover:bg-[var(--color-primary)] hover:shadow-lg hover:shadow-[var(--color-primary)]/30 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  <FiShoppingBag size={20} />
                  Add to Cart
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest pt-4 border-t border-gray-50">
                <span className="flex items-center gap-2">
                  <FiShield size={16} /> Lifetime Warranty
                </span>
                <span className="flex items-center gap-2">
                  <FiGlobe size={16} /> Free Shipping Worldwide
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetail;