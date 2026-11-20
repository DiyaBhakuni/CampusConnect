package com.bits.campusmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CourseRequest {
    @NotBlank
    private String courseCode;

    @NotBlank
    private String courseName;

    private String description;
    private Integer credits;
    private Integer semester;

    @NotNull
    private Long departmentId;
}
