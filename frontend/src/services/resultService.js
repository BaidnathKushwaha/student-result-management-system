import { generateResultApi, getResultApi } from '../api/resultApi';

export const generateResult = async (studentId, semester) => {
    const { data } = await generateResultApi(studentId, semester);
    return data;
};

export const fetchResult = async (studentId, semester) => {
    const { data } = await getResultApi(studentId, semester);
    return data;
};