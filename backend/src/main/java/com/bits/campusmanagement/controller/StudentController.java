package com.bits.campusmanagement.controller;

import com.bits.campusmanagement.dto.*;
import com.bits.campusmanagement.model.User;
import com.bits.campusmanagement.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentService.getDashboard(user.getId()));
    }

    @GetMapping("/profile")
    public ResponseEntity<StudentResponse> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentService.getProfile(user.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<StudentResponse> updateProfile(@AuthenticationPrincipal User user,
                                                          @RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.updateProfile(user.getId(), request));
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponse>> getMyCourses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentService.getMyCourses(user.getId()));
    }

    @GetMapping("/attendance/summary")
    public ResponseEntity<List<AttendanceSummary>> getAttendanceSummary(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentService.getAttendanceSummary(user.getId()));
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceDetails(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentService.getAttendanceDetails(user.getId()));
    }

    @GetMapping("/marks")
    public ResponseEntity<List<MarksResponse>> getMarks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentService.getMyMarks(user.getId()));
    }

    @GetMapping("/timetable")
    public ResponseEntity<List<TimetableResponse>> getTimetable(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentService.getMyTimetable(user.getId()));
    }

    @GetMapping("/announcements")
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncements() {
        return ResponseEntity.ok(studentService.getAnnouncements());
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getEvents() {
        return ResponseEntity.ok(studentService.getEvents());
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getNotifications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentService.getNotifications(user.getId()));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id, @AuthenticationPrincipal User user) {
        studentService.markNotificationRead(id, user.getId());
        return ResponseEntity.ok().build();
    }
}
