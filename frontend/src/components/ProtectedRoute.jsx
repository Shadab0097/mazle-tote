import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
    const { isAdmin } = useSelector((state) => state.auth);
    return isAdmin ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

export const GuestRoute = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};
