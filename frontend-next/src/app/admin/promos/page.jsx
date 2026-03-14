'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiToggleLeft, FiToggleRight, FiTag } from 'react-icons/fi';
import api from '@/services/api';
import { useToast } from '@/context/ToastContext';

export default function AdminPromos() {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newPromo, setNewPromo] = useState({ code: '', discountAmount: '', maxUses: '' });
    const toast = useToast();

    const fetchPromos = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/promos');
            setPromos(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch promos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/promos', newPromo);
            toast.success('Promo code created successfully');
            setShowModal(false);
            setNewPromo({ code: '', discountAmount: '', maxUses: '' });
            fetchPromos();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create promo code');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await api.patch(`/api/promos/${id}/toggle`);
            toast.success('Promo status updated');
            fetchPromos();
        } catch (error) {
            toast.error('Failed to update promo status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this promo code?')) return;
        try {
            await api.delete(`/api/promos/${id}`);
            toast.success('Promo code deleted');
            fetchPromos();
        } catch (error) {
            toast.error('Failed to delete promo code');
        }
    };

    return (
        <div>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#2C2C2C] mb-1">Promo Codes</h1>
                    <p className="text-gray-500 text-sm">Manage discount codes and usage limits</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-[#2C2C2C] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#8ABEE8] transition-colors shadow-lg shadow-[#2C2C2C]/20"
                >
                    <FiPlus size={18} />
                    New Promo Code
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#8ABEE8] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F5F8FA]/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Discount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usage</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {promos.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-3">
                                                <FiTag size={24} />
                                            </div>
                                            <p className="font-medium text-[#2C2C2C]">No promo codes found</p>
                                            <p className="text-sm mt-1">Create one to get started</p>
                                        </td>
                                    </tr>
                                ) : (
                                    promos.map((promo) => (
                                        <tr key={promo._id} className="border-b border-gray-50 hover:bg-[#F5F8FA]/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-extrabold text-[#2C2C2C] tracking-wide inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg">
                                                        <FiTag size={12} className="text-[#8ABEE8]"/>
                                                        {promo.code}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-emerald-600">
                                                ${promo.discountAmount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[#2C2C2C] font-bold">{promo.uses}</span>
                                                    <span className="text-gray-400 text-sm">/ {promo.maxUses === 0 ? '∞' : promo.maxUses}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${promo.isActive
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                    : 'bg-red-50 text-red-600 border-red-200'
                                                    }`}>
                                                    {promo.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggleStatus(promo._id)}
                                                        className={`p-2 rounded-xl border ${promo.isActive ? 'text-emerald-500 hover:bg-emerald-50 border-transparent hover:border-emerald-200' : 'text-gray-400 hover:bg-gray-50 border-transparent hover:border-gray-200'} transition-all`}
                                                        title={promo.isActive ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {promo.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(promo._id)}
                                                        className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-200"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 size={18} />
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
            )}

            {/* Create Promo Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowModal(false)} />
                    <div className="bg-white rounded-[2rem] p-6 sm:p-8 w-full max-w-md relative z-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-2xl font-extrabold text-[#2C2C2C] mb-6">Create Promo Code</h2>
                        <form onSubmit={handleCreate} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Code Name *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <FiTag size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-[#F5F8FA] border-2 border-transparent text-[#2C2C2C] rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#8ABEE8] focus:bg-white transition-colors font-bold uppercase"
                                        placeholder="e.g. SUMMER10"
                                        value={newPromo.code}
                                        onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discount Amount ($) *</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full bg-[#F5F8FA] border-2 border-transparent text-[#2C2C2C] rounded-xl px-4 py-3 focus:outline-none focus:border-[#8ABEE8] focus:bg-white transition-colors"
                                    placeholder="0.00"
                                    value={newPromo.discountAmount}
                                    onChange={(e) => setNewPromo({ ...newPromo, discountAmount: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Maximum Uses</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full bg-[#F5F8FA] border-2 border-transparent text-[#2C2C2C] rounded-xl px-4 py-3 focus:outline-none focus:border-[#8ABEE8] focus:bg-white transition-colors"
                                    placeholder="Leave 0 for unlimited"
                                    value={newPromo.maxUses}
                                    onChange={(e) => setNewPromo({ ...newPromo, maxUses: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-white border-2 border-gray-200 text-[#2C2C2C] py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#2C2C2C] text-white py-3 rounded-xl font-bold hover:bg-[#8ABEE8] transition-colors shadow-lg shadow-[#2C2C2C]/20"
                                >
                                    Create Code
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
