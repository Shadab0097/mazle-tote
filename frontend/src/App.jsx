import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { getProfile, getAdminProfile } from './store/authSlice';
import { ToastProvider } from './context/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import NewsletterModal from './components/NewsletterModal';

// Layouts
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

// Auth Pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));

// User Pages
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const MyOrders = lazy(() => import('./pages/MyOrders'));

// Admin Pages (Lazy Loaded)
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));

// Loading component for Suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function AuthChecker() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      const path = window.location.pathname;

      // Optimization: Prioritize checks based on current route to reduce 401s
      if (path.startsWith('/admin')) {
        // If on admin route, check admin first
        const adminAction = await dispatch(getAdminProfile());
        // If admin check failed, try user check (fallback)
        if (getAdminProfile.rejected.match(adminAction)) {
          await dispatch(getProfile());
        }
      } else {
        // Normal user route - check user first
        await dispatch(getProfile());
        // We don't auto-check admin on user routes to save a request
        // Admin state will be re-verified if they navigate to /admin
      }
    };
    checkAuth();
  }, [dispatch]);

  return null;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <NewsletterModal />
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

          {/* Checkout - accessible by both logged-in users and guests */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Route>
        </Route>

        {/* Admin Login (No Layout) */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminDashboard />
              </Suspense>
            } />
            <Route path="/admin/products" element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminProducts />
              </Suspense>
            } />
            <Route path="/admin/orders" element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminOrders />
              </Suspense>
            } />
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
