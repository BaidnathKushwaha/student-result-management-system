export const ROLES = {
    ADMIN: 'ADMIN',
    FACULTY: 'FACULTY',
    STUDENT: 'STUDENT',
};

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Mirrors backend GradeUtil grade-point scale
export const GRADE_SCALE = [
    { min: 90, point: 10, label: 'O' },
    { min: 80, point: 9, label: 'A+' },
    { min: 70, point: 8, label: 'A' },
    { min: 60, point: 7, label: 'B+' },
    { min: 50, point: 6, label: 'B' },
    { min: 0, point: 0, label: 'F' },
];

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const STORAGE_KEYS = {
    TOKEN: 'eg_token',
    USER: 'eg_user',
};

export const NAV_LINKS = {
    ADMIN: [
        { to: '/admin/dashboard', label: 'Dashboard', icon: 'grid' },
        { to: '/admin/students', label: 'Students', icon: 'users' },
        { to: '/admin/faculty', label: 'Faculty', icon: 'briefcase' },
        { to: '/admin/subjects', label: 'Subjects', icon: 'book' },
        { to: '/admin/marks', label: 'Marks', icon: 'edit' },
        { to: '/admin/reports', label: 'Reports', icon: 'bar-chart' },
    ],
    FACULTY: [
        { to: '/faculty/dashboard', label: 'Dashboard', icon: 'grid' },
        { to: '/faculty/students', label: 'Students', icon: 'users' },
        { to: '/faculty/marks-entry', label: 'Marks Entry', icon: 'edit' },
        { to: '/faculty/results', label: 'Results', icon: 'award' },
    ],
    STUDENT: [
        { to: '/student/dashboard', label: 'Dashboard', icon: 'grid' },
        { to: '/student/profile', label: 'My Profile', icon: 'user' },
        { to: '/student/results', label: 'My Results', icon: 'award' },
        { to: '/student/semester-results', label: 'Semester Results', icon: 'book' },
    ],
};