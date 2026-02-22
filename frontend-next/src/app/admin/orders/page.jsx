'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '@/store/adminSlice';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import api from '@/services/api';
import { FiClock, FiCheckCircle, FiTruck, FiPackage, FiFilter, FiAlertCircle, FiX, FiPrinter, FiCopy, FiCreditCard } from 'react-icons/fi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import ShippingLabelModal from '@/components/ShippingLabelModal';

const AdminOrders = () => {

    const dispatch = useDispatch();
    const { orders: adminOrders, loading: adminLoading, ordersLastFetched } = useSelector((state) => state.admin);

    // Initial Orders
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingUpdate, setPendingUpdate] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);

    // Label Modal State
    const [labelOrder, setLabelOrder] = useState(null);
    const [showLabelModal, setShowLabelModal] = useState(false);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('Newest');

    const toast = useToast();

    useEffect(() => {
        // Optimization: Fetch only if not present or stale (> 2 mins for orders)
        const isStale = !ordersLastFetched || (Date.now() - ordersLastFetched > 2 * 60 * 1000);

        if (adminOrders.length === 0 || isStale) {
            dispatch(fetchAllOrders());
        }
    }, [dispatch, adminOrders.length, ordersLastFetched]);

    // Sync Redux state to local state
    useEffect(() => {
        setOrders(adminOrders);
        if (!adminLoading) {
            setLoading(false);
        }
    }, [adminOrders, adminLoading]);

    const handleRefresh = () => {
        setLoading(true);
        dispatch(fetchAllOrders()).finally(() => setLoading(false));
    };

    // Helper to refresh after update
    const refreshOrders = () => {
        dispatch(fetchAllOrders());
    };

    const initiateStatusUpdate = (orderId, newStatus) => {
        setPendingUpdate({ orderId, newStatus });
        setShowConfirmModal(true);
    };

    const handleViewAddress = (address) => {
        setSelectedAddress(address);
        setShowAddressModal(true);
    };

    const handlePrintLabel = (order) => {
        setLabelOrder(order);
        setShowLabelModal(true);
    };

    const confirmStatusUpdate = async () => {
        if (!pendingUpdate) return;
        setUpdatingStatus(true);

        const { orderId, newStatus } = pendingUpdate;
        try {
            const updatedOrders = orders.map(o =>
                o._id === orderId ? { ...o, status: newStatus } : o
            );
            setOrders(updatedOrders);
            await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
            toast.success('Order status updated & customer notified');
        } catch (error) {
            toast.error('Failed to update status');
            fetchOrders();
        } finally {
            setUpdatingStatus(false);
            setShowConfirmModal(false);
            setPendingUpdate(null);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-800';
            case 'Paid': return 'bg-blue-100 text-blue-800';
            case 'Shipped': return 'bg-purple-100 text-purple-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Refunded': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <FiClock />;
            case 'Paid': return <FiCheckCircle />;
            case 'Shipped': return <FiTruck />;
            case 'Delivered': return <FiPackage />;
            case 'Refunded': return <FiX />;
            default: return <FiClock />;
        }
    }

    // Check if order is less than 6 hours old
    const isNewOrder = (createdAt) => {
        const orderTime = new Date(createdAt).getTime();
        const now = Date.now();
        const sixHours = 6 * 60 * 60 * 1000; // 6 hours in ms
        return (now - orderTime) < sixHours;
    };

    const filteredOrders = orders
        .filter(order => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                order._id.toLowerCase().includes(searchLower) ||
                order.user?.name?.toLowerCase().includes(searchLower) ||
                order.user?.email?.toLowerCase().includes(searchLower);

            const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'Newest' ? dateB - dateA : dateA - dateB;
        });

    if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

    return (
        <div className="space-y-6 bg-[var(--color-bg)] min-h-screen p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Orders</h1>
                    <p className="text-gray-500 mt-1">Track and manage customer orders.</p>
                </div>
                {/* <Button variant="outline" size="sm" className="gap-2">
                    <FiDownload /> Export
                </Button> */}
            </div>

            <ShippingLabelModal isOpen={showLabelModal} onClose={() => setShowLabelModal(false)} order={labelOrder} />

            {/* Filters Bar */}
            <Card className="p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search ID, Name, Customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 border-gray-200"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-xl bg-white focus:outline-none border-gray-200 cursor-pointer"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Refunded">Refunded</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-4 py-2 border rounded-xl bg-white focus:outline-none border-gray-200 cursor-pointer"
                    >
                        <option value="Newest">Newest First</option>
                        <option value="Oldest">Oldest First</option>
                    </select>
                </div>
            </Card>

            <Card className="overflow-hidden bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                {/* Responsive Table View */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1200px]">
                        <thead className="bg-gray-50 border-b border-[var(--color-border)]">
                            <tr className="text-left text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Order ID & Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Address</th>
                                <th className="px-6 py-4">Products</th>
                                <th className="px-6 py-4">Charity</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center text-gray-400">
                                        No orders found matching your filters
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-sm">#{order._id.slice(-8).toUpperCase()}</span>
                                                {isNewOrder(order.createdAt) && (
                                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-full animate-pulse">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-sm">{order.user?.name || 'Guest'}</div>
                                            <div className="text-xs text-gray-400">{order.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleViewAddress(order.shippingAddress)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#8ABEE8]/10 text-[#8ABEE8] hover:bg-[#8ABEE8] hover:text-white transition-colors"
                                            >
                                                View Address
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-[#2C2C2C] max-w-[200px]">
                                                {order.items?.length > 0 ? order.items.map((item, idx) => (
                                                    <div key={idx} className="truncate" title={item.name}>
                                                        {item.name} <span className="text-gray-400">×{item.quantity}</span>
                                                    </div>
                                                )) : '-'}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.charityTrust ? (
                                                <span className="text-sm font-medium text-[var(--color-primary)]">{order.charityTrust}</span>
                                            ) : <span className="text-gray-400">-</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {order.payment?.paypalCaptureId ? (
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(order.payment.paypalCaptureId);
                                                            toast.success('Transaction ID copied!');
                                                        }}
                                                        className="flex items-center gap-1 text-xs font-mono text-gray-600 hover:text-[#2C2C2C] transition-colors group"
                                                        title={order.payment.paypalCaptureId}
                                                    >
                                                        <span>{order.payment.paypalCaptureId.slice(-10).toUpperCase()}</span>
                                                        <FiCopy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400">-</span>
                                                )}
                                                {order.payment?.paymentSource === 'card' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase w-fit bg-purple-100 text-purple-700">
                                                        <FiCreditCard size={10} />
                                                        Card
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase w-fit bg-blue-100 text-blue-700">
                                                        <span className="font-black text-[10px]">P</span>
                                                        {order.payment?.paymentSource || 'PayPal'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold">${order.totalAmount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => initiateStatusUpdate(order._id, e.target.value)}
                                                    className="bg-white border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Paid">Paid</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                                <button
                                                    onClick={() => handlePrintLabel(order)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#2C2C2C] hover:bg-gray-100 transition-colors"
                                                    title="Print Label"
                                                >
                                                    <FiPrinter size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

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

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowConfirmModal(false)}></div>
                    <div className="bg-white rounded-[2rem] p-8 max-w-md w-full relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                        >
                            <FiX size={20} />
                        </button>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-6">
                                <FiAlertCircle size={40} />
                            </div>

                            <h3 className="text-2xl font-bold text-[#2C2C2C] mb-2">Update Order Status?</h3>
                            <p className="text-gray-500 mb-8">
                                Changing this status to <span className="font-bold text-[#2C2C2C]">{pendingUpdate?.newStatus}</span> will automatically send an email notification to the customer.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    disabled={updatingStatus}
                                    className="flex-1 h-12 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmStatusUpdate}
                                    disabled={updatingStatus}
                                    className="flex-1 h-12 bg-[#2C2C2C] text-white rounded-xl font-bold hover:bg-[#8ABEE8] transition-all shadow-lg shadow-[#2C2C2C]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {updatingStatus ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : 'Yes, Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
