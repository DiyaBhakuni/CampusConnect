package com.bits.campusmanagement;

import com.bits.campusmanagement.dto.AttendanceRequest;
import com.bits.campusmanagement.dto.MarksRequest;
import com.bits.campusmanagement.model.*;
import com.bits.campusmanagement.repository.*;
import com.bits.campusmanagement.service.AdminServiceImpl;
import com.bits.campusmanagement.service.FacultyServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FacultyServiceTest {

    @Mock private FacultyRepository facultyRepository;
    @Mock private CourseAssignmentRepository courseAssignmentRepository;
    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private AttendanceRepository attendanceRepository;
    @Mock private MarksRepository marksRepository;
    @Mock private TimetableRepository timetableRepository;
    @Mock private AnnouncementRepository announcementRepository;
    @Mock private EventRepository eventRepository;
    @Mock private AdminServiceImpl adminService;

    @InjectMocks FacultyServiceImpl facultyService;

    private Faculty buildFaculty(Long id, Long userId) {
        User user = User.builder().id(userId).email("f@test.com").role(Role.ROLE_FACULTY).fullName("F").password("pw").build();
        Department dept = Department.builder().id(1L).name("CS").code("CS").build();
        return Faculty.builder().id(id).user(user).employeeNumber("EMP001").department(dept).build();
    }

    private Enrollment buildEnrollment(Long enrollId, Long courseId, Long studentId) {
        Course course = Course.builder().id(courseId).courseCode("CS101").courseName("Intro CS").build();
        User u = User.builder().id(studentId).email("s@test.com").role(Role.ROLE_STUDENT).fullName("S").password("pw").build();
        Student student = Student.builder().id(studentId).user(u).rollNumber("R001").build();
        return Enrollment.builder().id(enrollId).student(student).course(course).active(true).build();
    }

    @Test
    void markAttendance_futureDate_throwsException() {
        Faculty faculty = buildFaculty(1L, 10L);
        Enrollment enrollment = buildEnrollment(1L, 5L, 20L);

        when(facultyRepository.findByUserId(10L)).thenReturn(Optional.of(faculty));
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(enrollment));
        when(courseAssignmentRepository.existsByFacultyIdAndCourseId(1L, 5L)).thenReturn(true);

        AttendanceRequest req = new AttendanceRequest();
        req.setEnrollmentId(1L);
        req.setAttendanceDate(LocalDate.now().plusDays(1));
        req.setStatus("PRESENT");

        assertThatThrownBy(() -> facultyService.markAttendance(req, 10L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("future");
    }

    @Test
    void markAttendance_duplicateDate_throwsException() {
        Faculty faculty = buildFaculty(1L, 10L);
        Enrollment enrollment = buildEnrollment(1L, 5L, 20L);
        LocalDate today = LocalDate.now();

        when(facultyRepository.findByUserId(10L)).thenReturn(Optional.of(faculty));
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(enrollment));
        when(courseAssignmentRepository.existsByFacultyIdAndCourseId(1L, 5L)).thenReturn(true);
        when(attendanceRepository.existsByEnrollmentIdAndAttendanceDate(1L, today)).thenReturn(true);

        AttendanceRequest req = new AttendanceRequest();
        req.setEnrollmentId(1L);
        req.setAttendanceDate(today);
        req.setStatus("PRESENT");

        assertThatThrownBy(() -> facultyService.markAttendance(req, 10L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already marked");
    }

    @Test
    void markAttendance_unauthorizedFaculty_throwsException() {
        Faculty faculty = buildFaculty(1L, 10L);
        Enrollment enrollment = buildEnrollment(1L, 5L, 20L);

        when(facultyRepository.findByUserId(10L)).thenReturn(Optional.of(faculty));
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(enrollment));
        when(courseAssignmentRepository.existsByFacultyIdAndCourseId(1L, 5L)).thenReturn(false);

        AttendanceRequest req = new AttendanceRequest();
        req.setEnrollmentId(1L);
        req.setAttendanceDate(LocalDate.now());
        req.setStatus("PRESENT");

        assertThatThrownBy(() -> facultyService.markAttendance(req, 10L))
                .isInstanceOf(org.springframework.security.access.AccessDeniedException.class);
    }

    @Test
    void enterMarks_duplicateExamType_throwsException() {
        Faculty faculty = buildFaculty(1L, 10L);
        Enrollment enrollment = buildEnrollment(1L, 5L, 20L);

        when(facultyRepository.findByUserId(10L)).thenReturn(Optional.of(faculty));
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(enrollment));
        when(courseAssignmentRepository.existsByFacultyIdAndCourseId(1L, 5L)).thenReturn(true);
        when(marksRepository.existsByEnrollmentIdAndExamType(1L, "MIDTERM")).thenReturn(true);

        MarksRequest req = new MarksRequest();
        req.setEnrollmentId(1L);
        req.setExamType("MIDTERM");
        req.setMarksObtained(45.0);
        req.setMaxMarks(50.0);

        assertThatThrownBy(() -> facultyService.enterMarks(req, 10L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Marks already entered");
    }
}
