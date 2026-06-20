import axiosInstance from './axiosConfig';

export const getMarksByIdApi = (id) => axiosInstance.get(`/faculty/marks/${id}`);

export const getMarksByStudentApi = (studentId) => axiosInstance.get(`/faculty/marks/student/${studentId}`);

export const addMarksApi = (payload) => axiosInstance.post('/faculty/marks', payload);
// payload: { studentId, subjectId, internalMarks, externalMarks }

export const updateMarksApi = (id, payload) => axiosInstance.put(`/faculty/marks/${id}`, payload);

export const deleteMarksApi = (id) => axiosInstance.delete(`/faculty/marks/${id}`);