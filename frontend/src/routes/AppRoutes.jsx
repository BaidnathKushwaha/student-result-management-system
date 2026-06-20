import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/Home';

import AdminLayout from '../layouts/AdminLayout';
import FacultyLayout from '../layouts/FacultyLayout';
import StudentLayout from '../layouts/StudentLayout';

import AdminDashboard from '../pages/admin/Dashboard';
import AdminStudents from '../pages/admin/Students';
import AdminFaculty from '../pages/admin/Faculty';
import AdminSubjects from '../pages/admin/Subjects';
import AdminMarks from '../pages/admin/Marks';
import AdminReports from '../pages/admin/Reports';
import AdminAuditLogs from '../pages/admin/AuditLogs';

import FacultyDashboard from '../pages/faculty/Dashboard';
import FacultyAssignedStudents from '../pages/faculty/AssignedStudents';
import FacultyMarksEntry from '../pages/faculty/MarksEntry';
import FacultyResults from '../pages/faculty/Results';

import StudentDashboard from '../pages/student/Dashboard';
import StudentMyProfile from '../pages/student/MyProfile';
import StudentMyResults from '../pages/student/MyResults';
import StudentSemesterResults from '../pages/student/SemesterResults';
import StudentNotifications from '../pages/student/Notifications';

import { ROLES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';

const ROLE_HOME = {
    [ROLES.ADMIN]: '/admin/dashboard',
    [ROLES.FACULTY]: '/faculty/dashboard',
    [ROLES.STUDENT]: '/student/dashboard',
};

function RootRedirect() {
    const { isAuthenticated, role } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Navigate to={ROLE_HOME[role] || '/login'} replace />;
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
                {/* ---------------- Admin ---------------- */}
                <Route element={<RoleBasedRoute allowedRoles={[ROLES.ADMIN]} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="students" element={<AdminStudents />} />
                        <Route path="faculty" element={<AdminFaculty />} />
                        <Route path="subjects" element={<AdminSubjects />} />
                        <Route path="marks" element={<AdminMarks />} />
                        <Route path="reports" element={<AdminReports />} />
                        <Route path="audit-logs" element={<AdminAuditLogs />} />
                    </Route>
                </Route>

                {/* ---------------- Faculty ---------------- */}
                <Route element={<RoleBasedRoute allowedRoles={[ROLES.FACULTY, ROLES.ADMIN]} />}>
                    <Route path="/faculty" element={<FacultyLayout />}>
                        <Route path="dashboard" element={<FacultyDashboard />} />
                        <Route path="students" element={<FacultyAssignedStudents />} />
                        <Route path="marks-entry" element={<FacultyMarksEntry />} />
                        <Route path="results" element={<FacultyResults />} />
                    </Route>
                </Route>

                {/* ---------------- Student ---------------- */}
                <Route element={<RoleBasedRoute allowedRoles={[ROLES.STUDENT]} />}>
                    <Route path="/student" element={<StudentLayout />}>
                        <Route path="dashboard" element={<StudentDashboard />} />
                        <Route path="profile" element={<StudentMyProfile />} />
                        <Route path="results" element={<StudentMyResults />} />
                        <Route path="semester-results" element={<StudentSemesterResults />} />
                        <Route path="notifications" element={<StudentNotifications />} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}