package com.bits.campusmanagement.service;

import com.bits.campusmanagement.dto.*;
import com.bits.campusmanagement.model.*;
import com.bits.campusmanagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FacultyServiceImpl implements FacultyService {

    private final FacultyRepository facultyRepository;
    private final CourseAssignmentRepository courseAssignmentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;
    private final TimetableRepository timetableRepository;
    private final AnnouncementRepository announcementRepository;
    private final EventRepository eventRepository;
    private final AdminServiceImpl adminService;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboard(Long userId) {
        Faculty faculty = findFacultyByUserId(userId);
        List<CourseAssignment> assignments = courseAssignmentRepository.findByFacultyId(faculty.getId());
        long totalStudents = assignments.stream()
                .mapToLong(a -> enrollmentRepository.countActiveByCourseId(a.getCourse().getId()))
                .sum();

        String today = LocalDate.now().getDayOfWeek().toString();
        List<TimetableResponse> todayClasses = timetableRepository
                .findTodayClassesForFaculty(faculty.getId(), today)
                .stream().map(adminService::mapToTimetableResponse).collect(Collectors.toList());

        List<EventResponse> upcomingEvents = eventRepository
                .findByEventDateGreaterThanEqualAndActiveTrueOrderByEventDateAsc(LocalDate.now())
                .stream().limit(3).map(e -> EventResponse.builder()
                        .id(e.getId()).title(e.getTitle()).eventDate(e.getEventDate())
                        .venue(e.getVenue()).description(e.getDescription()).build())
                .collect(Collectors.toList());

        List<AnnouncementResponse> recentAnnouncements = announcementRepository.findForFaculty()
                .stream().limit(3).map(a -> AnnouncementResponse.builder()
                        .id(a.getId()).title(a.getTitle()).postedAt(a.getPostedAt()).content(a.getContent()).build())
                .collect(Collectors.toList());

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("facultyName", faculty.getUser().getFullName());
        dashboard.put("employeeNumber", faculty.getEmployeeNumber());
        dashboard.put("designation", faculty.getDesignation());
        dashboard.put("department", faculty.getDepartment() != null ? faculty.getDepartment().getName() : null);
        dashboard.put("assignedCourses", assignments.size());
        dashboard.put("totalStudents", totalStudents);
        dashboard.put("todayClasses", todayClasses);
        dashboard.put("upcomingEvents", upcomingEvents);
        dashboard.put("recentAnnouncements", recentAnnouncements);
        return dashboard;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getMyCourses(Long userId) {
        Faculty faculty = findFacultyByUserId(userId);
        return courseAssignmentRepository.findByFacultyIdWithCourse(faculty.getId()).stream()
                .map(ca -> adminService.mapToCourseResponse(ca.getCourse()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getStudentsForCourse(Long courseId, Long userId) {
        Faculty faculty = findFacultyByUserId(userId);
        assertFacultyOwnsCourse(faculty.getId(), courseId);
        return enrollmentRepository.findActiveEnrollmentsByCourseId(courseId).stream()
                .map(e -> {
                    StudentResponse r = adminService.mapToStudentResponse(e.getStudent());
                    r.setEnrollmentId(e.getId());
                    return r;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendance(Long userId, Long courseId) {
        Faculty faculty = findFacultyByUserId(userId);
        if (courseId != null) assertFacultyOwnsCourse(faculty.getId(), courseId);
        return attendanceRepository.findAll().stream()
                .filter(a -> courseId == null || a.getEnrollment().getCourse().getId().equals(courseId))
                .filter(a -> courseId != null || isAssignedCourse(faculty.getId(), a.getEnrollment().getCourse().getId()))
                .map(this::mapAttendance)
                .collect(Collectors.toList());
    }

    @Override
    public AttendanceResponse markAttendance(AttendanceRequest req, Long userId) {
        Faculty faculty = findFacultyByUserId(userId);
        Enrollment enrollment = enrollmentRepository.findById(req.getEnrollmentId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Enrollment not found"));
        assertFacultyOwnsCourse(faculty.getId(), enrollment.getCourse().getId());

        if (req.getAttendanceDate().isAfter(LocalDate.now()))
            throw new IllegalArgumentException("Attendance date cannot be in the future");

        Attendance att = attendanceRepository
                .findByEnrollmentIdAndAttendanceDate(enrollment.getId(), req.getAttendanceDate())
                .orElseGet(() -> Attendance.builder().enrollment(enrollment).attendanceDate(req.getAttendanceDate()).build());
        att.setStatus(Attendance.AttendanceStatus.valueOf(req.getStatus()));
        att.setRemarks(req.getRemarks());
        return mapAttendance(attendanceRepository.save(att));
    }

    @Override
    public AttendanceResponse updateAttendance(Long id, AttendanceRequest req, Long userId) {
        Faculty faculty = findFacultyByUserId(userId);
        Attendance att = attendanceRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Attendance not found"));
        assertFacultyOwnsCourse(faculty.getId(), att.getEnrollment().getCourse().getId());
        att.setStatus(Attendance.AttendanceStatus.valueOf(req.getStatus()));
        att.setRemarks(req.getRemarks());
        return mapAttendance(attendanceRepository.save(att));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MarksResponse> getMarks(Long userId, Long courseId) {
        Faculty faculty = findFacultyByUserId(userId);
        if (courseId != null) {
            assertFacultyOwnsCourse(faculty.getId(), courseId);
            return marksRepository.findByCourseId(courseId).stream().map(this::mapMarks).collect(Collectors.toList());
        }
        List<Long> courseIds = courseAssignmentRepository.findByFacultyId(faculty.getId())
                .stream().map(ca -> ca.getCourse().getId()).collect(Collectors.toList());
        return marksRepository.findAll().stream()
                .filter(m -> courseIds.contains(m.getEnrollment().getCourse().getId()))
                .map(this::mapMarks).collect(Collectors.toList());
    }

    @Override
    public MarksResponse enterMarks(MarksRequest req, Long userId) {
        Faculty faculty = findFacultyByUserId(userId);
        Enrollment enrollment = enrollmentRepository.findById(req.getEnrollmentId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Enrollment not found"));
        assertFacultyOwnsCourse(faculty.getId(), enrollment.getCourse().getId());

        if (req.getMarksObtained() > req.getMaxMarks())
            throw new IllegalArgumentException("Marks obtained cannot exceed max marks");
        if (marksRepository.existsByEnrollmentIdAndExamType(enrollment.getId(), req.getExamType()))
            throw new IllegalStateException("Marks already entered for this exam type");

        Marks marks = marksRepository.save(Marks.builder()
                .enrollment(enrollment)
                .examType(req.getExamType())
                .marksObtained(req.getMarksObtained())
                .maxMarks(req.getMaxMarks())
                .grade(req.getGrade())
                .remarks(req.getRemarks())
                .build());
        return mapMarks(marks);
    }

    @Override
    public MarksResponse updateMarks(Long id, MarksRequest req, Long userId) {
        Faculty faculty = findFacultyByUserId(userId);
        Marks marks = marksRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Marks not found"));
        assertFacultyOwnsCourse(faculty.getId(), marks.getEnrollment().getCourse().getId());

        if (req.getMarksObtained() > req.getMaxMarks())
            throw new IllegalArgumentException("Marks obtained cannot exceed max marks");
        marks.setMarksObtained(req.getMarksObtained());
        marks.setMaxMarks(req.getMaxMarks());
        marks.setGrade(req.getGrade());
        marks.setRemarks(req.getRemarks());
        return mapMarks(marksRepository.save(marks));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableResponse> getMyTimetable(Long userId) {
        Faculty faculty = findFacultyByUserId(userId);
        return timetableRepository.findByFacultyIdOrdered(faculty.getId()).stream()
                .map(adminService::mapToTimetableResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAnnouncements() {
        return announcementRepository.findForFaculty().stream().map(a ->
                AnnouncementResponse.builder()
                        .id(a.getId()).title(a.getTitle()).content(a.getContent())
                        .audience(a.getAudience().name()).postedBy(a.getPostedBy().getFullName())
                        .postedAt(a.getPostedAt()).active(a.isActive()).build()
        ).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getEvents() {
        return eventRepository.findByEventDateGreaterThanEqualAndActiveTrueOrderByEventDateAsc(LocalDate.now())
                .stream().map(e -> EventResponse.builder()
                        .id(e.getId()).title(e.getTitle()).description(e.getDescription())
                        .eventDate(e.getEventDate()).venue(e.getVenue()).organizer(e.getOrganizer())
                        .createdBy(e.getCreatedBy().getFullName()).createdAt(e.getCreatedAt()).active(e.isActive()).build())
                .collect(Collectors.toList());
    }

    // helpers

    private Faculty findFacultyByUserId(Long userId) {
        return facultyRepository.findByUserId(userId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Faculty profile not found"));
    }

    private void assertFacultyOwnsCourse(Long facultyId, Long courseId) {
        if (!courseAssignmentRepository.existsByFacultyIdAndCourseId(facultyId, courseId))
            throw new org.springframework.security.access.AccessDeniedException("Not assigned to this course");
    }

    private boolean isAssignedCourse(Long facultyId, Long courseId) {
        return courseAssignmentRepository.existsByFacultyIdAndCourseId(facultyId, courseId);
    }

    private AttendanceResponse mapAttendance(Attendance a) {
        return AttendanceResponse.builder()
                .id(a.getId())
                .enrollmentId(a.getEnrollment().getId())
                .studentId(a.getEnrollment().getStudent().getId())
                .studentName(a.getEnrollment().getStudent().getUser().getFullName())
                .rollNumber(a.getEnrollment().getStudent().getRollNumber())
                .courseId(a.getEnrollment().getCourse().getId())
                .courseName(a.getEnrollment().getCourse().getCourseName())
                .attendanceDate(a.getAttendanceDate())
                .status(a.getStatus().name())
                .remarks(a.getRemarks())
                .build();
    }

    private MarksResponse mapMarks(Marks m) {
        double pct = m.getMaxMarks() > 0 ? (m.getMarksObtained() / m.getMaxMarks() * 100) : 0;
        return MarksResponse.builder()
                .id(m.getId())
                .enrollmentId(m.getEnrollment().getId())
                .studentId(m.getEnrollment().getStudent().getId())
                .studentName(m.getEnrollment().getStudent().getUser().getFullName())
                .rollNumber(m.getEnrollment().getStudent().getRollNumber())
                .courseId(m.getEnrollment().getCourse().getId())
                .courseCode(m.getEnrollment().getCourse().getCourseCode())
                .courseName(m.getEnrollment().getCourse().getCourseName())
                .examType(m.getExamType())
                .marksObtained(m.getMarksObtained())
                .maxMarks(m.getMaxMarks())
                .percentage(Math.round(pct * 10.0) / 10.0)
                .grade(m.getGrade())
                .remarks(m.getRemarks())
                .build();
    }

    public TimetableResponse mapToTimetableResponse(Timetable tt) {
        return adminService.mapToTimetableResponse(tt);
    }
}
