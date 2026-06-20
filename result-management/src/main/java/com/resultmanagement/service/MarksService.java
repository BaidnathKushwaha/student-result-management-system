package com.resultmanagement.service;

import com.resultmanagement.dto.request.MarksRequest;
import com.resultmanagement.dto.response.MarksResponse;
import com.resultmanagement.entity.Marks;
import com.resultmanagement.entity.Student;
import com.resultmanagement.entity.Subject;
import com.resultmanagement.exception.MarksNotFoundException;
import com.resultmanagement.repository.MarksRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarksService {

    private final MarksRepository marksRepository;
    private final StudentService studentService;
    private final SubjectService subjectService;

    public MarksResponse addMarks(MarksRequest request) {
        Student student = studentService.getStudentEntityById(request.getStudentId());
        Subject subject = subjectService.getSubjectEntityById(request.getSubjectId());

        // If marks already exist for this student+subject, update instead of duplicating
        Marks marks = marksRepository.findByStudentIdAndSubjectId(student.getId(), subject.getId())
                .orElse(Marks.builder().student(student).subject(subject).build());

        marks.setInternalMarks(request.getInternalMarks());
        marks.setExternalMarks(request.getExternalMarks());
        marks.setTotalMarks(request.getInternalMarks() + request.getExternalMarks());

        Marks saved = marksRepository.save(marks);
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
        marksRepository.delete(marks);
    }

    public List<Marks> getMarksEntitiesByStudentAndSemester(Long studentId, Integer semester) {
        return marksRepository.findByStudentIdAndSubject_Semester(studentId, semester);
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
