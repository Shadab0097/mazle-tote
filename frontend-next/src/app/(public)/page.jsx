'use client';

import React, { useEffect, useCallback, memo } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchProducts } from '@/store/productSlice';
import { addToCart } from '@/store/cartSlice';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { FiArrowRight, FiShoppingBag, FiGlobe, FiSun, FiShield, FiHeart, FiBook } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { stripHtmlForPreview } from '@/utils/stripHtml';

// --- Hero Component ---
const Hero = () => {
    return (
        <section className="relative pt-28 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-[var(--color-bg-secondary)]">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[var(--color-primary)]/20 to-transparent rounded-bl-[10rem] -z-0"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-3xl -z-0"></div>

            {/* MAZEL Masking - Top Watermark */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-full overflow-hidden pointer-events-none select-none z-0 opacity-50 lg:opacity-100">
                <span className="block text-[10rem] sm:text-[14rem] lg:text-[18rem] font-black text-[var(--color-primary)]/10 tracking-widest leading-none text-center whitespace-nowrap">
                    MAZEL
                </span>
            </div>

            <Container className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Text Content */}
                    <div className="lg:w-1/2 space-y-8 text-center lg:text-left order-2 lg:order-1">

                        {/* 100% Donation Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-bold text-sm tracking-wide uppercase mb-4 shadow-sm animate-fade-in-up">
                            <FiHeart className="fill-rose-500 animate-pulse text-rose-500" size={16} />
                            <span>100% of Profits Donated to Charity</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold text-[var(--color-text)] leading-[1.1]">
                            Carry Hope, <br />
                            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-blue-400">
                                Create Impact.
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            <strong>Shop with purpose.</strong> Every Mazel Tote you purchase directly funds verified charities. Look good while doing good.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="/products">
                                <Button size="lg" className="rounded-full h-14 px-8 text-lg flex items-center gap-2 group shadow-xl shadow-blue-500/20">
                                    Shop & Support
                                    <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button variant="secondary" size="lg" className="rounded-full h-14 px-8 text-lg border-2 border-[var(--color-text)] bg-white hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all">
                                    Our Mission
                                </Button>
                            </Link>
                        </div>

                        {/* Impact Indicators - Styled like original avatars but for charity */}
                        <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 opacity-90">
                            <div className="flex -space-x-4">
                                <div className="w-12 h-12 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm z-30">
                                    <FiShield size={20} />
                                </div>
                                <div className="w-12 h-12 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm z-20">
                                    <FiGlobe size={20} />
                                </div>
                                <div className="w-12 h-12 rounded-full border-2 border-white bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm z-10">
                                    <FiHeart size={20} />
                                </div>
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-[var(--color-text)]">
                                    Verified Impact
                                </div>
                                <div className="text-xs text-gray-500">
                                    3+ Partner Charities
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="lg:w-1/2 relative order-1 lg:order-2 w-full max-w-md lg:max-w-none mx-auto lg:pr-12">
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-700 ease-out border-4 lg:border-8 border-white bg-gray-100">
                            <Image
                                src="/hero.png"
                                alt="Mazel Tote Bag Model"
                                width={800}
                                height={1000}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="w-full h-[400px] lg:h-[600px] object-cover"
                                priority
                            />

                            {/* Floating Badge */}
                            <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 bg-white/90 backdrop-blur px-4 py-3 lg:px-6 lg:py-4 rounded-xl lg:rounded-2xl shadow-xl max-w-[180px] lg:max-w-xs">
                                <p className="font-bold text-[var(--color-text)] text-sm lg:text-base">The Classic Shopper</p>
                                <p className="text-xs lg:text-sm text-[var(--color-primary)] font-semibold">$20.00</p>
                            </div>
                        </div>
                        {/* Decorative Element behind image */}
                        <div className="absolute -top-6 -right-2 lg:-top-10 lg:-right-4 w-full h-full border-4 border-[var(--color-primary)] rounded-3xl -z-10 hidden lg:block"></div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

// --- Meet Founder Component ---
const MeetFounder = () => {
    return (
        <section className="py-24 bg-[var(--color-bg-secondary)] relative overflow-hidden">
            {/* MAZEL Masking Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none select-none">
                <span className="absolute -top-20 left-1/2 -translate-x-1/2 text-[15rem] md:text-[22rem] font-black text-[var(--color-primary)]/5 tracking-widest leading-none whitespace-nowrap z-0">
                    MAZEL
                </span>
            </div>

            {/* Top Fade */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white via-[var(--color-bg-secondary)]/50 to-transparent z-10 pointer-events-none" />

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-[var(--color-bg-secondary)]/50 to-transparent z-10 pointer-events-none" />

            <Container className="relative z-10">
                {/* Section Header - Stylish */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--color-primary)]/50"></span>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">Our Story</span>
                        <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--color-primary)]/50"></span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-text)] leading-tight">
                        The Heart Behind{" "}
                        <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-blue-400">
                            Mazel Tote
                        </span>
                    </h2>
                    <p className="mt-4 text-gray-500 max-w-xl mx-auto text-base md:text-lg">
                        A young visionary on a mission to spread kindness and repair the world, one tote at a time.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Image Side */}
                    <div className="lg:w-1/2 relative order-1">
                        <div className="absolute inset-0 bg-[var(--color-primary)]/10 rounded-[2rem] transform rotate-3 scale-105 -z-10"></div>
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/founder.png"
                                alt="Brielle Harbur - Founder"
                                width={800}
                                height={1000}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[var(--color-primary)]/10 rounded-full blur-3xl -z-10"></div>

                        {/* Quote Card */}
                        <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-100 hidden sm:block">
                            <p className="text-[var(--color-primary)] font-bold text-lg mb-1">"Repairing the world"</p>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tikkun Olam • תִּיקּוּן עוֹלָם</p>
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="lg:w-1/2 space-y-8 order-2">
                        <div>
                            <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold text-xs tracking-wide uppercase mb-3">
                                Founder & Designer
                            </div>
                            <h3 className="text-3xl lg:text-4xl font-extrabold text-[var(--color-text)] leading-tight mb-2">
                                Brielle H.
                            </h3>
                            <p className="text-[var(--color-primary)] font-medium text-sm">
                                12-year-old entrepreneur • Boca Raton, Florida
                            </p>
                        </div>

                        <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                            <p>
                                "Hello, welcome to Mazel Tote! My name is <strong className="text-[var(--color-text)]">Brielle H.</strong>, and I am the owner, founder, and creative designer of this business. I am currently 12 years old and located in Boca Raton, Florida."
                            </p>
                            <p>
                                "I am proud to be Jewish and live by the core Jewish value of <em className="font-serif text-[var(--color-primary)] font-bold">Tikkun Olam</em> (תִּיקּוּן עוֹלָם), which translates to 'repairing the world.' It encourages us to improve the world through social justice and acts of kindness."
                            </p>
                            <p>
                                "I have a dream to end antisemitism. I want to create these bags not only to make a cute fashion statement for others but also to raise money to help stop antisemitism. After the attack in Bondi, Australia, I realized that antisemitism has grown worldwide, and I want to do my part to help."
                            </p>
                            <p className="font-medium text-[var(--color-text)]">
                                "I know I may not be able to solve the problem entirely, but I can help raise awareness. So, by buying a bag, you’re carrying hope toward ending antisemitism."
                            </p>
                            <p className="font-bold text-[var(--color-text)] text-xl pt-2 font-handwriting">
                                "Thank you for visiting Mazel Tote!"
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

// --- Mission/Vision Component ---
const MissionVision = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -left-[10%] top-[20%] w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
                <div className="absolute right-[0%] bottom-[0%] w-[400px] h-[600px] bg-gradient-to-t from-[var(--color-primary)]/5 to-transparent rounded-l-full blur-2xl"></div>
            </div>

            <Container className="relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold text-xs tracking-wide uppercase mb-3">
                        Our Purpose
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--color-text)] mb-4">
                        Purpose in Every <span className="text-[var(--color-primary)]">Stitch.</span>
                    </h2>
                    <p className="text-gray-600 text-lg">
                        We don't just make bags. We craft vessels for your daily journey, ethically built and designed to last.
                    </p>
                </div>

                {/* The Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Mission */}
                    <div className="group bg-[var(--color-bg-secondary)] p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[var(--color-primary)]/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white text-[var(--color-primary)] rounded-xl flex items-center justify-center mb-6 shadow-sm">
                                <FiGlobe size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                                To empower individuals to carry their values with pride. We blend high-quality fashion with a deep commitment to Tikkun Olam, dedicating our platform to fighting antisemitism and fostering global unity.
                            </p>
                        </div>
                    </div>

                    {/* Vision */}
                    <div className="group bg-[var(--color-bg-secondary)] p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[var(--color-primary)]/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white text-[var(--color-primary)] rounded-xl flex items-center justify-center mb-6 shadow-sm">
                                <span className="text-lg font-bold">★</span>
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                                A future where every accessory tells a story of hope. We see a world where style serves a higher purpose, turning everyday interactions into opportunities for education, connection, and repairing the world.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

// --- Charity Partners Component ---
const CharityPartners = () => {
    const charities = [
        {
            name: "StandWithUs",
            desc: "An international non-profit organization that prioritizes education about Israel and fights antisemitism around the world.",
            link: "https://www.standwithus.org",
            icon: FiGlobe
        },
        {
            name: "Combat Campus Antisemitism",
            desc: "Dedicated to ending hate and harassment against Jewish students on college campuses through rapid response and education.",
            link: "https://www.combatcampusantisemitism.org/",
            icon: FiBook
        },
        {
            name: "Blue Square Alliance",
            desc: "Standing up against Jewish hate and promoting pride through the Blue Square campaign.",
            link: "https://www.bluesquarealliance.org/",
            icon: FiHeart
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <Container>
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold text-xs tracking-wide uppercase mb-3">
                        Making a Difference
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--color-text)] mb-4">
                        Your Purchase <span className="text-[var(--color-primary)]">Matters.</span>
                    </h2>
                    <p className="text-gray-600 text-lg">
                        100% of the proceeds from your purchase go directly to the charity of your choice. You choose where your impact goes at checkout.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {charities.map((charity, idx) => (
                        <div key={idx} className="bg-[var(--color-bg-secondary)] p-8 rounded-[2rem] hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[var(--color-primary)]/20 group cursor-pointer" onClick={() => window.open(charity.link, '_blank')}>
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[var(--color-primary)] mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <charity.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--color-text)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">{charity.name}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                {charity.desc}
                            </p>
                            <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                                Learn More <FiArrowRight />
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

const Marquee = () => {
    return (
        <div className="bg-[var(--color-primary)] py-4 overflow-hidden">
            <div className="flex gap-8 items-center animate-marquee whitespace-nowrap text-white font-bold tracking-wider">
                {[...Array(10)].map((_, i) => (
                    <React.Fragment key={i}>
                        <span>TIKKUN OLAM</span>
                        <span className="inline-flex items-center justify-center w-8"><FaHeart className="text-white" size={18} /></span>
                        <span>REPAIRING THE WORLD ONE TOTE AT A TIME</span>
                        <span className="inline-flex items-center justify-center w-8"><FaHeart className="text-white" size={18} /></span>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

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

            {/* ---------------------------------------------------------------------------- */}

            {/* Animated Hanging Pre-Order Badge */}
            <div className="absolute -top-1 right-4 z-20 animate-sway origin-top">
                <div className="bg-[var(--color-primary)] text-white w-16 h-24 shadow-lg flex flex-col items-center justify-center p-2 clip-path-badge before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent">
                    <span className="text-[7px] font-black uppercase tracking-tight mb-1 leading-tight text-center opacity-90 border-b border-white/20 pb-1 mb-1 w-full">Coming<br />Soon</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mb-0 opacity-80">Pre</span>
                    <span className="text-xs font-extrabold uppercase tracking-wider relative z-10">Order</span>
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full mt-1.5 shadow-inner"></div>
                </div>
            </div>


            {/* ------------------------------------------------------------------------------------------------- */}



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

const Home = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { items: products, loading } = useSelector((state) => state.products);

    useEffect(() => {
        // Optimization: Only fetch if we don't have products yet
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

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
        <div className="flex flex-col min-h-screen bg-white">
            <Hero />

            <Marquee />

            {/* Featured Collection */}
            <section id="collections" className="pt-24 bg-white">
                <Container>
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-[var(--color-primary)] font-bold tracking-wider uppercase text-sm">Curated For You</span>
                        <h2 className="text-4xl font-bold text-[var(--color-text)] mt-2 mb-4">Featured Collection</h2>
                        <div className="h-1 w-20 bg-[var(--color-primary)] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
                            ))
                        ) : (
                            featuredProducts.map(product => (
                                <ProductCardComponent key={product._id} product={product} onAddToCart={handleAddToCart} />
                            ))
                        )}
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

            <CharityPartners />
            <MeetFounder />
            <MissionVision />
        </div>
    );
};

export default Home;