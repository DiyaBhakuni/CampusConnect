package com.bits.campusmanagement.controller;

import com.bits.campusmanagement.dto.*;
import com.bits.campusmanagement.model.User;
import com.bits.campusmanagement.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // --- STUDENTS ---
    @GetMapping("/students")
    public ResponseEntity<List<StudentResponse>> getStudents(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (page != null && size != null) {
            Pageable pageable = PageRequest.of(page, size);
            Page<StudentResponse> result = adminService.getStudentsPaged(pageable);
            return ResponseEntity.ok(result.getContent());
        }
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    @PostMapping("/students")
    public ResponseEntity<StudentResponse> createStudent(@Valid @RequestBody StudentRequest request) {
        return ResponseEntity.ok(adminService.createStudent(request));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<StudentResponse> getStudent(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getStudentById(id));
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<StudentResponse> updateStudent(@PathVariable Long id,
                                                          @Valid @RequestBody StudentRequest request) {
        return ResponseEntity.ok(adminService.updateStudent(id, request));
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> deactivateStudent(@PathVariable Long id) {
        adminService.deactivateStudent(id);
        return ResponseEntity.ok().build();
    }

    // --- FACULTY ---
    @GetMapping("/faculty")
    public ResponseEntity<List<FacultyResponse>> getFaculty() {
        return ResponseEntity.ok(adminService.getAllFaculty());
    }

    @PostMapping("/faculty")
    public ResponseEntity<FacultyResponse> createFaculty(@Valid @RequestBody FacultyRequest request) {
        return ResponseEntity.ok(adminService.createFaculty(request));
    }

    @GetMapping("/faculty/{id}")
    public ResponseEntity<FacultyResponse> getFacultyById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getFacultyById(id));
    }

    @PutMapping("/faculty/{id}")
    public ResponseEntity<FacultyResponse> updateFaculty(@PathVariable Long id,
                                                          @Valid @RequestBody FacultyRequest request) {
        return ResponseEntity.ok(adminService.updateFaculty(id, request));
    }

    @DeleteMapping("/faculty/{id}")
    public ResponseEntity<Void> deactivateFaculty(@PathVariable Long id) {
        adminService.deactivateFaculty(id);
        return ResponseEntity.ok().build();
    }

    // --- DEPARTMENTS ---
    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentResponse>> getDepartments() {
        return ResponseEntity.ok(adminService.getAllDepartments());
    }

    @PostMapping("/departments")
    public ResponseEntity<DepartmentResponse> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.ok(adminService.createDepartment(request));
    }

    @GetMapping("/departments/{id}")
    public ResponseEntity<DepartmentResponse> getDepartment(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getDepartmentById(id));
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<DepartmentResponse> updateDepartment(@PathVariable Long id,
                                                                @Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.ok(adminService.updateDepartment(id, request));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        adminService.deleteDepartment(id);
        return ResponseEntity.ok().build();
    }

    // --- COURSES ---
    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponse>> getCourses() {
        return ResponseEntity.ok(adminService.getAllCourses());
    }

    @PostMapping("/courses")
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request) {
        return ResponseEntity.ok(adminService.createCourse(request));
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<CourseResponse> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getCourseById(id));
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long id,
                                                        @Valid @RequestBody CourseRequest request) {
        return ResponseEntity.ok(adminService.updateCourse(id, request));
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> deactivateCourse(@PathVariable Long id) {
        adminService.deactivateCourse(id);
        return ResponseEntity.ok().build();
    }

    // --- COURSE ASSIGNMENTS ---
    @GetMapping("/course-assignments")
    public ResponseEntity<List<CourseResponse>> getCoursesByFaculty(@RequestParam Long facultyId) {
        return ResponseEntity.ok(adminService.getCoursesByFaculty(facultyId));
    }

    @PostMapping("/course-assignments")
    public ResponseEntity<Void> assignFaculty(@Valid @RequestBody CourseAssignmentRequest request) {
        adminService.assignFacultyToCourse(request);
        return ResponseEntity.ok().build();
    }

    // --- ENROLLMENTS ---
    @GetMapping("/enrollments")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollments(
            @RequestParam(required = false) Long courseId) {
        if (courseId != null) return ResponseEntity.ok(adminService.getEnrollmentsByCourse(courseId));
        return ResponseEntity.ok(adminService.getAllEnrollments());
    }

    @PostMapping("/enrollments")
    public ResponseEntity<EnrollmentResponse> enrollStudent(@Valid @RequestBody EnrollmentRequest request) {
        return ResponseEntity.ok(adminService.enrollStudent(request));
    }

    // --- TIMETABLE ---
    @GetMapping("/timetable")
    public ResponseEntity<List<TimetableResponse>> getTimetable() {
        return ResponseEntity.ok(adminService.getAllTimetableEntries());
    }

    @PostMapping("/timetable")
    public ResponseEntity<TimetableResponse> createTimetable(@Valid @RequestBody TimetableRequest request) {
        return ResponseEntity.ok(adminService.createTimetableEntry(request));
    }

    @PutMapping("/timetable/{id}")
    public ResponseEntity<TimetableResponse> updateTimetable(@PathVariable Long id,
                                                              @Valid @RequestBody TimetableRequest request) {
        return ResponseEntity.ok(adminService.updateTimetableEntry(id, request));
    }

    @DeleteMapping("/timetable/{id}")
    public ResponseEntity<Void> deleteTimetable(@PathVariable Long id) {
        adminService.deleteTimetableEntry(id);
        return ResponseEntity.ok().build();
    }

    // --- ANNOUNCEMENTS ---
    @GetMapping("/announcements")
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncements() {
        return ResponseEntity.ok(adminService.getAllAnnouncements());
    }

    @PostMapping("/announcements")
    public ResponseEntity<AnnouncementResponse> createAnnouncement(@Valid @RequestBody AnnouncementRequest request,
                                                                    @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(adminService.createAnnouncement(request, user.getId()));
    }

    @PutMapping("/announcements/{id}")
    public ResponseEntity<AnnouncementResponse> updateAnnouncement(@PathVariable Long id,
                                                                    @Valid @RequestBody AnnouncementRequest request) {
        return ResponseEntity.ok(adminService.updateAnnouncement(id, request));
    }

    @DeleteMapping("/announcements/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        adminService.deleteAnnouncement(id);
        return ResponseEntity.ok().build();
    }

    // --- EVENTS ---
    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getEvents() {
        return ResponseEntity.ok(adminService.getAllEvents());
    }

    @PostMapping("/events")
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request,
                                                      @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(adminService.createEvent(request, user.getId()));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable Long id,
                                                      @Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(adminService.updateEvent(id, request));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        adminService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }

    // --- REPORTS ---
    @GetMapping("/reports/attendance")
    public ResponseEntity<List<AttendanceSummary>> getAttendanceReport() {
        return ResponseEntity.ok(adminService.getAttendanceReport());
    }

    @GetMapping("/reports/enrollment")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentReport() {
        return ResponseEntity.ok(adminService.getEnrollmentReport());
    }

    @GetMapping("/reports/analytics")
    public ResponseEntity<List<DepartmentResponse>> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalyticsReport());
    }

    // --- CSV ---
    @PostMapping("/import/students")
    public ResponseEntity<List<StudentResponse>> importStudents(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(adminService.importStudents(file));
    }

    @PostMapping("/import/faculty")
    public ResponseEntity<List<FacultyResponse>> importFaculty(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(adminService.importFaculty(file));
    }

    @GetMapping("/export/students")
    public ResponseEntity<byte[]> exportStudents() {
        byte[] csv = adminService.exportStudentsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=students.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @GetMapping("/export/faculty")
    public ResponseEntity<byte[]> exportFaculty() {
        byte[] csv = adminService.exportFacultyCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=faculty.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
