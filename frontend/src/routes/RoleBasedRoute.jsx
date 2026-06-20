import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ROLE_HOME = {
    ADMIN: '/admin/dashboard',
    FACULTY: '/faculty/dashboard',
    STUDENT: '/student/dashboard',
};

export default function RoleBasedRoute({ allowedRoles }) {
    const { role } = useAuth();

    if (!allowedRoles.includes(role)) {
        return <Navigate to={ROLE_HOME[role] || '/login'} replace />;
    }

    return <Outlet />;
}