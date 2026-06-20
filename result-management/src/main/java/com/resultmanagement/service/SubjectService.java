package com.resultmanagement.service;

import com.resultmanagement.dto.request.SubjectRequest;
import com.resultmanagement.dto.response.SubjectResponse;
import com.resultmanagement.entity.Student;
import com.resultmanagement.entity.Subject;
import com.resultmanagement.exception.DuplicateResourceException;
import com.resultmanagement.exception.SubjectNotFoundException;
import com.resultmanagement.repository.StudentRepository;
import com.resultmanagement.repository.SubjectRepository;
import com.resultmanagement.repository.UserRepository;
import com.resultmanagement.util.AuditAction;
import com.resultmanagement.util.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public SubjectResponse createSubject(SubjectRequest request) {
        if (subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            throw new DuplicateResourceException("Subject with code '" + request.getSubjectCode() + "' already exists");
        }

        Subject subject = Subject.builder()
                .subjectCode(request.getSubjectCode())
                .subjectName(request.getSubjectName())
                .credits(request.getCredits())
                .semester(request.getSemester())
                .build();

        Subject saved = subjectRepository.save(subject);

        auditLogService.log(AuditAction.CREATED_SUBJECT, String.format("Created subject %s (%s) - Sem %d, %d credits",
                saved.getSubjectName(), saved.getSubjectCode(), saved.getSemester(), saved.getCredits()), "Subject",
                saved.getId());

        // Notify all students of this semester that a new subject is assigned
        try {
            List<Student> students = studentRepository.findBySemester(saved.getSemester());
            List<String> usernames = students.stream()
                    .map(student -> userRepository.findByReferenceIdAndRole(student.getId(), com.resultmanagement.entity.Role.STUDENT))
                    .filter(Optional::isPresent)
                    .map(opt -> opt.get().getUsername())
                    .toList();
            if (!usernames.isEmpty()) {
                notificationService.sendToAll(
                        usernames,
                        NotificationType.SUBJECT_ASSIGNED,
                        "Subject assigned",
                        String.format("Subject %s (%s) has been assigned to Semester %d", 
                                saved.getSubjectName(), saved.getSubjectCode(), saved.getSemester())
                );
            }
        } catch (Exception ex) {
            // Swallow so we never break main request
        }

        return mapToResponse(saved);
    }

    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public SubjectResponse getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new SubjectNotFoundException("Subject not found with id: " + id));
        return mapToResponse(subject);
    }

    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new SubjectNotFoundException("Subject not found with id: " + id));

        if (!subject.getSubjectCode().equals(request.getSubjectCode())
                && subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            throw new DuplicateResourceException("Subject with code '" + request.getSubjectCode() + "' already exists");
        }

        subject.setSubjectCode(request.getSubjectCode());
        subject.setSubjectName(request.getSubjectName());
        subject.setCredits(request.getCredits());
        subject.setSemester(request.getSemester());

        Subject updated = subjectRepository.save(subject);

        auditLogService.log(AuditAction.UPDATED_SUBJECT, String.format("Updated subject %s (%s)",
                updated.getSubjectName(), updated.getSubjectCode()), "Subject", updated.getId());

        return mapToResponse(updated);
    }

    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new SubjectNotFoundException("Subject not found with id: " + id));

        String name = subject.getSubjectName();
        String code = subject.getSubjectCode();

        subjectRepository.delete(subject);

        auditLogService.log(AuditAction.DELETED_SUBJECT, String.format("Deleted subject %s (%s)", name, code),
                "Subject", id);
    }

    public Subject getSubjectEntityById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new SubjectNotFoundException("Subject not found with id: " + id));
    }

    private SubjectResponse mapToResponse(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .subjectCode(subject.getSubjectCode())
                .subjectName(subject.getSubjectName())
                .credits(subject.getCredits())
                .semester(subject.getSemester())
                .build();
    }
}
