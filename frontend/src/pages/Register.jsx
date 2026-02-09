import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/authSlice';
import { useToast } from '../context/ToastContext';
import {
  FiMail,
  FiLock,
  FiUser,
  FiArrowRight,
  FiShield,
  FiCheck,
  FiCheckCircle
} from 'react-icons/fi';

const SecurityBadges = () => (
  <div className="mt-8 flex justify-center lg:justify-start gap-6 text-xs text-gray-400 border-t border-gray-100 pt-6">
    <div className="flex items-center gap-1.5 font-medium">
      <FiShield size={14} className="text-green-500" /> 256-bit SSL Secure
    </div>
    <div className="flex items-center gap-1.5 font-medium">
      <FiCheck size={14} className="text-blue-500" /> Private & Confidential
    </div>
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreed, setAgreed] = useState(false);
  const toast = useToast();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Account created successfully!');
      navigate('/');
    }
    if (error) toast.error(error);
    return () => dispatch(clearError());
  }, [isAuthenticated, error, navigate, dispatch, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreed) {
      toast.error("Please agree to the Privacy Policy");
      return;
    }

    await dispatch(registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password
    }));
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-base)]">
      <div className="w-full max-w-md mx-auto lg:mx-0 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white">

        <div className="mb-16 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5F8FA] rounded-full text-[#8ABEE8] font-bold text-xs tracking-widest uppercase mb-4">
            <FiUser size={16} /> Join Us
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2C] mb-3 tracking-tight leading-[1.1] font-[family-name:var(--font-heading)]">
            Start Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ABEE8] to-blue-400">Journey.</span>
          </h1>
          <p className="text-gray-500 text-lg font-light leading-relaxed">
            Create an account to access exclusive collections.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <div className="w-1 h-4 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2C2C2C] uppercase tracking-wide ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#8ABEE8] transition-colors">
                <FiUser size={20} />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 focus:border-[#8ABEE8] rounded-xl outline-none text-[#2C2C2C] font-medium placeholder-gray-400 transition-all duration-300 shadow-sm focus:shadow-md"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2C2C2C] uppercase tracking-wide ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#8ABEE8] transition-colors">
                <FiMail size={20} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 focus:border-[#8ABEE8] rounded-xl outline-none text-[#2C2C2C] font-medium placeholder-gray-400 transition-all duration-300 shadow-sm focus:shadow-md"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2C2C2C] uppercase tracking-wide ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#8ABEE8] transition-colors">
                <FiLock size={20} />
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 focus:border-[#8ABEE8] rounded-xl outline-none text-[#2C2C2C] font-medium placeholder-gray-400 transition-all duration-300 shadow-sm focus:shadow-md"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2C2C2C] uppercase tracking-wide ml-1">Confirm Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#8ABEE8] transition-colors">
                <FiLock size={20} />
              </div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 focus:border-[#8ABEE8] rounded-xl outline-none text-[#2C2C2C] font-medium placeholder-gray-400 transition-all duration-300 shadow-sm focus:shadow-md"
                required
              />
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm pt-2">
            <label
              className="flex items-start gap-3 cursor-pointer text-gray-600 hover:text-[#2C2C2C] transition-colors group"
              onClick={() => setAgreed(!agreed)}
            >
              <div className="relative flex items-center justify-center mt-0.5">
                <div className={`w-5 h-5 border-2 rounded transition-all duration-200 flex-shrink-0 ${agreed ? 'bg-[#2C2C2C] border-[#2C2C2C]' : 'border-gray-300 bg-white'}`}></div>
                <FiCheckCircle size={12} className={`absolute text-white transition-opacity duration-200 ${agreed ? 'opacity-100' : 'opacity-0'}`} />
              </div>
              <span className="leading-tight">
                I agree to the <Link to="/terms" className="text-[#2C2C2C] font-bold hover:underline" onClick={e => e.stopPropagation()}>Terms of Service</Link> and <Link to="/privacy" className="text-[#2C2C2C] font-bold hover:underline" onClick={e => e.stopPropagation()}>Privacy Policy</Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !agreed}
            className="w-full bg-[#2C2C2C] text-white font-bold text-lg py-4 rounded-xl hover:bg-[#8ABEE8] hover:shadow-lg hover:shadow-[#8ABEE8]/30 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Create Account'} <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center lg:text-left">
          <p className="text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2C2C2C] font-bold hover:text-[#8ABEE8] transition-colors border-b-2 border-[#2C2C2C] hover:border-[#8ABEE8] pb-0.5">
              Sign In
            </Link>
          </p>
        </div>
        <SecurityBadges />
      </div>
    </div>
  );
};

export default Register;