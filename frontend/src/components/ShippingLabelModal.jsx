
import React, { useEffect } from 'react';
import { FiX, FiPrinter } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

const ShippingLabelModal = ({ isOpen, onClose, order }) => {

    // Add/remove print styles when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            // Create and inject print styles
            const style = document.createElement('style');
            style.id = 'print-label-styles';
            style.innerHTML = `
                @media print {
                    /* Hide everything */
                    body * {
                        visibility: hidden !important;
                    }
                    /* Show only the printable label and its children */
                    .printable-label, .printable-label * {
                        visibility: visible !important;
                    }
                    /* Position the label at top-left */
                    .printable-label {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100mm !important;
                        height: 150mm !important;
                        margin: 0 !important;
                        padding: 5mm !important;
                        border: none !important;
                        box-shadow: none !important;
                        background: white !important;
                    }
                    @page {
                        size: 100mm 150mm;
                        margin: 0;
                    }
                }
            `;
            document.head.appendChild(style);

            return () => {
                // Cleanup: remove styles when modal closes
                const existingStyle = document.getElementById('print-label-styles');
                if (existingStyle) existingStyle.remove();
            };
        }
    }, [isOpen]);

    if (!isOpen || !order) return null;

    const companyName = import.meta.env.VITE_COMPANY_NAME || "Mazel Tote";
    const companyAddress1 = import.meta.env.VITE_COMPANY_ADDRESS_LINE1 || "123 Sustainable Way";
    const companyAddress2 = import.meta.env.VITE_COMPANY_ADDRESS_LINE2 || "Fashion District, NY 10001";
    const companyPhone = import.meta.env.VITE_COMPANY_PHONE || "+1 (555) 123-4567";

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#2C2C2C] flex items-center gap-2">
                        <FiPrinter className="text-[#8ABEE8]" /> Print Shipping Label
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Preview Area */}
                <div className="p-8 overflow-y-auto bg-gray-50 flex-grow flex justify-center">
                    <div
                        className="printable-label bg-white w-[100mm] min-h-[150mm] p-6 shadow-sm border border-gray-200 text-black font-sans leading-tight relative"
                    >
                        {/* Label Content */}
                        <div className="border-[3px] border-black h-full flex flex-col">
                            {/* Header / From */}
                            <div className="border-b-[3px] border-black p-4">
                                <h1 className="font-bold text-xl uppercase tracking-wider mb-2">PRIORITY SHIPPING</h1>
                                <div className="text-xs font-bold uppercase mb-1">From:</div>
                                <div className="text-sm">
                                    <div className="font-bold">{companyName}</div>
                                    <div>{companyAddress1}</div>
                                    <div>{companyAddress2}</div>
                                    <div className="mt-1">Tel: {companyPhone}</div>
                                </div>
                            </div>

                            {/* To Address */}
                            <div className="flex-grow p-6 flex flex-col justify-center border-b-[3px] border-black">
                                <div className="text-sm font-bold uppercase mb-4 text-gray-500">Ship To:</div>
                                <div className="text-xl leading-relaxed">
                                    <div className="font-bold text-2xl mb-1">{order.shippingAddress.name.toUpperCase()}</div>
                                    <div>{order.shippingAddress.address.toUpperCase()}</div>
                                    <div>{order.shippingAddress.city.toUpperCase()}, {order.shippingAddress.state.toUpperCase()} {order.shippingAddress.pincode}</div>
                                    <div className="mt-2 font-bold">Tel: {order.shippingAddress.phone}</div>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="p-4 grid grid-cols-2 gap-4 text-sm bg-gray-50/50">
                                <div>
                                    <div className="font-bold uppercase text-xs text-gray-400">Order ID</div>
                                    <div className="font-mono font-bold">#{order._id.slice(-8).toUpperCase()}</div>
                                </div>
                                <div>
                                    <div className="font-bold uppercase text-xs text-gray-400">Date</div>
                                    <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <div className="font-bold uppercase text-xs text-gray-400">Weight</div>
                                    <div>2.5 lbs (Est)</div>
                                </div>
                                <div>
                                    <div className="font-bold uppercase text-xs text-gray-400">Reference</div>
                                    <div className="truncate">{order.user?.email || 'Guest'}</div>
                                </div>
                            </div>

                            {/* Bottom Bar Code Placeholder */}
                            <div className="p-4 border-t-[3px] border-black flex flex-col items-center justify-center gap-2">
                                <div className="w-full h-12 bg-black/90 flex items-center justify-center text-white font-mono text-xs tracking-[0.5em]">
                                    ||| | ||| || ||| | ||
                                </div>
                                <div className="font-mono text-xs font-bold tracking-widest">{order._id.toUpperCase()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-2xl">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handlePrint} className="flex items-center gap-2">
                        <FiPrinter /> Print Label
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ShippingLabelModal;

