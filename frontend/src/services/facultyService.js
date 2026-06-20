import {
    getFacultyListApi,
    getFacultyByIdApi,
    createFacultyApi,
    updateFacultyApi,
    deleteFacultyApi,
} from '../api/facultyApi';

export const fetchFaculty = async () => {
    const { data } = await getFacultyListApi();
    return data;
};

export const fetchFacultyById = async (id) => {
    const { data } = await getFacultyByIdApi(id);
    return data;
};

export const createFaculty = async (payload) => {
    const { data } = await createFacultyApi(payload);
    return data;
};

export const updateFaculty = async (id, payload) => {
    const { data } = await updateFacultyApi(id, payload);
    return data;
};

export const deleteFaculty = async (id) => {
    await deleteFacultyApi(id);
};