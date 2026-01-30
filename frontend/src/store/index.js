import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginUser, registerUser, logoutUser } from './authSlice';
import cartReducer, { clearCart } from './cartSlice';
import productReducer from './productSlice';

// Middleware to clear cart on auth state changes
const cartClearMiddleware = (store) => (next) => (action) => {
    const result = next(action);

    // Clear cart when user logs out
    if (logoutUser.fulfilled.match(action)) {
        store.dispatch(clearCart());
    }

    // Cart cleared on logout only to allow guest cart to persist on login
    // if (loginUser.fulfilled.match(action) || registerUser.fulfilled.match(action)) {
    //    store.dispatch(clearCart());
    // }

    return result;
};

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        products: productReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(cartClearMiddleware),
});

export default store;
