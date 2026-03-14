'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '@/store/adminSlice';
import api from '@/services/api';
import {
    FiShoppingBag,
    FiPackage,
    FiUsers,
    FiDollarSign,
    FiArrowUpRight,
    FiArrowDownRight,
    FiMoreHorizontal,
    FiChevronRight,
    FiMail,
    FiSend,
    FiPrinter,
    FiRefreshCw,
    FiHeart,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiCheck,
    FiX,
    FiTag
} from 'react-icons/fi';

import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ShippingLabelModal from '@/components/ShippingLabelModal';

const NewsletterModal = ({ isOpen, onClose }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const toast = useToast();

    if (!isOpen) return null;

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post('/api/subscribers/send-bulk', { subject, message });
            toast.success('Newsletter sent successfully to all subscribers!');
            onClose();
            setSubject('');
            setMessage('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send newsletter');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
                <h3 className="text-xl font-bold text-[#2C2C2C] flex items-center gap-2">
                    <FiMail className="text-[#8ABEE8]" /> Send Newsletter
                </h3>
                <p className="text-sm text-gray-500">
                    Send an email to all subscribed customers.
                </p>
                <form onSubmit={handleSend} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Subject</label>
                        <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Newsletter Subject"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Message (HTML supported)</label>
                        <textarea
                            className="w-full min-h-[150px] p-3 rounded-xl border-2 border-gray-100 focus:border-[#8ABEE8] outline-none text-sm resize-y"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="<h1>Hello!</h1><p>We have news...</p>"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={sending}>Cancel</Button>
                        <Button type="submit" disabled={sending} className="min-w-[140px] flex items-center justify-center gap-2">
                            {sending ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                <><FiSend className="mr-1" /> Send to All</>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const toast = useToast();
    const { stats: adminStats, loading: adminLoading, statsLastFetched, recentOrders: adminRecentOrders } = useSelector((state) => state.admin);

    // Local state (initialized with Redux data if available)
    const [stats, setStats] = useState(adminStats ? {
        orders: adminStats.orders,
        products: adminStats.products,
        revenue: adminStats.revenue,
        activeUsers: adminStats.orders > 0 ? 'N/A' : 0,
        subscribers: adminStats.subscribers,
        ordersChange: '+12.5%',
        revenueChange: '+8.2%'
    } : {
        orders: 0, products: 0, revenue: 0, activeUsers: 0, subscribers: 0, ordersChange: '+0%', revenueChange: '+0%'
    });

    // Initial loading state depends on whether we have data
    const [loading, setLoading] = useState(!adminStats);
    const [recentOrders, setRecentOrders] = useState(adminStats?.recentOrders || []);

    // Address Modal State
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);

    // Label Modal State
    const [labelOrder, setLabelOrder] = useState(null);
    const [showLabelModal, setShowLabelModal] = useState(false);

    // Charity Tracker State
    const [charities, setCharities] = useState([]);
    const [charitiesLoading, setCharitiesLoading] = useState(true);
    const [editingCharity, setEditingCharity] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', amount: '', description: '', link: '', iconName: 'heart' });
    const [showAddCharity, setShowAddCharity] = useState(false);
    const [newCharity, setNewCharity] = useState({ name: '', amount: '', description: '', link: '', iconName: 'heart' });

    // 1. Fetch Data Effect (Caching Strategy)
    useEffect(() => {
        // Fetch only if not present or stale (> 5 mins)
        const isStale = !statsLastFetched || (Date.now() - statsLastFetched > 5 * 60 * 1000);

        if (!adminStats || isStale) {
            dispatch(fetchDashboardStats());
        } else {
            setLoading(false);
        }
    }, [dispatch, adminStats, statsLastFetched]);

    // Fetch Charities
    useEffect(() => {
        const fetchCharities = async () => {
            try {
                const { data } = await api.get('/api/charities');
                setCharities(data);
            } catch { /* silent */ }
            finally { setCharitiesLoading(false); }
        };
        fetchCharities();
    }, []);

    // 2. Sync Effect (Redux -> Local State)
    useEffect(() => {
        if (adminStats) {
            setStats({
                orders: adminStats.orders,
                products: adminStats.products,
                revenue: adminStats.revenue,
                activeUsers: adminStats.orders > 0 ? 'N/A' : 0,
                subscribers: adminStats.subscribers,
                ordersChange: '+12.5%',
                revenueChange: '+8.2%'
            });
            setRecentOrders(adminStats.recentOrders || []);
            setLoading(false);
        }
    }, [adminStats]);

    const handleRefresh = () => {
        setLoading(true);
        dispatch(fetchDashboardStats())
            .unwrap()
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    };

    const handleViewAddress = (e, address) => {
        e.stopPropagation();
        setSelectedAddress(address);
        setShowAddressModal(true);
    };

    const handlePrintLabel = (e, order) => {
        e.stopPropagation();
        setLabelOrder(order);
        setShowLabelModal(true);
    };

    // Charity handlers
    const handleSaveCharity = async (id) => {
        try {
            const { data } = await api.put(`/api/charities/${id}`, {
                name: editForm.name,
                amount: parseFloat(editForm.amount) || 0,
                description: editForm.description,
                link: editForm.link,
                iconName: editForm.iconName,
            });
            setCharities(prev => prev.map(c => c._id === id ? data : c));
            setEditingCharity(null);
            toast.success('Charity updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update charity');
        }
    };

    const handleAddCharity = async () => {
        if (!newCharity.name) return;
        try {
            const { data } = await api.post('/api/charities', {
                ...newCharity,
                amount: parseFloat(newCharity.amount) || 0,
            });
            setCharities(prev => [...prev, data]);
            setNewCharity({ name: '', amount: '', description: '', link: '', iconName: 'heart' });
            setShowAddCharity(false);
            toast.success('Charity added!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add charity');
        }
    };

    const handleDeleteCharity = async (id) => {
        if (!window.confirm('Delete this charity?')) return;
        try {
            await api.delete(`/api/charities/${id}`);
            setCharities(prev => prev.filter(c => c._id !== id));
            toast.success('Charity deleted');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete charity');
        }
    };

    const statCards = [
        { label: "Total Revenue", value: `$${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, change: stats.revenueChange, trend: 'up', icon: FiDollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Total Orders", value: stats.orders, change: stats.ordersChange, trend: 'up', icon: FiShoppingBag, color: "text-[#8ABEE8]", bg: "bg-[#8ABEE8]/10" },
        { label: "Active Products", value: stats.products, change: "+2 New", trend: 'up', icon: FiPackage, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Subscribers", value: stats.subscribers, change: "Newsletter", trend: 'up', icon: FiUsers, color: "text-amber-500", bg: "bg-amber-500/10" },
    ];

    const getStatusStyle = (status) => {
        const styles = {
            Delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
            Paid: "bg-blue-500/10 text-blue-600 border-blue-200",
            Shipped: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
            Cancelled: "bg-red-500/10 text-red-600 border-red-200",
            Pending: "bg-amber-500/10 text-amber-600 border-amber-200"
        };
        return styles[status] || "bg-gray-100 text-gray-600";
    };

    // Check if order is less than 6 hours old
    const isNewOrder = (createdAt) => {
        const orderTime = new Date(createdAt).getTime();
        const now = Date.now();
        const sixHours = 6 * 60 * 60 * 1000; // 6 hours in ms
        return (now - orderTime) < sixHours;
    };

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="w-10 h-10 border-4 border-[#8ABEE8] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-[#2C2C2C]">Overview</h2>
                    <p className="text-gray-500 mt-2">Here's what's happening with your store today.</p>
                </div>
                <Button onClick={() => setShowEmailModal(true)} className="flex items-center gap-2 shadow-lg shadow-[#8ABEE8]/20">
                    <FiMail /> Send Newsletter
                </Button>
                <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2 border-gray-200">
                    <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
                </Button>
            </div>

            <NewsletterModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} />
            <ShippingLabelModal isOpen={showLabelModal} onClose={() => setShowLabelModal(false)} order={labelOrder} />

            {/* Address Modal */}
            {showAddressModal && selectedAddress && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95">
                        <button onClick={() => setShowAddressModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <FiChevronRight className="rotate-45" size={24} />
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

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-200/40 border border-white hover:-translate-y-1 transition-transform duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                                <stat.icon size={22} />
                            </div>
                            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.trend === 'up' ? <FiArrowUpRight size={14} className="mr-1" /> : <FiArrowDownRight size={14} className="mr-1" />}
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-extrabold text-[#2C2C2C] mb-1">{stat.value}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Charity Tracker Section */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-[#2C2C2C] flex items-center gap-2">
                            <FiHeart className="text-rose-500" /> Charity Tracker
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">Track amounts raised for each charity partner.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-sm">
                            Total: ${charities.reduce((sum, c) => sum + (c.amount || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <button
                            onClick={() => setShowAddCharity(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8ABEE8] text-white font-bold text-sm hover:bg-[#2C2C2C] transition-colors"
                        >
                            <FiPlus size={16} /> Add Charity
                        </button>
                    </div>
                </div>

                {/* Add New Charity Form */}
                {showAddCharity && (
                    <div className="bg-[#F5F8FA] rounded-2xl p-5 mb-6 space-y-3 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input placeholder="Charity Name *" value={newCharity.name} onChange={(e) => setNewCharity(p => ({ ...p, name: e.target.value }))} />
                            <Input type="number" step="0.01" placeholder="Amount Raised ($)" value={newCharity.amount} onChange={(e) => setNewCharity(p => ({ ...p, amount: e.target.value }))} />
                        </div>
                        <Input placeholder="Description (optional)" value={newCharity.description} onChange={(e) => setNewCharity(p => ({ ...p, description: e.target.value }))} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input placeholder="Website URL (optional)" value={newCharity.link} onChange={(e) => setNewCharity(p => ({ ...p, link: e.target.value }))} />
                            <select value={newCharity.iconName} onChange={(e) => setNewCharity(p => ({ ...p, iconName: e.target.value }))} className="px-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-[#8ABEE8]">
                                <option value="heart">❤️ Heart</option>
                                <option value="globe">🌍 Globe</option>
                                <option value="book">📖 Book</option>
                                <option value="shield">🛡️ Shield</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                            <Button variant="ghost" onClick={() => setShowAddCharity(false)}>Cancel</Button>
                            <Button onClick={handleAddCharity}>Save Charity</Button>
                        </div>
                    </div>
                )}

                {/* Charities List */}
                {charitiesLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-4 border-[#8ABEE8] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : charities.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <FiHeart size={32} className="mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">No charities added yet.</p>
                        <p className="text-sm">Click "Add Charity" to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {charities.map((charity) => (
                            <div key={charity._id} className="p-4 rounded-2xl bg-[#F5F8FA] hover:bg-gray-50 transition-colors group">
                                {editingCharity === charity._id ? (
                                    /* Edit Mode */
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <Input value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} placeholder="Name" />
                                            <Input type="number" step="0.01" value={editForm.amount} onChange={(e) => setEditForm(p => ({ ...p, amount: e.target.value }))} placeholder="Amount" />
                                        </div>
                                        <textarea
                                            value={editForm.description}
                                            onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))}
                                            placeholder="Description"
                                            className="w-full px-4 py-3 bg-white border-2 border-gray-100 focus:border-[#8ABEE8] rounded-xl outline-none text-sm font-medium resize-y min-h-[80px]"
                                            rows={3}
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={() => handleSaveCharity(charity._id)} className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
                                                <FiCheck size={16} />
                                            </button>
                                            <button onClick={() => setEditingCharity(null)} className="p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors">
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* View Mode */
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <div className="flex items-start gap-4 flex-1 min-w-0 overflow-hidden">
                                            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <FiHeart size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-[#2C2C2C]">{charity.name}</h4>
                                                {charity.description && (
                                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2" title={charity.description}>{charity.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0 md:pl-4">
                                            <span className="text-xl font-extrabold text-emerald-600 whitespace-nowrap">
                                                ${charity.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setEditingCharity(charity._id);
                                                    setEditForm({ name: charity.name, amount: charity.amount, description: charity.description || '', link: charity.link || '', iconName: charity.iconName || 'heart' });
                                                }}
                                                className="p-2 rounded-lg text-gray-400 hover:text-[#8ABEE8] hover:bg-white transition-colors"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteCharity(charity._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-white transition-colors">
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Orders Table - Full Width */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-[#2C2C2C]">Recent Orders</h3>
                        <p className="text-sm text-gray-400 mt-1">Latest transactions from your store.</p>
                    </div>
                    <button
                        onClick={() => router.push('/admin/orders')}
                        className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5F8FA] hover:bg-[#8ABEE8] text-[#2C2C2C] hover:text-white font-bold text-sm transition-all"
                    >
                        View All Orders <FiChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
                    </button>
                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
                    <table className="w-full min-w-[1200px]">
                        <thead>
                            <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                <th className="pb-4 pl-4">Order ID</th>
                                <th className="pb-4">Customer</th>
                                <th className="pb-4">Address</th>
                                <th className="pb-4">Products</th>
                                <th className="pb-4">Date</th>
                                <th className="pb-4">Amount</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 text-right pr-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center text-gray-400">
                                        No recent orders found.
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order._id} className="group hover:bg-[#F5F8FA] transition-colors border-b border-gray-50 last:border-none cursor-pointer" onClick={() => router.push('/admin/orders')}>
                                        <td className="py-4 pl-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-[#2C2C2C]">#{order._id.slice(-6).toUpperCase()}</span>
                                                {isNewOrder(order.createdAt) && (
                                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-full animate-pulse">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                    {order.user?.name?.charAt(0) || 'G'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#2C2C2C]">{order.user?.name || 'Guest'}</div>
                                                    <div className="text-xs text-gray-400">{order.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <button
                                                onClick={(e) => handleViewAddress(e, order.shippingAddress)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#8ABEE8]/10 text-[#8ABEE8] hover:bg-[#8ABEE8] hover:text-white transition-colors"
                                            >
                                                View Address
                                            </button>
                                        </td>
                                        <td className="py-4">
                                            <div className="text-sm text-[#2C2C2C] max-w-[220px]">
                                                {order.items?.length > 0 ? order.items.map((item, idx) => (
                                                    <div key={idx} className="truncate" title={item.name}>
                                                        {item.name} <span className="text-gray-400">×{item.quantity}</span>
                                                    </div>
                                                )) : '-'}
                                            </div>
                                        </td>
                                        <td className="py-4 text-gray-500 text-xs font-medium">
                                            {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="py-4">
                                            <div className="font-bold text-[#2C2C2C]">${order.totalAmount.toFixed(2)}</div>
                                            {order.promoCode && (
                                                <div className="mt-1 flex items-center gap-1">
                                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                                                        <FiTag size={10} /> {order.promoCode} (-${order.discountAmount?.toFixed(2) || '0.00'})
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right pr-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={(e) => handlePrintLabel(e, order)}
                                                    className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-[#2C2C2C] transition-colors shadow-sm bg-gray-50"
                                                    title="Print Label"
                                                >
                                                    <FiPrinter size={18} />
                                                </button>
                                                <button className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-[#2C2C2C] transition-colors shadow-sm bg-gray-50">
                                                    <FiMoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
