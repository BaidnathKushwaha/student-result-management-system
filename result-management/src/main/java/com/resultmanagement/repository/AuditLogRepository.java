package com.resultmanagement.repository;

import com.resultmanagement.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    // Admin dashboard — most recent N entries across all users
    List<AuditLog> findTop20ByOrderByTimestampDesc();

    // Full paginated view with optional filters
    Page<AuditLog> findByUsernameOrderByTimestampDesc(String username, Pageable pageable);

    Page<AuditLog> findByRoleOrderByTimestampDesc(String role, Pageable pageable);

    Page<AuditLog> findByEntityTypeOrderByTimestampDesc(String entityType, Pageable pageable);

    // All logs, newest first — paged for the admin audit log page
    Page<AuditLog> findAllByOrderByTimestampDesc(Pageable pageable);
}