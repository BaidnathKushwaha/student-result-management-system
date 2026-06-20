package com.resultmanagement.service;

import com.resultmanagement.dto.request.CreateNotificationRequest;
import com.resultmanagement.dto.request.MarksRequest;
import com.resultmanagement.dto.response.MarksResponse;
import com.resultmanagement.entity.Marks;
import com.resultmanagement.entity.Student;
import com.resultmanagement.entity.Subject;
import com.resultmanagement.exception.MarksNotFoundException;
import com.resultmanagement.repository.MarksRepository;
import com.resultmanagement.repository.UserRepository;
import com.resultmanagement.util.AuditAction;
import com.resultmanagement.util.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarksService {

    private final MarksRepository marksRepository;
    private final StudentService studentService;
    private final SubjectService subjectService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public MarksResponse addMarks(MarksRequest request) {
        Student student = studentService.getStudentEntityById(request.getStudentId());
        Subject subject = subjectService.getSubjectEntityById(request.getSubjectId());

        // If marks already exist for this student+subject, update instead of
        // duplicating
        Marks marks = marksRepository.findByStudentIdAndSubjectId(student.getId(), subject.getId())
                .orElse(Marks.builder().student(student).subject(subject).build());

        marks.setInternalMarks(request.getInternalMarks());
        marks.setExternalMarks(request.getExternalMarks());
        marks.setTotalMarks(request.getInternalMarks() + request.getExternalMarks());

        Marks saved = marksRepository.save(marks);

        // Audit
        auditLogService.log(AuditAction.ENTERED_MARKS,
                String.format("Entered marks for student %s in subject %s (Total: %.1f)",
                        student.getName(),
                        subject.getSubjectName(),
                        saved.getTotalMarks()),
                "Marks", saved.getId());

        // Notify the student
        notifyStudent(student, subject, "Marks enetered for " + subject.getSubjectName(),
                String.format("Internal: %.1f | External: %.1f | Total: %.1f", saved.getInternalMarks(),
                        saved.getExternalMarks(), saved.getTotalMarks()),
                NotificationType.MARKS_ENTERED);

        return mapToResponse(saved);
    }

    public MarksResponse updateMarks(Long id, MarksRequest request) {
        Marks marks = marksRepository.findById(id)
                .orElseThrow(() -> new MarksNotFoundException("Marks record not found with id: " + id));

        Student student = studentService.getStudentEntityById(request.getStudentId());
        Subject subject = subjectService.getSubjectEntityById(request.getSubjectId());

        marks.setStudent(student);
        marks.setSubject(subject);
        marks.setInternalMarks(request.getInternalMarks());
        marks.setExternalMarks(request.getExternalMarks());
        marks.setTotalMarks(request.getInternalMarks() + request.getExternalMarks());

        Marks updated = marksRepository.save(marks);

        // Audit
        auditLogService.log(AuditAction.UPDATED_MARKS,
                String.format("Updated marks for student %s in subject %s (Total: %.1f)",
                        student.getName(),
                        subject.getSubjectName(),
                        updated.getTotalMarks()),
                "Marks", updated.getId());

        // Notify the student
        notifyStudent(student, subject, "Marks updated for " + subject.getSubjectName(),
                String.format("Internal: %.1f | External: %.1f | Total: %.1f", updated.getInternalMarks(),
                        updated.getExternalMarks(), updated.getTotalMarks()),
                NotificationType.MARKS_UPDATED);

        return mapToResponse(updated);
    }

    public List<MarksResponse> getMarksByStudent(Long studentId) {
        // Ensure student exists
        studentService.getStudentEntityById(studentId);

        return marksRepository.findByStudentId(studentId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public MarksResponse getMarksById(Long id) {
        Marks marks = marksRepository.findById(id)
                .orElseThrow(() -> new MarksNotFoundException("Marks record not found with id: " + id));

        return mapToResponse(marks);
    }

    public void deleteMarks(Long id) {
        Marks marks = marksRepository.findById(id)
                .orElseThrow(() -> new MarksNotFoundException("Marks record not found with id: " + id));

        String studentName = marks.getStudent().getName();
        String subjectName = marks.getSubject().getSubjectName();

        marksRepository.delete(marks);
        // Audit
        auditLogService.log(AuditAction.DELETED_MARKS,
                String.format("Deleted marks for student %s in subject %s", studentName, subjectName),
                "Marks", id);

    }

    public List<Marks> getMarksEntitiesByStudentAndSemester(Long studentId, Integer semester) {
        return marksRepository.findByStudentIdAndSubject_Semester(studentId, semester);
    }

    // --Helper: lookup student's login username and notify them--
    private void notifyStudent(Student student, Subject subject, String title, String message, NotificationType type) {
        userRepository.findByReferenceIdAndRole(student.getId(), com.resultmanagement.entity.Role.STUDENT)
                .ifPresent(u -> notificationService.send(CreateNotificationRequest.builder()
                        .recipientUsername(u.getUsername()).type(type).title(title).message(message).build()));
    }

    private MarksResponse mapToResponse(Marks marks) {
        return MarksResponse.builder()
                .id(marks.getId())
                .studentId(marks.getStudent().getId())
                .studentName(marks.getStudent().getName())
                .subjectId(marks.getSubject().getId())
                .subjectName(marks.getSubject().getSubjectName())
                .subjectCode(marks.getSubject().getSubjectCode())
                .internalMarks(marks.getInternalMarks())
                .externalMarks(marks.getExternalMarks())
                .totalMarks(marks.getTotalMarks())
                .build();
    }
}
