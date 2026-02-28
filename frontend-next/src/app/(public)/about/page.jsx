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
                <div className="absolute top-20 left-0 text-[180px] lg:text-[250px] font-bold text-gray-50 opacity-100 leading-none pointer-events-none select-none hidden lg:block tracking-tighter">
                    MAZEL
                </div>

                <Container className="relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                        {/* Left: Artistic Image Composition */}
                        <div className="lg:w-1/2 relative mb-16 lg:mb-0">
                            {/* Main Tall Image */}
                            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl w-full max-w-md mx-auto lg:mx-0 border-8 border-white">
                                <Image
                                    src="/Tu-Bav-Tote.png"
                                    alt="Artisan working on bag"
                                    width={800}
                                    height={1000}
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="w-full h-[500px] lg:h-[650px] object-cover hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                                {/* Overlay Content */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                                    <div className="w-2/3 md:w-3/4 sm:-mb-0 -mb-8">
                                        <span className="font-bold text-[var(--color-primary)] uppercase tracking-widest text-xs mb-2 block">Established 2026</span>
                                        <p className="font-light italic text-lg opacity-90 leading-relaxed">"Exclusively designed by a 12-year-old girl located in Boca Raton, FL."</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Offset Image - overlay hanging on mobile with space reserved below */}
                            <div className="absolute sm:-bottom-24  -bottom-8 -right-2 lg:-bottom-24 lg:-right-12 w-32 h-32 lg:w-72 lg:h-72 rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 lg:border-8 border-white z-20 hover:-translate-y-2 transition-transform duration-500">
                                <Image
                                    src="/founder-story.png"
                                    alt="Founder designing"
                                    fill
                                    sizes="288px"
                                    className="object-cover"
                                />
                            </div>

                            {/* Decorative Circle */}
                            <div className="absolute -top-10 -left-10 w-40 h-40 border-2 border-[var(--color-primary)]/30 rounded-full z-0 animate-spin-slow"></div>
                            <div className="absolute bottom-20 -left-20 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl -z-10"></div>
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
