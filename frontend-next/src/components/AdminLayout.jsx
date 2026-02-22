'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAdmin } from '@/store/authSlice';
import {
    FiLayout,
    FiShoppingBag,
    FiPackage,
    FiLogOut,
    FiMenu,
    FiX
} from 'react-icons/fi';

const AdminLayout = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { admin } = useSelector((state) => state.auth);
    const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logoutAdmin());
        router.push('/admin-login');
    };

    const isActive = (path) => pathname === path;

    const navItems = [
        { label: 'Dashboard', path: '/admin', icon: FiLayout },
        { label: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
        { label: 'Products', path: '/admin/products', icon: FiPackage },
    ];

    return (
        <div className="min-h-screen bg-[#F5F8FA] font-sans selection:bg-[#8ABEE8] selection:text-white flex flex-col">

            {/* Top Navigation Bar */}
            <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 h-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 text-[#2C2C2C] lg:hidden"
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>

                        <Link href="/admin" className="flex items-center gap-2.5">
                            <img src="/logo.png" alt="Mazel Admin" className="h-14 w-auto object-contain" />
                        </Link>
                    </div>

                    <nav className="hidden lg:flex items-center gap-1 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100/50">
                        {navItems.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${active
                                        ? 'bg-white text-[#2C2C2C] shadow-sm'
                                        : 'text-gray-500 hover:text-[#2C2C2C] hover:bg-white/50'
                                        }`}
                                >
                                    <item.icon size={16} className={active ? 'text-[#8ABEE8]' : ''} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3 md:gap-5">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-[#2C2C2C] leading-tight">{admin?.name || 'Admin'}</p>
                                <p className="text-[10px] text-gray-400 font-medium">Administrator</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#8ABEE8] to-blue-500 p-[2px] cursor-pointer hover:scale-105 transition-transform">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#2C2C2C] font-bold text-xs">
                                    {admin?.name?.charAt(0) || 'A'}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                                title="Sign Out"
                            >
                                <FiLogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-2 duration-200 overflow-hidden">
                        <div className="p-4 space-y-2">
                            {navItems.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${active
                                            ? 'bg-[#F5F8FA] text-[#2C2C2C]'
                                            : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        <item.icon size={18} className={active ? 'text-[#8ABEE8]' : ''} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 fade-in">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
