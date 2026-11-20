package com.bits.campusmanagement.repository;

import com.bits.campusmanagement.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(Long studentId);
    List<Enrollment> findByCourseId(Long courseId);
    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    @Query("SELECT e FROM Enrollment e JOIN FETCH e.course c JOIN FETCH c.department WHERE e.student.id = :studentId AND e.active = true")
    List<Enrollment> findActiveEnrollmentsByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT e FROM Enrollment e JOIN FETCH e.student s JOIN FETCH s.user WHERE e.course.id = :courseId AND e.active = true")
    List<Enrollment> findActiveEnrollmentsByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId AND e.active = true")
    Long countActiveByCourseId(@Param("courseId") Long courseId);
}
