import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCharityTrust, clearCart } from '../store/cartSlice';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
    FiCheck,
    FiArrowRight,
    FiLock,
    FiTruck,
    FiHeart,
    FiGlobe,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiBook,
    FiChevronRight,
    FiShoppingBag
} from 'react-icons/fi';

// Custom Floating Input Component
const FloatingInput = ({ label, icon: Icon, ...props }) => (
    <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#8ABEE8] transition-colors">
            {Icon && <Icon size={18} />}
        </div>
        <input
            {...props}
            className="block px-4 pl-12 pb-3 pt-6 w-full text-sm md:text-base text-[#2C2C2C] bg-[#F5F8FA] border-2 border-transparent rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-[#8ABEE8] focus:bg-white peer transition-all duration-300 placeholder-transparent"
            placeholder=" "
        />
        <label className="absolute text-xs md:text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 font-bold tracking-wider pointer-events-none uppercase text-[10px] peer-focus:text-[#8ABEE8]">
            {label}
        </label>
    </div>
);

const CHARITIES = [
    { id: 'StandWithUs', name: 'StandWithUs', icon: FiGlobe, desc: 'Fighting antisemitism & educating about Israel' },
    { id: 'Combat Campus Antisemitism', name: 'Combat Campus Antisemitism', icon: FiBook, desc: 'Ending hate on college campuses' },
    { id: 'Blue Square Alliance', name: 'Blue Square Alliance', icon: FiHeart, desc: 'Standing up against Jewish hate' },
];

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, charityTrust } = useSelector((state) => state.cart);
    const toast = useToast();

    // State
    const [loading, setLoading] = useState(false);
    const [paymentInProgress, setPaymentInProgress] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCharity, setSelectedCharity] = useState(charityTrust || CHARITIES[0].id);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: ''
    });

    // ============ SHIPPING CONFIGURATION ============
    // Set FREE_SHIPPING to false and adjust SHIPPING_COST to enable charges
    const FREE_SHIPPING = true;  // Toggle: true = always free, false = charges apply
    const SHIPPING_COST = 15;    // Cost when not free (in USD)
    // ================================================

    // Calculations
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = FREE_SHIPPING ? 0 : SHIPPING_COST;
    const donation = subtotal * 0.10;
    const total = subtotal + shippingCost;

    // Ref to prevent re-triggering the redirect toast
    const hasRedirectedForEmptyCart = useRef(false);

    // Redirect if cart empty
    useEffect(() => {
        if (items.length === 0 && !hasRedirectedForEmptyCart.current && !showSuccessModal) {
            hasRedirectedForEmptyCart.current = true;
            toast.info("Your cart is empty");
            navigate('/products');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items.length, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const validateShipping = () => {
        const { firstName, lastName, email, phone, address, city, state, zip } = shippingAddress;
        return firstName && lastName && email && phone && address && city && state && zip;
    };

    const nextStep = () => {
        if (currentStep === 2 && !validateShipping()) {
            toast.error("Please fill in all shipping details");
            return;
        }
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Ref for storing local order ID for PayPal flow
    const localOrderIdRef = useRef(null);

    // PayPal createOrder callback - creates local order then PayPal order
    const paypalCreateOrder = async () => {
        try {
            const orderData = {
                items: items.map(item => ({
                    product: item.product || item._id, // Fallback for older cart items
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                shippingAddress: {
                    name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                    phone: shippingAddress.phone,
                    address: shippingAddress.address,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    pincode: shippingAddress.zip
                },
                charityTrust: selectedCharity,
                payment: { method: 'PayPal', status: 'Pending' },
                totalAmount: total,
            };

            // 1. Create local order in our DB
            const { data: order } = await api.post('/api/orders', orderData);
            localOrderIdRef.current = order._id;

            // 2. Create PayPal order
            const { data: paypalOrder } = await api.post('/api/payment/paypal/create-order', {
                orderId: order._id,
            });

            return paypalOrder.id; // Return PayPal order ID for the SDK

        } catch (err) {
            console.error('PayPal createOrder error:', err);
            toast.error(err.response?.data?.message || 'Failed to create order');
            setPaymentInProgress(false);
            throw err;
        }
    };

    // PayPal onApprove callback - captures the payment
    const paypalOnApprove = async (data) => {
        setLoading(true);
        try {
            // Capture the payment
            await api.post('/api/payment/paypal/capture-order', {
                orderID: data.orderID,
            });

            toast.success('Payment successful! Order placed.');
            dispatch(clearCart());
            setShowSuccessModal(true);
        } catch (err) {
            console.error('PayPal capture error:', err);
            toast.error(err.response?.data?.message || 'Payment failed');
        } finally {
            setLoading(false);
            setPaymentInProgress(false);
        }
    };

    const paypalOnError = (err) => {
        console.error('PayPal Error:', err);
        toast.error('An error occurred with PayPal. Please try again.');
        setPaymentInProgress(false);
    };

    const paypalOnCancel = () => {
        toast.info('Payment cancelled.');
        setPaymentInProgress(false);
    };

    const paypalOnClick = (data, actions) => {
        if (paymentInProgress) {
            return actions.reject();
        }
        setPaymentInProgress(true);
        return actions.resolve();
    };

    if (!items.length && !showSuccessModal) {
        // Show nothing briefly while redirecting to prevent flash, navigation effect handles redirect
        return (
            <div className="min-h-screen bg-[#F5F8FA] flex items-center justify-center">
                <div className="animate-pulse text-gray-400 font-bold">Redirecting...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F8FA] font-sans selection:bg-[#8ABEE8] selection:text-white pb-12 md:pb-24">

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => navigate('/')}
                    ></div>

                    {/* Modal Content */}
                    <div className="bg-white rounded-[2.5rem] p-6 md:p-12 max-w-md w-full relative z-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 text-center border border-white/50">
                        {/* Success Icon */}
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 animate-in zoom-in duration-700 delay-200">
                            <FiCheck size={48} strokeWidth={3} className="animate-in fade-in duration-1000" />
                        </div>

                        <h2 className="text-3xl font-extrabold text-[#2C2C2C] mb-4">Payment Successful!</h2>
                        <p className="text-gray-500 mb-10 leading-relaxed">
                            Thank you for your purchase. Your order has been placed successfully and a confirmation email has been sent to you.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/my-orders')}
                                className="w-full h-14 bg-[#2C2C2C] text-white rounded-full font-bold hover:bg-[#8ABEE8] transition-colors shadow-lg shadow-[#2C2C2C]/20"
                            >
                                View Order Details
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full h-14 bg-transparent text-gray-400 font-bold hover:text-[#2C2C2C] transition-colors"
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300 shadow-sm">
                <div className="container mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#8ABEE8] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-[#8ABEE8]/20 group-hover:scale-110 transition-transform">M</div>
                        <span className="text-lg md:text-xl font-extrabold tracking-tight text-[#2C2C2C]">MAZEL</span>
                    </div>

                    {/* Desktop Stepper */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-8 text-xs font-bold uppercase tracking-widest">
                        {[
                            { step: 1, label: 'Impact' },
                            { step: 2, label: 'Shipping' },
                            { step: 3, label: 'Payment' }
                        ].map((s, idx) => (
                            <div key={s.step} className="flex items-center gap-2 lg:gap-4">
                                <div className={`flex items-center gap-2 transition-colors duration-300 ${currentStep >= s.step ? 'text-[#2C2C2C]' : 'text-gray-300'}`}>
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 transition-all duration-300 ${currentStep > s.step ? 'bg-[#2C2C2C] border-[#2C2C2C] text-white' :
                                        currentStep === s.step ? 'text-[#2C2C2C] border-[#2C2C2C]' :
                                            'text-gray-300 border-gray-200'
                                        }`}>
                                        {currentStep > s.step ? <FiCheck size={12} strokeWidth={4} /> : s.step}
                                    </span>
                                    <span>{s.label}</span>
                                </div>
                                {idx < 2 && <div className={`w-8 lg:w-16 h-px transition-colors duration-300 ${currentStep > s.step ? 'bg-[#2C2C2C]' : 'bg-gray-200'}`}></div>}
                            </div>
                        ))}
                    </div>

                    {/* Mobile Step Indicator */}
                    <div className="md:hidden flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2C2C2C]">
                        <span className="text-[#8ABEE8]">Step {currentStep}</span> <span className="text-gray-300">/</span> <span>3</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 pt-8 md:pt-12">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* LEFT COLUMN: Main Forms */}
                    <div className="lg:col-span-7 space-y-8">

                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#2C2C2C] mb-2 tracking-tight">
                                {currentStep === 1 && 'Choose Your Impact'}
                                {currentStep === 2 && 'Shipping Details'}
                                {currentStep === 3 && 'Payment & Review'}
                            </h1>
                            <p className="text-gray-500 text-sm md:text-base">
                                {currentStep === 1 && 'Select a cause to support with your purchase.'}
                                {currentStep === 2 && 'Where should we send your order?'}
                                {currentStep === 3 && 'Securely complete your purchase.'}
                            </p>
                        </div>

                        {/* STEP 1: Impact Selection */}
                        {currentStep === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-white bg-[#8ABEE8] px-2 py-2 md:px-3 rounded-full shadow-sm shadow-[#8ABEE8]/20">100% Donation Included</span>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {CHARITIES.map((c) => (
                                        <button
                                            key={c.id}
                                            onClick={() => {
                                                setSelectedCharity(c.id);
                                                dispatch(setCharityTrust(c.id));
                                            }}
                                            className={`group relative p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-2 text-left transition-all duration-300 outline-none flex flex-row md:flex-col justify-between items-center md:items-start gap-4 md:gap-0 h-auto md:h-64 ${selectedCharity === c.id
                                                ? 'border-[#2C2C2C] bg-[#2C2C2C] text-white shadow-xl shadow-[#2C2C2C]/20 transform scale-[1.02]'
                                                : 'border-white bg-white hover:border-[#8ABEE8]/30 hover:shadow-lg hover:shadow-[#8ABEE8]/5 text-[#2C2C2C]'
                                                }`}
                                        >
                                            {/* <div className={`w-6 h-6 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-2xl transition-all duration-500 shrink-0 ${selectedCharity === c.id
                                                ? 'bg-white/20 text-[#8ABEE8]'
                                                : 'bg-[#F5F8FA] text-[#2C2C2C] group-hover:bg-[#8ABEE8] group-hover:text-white'
                                                }`}>
                                                <c.icon size={14} className="md:w-6 md:h-6" />
                                            </div> */}
                                            <div className="flex-1 md:mt-auto">
                                                <h3 className="font-bold text-sm md:text-lg mb-1 md:mb-2 leading-tight">{c.name}</h3>
                                                <p className={`text-[10px] md:text-xs font-medium leading-relaxed line-clamp-2 md:line-clamp-none ${selectedCharity === c.id ? 'text-white/70' : 'text-gray-400'}`}>{c.desc}</p>
                                            </div>
                                            {selectedCharity === c.id && (
                                                <div className="absolute top-4 right-4 md:top-6 md:right-6 animate-in fade-in zoom-in duration-300">
                                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#8ABEE8] text-white flex items-center justify-center border-2 border-[#2C2C2C]">
                                                        <FiCheck size={12} className="md:w-4 md:h-4" strokeWidth={4} />
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={nextStep}
                                    className="w-full md:w-auto md:px-12 bg-[#2C2C2C] text-white h-14 rounded-full font-bold hover:bg-[#8ABEE8] transition-colors flex items-center justify-center gap-2 mt-8"
                                >
                                    Continue to Shipping <FiArrowRight />
                                </button>
                            </div>
                        )}

                        {/* STEP 2: Shipping Details */}
                        {currentStep === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-white">
                                    <form className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-5">
                                            <FloatingInput label="First Name" name="firstName" icon={FiUser} type="text" value={shippingAddress.firstName} onChange={handleInputChange} />
                                            <FloatingInput label="Last Name" name="lastName" icon={FiUser} type="text" value={shippingAddress.lastName} onChange={handleInputChange} />
                                        </div>

                                        <div className="space-y-5">
                                            <FloatingInput label="Email Address" name="email" icon={FiMail} type="email" value={shippingAddress.email} onChange={handleInputChange} />
                                            <FloatingInput label="Phone Number" name="phone" icon={FiPhone} type="tel" value={shippingAddress.phone} onChange={handleInputChange} />
                                            <FloatingInput label="Street Address" name="address" icon={FiMapPin} type="text" value={shippingAddress.address} onChange={handleInputChange} />
                                        </div>

                                        <div className="grid grid-cols-6 gap-5">
                                            <div className="col-span-6 md:col-span-3">
                                                <FloatingInput label="City" name="city" type="text" value={shippingAddress.city} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-span-3 md:col-span-2">
                                                <FloatingInput label="State" name="state" type="text" value={shippingAddress.state} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-span-3 md:col-span-1">
                                                <FloatingInput label="Zip" name="zip" type="text" value={shippingAddress.zip} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="flex flex-col-reverse md:flex-row gap-4 mt-8">
                                    <button
                                        onClick={prevStep}
                                        className="w-full md:w-auto md:px-8 bg-white border border-gray-200 text-[#2C2C2C] h-14 md:h-14 rounded-full font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        className="w-full md:w-auto md:px-12 bg-[#2C2C2C] text-white h-16 md:h-14 rounded-full font-bold hover:bg-[#8ABEE8] transition-colors flex items-center justify-center gap-2"
                                    >
                                        Continue to Payment <FiArrowRight />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Payment */}
                        {currentStep === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
                                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center justify-center text-center space-y-6 mb-8">
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2">
                                        <FiCheck size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2C2C2C]">Everything looks good!</h3>
                                        <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                            You are about to donate <strong>100%</strong> to <span className="text-[#8ABEE8] font-bold">{CHARITIES.find(c => c.id === selectedCharity)?.name}</span> with this purchase.
                                        </p>
                                    </div>
                                </div>

                                {/* Pay Button Moved to Summary on Mobile, or shown here */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={prevStep}
                                        className="w-full md:w-auto md:px-8 bg-white border border-gray-200 text-[#2C2C2C] h-14 rounded-full font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-5 relative">
                        <div className="bg-white text-[#2C2C2C] rounded-[2.5rem] p-6 lg:p-10 shadow-2xl shadow-gray-200/50 sticky top-28 overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700 border border-gray-100">

                            {/* Decorative background blur */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5F8FA] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                                    <h3 className="text-xl font-bold tracking-tight">Order Summary</h3>
                                    <div className="bg-[#F5F8FA] px-3 py-1 rounded-full text-xs font-bold text-[#8ABEE8] border border-gray-100">
                                        {items.reduce((a, c) => a + c.quantity, 0)} Items
                                    </div>
                                </div>

                                {/* Cart Items */}
                                <div className="space-y-6 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                                    {items.map((item) => (
                                        <div key={item.product} className="flex gap-5 group">
                                            <div className="w-20 h-20 rounded-2xl bg-[#F5F8FA] overflow-hidden flex-shrink-0 relative border border-gray-100 group-hover:border-[#8ABEE8]/30 transition-colors">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="flex-grow pt-1">
                                                <h4 className="text-sm font-bold text-[#2C2C2C] mb-1 leading-snug line-clamp-1">{item.name}</h4>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold">Qty {item.quantity}</span>
                                                    <span className="font-bold text-[#8ABEE8]">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 pt-6 border-t border-gray-100 text-sm font-medium">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Shipping</span>
                                        <span className="text-[#8ABEE8] font-bold flex items-center gap-1"><FiTruck size={14} /> {shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[#8ABEE8] bg-[#F5F8FA] px-4 py-3 rounded-xl mt-2 border border-[#8ABEE8]/20">
                                        <span className="flex items-center gap-1 font-bold text-xs uppercase tracking-wide">
                                            <FiHeart size={14} fill="currentColor" /> Impact Donation (100%)
                                        </span>
                                        {/* <span className="font-bold">${donation.toFixed(2)}</span> */}
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-gray-100 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-400 font-medium text-sm">Total Due</span>
                                        <span className="text-4xl font-extrabold text-[#2C2C2C] tracking-tight">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {currentStep === 3 ? (
                                    <div className="paypal-button-container" style={{ position: 'relative', zIndex: 1 }}>
                                        {loading ? (
                                            <div className="w-full bg-gray-200 h-12 rounded-lg flex items-center justify-center">
                                                <span className="animate-pulse text-gray-500">Processing...</span>
                                            </div>
                                        ) : (
                                            <PayPalButtons
                                                style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
                                                disabled={paymentInProgress}
                                                createOrder={paypalCreateOrder}
                                                onApprove={paypalOnApprove}
                                                onError={paypalOnError}
                                                onCancel={paypalOnCancel}
                                                onClick={paypalOnClick}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center text-sm text-gray-400 font-medium bg-gray-50 py-4 rounded-xl">
                                        Complete previous steps to pay
                                    </div>
                                )}

                                <div className="mt-8 flex items-center justify-center gap-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-80">
                                    <span className="flex items-center gap-1.5"><FiLock size={12} /> SSL Encrypted</span>
                                    <span className="flex items-center gap-1.5"><FiGlobe size={12} /> Global Shipping</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
