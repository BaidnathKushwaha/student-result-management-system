package com.resultmanagement.service;

import com.resultmanagement.dto.request.CreateNotificationRequest;
import com.resultmanagement.dto.response.NotificationResponse;
import com.resultmanagement.entity.Notification;
import com.resultmanagement.repository.NotificationRepository;
import com.resultmanagement.util.NotificationType;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // ── Creation ──────────────────────────────────────────────────

    /**
     * Creates a notification for a specific user asynchronously.
     * Failures are swallowed so they never break the triggering request.
     */
    @Async
    public void send(CreateNotificationRequest request) {
        try {
            Notification notification = Notification.builder()
                    .recipientUsername(request.getRecipientUsername())
                    .type(request.getType().name())
                    .title(request.getTitle())
                    .message(request.getMessage())
                    .isRead(false)
                    .build();

            notificationRepository.save(notification);
        } catch (Exception ex) {
            log.error("Failed to send notification to {}: {}", request.getRecipientUsername(), ex.getMessage());
        }
    }

    /**
     * Convenience method — broadcasts a notification to a list of recipients (e.g.
     * all students in a semester).
     */
    @Async
    public void sendToAll(List<String> recipientUsernames, NotificationType type, String title, String message) {
        try {
            List<Notification> notifications = recipientUsernames.stream()
                    .map(username -> Notification.builder()
                            .recipientUsername(username)
                            .type(type.name())
                            .title(title)
                            .message(message)
                            .isRead(false)
                            .build())
                    .toList();

            notificationRepository.saveAll(notifications);
        } catch (Exception ex) {
            log.error("Failed to broadcast notification: {}", ex.getMessage());
        }
    }

    // ── Queries ──────────────────────────────────────────────────

    /**
     * All notifications for the current user — newest first.
     */
    public List<NotificationResponse> getNotificationsForUser(String username) {
        return notificationRepository
                .findByRecipientUsernameOrderByTimestampDesc(username)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Unread notifications only.
     */
    public List<NotificationResponse> getUnreadForUser(String username) {
        return notificationRepository
                .findByRecipientUsernameAndIsReadFalseOrderByTimestampDesc(username)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Unread count — used for the notification badge in the UI.
     */
    public long getUnreadCount(String username) {
        return notificationRepository.countByRecipientUsernameAndIsReadFalse(username);
    }

    /**
     * Mark a single notification as read.
     */
    @Transactional
    public NotificationResponse markAsRead(Long id, String username) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));

        // Security: users can only mark their own notifications as read
        if (!notification.getRecipientUsername().equals(username)) {
            throw new RuntimeException("Access denied: notification does not belong to this user");
        }

        notification.setRead(true);
        return mapToResponse(notificationRepository.save(notification));
    }

    /**
     * Mark ALL unread notifications as read for a user — e.g. when they open the
     * notification panel.
     */
    @Transactional
    public int markAllAsRead(String username) {
        return notificationRepository.markAllReadForUser(username);
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .isRead(n.isRead())
                .timestamp(n.getTimestamp())
                .build();
    }
}