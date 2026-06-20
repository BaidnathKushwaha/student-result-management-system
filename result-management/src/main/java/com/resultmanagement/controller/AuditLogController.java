package com.resultmanagement.controller;

import com.resultmanagement.dto.response.AuditLogResponse;
import com.resultmanagement.service.AuditLogService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit Logs", description = "Admin endpoints for viewing system activity logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    /**
     * Returns the 20 most recent actions — powers the "Recent Activities" widget
     * on the Admin Dashboard.
     *
     * GET /api/admin/audit-logs/recent
     */
    @GetMapping("/recent")
    public ResponseEntity<List<AuditLogResponse>> getRecentActivity() {
        return ResponseEntity.ok(auditLogService.getRecentActivity());
    }

    /**
     * Full paginated audit log — for the dedicated Audit Log admin page.
     *
     * GET /api/admin/audit-logs?page=0&size=20
     */
    @GetMapping
    public ResponseEntity<Page<AuditLogResponse>> getAllLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(auditLogService.getAllLogs(page, size));
    }

    /**
     * Filter logs by a specific username.
     *
     * GET /api/admin/audit-logs/user/{username}?page=0&size=20
     */
    @GetMapping("/user/{username}")
    public ResponseEntity<Page<AuditLogResponse>> getLogsByUsername(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(auditLogService.getLogsByUsername(username, page, size));
    }

    /**
     * Filter logs by role.
     *
     * GET /api/admin/audit-logs/role/{role}?page=0&size=20
     * Role values: ADMIN | FACULTY | STUDENT
     */
    @GetMapping("/role/{role}")
    public ResponseEntity<Page<AuditLogResponse>> getLogsByRole(
            @PathVariable String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(auditLogService.getLogsByRole(role, page, size));
    }
}