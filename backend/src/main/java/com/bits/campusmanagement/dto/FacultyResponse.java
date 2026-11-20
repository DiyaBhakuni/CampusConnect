package com.bits.campusmanagement.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FacultyResponse {
    private Long id;
    private Long userId;
    private String email;
    private String fullName;
    private String employeeNumber;
    private Long departmentId;
    private String departmentName;
    private String designation;
    private String phone;
    private String qualification;
    private String specialization;
    private boolean active;
}
