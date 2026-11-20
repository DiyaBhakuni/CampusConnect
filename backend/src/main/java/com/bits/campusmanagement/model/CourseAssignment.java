package com.bits.campusmanagement.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "course_assignments",
       uniqueConstraints = @UniqueConstraint(columnNames = {"faculty_id", "course_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    @ToString.Exclude
    private Faculty faculty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @ToString.Exclude
    private Course course;

    private String academicYear;
    private String semester;
}
