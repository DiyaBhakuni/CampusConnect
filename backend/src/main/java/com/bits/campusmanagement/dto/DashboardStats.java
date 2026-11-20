package com.bits.campusmanagement.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardStats {
    private Long totalStudents;
    private Long totalFaculty;
    private Long totalCourses;
    private Long totalDepartments;
    private Double overallAttendanceRate;
    private List<Map<String, Object>> departmentStats;
    private List<Map<String, Object>> recentActivities;
}
