package com.bits.campusmanagement.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AttendanceSummary {
    private Long courseId;
    private String courseCode;
    private String courseName;
    private Long totalClasses;
    private Long presentCount;
    private Double percentage;
    private boolean belowThreshold;
}
