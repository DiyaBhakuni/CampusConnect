package com.bits.campusmanagement.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class AttendanceResponse {
    private Long id;
    private Long enrollmentId;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long courseId;
    private String courseName;
    private LocalDate attendanceDate;
    private String status;
    private String remarks;
}
