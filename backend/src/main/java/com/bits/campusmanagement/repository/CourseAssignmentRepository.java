package com.bits.campusmanagement.repository;

import com.bits.campusmanagement.model.CourseAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseAssignmentRepository extends JpaRepository<CourseAssignment, Long> {
    List<CourseAssignment> findByFacultyId(Long facultyId);
    List<CourseAssignment> findByCourseId(Long courseId);
    Optional<CourseAssignment> findByFacultyIdAndCourseId(Long facultyId, Long courseId);
    boolean existsByFacultyIdAndCourseId(Long facultyId, Long courseId);

    @Query("SELECT ca FROM CourseAssignment ca JOIN FETCH ca.course c JOIN FETCH c.department WHERE ca.faculty.id = :facultyId")
    List<CourseAssignment> findByFacultyIdWithCourse(@Param("facultyId") Long facultyId);
}
