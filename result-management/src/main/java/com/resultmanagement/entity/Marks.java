package com.resultmanagement.entity;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "marks", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "student_id", "subject_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Min(0)
    @Max(50)
    @Column(nullable = false)
    private Double internalMarks;

    @Min(0)
    @Max(50)
    @Column(nullable = false)
    private Double externalMarks;

    @Column(nullable = false)
    private Double totalMarks;
}
