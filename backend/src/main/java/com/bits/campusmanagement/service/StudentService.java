package com.bits.campusmanagement.service;

import com.bits.campusmanagement.dto.*;

import java.util.List;
import java.util.Map;

public interface StudentService {
    Map<String, Object> getDashboard(Long userId);
    StudentResponse getProfile(Long userId);
    StudentResponse updateProfile(Long userId, StudentRequest request);

    List<CourseResponse> getMyCourses(Long userId);
    List<AttendanceSummary> getAttendanceSummary(Long userId);
    List<AttendanceResponse> getAttendanceDetails(Long userId);
    List<MarksResponse> getMyMarks(Long userId);
    List<TimetableResponse> getMyTimetable(Long userId);
    List<AnnouncementResponse> getAnnouncements();
    List<EventResponse> getEvents();
    List<NotificationResponse> getNotifications(Long userId);
    void markNotificationRead(Long notifId, Long userId);
}
