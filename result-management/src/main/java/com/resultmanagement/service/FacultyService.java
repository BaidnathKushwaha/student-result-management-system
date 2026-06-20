package com.resultmanagement.service;

import com.resultmanagement.dto.request.FacultyRequest;
import com.resultmanagement.dto.response.FacultyResponse;
import com.resultmanagement.entity.Faculty;
import com.resultmanagement.exception.FacultyNotFoundException;
import com.resultmanagement.repository.FacultyRepository;
import com.resultmanagement.util.AuditAction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final AuditLogService auditLogService;

    public FacultyResponse createFaculty(FacultyRequest request) {
        Faculty faculty = Faculty.builder()
                .name(request.getName())
                .email(request.getEmail())
                .build();

        Faculty saved = facultyRepository.save(faculty);

        // Audit log
        auditLogService.log(AuditAction.CREATED_FACULTY,
                String.format("Created faculty %s (%s)", saved.getName(), saved.getEmail()), "Faculty", saved.getId());

        return mapToResponse(saved);
    }

    public List<FacultyResponse> getAllFaculty() {
        return facultyRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public FacultyResponse getFacultyById(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new FacultyNotFoundException("Faculty not found with id: " + id));
        return mapToResponse(faculty);
    }

    public FacultyResponse updateFaculty(Long id, FacultyRequest request) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new FacultyNotFoundException("Faculty not found with id: " + id));

        faculty.setName(request.getName());
        faculty.setEmail(request.getEmail());

        Faculty updated = facultyRepository.save(faculty);

        // Audit log
        auditLogService.log(AuditAction.UPDATED_FACULTY,
                String.format("Updated faculty %s (%s)", updated.getName(), updated.getEmail()), "Faculty",
                updated.getId());

        return mapToResponse(updated);
    }

    public void deleteFaculty(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new FacultyNotFoundException("Faculty not found with id: " + id));

        String name = faculty.getName();
        facultyRepository.delete(faculty);

        auditLogService.log(AuditAction.DELETED_FACULTY, String.format("Deleted faculty %s", name), "Faculty", id);
    }

    private FacultyResponse mapToResponse(Faculty faculty) {
        return FacultyResponse.builder()
                .id(faculty.getId())
                .name(faculty.getName())
                .email(faculty.getEmail())
                .build();
    }
}
