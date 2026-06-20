package com.resultmanagement.controller;

import com.resultmanagement.dto.response.ResultResponse;
import com.resultmanagement.entity.User;
import com.resultmanagement.repository.UserRepository;
import com.resultmanagement.security.CustomUserDetails;
import com.resultmanagement.service.ResultService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
@Tag(name = "Results", description = "Endpoints for generating and viewing student results")
public class ResultController {

    private final ResultService resultService;
    private final UserRepository userRepository;

    /**
     * Generates / refreshes the result for a given student based on
     * all marks currently recorded. Typically used by ADMIN/FACULTY.
     */
    @PostMapping("/student/{studentId}/semester/{semester}/generate")
    public ResponseEntity<ResultResponse> generateResult(@PathVariable Long studentId, @PathVariable Integer semester) {
        verifyAccess(studentId);
        return ResponseEntity.ok(resultService.generateResult(studentId, semester));
    }

    /**
     * Fetches the result for a student.
     * - ADMIN/FACULTY can view any student's result.
     * - STUDENT can only view their own result (matched via User.referenceId).
     */
    @GetMapping("/student/{studentId}/semester/{semester}")
    public ResponseEntity<ResultResponse> getResult(@PathVariable Long studentId, @PathVariable Integer semester) {
        verifyAccess(studentId);
        return ResponseEntity.ok(resultService.getResultByStudentId(studentId, semester));
    }

    private void verifyAccess(Long studentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        boolean isStudent = user.getRole().name().equals("STUDENT");
        if (isStudent && !studentId.equals(user.getReferenceId())) {
            throw new AccessDeniedException("You can only view your own result");
        }
    }
}
