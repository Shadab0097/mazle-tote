import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiLock, FiArrowRight, FiCheck } from 'react-icons/fi';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const ResetPassword = () => {
    const { resetToken } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const toast = useToast();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await api.put(`/api/auth/reset-password/${resetToken}`, {
                password: formData.password,
            });
            setSuccess(true);
            toast.success('Password reset successfully!');
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset password. The link may be expired.');
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
                                    <FiLock className="w-8 h-8" />
                                </div>
                                <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                                <p className="text-gray-500">
                                    Enter your new password below.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">New Password</label>
                                    <Input
                                        type="password"
                                        name="password"
                                        placeholder="Enter new password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        icon={<FiLock className="text-gray-400" />}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Confirm Password</label>
                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm new password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        icon={<FiLock className="text-gray-400" />}
                                        required
                                    />
                                </div>

                                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                    {!loading && <FiArrowRight className="ml-2" />}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-6">
                                <FiCheck className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Password Reset!</h2>
                            <p className="text-gray-500 mb-8">
                                Your password has been successfully reset. Redirecting you to login...
                            </p>

                            <Link to="/login">
                                <Button className="w-full">
                                    Go to Login <FiArrowRight className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </Card>
            </Container>
        </div>
    );
};

export default ResetPassword;
