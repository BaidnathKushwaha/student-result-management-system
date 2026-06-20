package com.resultmanagement.util;

/**
 * Canonical list of all audit action types.
 * Using an enum here means every service uses the exact same string,
 * making filtering in the admin log consistent.
 */
public enum AuditAction {

    // Auth
    USER_REGISTERED,
    USER_LOGGED_IN,

    // Students
    CREATED_STUDENT,
    UPDATED_STUDENT,
    DELETED_STUDENT,
    PROMOTED_STUDENTS,

    // Faculty
    CREATED_FACULTY,
    UPDATED_FACULTY,
    DELETED_FACULTY,

    // Subjects
    CREATED_SUBJECT,
    UPDATED_SUBJECT,
    DELETED_SUBJECT,

    // Marks
    ENTERED_MARKS,
    UPDATED_MARKS,
    DELETED_MARKS,

    // Results
    GENERATED_RESULT,
    VIEWED_RESULT,

    // Notifications
    NOTIFICATION_READ,
    ALL_NOTIFICATIONS_READ,

    // Student self-service
    VIEWED_PROFILE,
    DOWNLOADED_TRANSCRIPT
}