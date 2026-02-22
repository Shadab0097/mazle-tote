'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const toastVariants = {
    initial: { opacity: 0, y: -20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const ToastItem = ({ id, message, type, onClose }) => {
    let icon, bgClass, borderClass, textClass;

    switch (type) {
        case 'success':
            icon = <FiCheckCircle className="w-5 h-5 text-green-500" />;
            bgClass = 'bg-white';
            borderClass = 'border-green-100';
            textClass = 'text-gray-800';
            break;
        case 'error':
            icon = <FiAlertCircle className="w-5 h-5 text-red-500" />;
            bgClass = 'bg-white';
            borderClass = 'border-red-100';
            textClass = 'text-gray-800';
            break;
        case 'info':
        default:
            icon = <FiInfo className="w-5 h-5 text-blue-500" />;
            bgClass = 'bg-white';
            borderClass = 'border-blue-100';
            textClass = 'text-gray-800';
            break;
    }

    return (
        <motion.div
            layout
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`pointer-events-auto flex w-full max-w-sm items-center gap-4 rounded-2xl border ${borderClass} ${bgClass} p-4 shadow-lg shadow-gray-200/50 backdrop-blur-sm`}
        >
            <div className="flex-shrink-0">{icon}</div>
            <p className={`flex-1 text-sm font-medium ${textClass}`}>{message}</p>
            <button
                onClick={() => onClose(id)}
                className="flex-shrink-0 rounded-lg p-1 hover:bg-gray-100 transition-colors"
                aria-label="Close"
            >
                <FiX className="w-4 h-4 text-gray-400" />
            </button>
        </motion.div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

    const value = useMemo(() => ({ addToast, removeToast, success, error, info }), [addToast, removeToast, success, error, info]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center gap-2 p-4 pt-6 pointer-events-none sm:items-end sm:p-6">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <ToastItem
                            key={toast.id}
                            {...toast}
                            onClose={removeToast}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
