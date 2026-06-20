package com.resultmanagement.dto.request;

import com.resultmanagement.util.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Internal DTO used by services to create a notification.
 * Not exposed directly as a REST request body — notifications
 * are created server-side by service logic, not by clients.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateNotificationRequest {

    private String recipientUsername;
    private NotificationType type;
    private String title;
    private String message;
}