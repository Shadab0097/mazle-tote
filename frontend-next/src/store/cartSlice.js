import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
    if (typeof window === 'undefined') return [];
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch {
        return [];
    }
};

const saveCartToStorage = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
};

const initialState = {
    items: loadCartFromStorage(),
    charityTrust: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.items.find(
                (item) => item.product === action.payload.product
            );
            if (existingItem) {
                existingItem.quantity += action.payload.quantity || 1;
            } else {
                state.items.push({
                    ...action.payload,
                    quantity: action.payload.quantity || 1,
                });
            }
            saveCartToStorage(state.items);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                (item) => item.product !== action.payload
            );
            saveCartToStorage(state.items);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find((item) => item.product === productId);
            if (item) {
                item.quantity = quantity;
                if (quantity <= 0) {
                    state.items = state.items.filter((i) => i.product !== productId);
                }
            }
            saveCartToStorage(state.items);
        },
        setCharityTrust: (state, action) => {
            state.charityTrust = action.payload;
        },
        clearCart: (state) => {
            state.items = [];
            state.charityTrust = null;
            localStorage.removeItem('cart');
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, setCharityTrust, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
