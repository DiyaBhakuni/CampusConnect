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
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;
    private final TimetableRepository timetableRepository;
    private final AnnouncementRepository announcementRepository;
    private final EventRepository eventRepository;
    private final NotificationRepository notificationRepository;
    private final AdminServiceImpl adminService;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboard(Long userId) {
        Student student = findStudentByUserId(userId);
        List<AttendanceSummary> summaries = getAttendanceSummary(userId);
        double overallAttendance = summaries.isEmpty() ? 0.0
                : summaries.stream().mapToDouble(AttendanceSummary::getPercentage).average().orElse(0.0);

        String today = LocalDate.now().getDayOfWeek().toString();
        List<TimetableResponse> todayClasses = timetableRepository
                .findTodayClassesForStudent(student.getId(), today)
                .stream().map(adminService::mapToTimetableResponse).collect(Collectors.toList());

        List<EventResponse> upcomingEvents = eventRepository
                .findByEventDateGreaterThanEqualAndActiveTrueOrderByEventDateAsc(LocalDate.now())
                .stream().limit(3).map(e -> EventResponse.builder()
                        .id(e.getId()).title(e.getTitle()).eventDate(e.getEventDate())
                        .venue(e.getVenue()).build())
                .collect(Collectors.toList());

        List<AnnouncementResponse> recentAnnouncements = announcementRepository.findForStudents()
                .stream().limit(3).map(a -> AnnouncementResponse.builder()
                        .id(a.getId()).title(a.getTitle()).postedAt(a.getPostedAt()).build())
                .collect(Collectors.toList());

        long unreadNotifs = notificationRepository.countByUserIdAndReadFalse(userId);

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("studentName", student.getUser().getFullName());
        dashboard.put("rollNumber", student.getRollNumber());
        dashboard.put("enrolledCourses", summaries.size());
        dashboard.put("overallAttendance", Math.round(overallAttendance * 10.0) / 10.0);
        dashboard.put("attendanceSummary", summaries);
        dashboard.put("todayClasses", todayClasses);
        dashboard.put("upcomingEvents", upcomingEvents);
        dashboard.put("recentAnnouncements", recentAnnouncements);
        dashboard.put("unreadNotifications", unreadNotifs);
        dashboard.put("hasAttendanceAlert", summaries.stream().anyMatch(AttendanceSummary::isBelowThreshold));
        return dashboard;
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getProfile(Long userId) {
        return adminService.mapToStudentResponse(findStudentByUserId(userId));
    }

    @Override
    public StudentResponse updateProfile(Long userId, StudentRequest request) {
        Student student = findStudentByUserId(userId);
        // students can only update phone and address
        student.setPhone(request.getPhone());
        student.setAddress(request.getAddress());
        return adminService.mapToStudentResponse(studentRepository.save(student));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getMyCourses(Long userId) {
        Student student = findStudentByUserId(userId);
        return enrollmentRepository.findActiveEnrollmentsByStudentId(student.getId()).stream()
                .map(e -> adminService.mapToCourseResponse(e.getCourse()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummary> getAttendanceSummary(Long userId) {
        Student student = findStudentByUserId(userId);
        return enrollmentRepository.findActiveEnrollmentsByStudentId(student.getId()).stream().map(enrollment -> {
            long total = attendanceRepository.countTotalByEnrollmentId(enrollment.getId());
            long present = attendanceRepository.countPresentByEnrollmentId(enrollment.getId());
            double pct = total == 0 ? 0.0 : (present * 100.0 / total);
            return AttendanceSummary.builder()
                    .courseId(enrollment.getCourse().getId())
                    .courseCode(enrollment.getCourse().getCourseCode())
                    .courseName(enrollment.getCourse().getCourseName())
                    .totalClasses(total)
                    .presentCount(present)
                    .percentage(Math.round(pct * 10.0) / 10.0)
                    .belowThreshold(pct < 75.0 && total > 0)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceDetails(Long userId) {
        Student student = findStudentByUserId(userId);
        return attendanceRepository.findByStudentId(student.getId()).stream().map(a ->
                AttendanceResponse.builder()
                        .id(a.getId())
                        .enrollmentId(a.getEnrollment().getId())
                        .courseId(a.getEnrollment().getCourse().getId())
                        .courseName(a.getEnrollment().getCourse().getCourseName())
                        .attendanceDate(a.getAttendanceDate())
                        .status(a.getStatus().name())
                        .remarks(a.getRemarks())
                        .build()
        ).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MarksResponse> getMyMarks(Long userId) {
        Student student = findStudentByUserId(userId);
        return marksRepository.findByStudentId(student.getId()).stream().map(m -> {
            double pct = m.getMaxMarks() > 0 ? (m.getMarksObtained() / m.getMaxMarks() * 100) : 0;
            return MarksResponse.builder()
                    .id(m.getId())
                    .courseId(m.getEnrollment().getCourse().getId())
                    .courseCode(m.getEnrollment().getCourse().getCourseCode())
                    .courseName(m.getEnrollment().getCourse().getCourseName())
                    .examType(m.getExamType())
                    .marksObtained(m.getMarksObtained())
                    .maxMarks(m.getMaxMarks())
                    .percentage(Math.round(pct * 10.0) / 10.0)
                    .grade(m.getGrade())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableResponse> getMyTimetable(Long userId) {
        Student student = findStudentByUserId(userId);
        return timetableRepository.findByStudentId(student.getId()).stream()
                .map(adminService::mapToTimetableResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAnnouncements() {
        return announcementRepository.findForStudents().stream().map(a ->
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
                        .createdBy(e.getCreatedBy().getFullName()).createdAt(e.getCreatedAt()).build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(n ->
                NotificationResponse.builder()
                        .id(n.getId()).title(n.getTitle()).message(n.getMessage())
                        .type(n.getType().name()).read(n.isRead()).createdAt(n.getCreatedAt()).build()
        ).collect(Collectors.toList());
    }

    @Override
    public void markNotificationRead(Long notifId, Long userId) {
        Notification notif = notificationRepository.findById(notifId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Notification not found"));
        if (!notif.getUser().getId().equals(userId))
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        notif.setRead(true);
        notificationRepository.save(notif);
    }

    private Student findStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Student profile not found"));
    }
}
