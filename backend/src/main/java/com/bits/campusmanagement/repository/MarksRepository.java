package com.bits.campusmanagement.repository;

import com.bits.campusmanagement.model.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MarksRepository extends JpaRepository<Marks, Long> {
    List<Marks> findByEnrollmentId(Long enrollmentId);
    Optional<Marks> findByEnrollmentIdAndExamType(Long enrollmentId, String examType);
    boolean existsByEnrollmentIdAndExamType(Long enrollmentId, String examType);

    @Query("SELECT m FROM Marks m WHERE m.enrollment.student.id = :studentId")
    List<Marks> findByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT m FROM Marks m JOIN FETCH m.enrollment e JOIN FETCH e.student s JOIN FETCH s.user " +
           "WHERE e.course.id = :courseId")
    List<Marks> findByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT AVG(m.marksObtained / m.maxMarks * 100) FROM Marks m WHERE m.enrollment.course.id = :courseId AND m.examType = :examType")
    Double avgPercentageByCourseAndExamType(@Param("courseId") Long courseId, @Param("examType") String examType);
}
