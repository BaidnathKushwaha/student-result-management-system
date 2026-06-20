package com.resultmanagement.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MarksRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotNull(message = "Internal marks is required")
    @Min(value = 0, message = "Internal marks cannot be negative")
    @Max(value = 50, message = "Internal marks cannot exceed 50")
    private Double internalMarks;

    @NotNull(message = "External marks is required")
    @Min(value = 0, message = "External marks cannot be negative")
    @Max(value = 50, message = "External marks cannot exceed 50")
    private Double externalMarks;
}
