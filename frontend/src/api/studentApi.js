import axiosInstance from './axiosConfig';

// ---- Admin: full CRUD ----
export const getAdminStudentsApi = (params) => axiosInstance.get('/admin/students', { params });
// params: { page, size, sortBy }

export const getAdminStudentByIdApi = (id) => axiosInstance.get(`/admin/students/${id}`);

export const createStudentApi = (payload) => axiosInstance.post('/admin/students', payload);
// payload: { usn, name, email, semester, department }

export const updateStudentApi = (id, payload) => axiosInstance.put(`/admin/students/${id}`, payload);

export const deleteStudentApi = (id) => axiosInstance.delete(`/admin/students/${id}`);

// ---- Faculty: read-only ----
export const getFacultyStudentsApi = (params) => axiosInstance.get('/faculty/students', { params });

export const getFacultyStudentByIdApi = (id) => axiosInstance.get(`/faculty/students/${id}`);

// ---- Student: own profile ----
export const getMyProfileApi = () => axiosInstance.get('/student/profile/me');