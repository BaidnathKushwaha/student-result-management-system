package com.resultmanagement.controller;

import com.resultmanagement.dto.response.StudentResponse;
import com.resultmanagement.entity.User;
import com.resultmanagement.security.CustomUserDetails;
import com.resultmanagement.service.StudentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student/profile")
@RequiredArgsConstructor
@Tag(name = "Student - Profile", description = "Student endpoints to view own profile")
public class StudentProfileController {

    private final StudentService studentService;

    @GetMapping("/me")
    public ResponseEntity<StudentResponse> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        if (user.getReferenceId() == null) {
            throw new AccessDeniedException("No student profile linked to this account");
        }

        return ResponseEntity.ok(studentService.getStudentById(user.getReferenceId()));
    }
}
