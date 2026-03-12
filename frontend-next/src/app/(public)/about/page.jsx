import Link from 'next/link';
import Image from 'next/image';
import { FiScissors, FiArrowRight, FiStar } from 'react-icons/fi';
import { Container } from '@/components/ui/Container';

const About = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Our Story Section */}
            <section id="our-story" className="pt-32 pb-24 lg:pt-48 lg:pb-32 bg-white relative overflow-hidden">
                {/* Decorative Text Watermark */}
                <div className="absolute top-24 lg:top-20 left-0 text-[100px] sm:text-[140px] md:text-[180px] lg:text-[250px] font-bold text-gray-50 opacity-100 leading-none pointer-events-none select-none tracking-tighter w-full overflow-hidden whitespace-nowrap">
                    MAZEL
                </div>

                <Container className="relative z-10 ">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16 lg:gap-24 ">

                        {/* Left Side: Frame & Banner Container */}
                        <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:gap-10 mb-16 lg:mb-0 flex-shrink-0 ml-0 lg:ml-10 mt-8 md:mt-16 lg:mt-28">
                            {/* Elegant Collage Frame Composition */}
                            <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px]">
                                {/* Decorative background blobs */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-[var(--color-primary)]/20 to-blue-200/20 rounded-full blur-[60px] lg:blur-[80px] -z-20 animate-pulse"></div>

                                {/* 1. Main Tote Image - Center/Right */}
                                <div tabIndex="0" className="absolute top-[5%] right-[5%] lg:right-[10%] w-[65%] lg:w-[60%] h-[75%] lg:h-[80%] rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] border-8 border-white z-10 transition-all duration-700 hover:scale-[1.03] focus:scale-[1.03] active:scale-[1.03] hover:shadow-[0_40px_70px_-15px_rgba(0,0,0,0.3)] focus:shadow-[0_40px_70px_-15px_rgba(0,0,0,0.3)] active:shadow-[0_40px_70px_-15px_rgba(0,0,0,0.3)] hover:z-40 focus:z-40 active:z-40 outline-none cursor-pointer">
                                    <Image
                                        src="/Tu-Bav-Tote.png"
                                        alt="Mazel Tote carrying hope"
                                        fill
                                        sizes="(max-width: 1024px) 65vw, 30vw"
                                        className="object-cover"
                                        priority
                                    />
                                </div>

                                {/* 2. Founder Portrait - Top Left */}
                                <div tabIndex="0" className="absolute top-[10%] left-[5%] lg:-left-[5%] w-[45%] lg:w-[45%] h-[40%] lg:h-[45%] rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-[6px] lg:border-8 border-white z-20 transition-all duration-700 hover:-translate-y-3 focus:-translate-y-3 active:-translate-y-3 hover:rotate-0 focus:rotate-0 active:rotate-0 -rotate-6 hover:shadow-[0_40px_70px_-15px_rgba(0,0,0,0.3)] focus:shadow-[0_40px_70px_-15px_rgba(0,0,0,0.3)] active:shadow-[0_40px_70px_-15px_rgba(0,0,0,0.3)] hover:z-40 focus:z-40 active:z-40 outline-none cursor-pointer group">
                                    <Image
                                        src="/founder-story.png"
                                        alt="Brielle - Founder of Mazel Tote"
                                        fill
                                        sizes="(max-width: 1024px) 45vw, 25vw"
                                        className="object-cover group-hover:scale-110 group-focus:scale-110 group-active:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute top-3 left-3 lg:top-4 lg:left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-black/5">
                                        <span className="text-[9px] lg:text-[10px] font-extrabold text-[var(--color-text)] tracking-wider uppercase">The Founder</span>
                                    </div>
                                </div>

                                {/* 3. Booth Image - Bottom Center/Left */}
                                <div tabIndex="0" className="absolute bottom-[0%] lg:bottom-[5%] left-[10%] lg:left-[5%] w-[55%] lg:w-[50%] h-[35%] lg:h-[40%] rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-[6px] lg:border-8 border-white z-30 transition-all duration-700 hover:-translate-y-3 focus:-translate-y-3 active:-translate-y-3 hover:rotate-0 focus:rotate-0 active:rotate-0 rotate-3 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] focus:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] active:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] hover:z-40 focus:z-40 active:z-40 outline-none cursor-pointer group">
                                    <Image
                                        src="/brielle.jpeg"
                                        alt="Brielle at the Mazel Tote booth"
                                        fill
                                        sizes="(max-width: 1024px) 55vw, 25vw"
                                        className="object-cover group-hover:scale-110 group-focus:scale-110 group-active:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-black/5 flex items-center gap-1.5">
                                        <span className="text-[9px] lg:text-[10px] font-extrabold text-[var(--color-text)] tracking-wider uppercase">Spreading Kindness</span>
                                        <span className="text-blue-500 text-[10px] lg:text-[12px]">💙</span>
                                    </div>
                                </div>
                            </div>

                            {/* Animated Typographic Quote (Transparent Background) */}
                            <div className="relative mt-2 lg:mt-4 px-4 lg:px-8 flex flex-col items-start justify-center text-left group z-50">
                                {/* Subtle animated dot/line accent */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-ping opacity-75"></div>
                                    <span className="text-[var(--color-primary)] text-[10px] lg:text-xs font-bold uppercase tracking-[0.3em] font-sans">Established 2026</span>
                                    <div className="h-[1px] w-12 bg-gradient-to-r from-[var(--color-primary)] to-transparent"></div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-500 text-lg lg:text-xl font-light italic leading-relaxed max-w-lg relative">
                                    <span className="absolute -top-4 -left-3 text-4xl text-[var(--color-primary)] opacity-20 font-serif">"</span>
                                    Exclusively designed by a <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-blue-500 relative inline-block group-hover:animate-pulse">12-year-old girl</span> located in Boca Raton, FL.
                                </p>
                            </div>
                        </div>

                        {/* Right: Narrative Content */}
                        <div className="lg:w-1/2 space-y-10">
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-bg-secondary)] rounded-full text-[var(--color-primary)] font-bold text-xs tracking-widest uppercase shadow-sm">
                                <FiStar size={16} /> The Founder's Story
                            </div>

                            <h2 className="text-5xl lg:text-7xl font-extrabold text-[var(--color-text)] leading-[1.05] tracking-tight">
                                Carrying <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-blue-400">
                                    Hope.
                                </span>
                            </h2>

                            <div className="space-y-8 text-lg text-gray-600 leading-relaxed font-light max-w-xl">
                                <p>
                                    Mazel Tote Bags were created for those who carry hope in the face of antisemitism. Exclusively designed by <strong className="font-semibold text-[var(--color-text)]">Brielle H.</strong>, a 12-year-old girl located in Boca Raton, Florida, preparing for her upcoming Bat Mitzvah.
                                </p>
                                <p>
                                    She was inspired by the recent tragic events at Bondi Beach in Australia. Through this bag, she hopes to inspire others to carry hope and envision a world of acceptance and kindness, free from hate.
                                </p>
                                <p>
                                    Featuring fun, vibrant designs inspired by pop culture and trending themes, Mazel Tote Bags blend style with purpose. All proceeds from sales will be donated to one of three charities chosen by the customer, each dedicated to fighting antisemitism and promoting tolerance.
                                </p>
                            </div>

                            {/* Signature / Stats */}
                            <div className="pt-10 flex flex-wrap items-center gap-10 lg:gap-14 border-t border-gray-100">
                                <div className="group">
                                    <span className="block text-4xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">100%</span>
                                    <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">Proceeds Donated</span>
                                </div>
                                <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>
                                <div className="group">
                                    <span className="block text-4xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">3</span>
                                    <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">Charity Partners</span>
                                </div>
                                <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>
                                <Link href="/products" className="flex items-center gap-2 text-[var(--color-primary)] font-bold cursor-pointer group hover:text-[var(--color-text)] transition-colors">
                                    <span className="border-b-2 border-[var(--color-primary)]/30 group-hover:border-[var(--color-text)] pb-1 transition-all">Join The Mission</span>
                                    <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Philosophy Section */}
            <section className="py-24 bg-[var(--color-bg-secondary)] overflow-hidden">
                <Container>
                    <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-[var(--color-text)]">Fighting Antisemitism</h3>
                            <p className="text-gray-500 font-light leading-relaxed">
                                We stand firmly against hate. Every purchase contributes directly to organizations dedicated to education and combating antisemitism worldwide.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-[var(--color-text)]">Tikkun Olam</h3>
                            <p className="text-gray-500 font-light leading-relaxed">
                                "Repairing the World." We believe that small acts of kindness and conscious choices can stitch together a better future for everyone.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-[var(--color-text)]">Global Unity</h3>
                            <p className="text-gray-500 font-light leading-relaxed">
                                Our community spans across borders. We envision a world where acceptance is the norm, and vibrant expression is celebrated.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    )
}

export default About;
