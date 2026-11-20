package com.bits.campusmanagement.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MarksRequest {
    @NotNull
    private Long enrollmentId;

    @NotBlank
    private String examType;

    @NotNull
    @DecimalMin("0.0")
    private Double marksObtained;

    @NotNull
    @DecimalMin("1.0")
    private Double maxMarks;

    private String grade;
    private String remarks;
}
