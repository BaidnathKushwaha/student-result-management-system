import axiosInstance from './axiosConfig';

export const registerApi = (payload) => axiosInstance.post('/auth/register', payload);
// payload: { username, password, role, referenceId? }

export const loginApi = (payload) => axiosInstance.post('/auth/login', payload);
// payload: { username, password }