'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { ToastProvider } from '@/context/ToastContext';
import AuthChecker from '@/components/AuthChecker';

export default function Providers({ children }) {
    return (
        <Provider store={store}>
            <ToastProvider>
                <AuthChecker />
                {children}
            </ToastProvider>
        </Provider>
    );
}
