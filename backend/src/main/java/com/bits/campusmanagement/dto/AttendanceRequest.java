package com.bits.campusmanagement.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AttendanceRequest {
    @NotNull
    private Long enrollmentId;

    @NotNull
    @PastOrPresent
    private LocalDate attendanceDate;

    @NotNull
    private String status;

    private String remarks;
}
