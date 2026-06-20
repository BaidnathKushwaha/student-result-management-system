package com.resultmanagement.repository;

import com.resultmanagement.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MarksRepository extends JpaRepository<Marks, Long> {
    List<Marks> findByStudentId(Long studentId);
    List<Marks> findByStudentIdAndSubject_Semester(Long studentId, Integer semester);
    Optional<Marks> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
}
