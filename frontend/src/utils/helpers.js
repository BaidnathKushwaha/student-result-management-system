import { GRADE_SCALE } from './constants';

export const getInitials = (name = '') => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const getGradeLabel = (totalMarks) => {
    const grade = GRADE_SCALE.find((g) => totalMarks >= g.min);
    return grade ? grade.label : 'F';
};

export const getGradeBadgeVariant = (totalMarks) => {
    if (totalMarks >= 70) return 'green';
    if (totalMarks >= 50) return 'gold';
    return 'red';
};

export const getGpaBadgeVariant = (gpa) => {
    if (gpa >= 8) return 'green';
    if (gpa >= 6) return 'gold';
    return 'red';
};

export const formatDate = (...args) => {
    const date = args.length === 0 ? new Date() : args[0];
    if (!date) return 'N/A';

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        return 'Invalid Date';
    }

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(parsedDate);
};

export const formatDateTime = (date) => {
    if (!date) return 'N/A';

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        return 'Invalid Date';
    }

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).format(parsedDate);
};

export const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return Number(value).toFixed(decimals);
};

/**
 * Extracts a readable error message from an Axios error / API error response.
 */
export const getErrorMessage = (error) => {
    const data = error?.response?.data;
    if (!data) return error?.message || 'Something went wrong. Please try again.';
    if (data.fieldErrors) {
        const firstField = Object.values(data.fieldErrors)[0];
        return firstField || data.message || 'Validation failed';
    }
    return data.message || 'Something went wrong. Please try again.';
};

export const truncate = (str = '', max = 40) =>
    str.length > max ? `${str.slice(0, max - 1)}…` : str;