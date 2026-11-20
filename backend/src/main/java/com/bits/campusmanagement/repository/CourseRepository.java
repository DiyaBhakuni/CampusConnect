package com.bits.campusmanagement.repository;

import com.bits.campusmanagement.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseCode(String courseCode);
    boolean existsByCourseCode(String courseCode);
    List<Course> findByDepartmentId(Long departmentId);
    List<Course> findByActiveTrue();

    @Query("SELECT c FROM Course c WHERE " +
           "LOWER(c.courseName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.courseCode) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Course> searchCourses(@Param("query") String query, Pageable pageable);
}
