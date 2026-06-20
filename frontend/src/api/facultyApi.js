import axiosInstance from './axiosConfig';

export const getFacultyListApi = () => axiosInstance.get('/admin/faculty');

export const getFacultyByIdApi = (id) => axiosInstance.get(`/admin/faculty/${id}`);

export const createFacultyApi = (payload) => axiosInstance.post('/admin/faculty', payload);
// payload: { name, email }

export const updateFacultyApi = (id, payload) => axiosInstance.put(`/admin/faculty/${id}`, payload);

export const deleteFacultyApi = (id) => axiosInstance.delete(`/admin/faculty/${id}`);