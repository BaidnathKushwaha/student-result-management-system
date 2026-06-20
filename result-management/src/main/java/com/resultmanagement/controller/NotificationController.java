package com.resultmanagement.controller;

import com.resultmanagement.dto.response.NotificationResponse;
import com.resultmanagement.service.NotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Endpoints for user notifications")
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Returns all notifications for the currently authenticated user.
     *
     * GET /api/notifications
     */
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications() {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(currentUsername()));
    }

    /**
     * Returns only unread notifications — for the notification bell/panel.
     *
     * GET /api/notifications/unread
     */
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnread() {
        return ResponseEntity.ok(notificationService.getUnreadForUser(currentUsername()));
    }

    /**
     * Returns the unread notification count — used for the badge number on the bell
     * icon.
     *
     * GET /api/notifications/unread-count
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        long count = notificationService.getUnreadCount(currentUsername());
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    /**
     * Mark a single notification as read.
     *
     * PATCH /api/notifications/{id}/read
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id, currentUsername()));
    }

    /**
     * Mark ALL notifications as read — called when the user opens the notification
     * panel.
     *
     * PATCH /api/notifications/read-all
     */
    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, Integer>> markAllAsRead() {
        int updated = notificationService.markAllAsRead(currentUsername());
        return ResponseEntity.ok(Map.of("markedRead", updated));
    }

    private String currentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }
}