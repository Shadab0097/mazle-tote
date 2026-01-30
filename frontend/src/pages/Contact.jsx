import { useState } from 'react';
import { FiMail, FiMessageSquare, FiArrowRight, FiCheck } from 'react-icons/fi';
import api from '../services/api';
import { Container } from '@/components/ui/Container';
import { useToast } from '../context/ToastContext';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
    });
    // Removed local status state in favor of toast
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/api/contact', formData);
            toast.success(response.data.message || 'Message sent successfully!');
            setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen pt-20">
            <section id="contact" className="relative py-24 lg:py-32 bg-white overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#8ABEE8]/5 rounded-bl-[10rem] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8ABEE8]/10 rounded-full blur-3xl pointer-events-none"></div>

                <Container className="relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

                        {/* Left: Heading & Info */}
                        <div className="lg:w-5/12 text-[#2C2C2C] space-y-12">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5F8FA] rounded-full text-[#8ABEE8] font-bold text-sm tracking-widest uppercase mb-6">
                                    <span className="w-2 h-2 rounded-full bg-[#8ABEE8] animate-pulse"></span> Get in Touch
                                </div>
                                <h2 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6">
                                    Let's Craft <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ABEE8] to-[#5fa3db]">Something New.</span>
                                </h2>
                                <p className="text-xl text-gray-500 font-light leading-relaxed">
                                    Have a question about our materials, shipping, or just want to say hello? We're here to listen.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-[#F5F8FA] text-[#8ABEE8] flex items-center justify-center group-hover:bg-[#8ABEE8] group-hover:text-white transition-all duration-300">
                                        <FiMail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1">Wholesale Inquiries</h4>
                                        <p className="text-gray-500">partnerships@mazeltote.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-[#F5F8FA] text-[#8ABEE8] flex items-center justify-center group-hover:bg-[#8ABEE8] group-hover:text-white transition-all duration-300">
                                        <FiMessageSquare className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1">Customer Care</h4>
                                        <p className="text-gray-500">hello@mazeltote.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 border-t border-gray-100 italic text-gray-400 font-light">
                                <p>We typically respond within 24-48 hours during business days.</p>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="lg:w-7/12">
                            <div className="bg-white rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-gray-100 border border-gray-100 relative overflow-hidden">
                                {/* Form Decoration */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5F8FA] rounded-bl-full -mr-16 -mt-16"></div>

                                {/* Removed inline status message */}

                                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wide ml-1">Your Name</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-[#F5F8FA] border-2 border-transparent focus:border-[#8ABEE8] px-6 py-4 rounded-xl outline-none transition-colors font-medium text-[#2C2C2C] placeholder-gray-400"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wide ml-1">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-[#F5F8FA] border-2 border-transparent focus:border-[#8ABEE8] px-6 py-4 rounded-xl outline-none transition-colors font-medium text-[#2C2C2C] placeholder-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wide ml-1">Subject</label>
                                        <div className="relative">
                                            <select
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full bg-[#F5F8FA] border-2 border-transparent focus:border-[#8ABEE8] px-6 py-4 rounded-xl outline-none transition-colors font-medium text-[#2C2C2C] cursor-pointer appearance-none"
                                            >
                                                <option>General Inquiry</option>
                                                <option>Order Support</option>
                                                <option>Wholesale</option>
                                                <option>Press</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wide ml-1">Message</label>
                                        <textarea
                                            required
                                            rows="4"
                                            placeholder="How can we help you?"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-[#F5F8FA] border-2 border-transparent focus:border-[#8ABEE8] px-6 py-4 rounded-xl outline-none transition-colors font-medium text-[#2C2C2C] placeholder-gray-400 resize-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full bg-[#2C2C2C] text-white font-bold text-lg py-5 rounded-xl hover:bg-[#8ABEE8] hover:shadow-lg hover:shadow-[#8ABEE8]/30 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Sending...' : 'Send Message'}
                                        {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </Container>
            </section>
        </div>
    );
};

export default Contact;
