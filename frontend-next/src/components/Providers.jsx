'use client';

import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { store } from '@/store';
import { ToastProvider } from '@/context/ToastContext';
import AuthChecker from '@/components/AuthChecker';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID';
const PAYPAL_CURRENCY = process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || 'INR';

const initialOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency: PAYPAL_CURRENCY,
    intent: 'capture',
};

export default function Providers({ children }) {
    return (
        <Provider store={store}>
            <PayPalScriptProvider options={initialOptions}>
                <ToastProvider>
                    <AuthChecker />
                    {children}
                </ToastProvider>
            </PayPalScriptProvider>
        </Provider>
    );
}
