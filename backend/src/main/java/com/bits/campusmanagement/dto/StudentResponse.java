package com.bits.campusmanagement.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class StudentResponse {
    private Long id;
    private Long userId;
    private Long enrollmentId;
    private String email;
    private String fullName;
    private String rollNumber;
    private Long departmentId;
    private String departmentName;
    private String program;
    private Integer semester;
    private LocalDate dateOfBirth;
    private String phone;
    private String address;
    private String gender;
    private boolean active;
}
