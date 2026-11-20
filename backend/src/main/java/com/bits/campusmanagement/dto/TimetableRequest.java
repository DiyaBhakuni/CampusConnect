package com.bits.campusmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TimetableRequest {
    @NotNull
    private Long courseId;

    private Long facultyId;
    private Long roomId;

    @NotBlank
    private String dayOfWeek;

    @NotBlank
    private String startTime;

    @NotBlank
    private String endTime;

    private String academicYear;
    private String semesterLabel;
}
