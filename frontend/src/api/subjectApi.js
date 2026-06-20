import axiosInstance from './axiosConfig';

export const getSubjectsApi = () => axiosInstance.get('/admin/subjects');

export const getSubjectByIdApi = (id) => axiosInstance.get(`/admin/subjects/${id}`);

export const createSubjectApi = (payload) => axiosInstance.post('/admin/subjects', payload);
// payload: { subjectCode, subjectName, credits, semester }

export const updateSubjectApi = (id, payload) => axiosInstance.put(`/admin/subjects/${id}`, payload);

export const deleteSubjectApi = (id) => axiosInstance.delete(`/admin/subjects/${id}`);