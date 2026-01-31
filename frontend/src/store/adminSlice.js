import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Fetch Dashboard Stats
export const fetchDashboardStats = createAsyncThunk('admin/fetchDashboardStats', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/api/admin/dashboard-stats');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
});

// Fetch All Orders
export const fetchAllOrders = createAsyncThunk('admin/fetchAllOrders', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/api/orders'); // Now supports backward compat (returns all)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
});

const initialState = {
    stats: null,
    orders: [],
    loading: false,
    error: null,
    statsLastFetched: null,
    ordersLastFetched: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearAdminData: (state) => {
            state.stats = null;
            state.orders = [];
            state.statsLastFetched = null;
            state.ordersLastFetched = null;
        },
        // Optimistic Updates for Orders could go here
    },
    extraReducers: (builder) => {
        builder
            // Dashboard Stats
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
                state.statsLastFetched = Date.now();
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // All Orders
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = Array.isArray(action.payload) ? action.payload : action.payload.orders; // Handle both array and paginated response
                state.ordersLastFetched = Date.now();
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearAdminData } = adminSlice.actions;
export default adminSlice.reducer;
