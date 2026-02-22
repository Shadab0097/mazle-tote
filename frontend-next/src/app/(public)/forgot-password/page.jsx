'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi';
import api from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resetUrl, setResetUrl] = useState(''); // For development testing only
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/api/auth/forgot-password', { email });
            setSuccess(true);
            // In development, the API returns the reset URL for testing
            if (response.data.resetUrl) {
                setResetUrl(response.data.resetUrl);
            }
            toast.success('Reset link sent successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center py-12">
            <Container className="max-w-md w-full">
                <Card className="p-8 shadow-xl">
                    {!success ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-[var(--color-primary)] mb-4">
                                    <FiMail className="w-8 h-8" />
                                </div>
                                <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
                                <p className="text-gray-500">
                                    No worries! Enter your email and we'll send you a reset link.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        icon={<FiMail className="text-gray-400" />}
                                        required
                                    />
                                </div>

                                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                    {!loading && <FiArrowRight className="ml-2" />}
                                </Button>
                            </form>

                            <div className="mt-8 text-center">
                                <Link href="/login"
                                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors"
                                >
                                    <FiArrowLeft /> Back to Login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-6">
                                <FiCheck className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
                            <p className="text-gray-500 mb-8">
                                We've sent a password reset link to <strong className="text-[var(--color-text)]">{email}</strong>.
                                Check your inbox and click the link to reset your password.
                            </p>

                            {/* Development only - show reset URL */}
                            {resetUrl && (
                                <div className="p-4 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                                    <p className="text-xs text-yellow-700 font-bold uppercase mb-2">Development Only</p>
                                    <a
                                        href={resetUrl}
                                        className="text-sm text-blue-600 hover:underline break-all"
                                    >
                                        {resetUrl}
                                    </a>
                                </div>
                            )}

                            <Link href="/login">
                                <Button variant="secondary" className="w-full">
                                    <FiArrowLeft className="mr-2" /> Back to Login
                                </Button>
                            </Link>
                        </div>
                    )}
                </Card>
            </Container>
        </div>
    );
};

export default ForgotPassword;
