package com.resultmanagement.service;

import com.resultmanagement.dto.request.CreateNotificationRequest;
import com.resultmanagement.dto.response.MarksResponse;
import com.resultmanagement.dto.response.ResultResponse;
import com.resultmanagement.entity.Marks;
import com.resultmanagement.entity.Result;
import com.resultmanagement.entity.Student;
import com.resultmanagement.exception.MarksNotFoundException;
import com.resultmanagement.repository.MarksRepository;
import com.resultmanagement.repository.ResultRepository;
import com.resultmanagement.repository.UserRepository;
import com.resultmanagement.util.AuditAction;
import com.resultmanagement.util.NotificationType;
import com.resultmanagement.util.GradeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final MarksRepository marksRepository;
    private final ResultRepository resultRepository;
    private final StudentService studentService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    /**
     * Calculates and persists (or refreshes) the overall result
     * for a student based on ALL marks currently on record.
     */
    public ResultResponse generateResult(Long studentId, Integer semester) {
        Student student = studentService.getStudentEntityById(studentId);

        List<Marks> marksList = marksRepository.findByStudentIdAndSubject_Semester(studentId, semester);
        if (marksList.isEmpty()) {
            throw new MarksNotFoundException("No marks found for student with id: " + studentId);
        }

        double totalObtained = 0;
        double totalMax = 0;
        double weightedGradeSum = 0; // sum(credits * gradePoint)
        double totalCredits = 0;

        for (Marks m : marksList) {
            totalObtained += m.getTotalMarks();
            totalMax += 100; // each subject out of 100

            int credits = m.getSubject().getCredits();
            int gradePoint = GradeUtil.getGradePoint(m.getTotalMarks());

            weightedGradeSum += (credits * gradePoint);
            totalCredits += credits;
        }

        double percentage = (totalObtained / totalMax) * 100;
        double gpa = totalCredits == 0 ? 0 : (weightedGradeSum / totalCredits);

        Result result = resultRepository.findByStudentIdAndSemester(studentId, semester)
                .orElse(Result.builder().student(student).semester(semester).build());

        result.setPercentage(round(percentage));
        result.setGpa(round(gpa));

        Result saved = resultRepository.save(result);

        // Audit
        auditLogService.log(AuditAction.GENERATED_RESULT,
                String.format("Generated result for student %s (USN: %s) - Semester %d | GPA: %.2f | %.1f%%",
                        student.getName(), student.getUsn(), semester, round(gpa), round(percentage)),
                "Result", saved.getId());

        // Notify the student
        userRepository.findByReferenceIdAndRole(studentId, com.resultmanagement.entity.Role.STUDENT)
                .ifPresent(u -> notificationService.send(CreateNotificationRequest.builder()
                        .recipientUsername(u.getUsername()).type(NotificationType.RESULT_GENERATED)
                        .title("Result for Semester " + semester + " published")
                        .message(String.format("GPA: %.2f | Percentage: %.1f%%", round(gpa), round(percentage)))
                        .build()));

        return mapToResponse(saved, marksList);
    }

    public ResultResponse getResultByStudentId(Long studentId, Integer semester) {
        Student student = studentService.getStudentEntityById(studentId);
        List<Marks> marksList = marksRepository.findByStudentIdAndSubject_Semester(studentId, semester);

        return resultRepository.findByStudentIdAndSemester(studentId, semester)
                .stream()
                .findFirst()
                .map(result -> mapToResponse(result, marksList))
                .orElseGet(() -> generateResult(studentId, semester));
    }

    public void logTranscriptDownload(Long studentId, Integer semester) {
        Student student = studentService.getStudentEntityById(studentId);
        auditLogService.log(AuditAction.DOWNLOADED_TRANSCRIPT,
                String.format("Student %s (USN: %s) downloaded transcript for Semester %d",
                        student.getName(), student.getUsn(), semester),
                "Student", student.getId());
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private ResultResponse mapToResponse(Result result, List<Marks> marksList) {
        List<MarksResponse> marksResponses = marksList.stream()
                .map(m -> MarksResponse.builder()
                        .id(m.getId())
                        .studentId(m.getStudent().getId())
                        .studentName(m.getStudent().getName())
                        .subjectId(m.getSubject().getId())
                        .subjectName(m.getSubject().getSubjectName())
                        .subjectCode(m.getSubject().getSubjectCode())
                        .internalMarks(m.getInternalMarks())
                        .externalMarks(m.getExternalMarks())
                        .totalMarks(m.getTotalMarks())
                        .build())
                .toList();

        return ResultResponse.builder()
                .id(result.getId())
                .studentId(result.getStudent().getId())
                .studentName(result.getStudent().getName())
                .usn(result.getStudent().getUsn())
                .semester(result.getSemester())
                .percentage(result.getPercentage())
                .gpa(result.getGpa())
                .subjectMarks(marksResponses)
                .build();
    }
}
