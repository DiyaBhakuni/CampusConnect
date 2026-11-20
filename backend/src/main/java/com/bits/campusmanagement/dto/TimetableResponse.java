package com.bits.campusmanagement.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TimetableResponse {
    private Long id;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private Long facultyId;
    private String facultyName;
    private Long roomId;
    private String roomNumber;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private String academicYear;
    private String semesterLabel;
}
