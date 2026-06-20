import {
    getSubjectsApi,
    getSubjectByIdApi,
    createSubjectApi,
    updateSubjectApi,
    deleteSubjectApi,
} from '../api/subjectApi';

export const fetchSubjects = async () => {
    const { data } = await getSubjectsApi();
    return data;
};

export const fetchSubjectById = async (id) => {
    const { data } = await getSubjectByIdApi(id);
    return data;
};

export const createSubject = async (payload) => {
    const { data } = await createSubjectApi(payload);
    return data;
};

export const updateSubject = async (id, payload) => {
    const { data } = await updateSubjectApi(id, payload);
    return data;
};

export const deleteSubject = async (id) => {
    await deleteSubjectApi(id);
};