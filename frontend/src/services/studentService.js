import {
    getAdminStudentsApi,
    getAdminStudentByIdApi,
    createStudentApi,
    updateStudentApi,
    deleteStudentApi,
    getFacultyStudentsApi,
    getFacultyStudentByIdApi,
    getMyProfileApi,
} from '../api/studentApi';

export const fetchStudents = async ({ page = 0, size = 10, sortBy = 'name' } = {}) => {
    const { data } = await getAdminStudentsApi({ page, size, sortBy });
    return data; // Spring Page object: { content, totalElements, totalPages, number, size, ... }
};

export const fetchStudentById = async (id) => {
    const { data } = await getAdminStudentByIdApi(id);
    return data;
};

export const createStudent = async (payload) => {
    const { data } = await createStudentApi(payload);
    return data;
};

export const updateStudent = async (id, payload) => {
    const { data } = await updateStudentApi(id, payload);
    return data;
};

export const deleteStudent = async (id) => {
    await deleteStudentApi(id);
};

export const fetchFacultyViewStudents = async ({ page = 0, size = 10, sortBy = 'name' } = {}) => {
    const { data } = await getFacultyStudentsApi({ page, size, sortBy });
    return data;
};

export const fetchFacultyViewStudentById = async (id) => {
    const { data } = await getFacultyStudentByIdApi(id);
    return data;
};

export const fetchMyProfile = async () => {
    const { data } = await getMyProfileApi();
    return data;
};