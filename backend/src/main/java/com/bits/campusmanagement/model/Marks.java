package com.bits.campusmanagement.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "marks",
       uniqueConstraints = @UniqueConstraint(columnNames = {"enrollment_id", "exam_type"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    @ToString.Exclude
    private Enrollment enrollment;

    @Column(nullable = false)
    private String examType;

    @Column(nullable = false)
    private Double marksObtained;

    @Column(nullable = false)
    private Double maxMarks;

    private String grade;
    private String remarks;
}
