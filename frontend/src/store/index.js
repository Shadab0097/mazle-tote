import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginUser, registerUser, logoutUser } from './authSlice';
import cartReducer, { clearCart } from './cartSlice';
import productReducer from './productSlice';
import ordersReducer, { clearOrders } from './ordersSlice';
import adminReducer, { clearAdminData } from './adminSlice';

// Middleware to clear cart and orders on auth state changes
const authStateMiddleware = (store) => (next) => (action) => {
    const result = next(action);

    // Clear cart and orders when user logs out
    if (logoutUser.fulfilled.match(action)) {
        store.dispatch(clearCart());
        store.dispatch(clearOrders());
        store.dispatch(clearAdminData());
    }

    return result;
};

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        products: productReducer,
        orders: ordersReducer,
        admin: adminReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authStateMiddleware),
});

export default store;
