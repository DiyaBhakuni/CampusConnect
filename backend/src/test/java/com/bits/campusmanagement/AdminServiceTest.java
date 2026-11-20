package com.bits.campusmanagement;

import com.bits.campusmanagement.model.*;
import com.bits.campusmanagement.repository.*;
import com.bits.campusmanagement.service.AdminServiceImpl;
import com.bits.campusmanagement.dto.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private StudentRepository studentRepository;
    @Mock private FacultyRepository facultyRepository;
    @Mock private DepartmentRepository departmentRepository;
    @Mock private CourseRepository courseRepository;
    @Mock private CourseAssignmentRepository courseAssignmentRepository;
    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private AttendanceRepository attendanceRepository;
    @Mock private MarksRepository marksRepository;
    @Mock private TimetableRepository timetableRepository;
    @Mock private AnnouncementRepository announcementRepository;
    @Mock private EventRepository eventRepository;
    @Mock private NotificationRepository notificationRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks AdminServiceImpl adminService;

    @Test
    void createStudent_withDuplicateEmail_throwsException() {
        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        StudentRequest req = new StudentRequest();
        req.setEmail("existing@test.com");
        req.setRollNumber("CS001");
        req.setDepartmentId(1L);

        assertThatThrownBy(() -> adminService.createStudent(req))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Email already in use");
    }

    @Test
    void createStudent_withDuplicateRollNumber_throwsException() {
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(studentRepository.existsByRollNumber("CS001")).thenReturn(true);

        StudentRequest req = new StudentRequest();
        req.setEmail("new@test.com");
        req.setRollNumber("CS001");
        req.setDepartmentId(1L);

        assertThatThrownBy(() -> adminService.createStudent(req))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Roll number already exists");
    }

    @Test
    void enrollStudent_duplicate_throwsException() {
        when(enrollmentRepository.existsByStudentIdAndCourseId(1L, 2L)).thenReturn(true);

        EnrollmentRequest req = new EnrollmentRequest();
        req.setStudentId(1L);
        req.setCourseId(2L);

        assertThatThrownBy(() -> adminService.enrollStudent(req))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already enrolled");
    }

    @Test
    void createDepartment_duplicateCode_throwsException() {
        when(departmentRepository.existsByCode("CS")).thenReturn(true);

        DepartmentRequest req = new DepartmentRequest();
        req.setName("Computer Science");
        req.setCode("CS");

        assertThatThrownBy(() -> adminService.createDepartment(req))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void deactivateStudent_callsRepository() {
        User user = User.builder().id(1L).email("s@test.com").role(Role.ROLE_STUDENT).fullName("Test").password("pw").build();
        Department dept = Department.builder().id(1L).name("CS").code("CS").build();
        Student student = Student.builder().id(1L).user(user).rollNumber("CS001").department(dept).active(true).build();

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(studentRepository.save(any())).thenReturn(student);
        when(userRepository.save(any())).thenReturn(user);

        adminService.deactivateStudent(1L);

        assertThat(student.isActive()).isFalse();
        verify(studentRepository).save(student);
    }
}
