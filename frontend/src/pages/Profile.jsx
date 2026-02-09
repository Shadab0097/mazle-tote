import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    FiPackage,
    FiGlobe,
    FiLogOut,
    FiCalendar,
    FiTruck,
    FiShoppingBag,
    FiX
} from 'react-icons/fi';
import api from '../services/api';
import { logoutUser } from '../store/authSlice';
import { fetchMyOrders } from '../store/ordersSlice';
import { Container } from '@/components/ui/Container';
import { useToast } from '../context/ToastContext';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();

    const [activeTab, setActiveTab] = useState('orders');
    // Use Redux state for orders
    const { items: orders, loading } = useSelector((state) => state.orders);

    // Address Modal State
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);

    useEffect(() => {
        // Optimization: Only fetch if we don't have orders yet
        if (orders.length === 0) {
            dispatch(fetchMyOrders());
        }
    }, [dispatch, orders.length]);

    const handleLogout = () => {
        dispatch(logoutUser());
        toast.info('Logged out successfully');
        navigate('/');
    };

    const handleViewAddress = (address) => {
        setSelectedAddress(address);
        setShowAddressModal(true);
    };

    if (!user) return null;

    return (
        <div className="pt-24 pb-16 md:pt-32 md:pb-24 bg-[#F5F8FA] min-h-screen animate-in fade-in duration-700">
            <Container className="px-4 md:px-6">

                {/* Profile Header */}
                <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-10 mb-8 md:mb-12 border border-white flex flex-col md:flex-row items-center gap-6 md:gap-10 relative overflow-hidden">
                    {/* Decorative bg */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#8ABEE8]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 w-24 h-24 rounded-full bg-[#2C2C2C] text-white flex items-center justify-center text-4xl font-bold border-4 border-[#F5F8FA] shadow-lg uppercase">
                        {user.name.charAt(0)}
                    </div>

                    <div className="relative z-10 text-center md:text-left flex-grow">
                        <h1 className="text-2xl md:text-4xl font-extrabold text-[#2C2C2C] mb-1">Welcome, {user.name}</h1>
                        <p className="text-gray-500 text-sm mb-4">
                            Member since {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F5F8FA] text-[#2C2C2C] rounded-lg text-xs font-bold">
                                <FiPackage size={14} className="text-[#8ABEE8]" /> {orders.length} Total Orders
                            </span>
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F5F8FA] text-[#2C2C2C] rounded-lg text-xs font-bold">
                                <FiGlobe size={14} className="text-[#8ABEE8]" /> Free Global Shipping
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="relative z-10 flex items-center gap-2 text-red-500 font-bold text-sm hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
                    >
                        <FiLogOut size={16} /> <span className="hidden md:inline">Sign Out</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex justify-center md:justify-start gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-[#2C2C2C] text-white shadow-lg' : 'bg-white text-gray-500 hover:text-[#2C2C2C]'}`}
                    >
                        Order History
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-[#2C2C2C] text-white shadow-lg' : 'bg-white text-gray-500 hover:text-[#2C2C2C]'}`}
                    >
                        Account Details
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'orders' ? (
                    <div className="max-w-4xl mx-auto space-y-6 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {loading ? (
                            <div className="flex justify-center p-12">
                                <div className="w-8 h-8 border-4 border-[#8ABEE8] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : orders.length > 0 ? (
                            [...orders]
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map((order, index) => (
                                    <div key={order._id} className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-lg border border-white overflow-hidden">
                                        {/* Order Header */}
                                        <div className="bg-gray-50/50 p-5 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-bold text-[#2C2C2C] text-lg">#{order._id.slice(-8).toUpperCase()}</span>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                                order.status === 'Refunded' ? 'bg-red-100 text-red-700' :
                                                                    order.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                                                                        'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                    <FiCalendar size={14} />
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5 md:p-8">
                                            {/* Items List */}
                                            <div className="space-y-6 mb-8">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex gap-4 items-start">
                                                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                                            <img
                                                                src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=200'}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-grow pt-1">
                                                            <h4 className="font-bold text-[#2C2C2C] text-sm md:text-lg leading-tight mb-1">{item.name}</h4>
                                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                            <span className="font-bold text-[#2C2C2C] text-sm md:text-base block mt-1">${item.price.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Summary */}
                                            <div className="bg-[#F5F8FA] rounded-2xl p-5 md:p-6 space-y-4">
                                                <div className="flex justify-between items-center text-xs md:text-sm text-gray-600">
                                                    <span>Shipping Address</span>
                                                    <button
                                                        onClick={() => handleViewAddress(order.shippingAddress)}
                                                        className="text-[#8ABEE8] hover:text-[#2C2C2C] font-bold transition-colors"
                                                    >
                                                        View Address
                                                    </button>
                                                </div>
                                                <div className="flex justify-between items-center font-bold text-lg text-[#2C2C2C] border-t border-gray-200 pt-3">
                                                    <span>Total</span>
                                                    <span>${order.totalAmount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-[2.5rem] shadow-sm">
                                <FiShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">You haven't placed any orders yet.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold text-[#2C2C2C] mb-8">Personal Details</h2>
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#2C2C2C] uppercase ml-1">Full Name</label>
                                <input
                                    type="text"
                                    value={user.name}
                                    readOnly
                                    className="w-full bg-gray-50 border border-transparent px-5 py-3 rounded-xl outline-none text-gray-500 text-sm font-medium cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#2C2C2C] uppercase ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    readOnly
                                    className="w-full bg-gray-50 border border-transparent px-5 py-3 rounded-xl outline-none text-gray-500 text-sm font-medium cursor-not-allowed"
                                />
                            </div>

                        </form>
                    </div>
                )}
            </Container>

            {/* Address Modal */}
            {showAddressModal && selectedAddress && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95">
                        <button onClick={() => setShowAddressModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <FiX size={20} />
                        </button>
                        <h3 className="text-lg font-bold text-[#2C2C2C] mb-6 flex items-center gap-2">
                            Shipping Address
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Name</span>
                                <span className="font-medium text-[#2C2C2C] text-base">{selectedAddress.name}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Address</span>
                                <span className="font-medium text-[#2C2C2C] block leading-relaxed">{selectedAddress.address}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs font-bold text-gray-400 uppercase mb-1">City</span>
                                    <span className="font-medium text-[#2C2C2C]">{selectedAddress.city}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-gray-400 uppercase mb-1">State</span>
                                    <span className="font-medium text-[#2C2C2C]">{selectedAddress.state}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs font-bold text-gray-400 uppercase mb-1">ZIP Code</span>
                                    <span className="font-medium text-[#2C2C2C]">{selectedAddress.pincode}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Phone</span>
                                    <span className="font-medium text-[#2C2C2C]">{selectedAddress.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
