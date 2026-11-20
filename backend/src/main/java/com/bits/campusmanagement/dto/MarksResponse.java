package com.bits.campusmanagement.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MarksResponse {
    private Long id;
    private Long enrollmentId;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private String examType;
    private Double marksObtained;
    private Double maxMarks;
    private Double percentage;
    private String grade;
    private String remarks;
}
