package com.resultmanagement.service;

import com.resultmanagement.dto.request.StudentRequest;
import com.resultmanagement.dto.response.StudentResponse;
import com.resultmanagement.entity.Student;
import com.resultmanagement.exception.DuplicateResourceException;
import com.resultmanagement.exception.StudentNotFoundException;
import com.resultmanagement.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

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
        return mapToResponse(saved);
    }

    public Page<StudentResponse> getAllStudents(int page, int size, String sortBy) {
        Page<Student> students = studentRepository.findAll(
                PageRequest.of(page, size, Sort.by(sortBy))
        );
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
        return mapToResponse(updated);
    }

    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
        studentRepository.delete(student);
    }

    public Student getStudentEntityById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
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
