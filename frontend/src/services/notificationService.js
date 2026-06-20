import {
    getMyNotificationsApi,
    getUnreadNotificationsApi,
    getUnreadCountApi,
    markNotificationAsReadApi,
    markAllNotificationsAsReadApi,
    getRecentAuditLogsApi,
    getAllAuditLogsApi,
    getAuditLogsByUsernameApi,
    getAuditLogsByRoleApi,
    logTranscriptDownloadApi,
} from '../api/notificationApi';

// ---- Notifications Services ----

export const fetchMyNotifications = async () => {
    const { data } = await getMyNotificationsApi();
    return data;
};

export const fetchUnreadNotifications = async () => {
    const { data } = await getUnreadNotificationsApi();
    return data;
};

export const fetchUnreadCount = async () => {
    const { data } = await getUnreadCountApi();
    return data; // { unreadCount: Number }
};

export const markAsRead = async (id) => {
    const { data } = await markNotificationAsReadApi(id);
    return data;
};

export const markAllAsRead = async () => {
    const { data } = await markAllNotificationsAsReadApi();
    return data; // { markedRead: Number }
};


// ---- Audit Logs Services ----

export const fetchRecentAuditLogs = async () => {
    const { data } = await getRecentAuditLogsApi();
    return data; // Array of 20 logs
};

export const fetchAllAuditLogs = async ({ page = 0, size = 20 } = {}) => {
    const { data } = await getAllAuditLogsApi({ page, size });
    return data; // Spring Page object
};

export const fetchAuditLogsByUsername = async (username, { page = 0, size = 20 } = {}) => {
    const { data } = await getAuditLogsByUsernameApi(username, { page, size });
    return data; // Spring Page object
};

export const fetchAuditLogsByRole = async (role, { page = 0, size = 20 } = {}) => {
    const { data } = await getAuditLogsByRoleApi(role, { page, size });
    return data; // Spring Page object
};


// ---- Transcript Download Log Service ----

export const logTranscriptDownload = async (studentId, semester) => {
    await logTranscriptDownloadApi(studentId, semester);
};
