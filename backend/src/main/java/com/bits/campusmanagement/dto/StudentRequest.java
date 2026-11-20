package com.bits.campusmanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class StudentRequest {
    @NotBlank @Email
    private String email;

    private String password;

    @NotBlank
    private String fullName;

    @NotBlank
    private String rollNumber;

    @NotNull
    private Long departmentId;

    private String program;
    private Integer semester;
    private LocalDate dateOfBirth;
    private String phone;
    private String address;
    private String gender;
}
