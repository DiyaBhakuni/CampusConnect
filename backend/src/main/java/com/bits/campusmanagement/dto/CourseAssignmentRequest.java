package com.bits.campusmanagement.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CourseAssignmentRequest {
    @NotNull
    private Long facultyId;

    @NotNull
    private Long courseId;

    private String academicYear;
    private String semester;
}
