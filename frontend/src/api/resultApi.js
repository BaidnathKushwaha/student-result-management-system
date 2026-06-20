import axiosInstance from './axiosConfig';

export const generateResultApi = (studentId, semester) =>
    axiosInstance.post(`/results/student/${studentId}/semester/${semester}/generate`);

export const getResultApi = (studentId, semester) =>
    axiosInstance.get(`/results/student/${studentId}/semester/${semester}`);