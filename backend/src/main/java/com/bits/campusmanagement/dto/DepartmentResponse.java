package com.bits.campusmanagement.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DepartmentResponse {
    private Long id;
    private String name;
    private String code;
    private String hodName;
    private String description;
    private Long studentCount;
    private Long facultyCount;
    private Long courseCount;
}
