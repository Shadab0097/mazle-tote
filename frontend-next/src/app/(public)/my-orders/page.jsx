'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyOrders } from '@/store/ordersSlice';
import api from '@/services/api';
import {
    FiPackage,
    FiCalendar,
    FiTruck,
    FiShoppingBag,
    FiSearch,
    FiFilter,
    FiX
} from 'react-icons/fi';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const MyOrders = () => {
    const dispatch = useDispatch();
    const { items: orders, loading } = useSelector((state) => state.orders);

    // Address Modal State
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('Newest');

    useEffect(() => {
        // Optimization: Only fetch if we don't have orders yet
        if (orders.length === 0) {
            dispatch(fetchMyOrders());
        }
    }, [dispatch, orders.length]);

    const handleViewAddress = (address) => {
        setSelectedAddress(address);
        setShowAddressModal(true);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F8FA]">
            <div className="w-8 h-8 border-4 border-[#8ABEE8] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="pt-24 pb-16 md:pt-32 md:pb-24 bg-[#F5F8FA] min-h-screen">
            <Container className="px-4 md:px-6">

                <div className="mb-10 md:mb-16 text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-full text-[#8ABEE8] font-bold text-xs md:text-sm tracking-widest uppercase mb-3 shadow-sm">
                        <FiPackage size={14} /> My Account
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-[#2C2C2C] mb-2">Order History</h1>
                    <p className="text-sm md:text-base text-gray-500">Track your sustainable journey.</p>
                </div>

                {/* Filters */}
                <div className="max-w-4xl mx-auto mb-8 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Order ID or Product..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-white focus:outline-none focus:ring-2 focus:ring-[#8ABEE8]/50 shadow-sm text-sm"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-white rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8ABEE8]/50 shadow-sm cursor-pointer text-sm min-w-[120px]"
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="px-4 py-3 border border-white rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8ABEE8]/50 shadow-sm cursor-pointer text-sm min-w-[120px]"
                            >
                                <option value="Newest">Newest</option>
                                <option value="Oldest">Oldest</option>
                            </select>
                        </div>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="max-w-md mx-auto text-center bg-white p-12 rounded-[2.5rem] shadow-lg border border-white">
                        <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold mb-2">No Orders Yet</h3>
                        <p className="text-gray-500 mb-8">Your journey with sustainable fashion starts here.</p>
                        <Link href="/products">
                            <Button size="lg" className="rounded-xl">Explore Collection</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6 md:space-y-12">
                        {orders
                            .filter(order => {
                                const searchLower = searchQuery.toLowerCase();
                                const matchesSearch =
                                    order._id.toLowerCase().includes(searchLower) ||
                                    order.items.some(item => item.name.toLowerCase().includes(searchLower));

                                const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
                                return matchesSearch && matchesStatus;
                            })
                            .sort((a, b) => {
                                const dateA = new Date(a.createdAt);
                                const dateB = new Date(b.createdAt);
                                return sortOrder === 'Newest' ? dateB - dateA : dateA - dateB;
                            })
                            .map((order, index) => (
                                <div key={order._id} className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-lg border border-white overflow-hidden">

                                    {/* Order Header */}
                                    <div className="bg-gray-50/50 p-5 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-bold text-[#2C2C2C] text-lg">#{order._id.slice(-8).toUpperCase()}</span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                <FiCalendar size={14} />
                                                {new Date(order.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
                            ))}
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

export default MyOrders;
