package com.bits.campusmanagement.service;

import com.bits.campusmanagement.dto.*;
import com.bits.campusmanagement.model.*;
import com.bits.campusmanagement.repository.*;
import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final CourseAssignmentRepository courseAssignmentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;
    private final TimetableRepository timetableRepository;
    private final AnnouncementRepository announcementRepository;
    private final EventRepository eventRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public DashboardStats getDashboardStats() {
        long totalStudents = studentRepository.findByActiveTrue().size();
        long totalFaculty = facultyRepository.findByActiveTrue().size();
        long totalCourses = courseRepository.findByActiveTrue().size();
        long totalDepts = departmentRepository.count();

        List<Map<String, Object>> deptStats = departmentRepository.findAll().stream().map(d -> {
            Map<String, Object> m = new HashMap<>();
            m.put("name", d.getName());
            m.put("students", studentRepository.countByDepartmentIdAndActiveTrue(d.getId()));
            return m;
        }).collect(Collectors.toList());

        return DashboardStats.builder()
                .totalStudents(totalStudents)
                .totalFaculty(totalFaculty)
                .totalCourses(totalCourses)
                .totalDepartments(totalDepts)
                .departmentStats(deptStats)
                .build();
    }

    // ---- STUDENT CRUD ----

    @Override
    public StudentResponse createStudent(StudentRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new IllegalStateException("Email already in use: " + req.getEmail());
        if (studentRepository.existsByRollNumber(req.getRollNumber()))
            throw new IllegalStateException("Roll number already exists: " + req.getRollNumber());

        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Department not found"));

        User user = userRepository.save(User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .role(Role.ROLE_STUDENT)
                .build());

        Student student = studentRepository.save(Student.builder()
                .user(user)
                .rollNumber(req.getRollNumber())
                .department(dept)
                .program(req.getProgram())
                .semester(req.getSemester())
                .dateOfBirth(req.getDateOfBirth())
                .phone(req.getPhone())
                .address(req.getAddress())
                .gender(req.getGender())
                .build());

        return mapToStudentResponse(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream().map(this::mapToStudentResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> getStudentsPaged(Pageable pageable) {
        return studentRepository.findAll(pageable).map(this::mapToStudentResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        return mapToStudentResponse(findStudentOrThrow(id));
    }

    @Override
    public StudentResponse updateStudent(Long id, StudentRequest req) {
        Student student = findStudentOrThrow(id);
        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Department not found"));

        if (!student.getRollNumber().equals(req.getRollNumber()) && studentRepository.existsByRollNumber(req.getRollNumber()))
            throw new IllegalStateException("Roll number already exists");

        User user = student.getUser();
        user.setFullName(req.getFullName());
        if (req.getPassword() != null && !req.getPassword().isBlank())
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepository.save(user);

        student.setRollNumber(req.getRollNumber());
        student.setDepartment(dept);
        student.setProgram(req.getProgram());
        student.setSemester(req.getSemester());
        student.setDateOfBirth(req.getDateOfBirth());
        student.setPhone(req.getPhone());
        student.setAddress(req.getAddress());
        student.setGender(req.getGender());
        return mapToStudentResponse(studentRepository.save(student));
    }

    @Override
    public void deactivateStudent(Long id) {
        Student student = findStudentOrThrow(id);
        student.setActive(false);
        student.getUser().setActive(false);
        studentRepository.save(student);
        userRepository.save(student.getUser());
    }

    // ---- FACULTY CRUD ----

    @Override
    public FacultyResponse createFaculty(FacultyRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new IllegalStateException("Email already in use");
        if (facultyRepository.existsByEmployeeNumber(req.getEmployeeNumber()))
            throw new IllegalStateException("Employee number already exists");

        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Department not found"));

        User user = userRepository.save(User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .role(Role.ROLE_FACULTY)
                .build());

        Faculty faculty = facultyRepository.save(Faculty.builder()
                .user(user)
                .employeeNumber(req.getEmployeeNumber())
                .department(dept)
                .designation(req.getDesignation())
                .phone(req.getPhone())
                .qualification(req.getQualification())
                .specialization(req.getSpecialization())
                .build());

        return mapToFacultyResponse(faculty);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FacultyResponse> getAllFaculty() {
        return facultyRepository.findAll().stream().map(this::mapToFacultyResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FacultyResponse> getFacultyPaged(Pageable pageable) {
        return facultyRepository.findAll(pageable).map(this::mapToFacultyResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public FacultyResponse getFacultyById(Long id) {
        return mapToFacultyResponse(findFacultyOrThrow(id));
    }

    @Override
    public FacultyResponse updateFaculty(Long id, FacultyRequest req) {
        Faculty faculty = findFacultyOrThrow(id);
        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Department not found"));

        if (!faculty.getEmployeeNumber().equals(req.getEmployeeNumber()) && facultyRepository.existsByEmployeeNumber(req.getEmployeeNumber()))
            throw new IllegalStateException("Employee number already exists");

        User user = faculty.getUser();
        user.setFullName(req.getFullName());
        if (req.getPassword() != null && !req.getPassword().isBlank())
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepository.save(user);

        faculty.setEmployeeNumber(req.getEmployeeNumber());
        faculty.setDepartment(dept);
        faculty.setDesignation(req.getDesignation());
        faculty.setPhone(req.getPhone());
        faculty.setQualification(req.getQualification());
        faculty.setSpecialization(req.getSpecialization());
        return mapToFacultyResponse(facultyRepository.save(faculty));
    }

    @Override
    public void deactivateFaculty(Long id) {
        Faculty faculty = findFacultyOrThrow(id);
        timetableRepository.deleteAll(timetableRepository.findByFacultyId(faculty.getId()));
        User user = faculty.getUser();
        facultyRepository.delete(faculty);
        userRepository.delete(user);
    }

    // ---- DEPARTMENTS ----

    @Override
    public DepartmentResponse createDepartment(DepartmentRequest req) {
        if (departmentRepository.existsByCode(req.getCode()))
            throw new IllegalStateException("Department code already exists");
        if (departmentRepository.existsByName(req.getName()))
            throw new IllegalStateException("Department name already exists");

        Department dept = departmentRepository.save(Department.builder()
                .name(req.getName()).code(req.getCode())
                .hodName(req.getHodName()).description(req.getDescription())
                .build());
        return mapToDeptResponse(dept);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream().map(this::mapToDeptResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentById(Long id) {
        return mapToDeptResponse(findDeptOrThrow(id));
    }

    @Override
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest req) {
        Department dept = findDeptOrThrow(id);
        dept.setName(req.getName());
        dept.setCode(req.getCode());
        dept.setHodName(req.getHodName());
        dept.setDescription(req.getDescription());
        return mapToDeptResponse(departmentRepository.save(dept));
    }

    @Override
    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }

    // ---- COURSES ----

    @Override
    public CourseResponse createCourse(CourseRequest req) {
        if (courseRepository.existsByCourseCode(req.getCourseCode()))
            throw new IllegalStateException("Course code already exists");

        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Department not found"));

        Course course = courseRepository.save(Course.builder()
                .courseCode(req.getCourseCode()).courseName(req.getCourseName())
                .description(req.getDescription()).credits(req.getCredits())
                .semester(req.getSemester()).department(dept).build());
        return mapToCourseResponse(course);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream().map(this::mapToCourseResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CourseResponse getCourseById(Long id) {
        return mapToCourseResponse(findCourseOrThrow(id));
    }

    @Override
    public CourseResponse updateCourse(Long id, CourseRequest req) {
        Course course = findCourseOrThrow(id);
        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Department not found"));
        course.setCourseCode(req.getCourseCode());
        course.setCourseName(req.getCourseName());
        course.setDescription(req.getDescription());
        course.setCredits(req.getCredits());
        course.setSemester(req.getSemester());
        course.setDepartment(dept);
        return mapToCourseResponse(courseRepository.save(course));
    }

    @Override
    public void deactivateCourse(Long id) {
        Course course = findCourseOrThrow(id);
        course.setActive(false);
        courseRepository.save(course);
    }

    // ---- ASSIGNMENTS ----

    @Override
    public void assignFacultyToCourse(CourseAssignmentRequest req) {
        if (courseAssignmentRepository.existsByFacultyIdAndCourseId(req.getFacultyId(), req.getCourseId()))
            throw new IllegalStateException("Faculty already assigned to this course");

        Faculty faculty = findFacultyOrThrow(req.getFacultyId());
        Course course = findCourseOrThrow(req.getCourseId());

        courseAssignmentRepository.save(CourseAssignment.builder()
                .faculty(faculty).course(course)
                .academicYear(req.getAcademicYear()).semester(req.getSemester())
                .build());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getCoursesByFaculty(Long facultyId) {
        return courseAssignmentRepository.findByFacultyId(facultyId).stream()
                .map(ca -> mapToCourseResponse(ca.getCourse())).collect(Collectors.toList());
    }

    // ---- ENROLLMENTS ----

    @Override
    public EnrollmentResponse enrollStudent(EnrollmentRequest req) {
        if (enrollmentRepository.existsByStudentIdAndCourseId(req.getStudentId(), req.getCourseId()))
            throw new IllegalStateException("Student already enrolled in this course");

        Student student = findStudentOrThrow(req.getStudentId());
        Course course = findCourseOrThrow(req.getCourseId());

        Enrollment enrollment = enrollmentRepository.save(Enrollment.builder()
                .student(student).course(course).build());
        return mapToEnrollmentResponse(enrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getAllEnrollments() {
        return enrollmentRepository.findAll().stream().map(this::mapToEnrollmentResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findActiveEnrollmentsByCourseId(courseId).stream()
                .map(this::mapToEnrollmentResponse).collect(Collectors.toList());
    }

    // ---- TIMETABLE ----

    @Override
    public TimetableResponse createTimetableEntry(TimetableRequest req) {
        Course course = findCourseOrThrow(req.getCourseId());
        Faculty faculty = req.getFacultyId() != null ? findFacultyOrThrow(req.getFacultyId()) : null;

        Timetable tt = timetableRepository.save(Timetable.builder()
                .course(course).faculty(faculty)
                .dayOfWeek(req.getDayOfWeek()).startTime(req.getStartTime()).endTime(req.getEndTime())
                .academicYear(req.getAcademicYear()).semesterLabel(req.getSemesterLabel())
                .build());
        return mapToTimetableResponse(tt);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableResponse> getAllTimetableEntries() {
        return timetableRepository.findAll().stream().map(this::mapToTimetableResponse).collect(Collectors.toList());
    }

    @Override
    public TimetableResponse updateTimetableEntry(Long id, TimetableRequest req) {
        Timetable tt = timetableRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Timetable entry not found"));
        tt.setCourse(findCourseOrThrow(req.getCourseId()));
        tt.setFaculty(req.getFacultyId() != null ? findFacultyOrThrow(req.getFacultyId()) : null);
        tt.setDayOfWeek(req.getDayOfWeek());
        tt.setStartTime(req.getStartTime());
        tt.setEndTime(req.getEndTime());
        tt.setAcademicYear(req.getAcademicYear());
        tt.setSemesterLabel(req.getSemesterLabel());
        return mapToTimetableResponse(timetableRepository.save(tt));
    }

    @Override
    public void deleteTimetableEntry(Long id) {
        timetableRepository.deleteById(id);
    }

    // ---- ANNOUNCEMENTS ----

    @Override
    public AnnouncementResponse createAnnouncement(AnnouncementRequest req, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("User not found"));
        Announcement ann = announcementRepository.save(Announcement.builder()
                .title(req.getTitle()).content(req.getContent())
                .audience(Announcement.Audience.valueOf(req.getAudience()))
                .postedBy(user).build());
        return mapToAnnouncementResponse(ann);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAllAnnouncements() {
        return announcementRepository.findAllActive().stream().map(this::mapToAnnouncementResponse).collect(Collectors.toList());
    }

    @Override
    public AnnouncementResponse updateAnnouncement(Long id, AnnouncementRequest req) {
        Announcement ann = announcementRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Announcement not found"));
        ann.setTitle(req.getTitle());
        ann.setContent(req.getContent());
        ann.setAudience(Announcement.Audience.valueOf(req.getAudience()));
        return mapToAnnouncementResponse(announcementRepository.save(ann));
    }

    @Override
    public void deleteAnnouncement(Long id) {
        Announcement ann = announcementRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Announcement not found"));
        ann.setActive(false);
        announcementRepository.save(ann);
    }

    // ---- EVENTS ----

    @Override
    public EventResponse createEvent(EventRequest req, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("User not found"));
        Event event = eventRepository.save(Event.builder()
                .title(req.getTitle()).description(req.getDescription())
                .eventDate(req.getEventDate()).venue(req.getVenue())
                .organizer(req.getOrganizer()).createdBy(user).build());
        return mapToEventResponse(event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        return eventRepository.findByActiveTrueOrderByEventDateAsc().stream()
                .map(this::mapToEventResponse).collect(Collectors.toList());
    }

    @Override
    public EventResponse updateEvent(Long id, EventRequest req) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Event not found"));
        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setEventDate(req.getEventDate());
        event.setVenue(req.getVenue());
        event.setOrganizer(req.getOrganizer());
        return mapToEventResponse(eventRepository.save(event));
    }

    @Override
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Event not found"));
        event.setActive(false);
        eventRepository.save(event);
    }

    // ---- CSV ----

    @Override
    public List<StudentResponse> importStudents(MultipartFile file) {
        List<StudentResponse> imported = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] headers = reader.readNext();
            String[] line;
            while ((line = reader.readNext()) != null) {
                try {
                    StudentRequest req = new StudentRequest();
                    req.setFullName(line[0]);
                    req.setEmail(line[1]);
                    req.setPassword(line[2]);
                    req.setRollNumber(line[3]);
                    req.setDepartmentId(Long.parseLong(line[4]));
                    req.setProgram(line.length > 5 ? line[5] : null);
                    req.setSemester(line.length > 6 && !line[6].isBlank() ? Integer.parseInt(line[6]) : null);
                    req.setPhone(line.length > 7 ? line[7] : null);
                    imported.add(createStudent(req));
                } catch (Exception e) {
                    // skip invalid rows
                }
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to parse CSV: " + e.getMessage());
        }
        return imported;
    }

    @Override
    public List<FacultyResponse> importFaculty(MultipartFile file) {
        List<FacultyResponse> imported = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            reader.readNext();
            String[] line;
            while ((line = reader.readNext()) != null) {
                try {
                    FacultyRequest req = new FacultyRequest();
                    req.setFullName(line[0]);
                    req.setEmail(line[1]);
                    req.setPassword(line[2]);
                    req.setEmployeeNumber(line[3]);
                    req.setDepartmentId(Long.parseLong(line[4]));
                    req.setDesignation(line.length > 5 ? line[5] : null);
                    imported.add(createFaculty(req));
                } catch (Exception e) {
                    // skip invalid rows
                }
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to parse CSV: " + e.getMessage());
        }
        return imported;
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportStudentsCsv() {
        StringWriter sw = new StringWriter();
        try (CSVWriter writer = new CSVWriter(sw)) {
            writer.writeNext(new String[]{"Full Name", "Email", "Roll Number", "Department", "Program", "Semester", "Phone", "Active"});
            studentRepository.findAll().forEach(s -> writer.writeNext(new String[]{
                    s.getUser().getFullName(), s.getUser().getEmail(), s.getRollNumber(),
                    s.getDepartment() != null ? s.getDepartment().getName() : "",
                    s.getProgram() != null ? s.getProgram() : "",
                    s.getSemester() != null ? s.getSemester().toString() : "",
                    s.getPhone() != null ? s.getPhone() : "",
                    String.valueOf(s.isActive())
            }));
        } catch (IOException e) {
            throw new RuntimeException("Export failed");
        }
        return sw.toString().getBytes();
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportFacultyCsv() {
        StringWriter sw = new StringWriter();
        try (CSVWriter writer = new CSVWriter(sw)) {
            writer.writeNext(new String[]{"Full Name", "Email", "Employee Number", "Department", "Designation", "Active"});
            facultyRepository.findAll().forEach(f -> writer.writeNext(new String[]{
                    f.getUser().getFullName(), f.getUser().getEmail(), f.getEmployeeNumber(),
                    f.getDepartment() != null ? f.getDepartment().getName() : "",
                    f.getDesignation() != null ? f.getDesignation() : "",
                    String.valueOf(f.isActive())
            }));
        } catch (IOException e) {
            throw new RuntimeException("Export failed");
        }
        return sw.toString().getBytes();
    }

    // ---- REPORTS ----

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummary> getAttendanceReport() {
        return enrollmentRepository.findAll().stream().map(e -> {
            long total = attendanceRepository.countTotalByEnrollmentId(e.getId());
            long present = attendanceRepository.countPresentByEnrollmentId(e.getId());
            double pct = total == 0 ? 0.0 : (present * 100.0 / total);
            return AttendanceSummary.builder()
                    .courseId(e.getCourse().getId())
                    .courseCode(e.getCourse().getCourseCode())
                    .courseName(e.getCourse().getCourseName())
                    .totalClasses(total)
                    .presentCount(present)
                    .percentage(pct)
                    .belowThreshold(pct < 75.0)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getEnrollmentReport() {
        return getAllEnrollments();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAnalyticsReport() {
        return getAllDepartments();
    }

    // ---- HELPERS ----

    private Student findStudentOrThrow(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Student not found: " + id));
    }

    private Faculty findFacultyOrThrow(Long id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Faculty not found: " + id));
    }

    private Department findDeptOrThrow(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Department not found: " + id));
    }

    private Course findCourseOrThrow(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Course not found: " + id));
    }

    public StudentResponse mapToStudentResponse(Student s) {
        return StudentResponse.builder()
                .id(s.getId())
                .userId(s.getUser().getId())
                .email(s.getUser().getEmail())
                .fullName(s.getUser().getFullName())
                .rollNumber(s.getRollNumber())
                .departmentId(s.getDepartment() != null ? s.getDepartment().getId() : null)
                .departmentName(s.getDepartment() != null ? s.getDepartment().getName() : null)
                .program(s.getProgram())
                .semester(s.getSemester())
                .dateOfBirth(s.getDateOfBirth())
                .phone(s.getPhone())
                .address(s.getAddress())
                .gender(s.getGender())
                .active(s.isActive())
                .build();
    }

    public FacultyResponse mapToFacultyResponse(Faculty f) {
        return FacultyResponse.builder()
                .id(f.getId())
                .userId(f.getUser().getId())
                .email(f.getUser().getEmail())
                .fullName(f.getUser().getFullName())
                .employeeNumber(f.getEmployeeNumber())
                .departmentId(f.getDepartment() != null ? f.getDepartment().getId() : null)
                .departmentName(f.getDepartment() != null ? f.getDepartment().getName() : null)
                .designation(f.getDesignation())
                .phone(f.getPhone())
                .qualification(f.getQualification())
                .specialization(f.getSpecialization())
                .active(f.isActive())
                .build();
    }

    private DepartmentResponse mapToDeptResponse(Department d) {
        long studentCount = studentRepository.countByDepartmentIdAndActiveTrue(d.getId());
        long courseCount = courseRepository.findByDepartmentId(d.getId()).stream().filter(Course::isActive).count();
        long facultyCount = facultyRepository.findByDepartmentId(d.getId()).stream().filter(Faculty::isActive).count();
        return DepartmentResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .code(d.getCode())
                .hodName(d.getHodName())
                .description(d.getDescription())
                .studentCount(studentCount)
                .courseCount(courseCount)
                .facultyCount(facultyCount)
                .build();
    }

    public CourseResponse mapToCourseResponse(Course c) {
        long count = enrollmentRepository.countActiveByCourseId(c.getId());
        return CourseResponse.builder()
                .id(c.getId())
                .courseCode(c.getCourseCode())
                .courseName(c.getCourseName())
                .description(c.getDescription())
                .credits(c.getCredits())
                .semester(c.getSemester())
                .departmentId(c.getDepartment() != null ? c.getDepartment().getId() : null)
                .departmentName(c.getDepartment() != null ? c.getDepartment().getName() : null)
                .active(c.isActive())
                .enrollmentCount(count)
                .build();
    }

    private EnrollmentResponse mapToEnrollmentResponse(Enrollment e) {
        return EnrollmentResponse.builder()
                .id(e.getId())
                .studentId(e.getStudent().getId())
                .studentName(e.getStudent().getUser().getFullName())
                .rollNumber(e.getStudent().getRollNumber())
                .courseId(e.getCourse().getId())
                .courseCode(e.getCourse().getCourseCode())
                .courseName(e.getCourse().getCourseName())
                .enrolledAt(e.getEnrolledAt())
                .active(e.isActive())
                .build();
    }

    public TimetableResponse mapToTimetableResponse(Timetable tt) {
        return TimetableResponse.builder()
                .id(tt.getId())
                .courseId(tt.getCourse().getId())
                .courseCode(tt.getCourse().getCourseCode())
                .courseName(tt.getCourse().getCourseName())
                .facultyId(tt.getFaculty() != null ? tt.getFaculty().getId() : null)
                .facultyName(tt.getFaculty() != null ? tt.getFaculty().getUser().getFullName() : null)
                .roomId(tt.getRoom() != null ? tt.getRoom().getId() : null)
                .roomNumber(tt.getRoom() != null ? tt.getRoom().getRoomNumber() : null)
                .dayOfWeek(tt.getDayOfWeek())
                .startTime(tt.getStartTime())
                .endTime(tt.getEndTime())
                .academicYear(tt.getAcademicYear())
                .semesterLabel(tt.getSemesterLabel())
                .build();
    }

    private AnnouncementResponse mapToAnnouncementResponse(Announcement a) {
        return AnnouncementResponse.builder()
                .id(a.getId())
                .title(a.getTitle())
                .content(a.getContent())
                .audience(a.getAudience().name())
                .postedBy(a.getPostedBy().getFullName())
                .postedAt(a.getPostedAt())
                .active(a.isActive())
                .build();
    }

    private EventResponse mapToEventResponse(Event e) {
        return EventResponse.builder()
                .id(e.getId())
                .title(e.getTitle())
                .description(e.getDescription())
                .eventDate(e.getEventDate())
                .venue(e.getVenue())
                .organizer(e.getOrganizer())
                .createdBy(e.getCreatedBy().getFullName())
                .createdAt(e.getCreatedAt())
                .active(e.isActive())
                .build();
    }
}
