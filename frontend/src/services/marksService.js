import {
    getMarksByIdApi,
    getMarksByStudentApi,
    addMarksApi,
    updateMarksApi,
    deleteMarksApi,
} from '../api/marksApi';

export const fetchMarksById = async (id) => {
    const { data } = await getMarksByIdApi(id);
    return data;
};

export const fetchMarksByStudent = async (studentId) => {
    const { data } = await getMarksByStudentApi(studentId);
    return data;
};

export const addMarks = async (payload) => {
    const { data } = await addMarksApi(payload);
    return data;
};

export const updateMarks = async (id, payload) => {
    const { data } = await updateMarksApi(id, payload);
    return data;
};

export const deleteMarks = async (id) => {
    await deleteMarksApi(id);
};