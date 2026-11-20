package com.bits.campusmanagement.repository;

import com.bits.campusmanagement.model.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    List<Timetable> findByFacultyId(Long facultyId);
    List<Timetable> findByCourseId(Long courseId);

    @Query("SELECT t FROM Timetable t JOIN FETCH t.course c JOIN FETCH c.department WHERE t.faculty.id = :facultyId ORDER BY t.dayOfWeek, t.startTime")
    List<Timetable> findByFacultyIdOrdered(@Param("facultyId") Long facultyId);

    @Query("SELECT t FROM Timetable t JOIN FETCH t.course c JOIN FETCH t.faculty f JOIN FETCH f.user " +
           "WHERE c.id IN (SELECT e.course.id FROM Enrollment e WHERE e.student.id = :studentId AND e.active = true) " +
           "ORDER BY t.dayOfWeek, t.startTime")
    List<Timetable> findByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT t FROM Timetable t JOIN FETCH t.course c WHERE t.dayOfWeek = :day AND " +
           "c.id IN (SELECT e.course.id FROM Enrollment e WHERE e.student.id = :studentId AND e.active = true)")
    List<Timetable> findTodayClassesForStudent(@Param("studentId") Long studentId, @Param("day") String day);

    @Query("SELECT t FROM Timetable t WHERE t.faculty.id = :facultyId AND t.dayOfWeek = :day")
    List<Timetable> findTodayClassesForFaculty(@Param("facultyId") Long facultyId, @Param("day") String day);
}
