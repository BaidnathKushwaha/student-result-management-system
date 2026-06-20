import axiosInstance from './axiosConfig';

// ---- Notifications ----

// Get all notifications for current user
export const getMyNotificationsApi = () => axiosInstance.get('/notifications');

// Get unread notifications
export const getUnreadNotificationsApi = () => axiosInstance.get('/notifications/unread');

// Get unread notification count
export const getUnreadCountApi = () => axiosInstance.get('/notifications/unread-count');

// Mark a single notification as read
export const markNotificationAsReadApi = (id) => axiosInstance.patch(`/notifications/${id}/read`);

// Mark all notifications as read
export const markAllNotificationsAsReadApi = () => axiosInstance.patch('/notifications/read-all');


// ---- Audit Logs (Admin Only) ----

// Get 20 most recent audit logs for dashboard
export const getRecentAuditLogsApi = () => axiosInstance.get('/admin/audit-logs/recent');

// Get all paginated audit logs
export const getAllAuditLogsApi = (params) => axiosInstance.get('/admin/audit-logs', { params });
// params: { page, size }

// Filter audit logs by username
export const getAuditLogsByUsernameApi = (username, params) => 
    axiosInstance.get(`/admin/audit-logs/user/${username}`, { params });

// Filter audit logs by role
export const getAuditLogsByRoleApi = (role, params) => 
    axiosInstance.get(`/admin/audit-logs/role/${role}`, { params });


// ---- Log Transcript Download ----
export const logTranscriptDownloadApi = (studentId, semester) => 
    axiosInstance.post(`/results/student/${studentId}/semester/${semester}/log-download`);
