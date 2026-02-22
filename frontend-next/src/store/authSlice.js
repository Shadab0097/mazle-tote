import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { clearCart } from './cartSlice';

// Async thunks
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/auth/login', credentials);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/api/auth/me');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    await api.post('/api/auth/logout');
    return null;
});

// Admin thunks
export const loginAdmin = createAsyncThunk('auth/loginAdmin', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/admin/login', credentials);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Admin login failed');
    }
});

export const getAdminProfile = createAsyncThunk('auth/getAdminProfile', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/api/admin/me');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin profile');
    }
});

export const logoutAdmin = createAsyncThunk('auth/logoutAdmin', async () => {
    await api.post('/api/admin/logout');
    return null;
});

const initialState = {
    user: null,
    admin: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login User
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                // Cart will be cleared via middleware
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Profile
            .addCase(getProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getProfile.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })
            // Logout User
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                // Cart will be cleared via middleware
            })
            // Admin Login
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload;
                state.isAdmin = true;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Admin Profile
            .addCase(getAdminProfile.fulfilled, (state, action) => {
                state.admin = action.payload;
                state.isAdmin = true;
            })
            .addCase(getAdminProfile.rejected, (state) => {
                state.admin = null;
                state.isAdmin = false;
            })
            // Logout Admin
            .addCase(logoutAdmin.fulfilled, (state) => {
                state.admin = null;
                state.isAdmin = false;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
