package com.bits.campusmanagement.controller;

import com.bits.campusmanagement.dto.*;
import com.bits.campusmanagement.model.User;
import com.bits.campusmanagement.service.FacultyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(facultyService.getDashboard(user.getId()));
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<CourseResponse>> getMyCourses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(facultyService.getMyCourses(user.getId()));
    }

    @GetMapping("/courses/{courseId}/students")
    public ResponseEntity<List<StudentResponse>> getCourseStudents(@PathVariable Long courseId,
                                                                    @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(facultyService.getStudentsForCourse(courseId, user.getId()));
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceResponse>> getAttendance(@AuthenticationPrincipal User user,
                                                                   @RequestParam(required = false) Long courseId) {
        return ResponseEntity.ok(facultyService.getAttendance(user.getId(), courseId));
    }

    @PostMapping("/attendance")
    public ResponseEntity<AttendanceResponse> markAttendance(@Valid @RequestBody AttendanceRequest request,
                                                              @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(facultyService.markAttendance(request, user.getId()));
    }

    @PutMapping("/attendance/{id}")
    public ResponseEntity<AttendanceResponse> updateAttendance(@PathVariable Long id,
                                                                @Valid @RequestBody AttendanceRequest request,
                                                                @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(facultyService.updateAttendance(id, request, user.getId()));
    }

    @GetMapping("/marks")
    public ResponseEntity<List<MarksResponse>> getMarks(@AuthenticationPrincipal User user,
                                                         @RequestParam(required = false) Long courseId) {
        return ResponseEntity.ok(facultyService.getMarks(user.getId(), courseId));
    }

    @PostMapping("/marks")
    public ResponseEntity<MarksResponse> enterMarks(@Valid @RequestBody MarksRequest request,
                                                     @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(facultyService.enterMarks(request, user.getId()));
    }

    @PutMapping("/marks/{id}")
    public ResponseEntity<MarksResponse> updateMarks(@PathVariable Long id,
                                                      @Valid @RequestBody MarksRequest request,
                                                      @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(facultyService.updateMarks(id, request, user.getId()));
    }

    @GetMapping("/timetable")
    public ResponseEntity<List<TimetableResponse>> getTimetable(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(facultyService.getMyTimetable(user.getId()));
    }

    @GetMapping("/announcements")
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncements() {
        return ResponseEntity.ok(facultyService.getAnnouncements());
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getEvents() {
        return ResponseEntity.ok(facultyService.getEvents());
    }
}
