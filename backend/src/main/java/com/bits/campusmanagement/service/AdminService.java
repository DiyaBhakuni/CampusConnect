package com.bits.campusmanagement.service;

import com.bits.campusmanagement.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AdminService {
    // Dashboard
    DashboardStats getDashboardStats();

    // Students
    StudentResponse createStudent(StudentRequest request);
    List<StudentResponse> getAllStudents();
    Page<StudentResponse> getStudentsPaged(Pageable pageable);
    StudentResponse getStudentById(Long id);
    StudentResponse updateStudent(Long id, StudentRequest request);
    void deactivateStudent(Long id);

    // Faculty
    FacultyResponse createFaculty(FacultyRequest request);
    List<FacultyResponse> getAllFaculty();
    Page<FacultyResponse> getFacultyPaged(Pageable pageable);
    FacultyResponse getFacultyById(Long id);
    FacultyResponse updateFaculty(Long id, FacultyRequest request);
    void deactivateFaculty(Long id);

    // Departments
    DepartmentResponse createDepartment(DepartmentRequest request);
    List<DepartmentResponse> getAllDepartments();
    DepartmentResponse getDepartmentById(Long id);
    DepartmentResponse updateDepartment(Long id, DepartmentRequest request);
    void deleteDepartment(Long id);

    // Courses
    CourseResponse createCourse(CourseRequest request);
    List<CourseResponse> getAllCourses();
    CourseResponse getCourseById(Long id);
    CourseResponse updateCourse(Long id, CourseRequest request);
    void deactivateCourse(Long id);

    // Assignments
    void assignFacultyToCourse(CourseAssignmentRequest request);
    List<CourseResponse> getCoursesByFaculty(Long facultyId);

    // Enrollments
    EnrollmentResponse enrollStudent(EnrollmentRequest request);
    List<EnrollmentResponse> getAllEnrollments();
    List<EnrollmentResponse> getEnrollmentsByCourse(Long courseId);

    // Timetable
    TimetableResponse createTimetableEntry(TimetableRequest request);
    List<TimetableResponse> getAllTimetableEntries();
    TimetableResponse updateTimetableEntry(Long id, TimetableRequest request);
    void deleteTimetableEntry(Long id);

    // Announcements
    AnnouncementResponse createAnnouncement(AnnouncementRequest request, Long userId);
    List<AnnouncementResponse> getAllAnnouncements();
    AnnouncementResponse updateAnnouncement(Long id, AnnouncementRequest request);
    void deleteAnnouncement(Long id);

    // Events
    EventResponse createEvent(EventRequest request, Long userId);
    List<EventResponse> getAllEvents();
    EventResponse updateEvent(Long id, EventRequest request);
    void deleteEvent(Long id);

    // CSV
    List<StudentResponse> importStudents(MultipartFile file);
    List<FacultyResponse> importFaculty(MultipartFile file);
    byte[] exportStudentsCsv();
    byte[] exportFacultyCsv();

    // Reports
    List<AttendanceSummary> getAttendanceReport();
    List<EnrollmentResponse> getEnrollmentReport();
    List<DepartmentResponse> getAnalyticsReport();
}
