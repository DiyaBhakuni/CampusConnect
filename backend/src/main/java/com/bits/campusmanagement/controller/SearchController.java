package com.bits.campusmanagement.controller;

import com.bits.campusmanagement.dto.*;
import com.bits.campusmanagement.model.User;
import com.bits.campusmanagement.repository.*;
import com.bits.campusmanagement.service.AdminServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SearchController {

    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CourseRepository courseRepository;
    private final NotificationRepository notificationRepository;
    private final AdminServiceImpl adminService;

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(@RequestParam String query,
                                                       @RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Map<String, Object> result = new HashMap<>();
        result.put("students", studentRepository.searchStudents(query, pageable).getContent()
                .stream().map(adminService::mapToStudentResponse).collect(Collectors.toList()));
        result.put("faculty", facultyRepository.searchFaculty(query, pageable).getContent()
                .stream().map(adminService::mapToFacultyResponse).collect(Collectors.toList()));
        result.put("courses", courseRepository.searchCourses(query, pageable).getContent()
                .stream().map(adminService::mapToCourseResponse).collect(Collectors.toList()));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getNotifications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(n ->
                        NotificationResponse.builder()
                                .id(n.getId()).title(n.getTitle()).message(n.getMessage())
                                .type(n.getType().name()).read(n.isRead()).createdAt(n.getCreatedAt()).build()
                ).collect(Collectors.toList())
        );
    }
}
