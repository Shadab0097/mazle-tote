import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { getProfile, getAdminProfile } from './store/authSlice';
import { ToastProvider } from './context/ToastContext';

// Layouts
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminLogin from './pages/AdminLogin';

// User Pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';

function AuthChecker() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      // Try user auth first
      await dispatch(getProfile());
      // If that fails, try admin auth
      await dispatch(getAdminProfile());
    };
    checkAuth();
  }, [dispatch]);

  return null;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthChecker />
      <Routes>
        {/* Public Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          {/* Guest Only Routes */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
          </Route>

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Route>

        {/* Admin Login (No Layout) */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </Provider>
  );
}

export default App;
