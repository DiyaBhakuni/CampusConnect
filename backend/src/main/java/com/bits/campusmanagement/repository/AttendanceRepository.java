package com.bits.campusmanagement.repository;

import com.bits.campusmanagement.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByEnrollmentId(Long enrollmentId);
    Optional<Attendance> findByEnrollmentIdAndAttendanceDate(Long enrollmentId, LocalDate date);
    boolean existsByEnrollmentIdAndAttendanceDate(Long enrollmentId, LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.enrollment.student.id = :studentId ORDER BY a.attendanceDate DESC")
    List<Attendance> findByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT a FROM Attendance a WHERE a.enrollment.course.id = :courseId AND a.attendanceDate = :date")
    List<Attendance> findByCourseIdAndDate(@Param("courseId") Long courseId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.enrollment.id = :enrollmentId AND a.status = 'PRESENT'")
    Long countPresentByEnrollmentId(@Param("enrollmentId") Long enrollmentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.enrollment.id = :enrollmentId")
    Long countTotalByEnrollmentId(@Param("enrollmentId") Long enrollmentId);

    @Query("SELECT a FROM Attendance a JOIN FETCH a.enrollment e JOIN FETCH e.student s JOIN FETCH s.user " +
           "WHERE e.course.id = :courseId AND a.attendanceDate BETWEEN :start AND :end")
    List<Attendance> findByCourseIdAndDateRange(@Param("courseId") Long courseId,
                                                  @Param("start") LocalDate start,
                                                  @Param("end") LocalDate end);
}
