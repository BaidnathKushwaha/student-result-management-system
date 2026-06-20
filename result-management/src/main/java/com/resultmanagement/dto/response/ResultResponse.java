package com.resultmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String usn;
    private Integer semester;
    private Double percentage;
    private Double gpa;
    private List<MarksResponse> subjectMarks;
}
