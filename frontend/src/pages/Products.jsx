import React, { useEffect, useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import { Container } from '@/components/ui/Container';
import { FiSearch, FiX, FiShoppingBag } from 'react-icons/fi';
import { stripHtmlForPreview } from '../utils/stripHtml';

// --- Product Card Component ---
const ProductCard = memo(({ product, onAddToCart }) => (
  <div className="w-full h-full group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
    <div className="relative overflow-hidden aspect-[4/5]">
      {product.images?.[0] ? (
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
          <FiShoppingBag size={32} />
        </div>
      )}

      {/* Animated Hanging Pre-Order Badge */}
      <div className="absolute -top-1 right-4 z-20 animate-sway origin-top">
        <div className="bg-[var(--color-primary)] text-white w-16 h-24 shadow-lg flex flex-col items-center justify-center p-2 clip-path-badge before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent">
          <span className="text-[7px] font-black uppercase tracking-tight mb-1 leading-tight text-center opacity-90 border-b border-white/20 pb-1 mb-1 w-full">Coming<br />Soon</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mb-0 opacity-80">Pre</span>
          <span className="text-xs font-extrabold uppercase tracking-wider relative z-10">Order</span>
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full mt-1.5 shadow-inner"></div>
        </div>
      </div>

      {product.isHottest && (
        <span className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 uppercase tracking-wide rounded-full shadow-md flex items-center gap-1.5 z-10">
          <span className="text-sm">🔥</span> Hottest
        </span>
      )}
      {!product.isHottest && product.stock < 10 && product.stock > 0 && (
        <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 uppercase tracking-wide rounded-full shadow-md flex items-center gap-1.5 animate-pulse">
          <span className="text-sm">🔥</span> Hurry up! Few left
        </span>
      )}
      {product.stock === 0 && (
        <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-full">
          Sold Out
        </span>
      )}

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAddToCart(product);
        }}
        disabled={product.stock === 0}
        className="absolute bottom-4 right-4 bg-white text-[var(--color-text)] p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white cursor-pointer z-20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiShoppingBag size={20} />
      </button>
    </div>
    <Link to={`/products/${product.slug}`} className="p-6 flex-grow flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-primary)] transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{stripHtmlForPreview(product.description)}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-lg font-bold text-[var(--color-text)]">${product.price}</span>
        <div className="flex gap-1">
          {['#8ABEE8', '#2C2C2C', '#E5E7EB'].map((color, idx) => (
            <div key={idx} className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color }}></div>
          ))}
        </div>
      </div>
    </Link>
  </div>
));

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Optimization: Only fetch if we don't have products yet
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
        (p.description && p.description.toLowerCase().includes(lowerQuery))
    );
    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  const handleAddToCart = useCallback((product) => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        quantity: 1,
      })
    );
    // Don't navigate to cart immediately, maybe show toast instead? 
    // Keeping navigation for now as per previous behavior
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/cart');
  }, [dispatch, navigate]);

  return (
    <div className="pt-32 pb-24 bg-[var(--color-bg-secondary)] min-h-screen">
      <Container>
        {/* Gallery Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-8 bg-[var(--color-primary)]"></span>
              <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs">The Collection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-text)] leading-[1.1] tracking-tight">
              Find Your Perfect <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-blue-400">Companion.</span>
            </h1>
          </div>

          <div className="w-full md:w-96 relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search totes, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-transparent focus:border-[var(--color-primary)]/30 rounded-2xl outline-none text-[var(--color-text)] font-medium placeholder-gray-400 shadow-sm focus:shadow-xl hover:shadow-md transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-[var(--color-text)]"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-96 bg-white rounded-2xl animate-pulse" />
              ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>

            <div className="mt-20 text-center">
              <p className="text-gray-400 text-sm">Showing {filteredProducts.length} results</p>
            </div>
          </>
        ) : (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
              <FiSearch size={32} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">No matches found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn't find any products matching "{searchQuery}". Try searching for "Tote" or "Canvas".
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[var(--color-primary)] font-bold hover:text-[var(--color-text)] transition-colors border-b-2 border-[var(--color-primary)] pb-1"
            >
              Clear Search & View All
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Products;