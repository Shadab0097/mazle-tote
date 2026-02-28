'use client';

import React, { useCallback, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { Container } from '@/components/ui/Container';
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { stripHtmlForPreview } from '@/utils/stripHtml';

// --- Product Card Component ---
const ProductCardComponent = memo(({ product, onAddToCart }) => (
    <div className="w-full h-full group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
        <div className="relative overflow-hidden aspect-[4/5]">
            {product.images?.[0] ? (
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
            ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                    No Image
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

            {/* Tag - Logic could be expanded */}
            {product.isHottest && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 uppercase tracking-wide rounded-full shadow-md flex items-center gap-1.5 z-10">
                    <span className="text-sm">🔥</span> Hottest
                </div>
            )}
            {!product.isHottest && product.stock < 10 && product.stock > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 uppercase tracking-wide rounded-full shadow-md flex items-center gap-1.5 animate-pulse">
                    <span className="text-sm">🔥</span> Hurry up! Few left
                </div>
            )}

            <button
                onClick={() => onAddToCart(product)}
                className="absolute bottom-4 right-4 bg-white text-[var(--color-text)] p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white cursor-pointer z-20"
            >
                <FiShoppingBag size={20} />
            </button>
        </div>
        <div className="p-6 flex-grow flex flex-col justify-between">
            <div>
                <Link href={`/products/${product.slug}`}>
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-primary)] transition-colors cursor-pointer">{product.name}</h3>
                </Link>
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
        </div>
    </div>
));

const HomeClient = ({ products }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleAddToCart = useCallback((product) => {
        dispatch(addToCart({
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            quantity: 1,
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        router.push('/cart');
    }, [dispatch, router]);

    // Use specific products if available, otherwise fallback
    const featuredProducts = products.slice(0, 3);

    return (
        <section id="collections" className="pt-24 bg-white">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[var(--color-primary)] font-bold tracking-wider uppercase text-sm">Curated For You</span>
                    <h2 className="text-4xl font-bold text-[var(--color-text)] mt-2 mb-4">Featured Collection</h2>
                    <div className="h-1 w-20 bg-[var(--color-primary)] mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProducts.map(product => (
                        <ProductCardComponent key={product._id} product={product} onAddToCart={handleAddToCart} />
                    ))}
                </div>

                <div className="text-center mt-16">
                    <Link href="/products">
                        <button className="inline-flex items-center gap-2 text-[var(--color-text)] font-bold border-b-2 border-[var(--color-primary)] pb-1 hover:text-[var(--color-primary)] transition-colors">
                            View All Products <FiArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </Container>
        </section>
    );
};

export default HomeClient;
