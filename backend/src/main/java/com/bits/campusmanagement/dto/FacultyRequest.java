package com.bits.campusmanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FacultyRequest {
    @NotBlank @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String fullName;

    @NotBlank
    private String employeeNumber;

    @NotNull
    private Long departmentId;

    private String designation;
    private String phone;
    private String qualification;
    private String specialization;
}
