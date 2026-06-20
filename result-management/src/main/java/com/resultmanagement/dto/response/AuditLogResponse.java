package com.resultmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogResponse {

    private Long id;
    private String username;
    private String role;
    private String action;
    private String description;
    private String entityType;
    private Long entityId;
    private LocalDateTime timestamp;
}