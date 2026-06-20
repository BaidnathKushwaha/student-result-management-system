package com.resultmanagement.service;

import com.resultmanagement.dto.response.AuditLogResponse;
import com.resultmanagement.entity.AuditLog;
import com.resultmanagement.repository.AuditLogRepository;
import com.resultmanagement.util.AuditAction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Records an audit entry. Called from other services after each write
     * operation.
     * Async so it never adds latency to the main request — failures are logged, not
     * rethrown.
     */
    @Async
    public void log(AuditAction action,
            String description,
            String entityType,
            Long entityId) {
        try {
            String username = "system";
            String role = "SYSTEM";

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                username = auth.getName();
                role = auth.getAuthorities().stream()
                        .map(a -> a.getAuthority().replace("ROLE_", ""))
                        .findFirst()
                        .orElse("UNKNOWN");
            }

            AuditLog entry = AuditLog.builder()
                    .username(username)
                    .role(role)
                    .action(action.name())
                    .description(description)
                    .entityType(entityType)
                    .entityId(entityId)
                    .timestamp(LocalDateTime.now())
                    .build();

            auditLogRepository.save(entry);

        } catch (Exception ex) {
            // Never let audit logging break the main request
            log.error("Failed to record audit log for action {}: {}", action, ex.getMessage());
        }
    }

    // Convenience overloads
    public void log(AuditAction action, String description) {
        log(action, description, null, null);
    }

    public void log(AuditAction action, String description, String entityType) {
        log(action, description, entityType, null);
    }

    // ── Queries ──────────────────────────────────────────────────

    /**
     * Returns the 20 most recent audit entries — used by the Admin Dashboard
     * "Recent Activities" widget.
     */
    public List<AuditLogResponse> getRecentActivity() {
        return auditLogRepository.findTop20ByOrderByTimestampDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Full paginated audit log for the admin audit page.
     */
    public Page<AuditLogResponse> getAllLogs(int page, int size) {
        return auditLogRepository
                .findAllByOrderByTimestampDesc(PageRequest.of(page, size))
                .map(this::mapToResponse);
    }

    /**
     * Filter logs by username.
     */
    public Page<AuditLogResponse> getLogsByUsername(String username, int page, int size) {
        return auditLogRepository
                .findByUsernameOrderByTimestampDesc(username, PageRequest.of(page, size))
                .map(this::mapToResponse);
    }

    /**
     * Filter logs by role (ADMIN / FACULTY / STUDENT).
     */
    public Page<AuditLogResponse> getLogsByRole(String role, int page, int size) {
        return auditLogRepository
                .findByRoleOrderByTimestampDesc(role, PageRequest.of(page, size))
                .map(this::mapToResponse);
    }

    private AuditLogResponse mapToResponse(AuditLog log) {
        return AuditLogResponse.builder()
                .id(log.getId())
                .username(log.getUsername())
                .role(log.getRole())
                .action(log.getAction())
                .description(log.getDescription())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .timestamp(log.getTimestamp())
                .build();
    }
}