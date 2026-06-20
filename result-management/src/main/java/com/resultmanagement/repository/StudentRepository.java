package com.resultmanagement.repository;

import com.resultmanagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUsn(String usn);
    boolean existsByUsn(String usn);
    List<Student> findBySemester(Integer semester);
}
