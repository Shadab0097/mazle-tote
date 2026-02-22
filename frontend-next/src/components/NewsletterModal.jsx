'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FiX, FiMail } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/services/api';
import { useToast } from '@/context/ToastContext';

const NewsletterModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname.startsWith('/admin')) return;

        const hasSeenModal = localStorage.getItem('mazel_newsletter_seen');

        if (!hasSeenModal) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 30000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('mazel_newsletter_seen', 'true');
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            await api.post('/api/subscribers/subscribe', { email });
            toast.success('Successfully subscribed to newsletter!');
            setEmail('');
            handleClose();
        } catch (error) {
            const msg = error.response?.data?.message || 'Subscription failed';
            if (msg.includes('already subscribed')) {
                toast.info(msg);
                handleClose();
            } else {
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 transform transition-all">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-2"
                >
                    <FiX size={24} />
                </button>

                <div className="p-8 md:p-10 text-center">
                    <div className="w-16 h-16 bg-[#F5F8FA] text-[#8ABEE8] rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiMail size={32} />
                    </div>

                    <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2 font-heading">Join the Community</h2>
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                        Sign up for exclusive offers, new product launches, and sustainable design news.
                    </p>

                    <form onSubmit={handleSubscribe} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full text-center bg-[#F5F8FA] border-transparent focus:border-[#8ABEE8] h-12"
                            disabled={loading}
                        />
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 font-bold text-base"
                        >
                            {loading ? 'Subscribing...' : 'Subscribe Now'}
                        </Button>
                    </form>

                    <button
                        onClick={handleClose}
                        className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors underline decoration-dotted"
                    >
                        No thanks, I&apos;ll shop later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewsletterModal;
