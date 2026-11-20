package com.bits.campusmanagement.service;

import com.bits.campusmanagement.dto.*;

import java.util.List;
import java.util.Map;

public interface FacultyService {
    Map<String, Object> getDashboard(Long userId);
    List<CourseResponse> getMyCourses(Long userId);
    List<StudentResponse> getStudentsForCourse(Long courseId, Long userId);

    List<AttendanceResponse> getAttendance(Long userId, Long courseId);
    AttendanceResponse markAttendance(AttendanceRequest request, Long userId);
    AttendanceResponse updateAttendance(Long id, AttendanceRequest request, Long userId);

    List<MarksResponse> getMarks(Long userId, Long courseId);
    MarksResponse enterMarks(MarksRequest request, Long userId);
    MarksResponse updateMarks(Long id, MarksRequest request, Long userId);

    List<TimetableResponse> getMyTimetable(Long userId);
    List<AnnouncementResponse> getAnnouncements();
    List<EventResponse> getEvents();
}
