package com.bits.campusmanagement.config;

import com.bits.campusmanagement.model.*;
import com.bits.campusmanagement.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final CourseAssignmentRepository courseAssignmentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final TimetableRepository timetableRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping initialization.");
            return;
        }

        log.info("Seeding initial data...");

        // Admin
        User adminUser = userRepository.save(User.builder()
                .email("admin@campus.edu")
                .password(passwordEncoder.encode("admin123"))
                .fullName("System Administrator")
                .role(Role.ROLE_ADMIN)
                .build());

        // Departments
        Department csDept = departmentRepository.save(Department.builder()
                .name("Computer Science").code("CS").hodName("Dr. Priya Sharma")
                .description("Department of Computer Science and Engineering").build());

        Department eceDept = departmentRepository.save(Department.builder()
                .name("Electronics & Communication").code("ECE").hodName("Dr. Rajesh Kumar")
                .description("Department of Electronics and Communication Engineering").build());

        Department mbaDept = departmentRepository.save(Department.builder()
                .name("Business Administration").code("MBA").hodName("Dr. Anita Verma")
                .description("Department of Business Administration").build());

        // Faculty users
        User f1User = userRepository.save(User.builder()
                .email("faculty1@campus.edu").password(passwordEncoder.encode("faculty123"))
                .fullName("Prof. Amit Singh").role(Role.ROLE_FACULTY).build());

        User f2User = userRepository.save(User.builder()
                .email("faculty2@campus.edu").password(passwordEncoder.encode("faculty123"))
                .fullName("Prof. Sunita Patel").role(Role.ROLE_FACULTY).build());

        User f3User = userRepository.save(User.builder()
                .email("faculty3@campus.edu").password(passwordEncoder.encode("faculty123"))
                .fullName("Prof. Rajan Mehta").role(Role.ROLE_FACULTY).build());

        Faculty f1 = facultyRepository.save(Faculty.builder()
                .user(f1User).employeeNumber("EMP001").department(csDept)
                .designation("Associate Professor").qualification("Ph.D Computer Science").build());

        Faculty f2 = facultyRepository.save(Faculty.builder()
                .user(f2User).employeeNumber("EMP002").department(csDept)
                .designation("Assistant Professor").qualification("M.Tech").build());

        Faculty f3 = facultyRepository.save(Faculty.builder()
                .user(f3User).employeeNumber("EMP003").department(eceDept)
                .designation("Professor").qualification("Ph.D Electronics").build());

        // Students
        String[] names = {"Diya Bhakuni", "Brahmi Joshi", "Arjun Nair", "Deepika Reddy", "Rohan Mishra"};
        String[] rolls = {"CS2021001", "CS2021002", "CS2021003", "CS2021004", "CS2021005"};
        List<User> studentUsers = new java.util.ArrayList<>();
        List<Student> students = new java.util.ArrayList<>();

        for (int i = 0; i < 5; i++) {
            User su = userRepository.save(User.builder()
                    .email("student" + (i + 1) + "@campus.edu")
                    .password(passwordEncoder.encode("student123"))
                    .fullName(names[i])
                    .role(Role.ROLE_STUDENT)
                    .build());
            studentUsers.add(su);
            Student st = studentRepository.save(Student.builder()
                    .user(su).rollNumber(rolls[i]).department(csDept)
                    .program("B.Tech").semester(3)
                    .dateOfBirth(LocalDate.of(2002, 1 + i, 10 + i))
                    .build());
            students.add(st);
        }

        // Courses
        Course ds = courseRepository.save(Course.builder()
                .courseCode("CS301").courseName("Data Structures").credits(4)
                .semester(3).department(csDept).build());

        Course algo = courseRepository.save(Course.builder()
                .courseCode("CS302").courseName("Algorithms").credits(4)
                .semester(3).department(csDept).build());

        Course dbms = courseRepository.save(Course.builder()
                .courseCode("CS303").courseName("Database Management Systems").credits(3)
                .semester(3).department(csDept).build());

        Course cn = courseRepository.save(Course.builder()
                .courseCode("CS304").courseName("Computer Networks").credits(3)
                .semester(4).department(csDept).build());

        Course os = courseRepository.save(Course.builder()
                .courseCode("CS305").courseName("Operating Systems").credits(4)
                .semester(4).department(csDept).build());

        // Course assignments
        courseAssignmentRepository.save(CourseAssignment.builder().faculty(f1).course(ds).academicYear("2024-25").semester("3").build());
        courseAssignmentRepository.save(CourseAssignment.builder().faculty(f1).course(algo).academicYear("2024-25").semester("3").build());
        courseAssignmentRepository.save(CourseAssignment.builder().faculty(f2).course(dbms).academicYear("2024-25").semester("3").build());
        courseAssignmentRepository.save(CourseAssignment.builder().faculty(f2).course(cn).academicYear("2024-25").semester("4").build());
        courseAssignmentRepository.save(CourseAssignment.builder().faculty(f1).course(os).academicYear("2024-25").semester("4").build());

        // Enroll all students in 3 courses
        for (Student student : students) {
            enrollmentRepository.save(Enrollment.builder().student(student).course(ds).build());
            enrollmentRepository.save(Enrollment.builder().student(student).course(algo).build());
            enrollmentRepository.save(Enrollment.builder().student(student).course(dbms).build());
        }

        // Timetable
        String[] days = {"MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"};
        timetableRepository.save(Timetable.builder().course(ds).faculty(f1).dayOfWeek("MONDAY").startTime("09:00").endTime("10:00").academicYear("2024-25").semesterLabel("Semester 3").build());
        timetableRepository.save(Timetable.builder().course(algo).faculty(f1).dayOfWeek("TUESDAY").startTime("10:00").endTime("11:00").academicYear("2024-25").semesterLabel("Semester 3").build());
        timetableRepository.save(Timetable.builder().course(dbms).faculty(f2).dayOfWeek("WEDNESDAY").startTime("11:00").endTime("12:00").academicYear("2024-25").semesterLabel("Semester 3").build());
        timetableRepository.save(Timetable.builder().course(cn).faculty(f2).dayOfWeek("THURSDAY").startTime("09:00").endTime("10:00").academicYear("2024-25").semesterLabel("Semester 4").build());
        timetableRepository.save(Timetable.builder().course(os).faculty(f1).dayOfWeek("FRIDAY").startTime("10:00").endTime("11:00").academicYear("2024-25").semesterLabel("Semester 4").build());

        log.info("Database seeded successfully. Login: admin@campus.edu / admin123");
        log.info("Faculty: faculty1@campus.edu / faculty123");
        log.info("Student: student1@campus.edu / student123");
    }
}
