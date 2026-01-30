import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin, clearError } from '../store/authSlice';
import { FiMail, FiLock, FiArrowRight, FiShield, FiCheckCircle } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAdmin } = useSelector((state) => state.auth);
    const toast = useToast();

    useEffect(() => {
        if (isAdmin) navigate('/admin');
        if (error) toast.error(error);
        return () => dispatch(clearError());
    }, [isAdmin, navigate, dispatch, error, toast]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(loginAdmin(formData));
    };

    return (
        <div className="min-h-screen bg-[#F5F8FA] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden selection:bg-[#8ABEE8] selection:text-white">

            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Gradient Blobs */}
                <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-200/40 to-blue-200/40 blur-[80px] animate-pulse duration-[5000ms]"></div>
                <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-[#8ABEE8]/20 to-teal-200/20 blur-[60px]"></div>
                <div className="absolute -bottom-[10%] right-[20%] w-[30%] h-[30%] rounded-full bg-gradient-to-t from-pink-200/30 to-rose-100/30 blur-[50px]"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(138,190,232,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(138,190,232,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            {/* Decorative Text Watermark - Visible on all sizes */}
            <div className="absolute top-10 left-0 -translate-x-1/4 sm:translate-x-0 sm:left-10 text-[120px] md:text-[180px] lg:text-[250px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-100 opacity-60 leading-none pointer-events-none select-none tracking-tighter z-0 drop-shadow-sm">
                MAZEL
            </div>

            <div className="w-full max-w-md mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-2xl shadow-[#8ABEE8]/10 border border-white/50 ring-1 ring-white/50">

                <div className="mb-8 text-center lg:text-left">
                    <Link to="/" className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F5F8FA] rounded-full text-gray-500 hover:text-[#2C2C2C] font-bold text-[10px] tracking-widest uppercase mb-4 transition-colors">
                        ← Back to Store
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2C] mb-2 tracking-tight leading-tight">
                        Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ABEE8] to-blue-400">Portal.</span>
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed">
                        Secure access for authorized personnel only.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#2C2C2C] uppercase tracking-wide ml-1">Admin Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#8ABEE8] transition-colors">
                                <FiMail size={18} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="admin@mazel.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/80 border-2 border-gray-100 focus:border-[#8ABEE8] rounded-xl outline-none text-[#2C2C2C] font-medium placeholder-gray-400 text-sm transition-all duration-300 shadow-sm focus:shadow-md focus:bg-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#2C2C2C] uppercase tracking-wide ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#8ABEE8] transition-colors">
                                <FiLock size={18} />
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/80 border-2 border-gray-100 focus:border-[#8ABEE8] rounded-xl outline-none text-[#2C2C2C] font-medium placeholder-gray-400 text-sm transition-all duration-300 shadow-sm focus:shadow-md focus:bg-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2C2C2C] text-white font-bold text-base md:text-lg py-4 rounded-xl hover:bg-[#8ABEE8] hover:shadow-lg hover:shadow-[#8ABEE8]/30 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading ? 'Authenticating...' : 'Access Dashboard'} <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-6 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1.5">
                        <FiShield size={12} className="text-green-500" /> Secure System
                    </span>
                    <span className="flex items-center gap-1.5">
                        <FiCheckCircle size={12} className="text-[#8ABEE8]" /> Authorized Only
                    </span>
                </div>

                <p className="text-center text-gray-300 text-[10px] mt-6 tracking-widest uppercase">
                    &copy; 2026 Mazel Tote System
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
