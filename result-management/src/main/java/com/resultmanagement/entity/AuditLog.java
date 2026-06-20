package com.resultmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs", indexes = {
        @Index(name = "idx_audit_username", columnList = "username"),
        @Index(name = "idx_audit_timestamp", columnList = "timestamp"),
        @Index(name = "idx_audit_action", columnList = "action")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The username of the authenticated user who performed the action.
     * Stored as a plain string so logs survive user deletion.
     */
    @Column(nullable = false)
    private String username;

    /**
     * The role of the user at the time of the action (ADMIN / FACULTY / STUDENT).
     */
    @Column(nullable = false)
    private String role;

    /**
     * Short action descriptor — e.g. "CREATED_STUDENT", "UPDATED_MARKS",
     * "GENERATED_RESULT".
     * Stored as a plain string (not enum) so new action types can be added without
     * a migration.
     */
    @Column(nullable = false)
    private String action;

    /**
     * Human-readable description — e.g. "Created student Jane Doe (USN:
     * 1XX21CS001)".
     */
    @Column(length = 512)
    private String description;

    /**
     * The entity type that was acted upon — e.g. "Student", "Marks", "Result".
     */
    private String entityType;

    /**
     * The ID of the specific entity that was acted upon (nullable for list/search
     * actions).
     */
    private Long entityId;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}