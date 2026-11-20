package com.bits.campusmanagement.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class EnrollmentResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private LocalDateTime enrolledAt;
    private boolean active;
}
