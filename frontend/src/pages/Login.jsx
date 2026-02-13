import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice';
import { useToast } from '../context/ToastContext';
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiUser,
  FiCheckCircle,
  FiShield,
  FiCheck,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

const SecurityBadges = () => (
  <div className="mt-8 flex justify-center lg:justify-start gap-4 lg:gap-6 text-xs text-gray-400 border-t border-gray-100 pt-6 flex-wrap">
    <div className="flex items-center gap-1.5 font-medium">
      <FiShield size={14} className="text-green-500" /> 256-bit SSL Secure
    </div>
    <div className="flex items-center gap-1.5 font-medium">
      <FiCheck size={14} className="text-blue-500" /> Verified Merchant
    </div>
  </div>
);

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Welcome back!');
      navigate('/');
    }
    if (error) toast.error(error);
    return () => dispatch(clearError());
  }, [isAuthenticated, error, navigate, dispatch, toast]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-base)] ">
      <div className="w-full max-w-md mx-auto lg:mx-0 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white">

        <div className="mb-8 md:mb-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-[#F5F8FA] rounded-full text-[#8ABEE8] font-bold text-[10px] md:text-xs tracking-widest uppercase mb-3 md:mb-4">
            <FiUser size={14} /> Welcome Back
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#2C2C2C] mb-2 md:mb-3 tracking-tight leading-[1.1] font-[family-name:var(--font-heading)]">
            Continue Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ABEE8] to-blue-400">Journey.</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-lg font-light leading-relaxed">
            Access your curated collection and order history.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <div className="w-1 h-4 bg-red-500 rounded-full"></div>
            {error}
            {/* Trigger toast on error update if needed, but for now we keep inline or use effect */}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-1.5 md:space-y-2">
            <label className="text-[10px] md:text-xs font-bold text-[#2C2C2C] uppercase tracking-wide ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#8ABEE8] transition-colors">
                <FiMail size={18} className="md:w-5 md:h-5" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-white border-2 border-gray-100 focus:border-[#8ABEE8] rounded-xl outline-none text-[#2C2C2C] font-medium placeholder-gray-400 text-sm md:text-base transition-all duration-300 shadow-sm focus:shadow-md"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <label className="text-[10px] md:text-xs font-bold text-[#2C2C2C] uppercase tracking-wide ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#8ABEE8] transition-colors">
                <FiLock size={18} className="md:w-5 md:h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 md:pl-12 pr-11 py-3 md:py-4 bg-white border-2 border-gray-100 focus:border-[#8ABEE8] rounded-xl outline-none text-[#2C2C2C] font-medium placeholder-gray-400 text-sm md:text-base transition-all duration-300 shadow-sm focus:shadow-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#8ABEE8] transition-colors duration-200 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff size={18} className="md:w-5 md:h-5" /> : <FiEye size={18} className="md:w-5 md:h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs md:text-sm pt-1">
            <label
              className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-[#2C2C2C] transition-colors group"
              onClick={() => setRememberMe(!rememberMe)}
            >
              <div className="relative flex items-center justify-center">
                <div className={`w-4 h-4 md:w-5 md:h-5 border-2 rounded transition-all duration-200 ${rememberMe ? 'bg-[#2C2C2C] border-[#2C2C2C]' : 'border-gray-300 bg-white'}`}></div>
                <FiCheckCircle size={10} className={`absolute text-white transition-opacity duration-200 md:w-3 md:h-3 ${rememberMe ? 'opacity-100' : 'opacity-0'}`} />
              </div>
              <span className="font-medium">Remember me</span>
            </label>
            <Link to="/forgot-password" type="button" className="text-[#8ABEE8] hover:text-[#2C2C2C] font-bold transition-colors border-b border-transparent hover:border-[#2C2C2C] pb-0.5">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2C2C2C] text-white font-bold text-base md:text-lg py-3.5 md:py-4 rounded-xl hover:bg-[#8ABEE8] hover:shadow-lg hover:shadow-[#8ABEE8]/30 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading ? 'Signing In...' : 'Sign In'} <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform md:w-5 md:h-5" />
          </button>
        </form>

        <div className="mt-6 md:mt-8 pt-6 border-t border-gray-100 text-center lg:text-left text-xs md:text-sm">
          <p className="text-gray-500 font-medium">
            New to Mazel?{' '}
            <Link to="/register" className="text-[#2C2C2C] font-bold hover:text-[#8ABEE8] transition-colors border-b-2 border-[#2C2C2C] hover:border-[#8ABEE8] pb-0.5">
              Create an Account
            </Link>
          </p>
        </div>
        <SecurityBadges />
      </div>
    </div>
  );
};

export default Login;