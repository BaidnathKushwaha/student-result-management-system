package com.resultmanagement.service;

import com.resultmanagement.dto.request.StudentRequest;
import com.resultmanagement.dto.response.StudentResponse;
import com.resultmanagement.entity.Student;
import com.resultmanagement.exception.DuplicateResourceException;
import com.resultmanagement.exception.StudentNotFoundException;
import com.resultmanagement.repository.StudentRepository;
import com.resultmanagement.util.AuditAction;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final AuditLogService auditLogService;

    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.existsByUsn(request.getUsn())) {
            throw new DuplicateResourceException("Student with USN '" + request.getUsn() + "' already exists");
        }

        Student student = Student.builder()
                .usn(request.getUsn())
                .name(request.getName())
                .email(request.getEmail())
                .semester(request.getSemester())
                .department(request.getDepartment())
                .build();

        Student saved = studentRepository.save(student);

        auditLogService.log(AuditAction.CREATED_STUDENT,
                String.format("Created student %s (USN: %s, Dept: %s, Sem: %d)",
                        saved.getName(), saved.getUsn(), saved.getDepartment(), saved.getSemester()),
                "Student", saved.getId());

        return mapToResponse(saved);
    }

    public Page<StudentResponse> getAllStudents(int page, int size, String sortBy) {
        Page<Student> students = studentRepository.findAll(
                PageRequest.of(page, size, Sort.by(sortBy)));
        return students.map(this::mapToResponse);
    }

    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
        return mapToResponse(student);
    }

    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));

        // If USN is changing, ensure new USN isn't already taken by someone else
        if (!student.getUsn().equals(request.getUsn()) && studentRepository.existsByUsn(request.getUsn())) {
            throw new DuplicateResourceException("Student with USN '" + request.getUsn() + "' already exists");
        }

        student.setUsn(request.getUsn());
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setSemester(request.getSemester());
        student.setDepartment(request.getDepartment());

        Student updated = studentRepository.save(student);

        auditLogService.log(AuditAction.UPDATED_STUDENT, String.format("Updated student %s (USN: %s)",
                updated.getName(), updated.getUsn()),
                "Student", updated.getId());

        return mapToResponse(updated);
    }

    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));

        String name = student.getName();
        String usn = student.getUsn();

        studentRepository.delete(student);

        auditLogService.log(AuditAction.DELETED_STUDENT, String.format("Deleted student %s (USN: %s)",
                name, usn), "Student", id);
    }

    public Student getStudentEntityById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
    }

    @Transactional
    public void promoteStudents(Integer currentSemester) {
        if (currentSemester < 1 || currentSemester >= 8) {
            throw new IllegalArgumentException("Invalid semester. Promotion is only allowed for Semesters 1 through 7.");
        }

        List<Student> students = studentRepository.findBySemester(currentSemester);
        if (students.isEmpty()) {
            throw new IllegalArgumentException("No students found in Semester " + currentSemester + " to promote.");
        }

        for (Student student : students) {
            student.setSemester(student.getSemester() + 1);
        }

        studentRepository.saveAll(students);

        auditLogService.log(AuditAction.PROMOTED_STUDENTS,
                String.format("Promoted %d students from Semester %d to Semester %d",
                        students.size(), currentSemester, currentSemester + 1),
                "Student", null);
    }

    private StudentResponse mapToResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .usn(student.getUsn())
                .name(student.getName())
                .email(student.getEmail())
                .semester(student.getSemester())
                .department(student.getDepartment())
                .build();
    }
}
