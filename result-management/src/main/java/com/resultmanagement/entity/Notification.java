package com.resultmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notification_recipient", columnList = "recipientUsername"),
        @Index(name = "idx_notification_read", columnList = "isRead"),
        @Index(name = "idx_notification_timestamp", columnList = "timestamp")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The username of the user who should receive this notification.
     * Stored as a plain string so it stays valid even if User record changes.
     */
    @Column(nullable = false)
    private String recipientUsername;

    /**
     * The type of notification — e.g. "MARKS_ENTERED", "RESULT_GENERATED",
     * "SUBJECT_ASSIGNED".
     */
    @Column(nullable = false)
    private String type;

    /**
     * Human-readable title shown in the notification panel.
     * e.g. "Result for Semester 3 published"
     */
    @Column(nullable = false)
    private String title;

    /**
     * Optional extra detail — e.g. "Marks updated in DBMS (CS401)"
     */
    @Column(length = 512)
    private String message;

    /**
     * Whether the recipient has read this notification.
     */
    @Column(nullable = false)
    @Builder.Default
    private boolean isRead = false;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}