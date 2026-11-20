package com.bits.campusmanagement.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseResponse {
    private Long id;
    private String courseCode;
    private String courseName;
    private String description;
    private Integer credits;
    private Integer semester;
    private Long departmentId;
    private String departmentName;
    private boolean active;
    private Long enrollmentCount;
}
