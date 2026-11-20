package com.bits.campusmanagement.repository;

import com.bits.campusmanagement.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByRollNumber(String rollNumber);
    boolean existsByRollNumber(String rollNumber);
    List<Student> findByDepartmentId(Long departmentId);
    List<Student> findByActiveTrue();

    @Query("SELECT s FROM Student s JOIN s.user u WHERE " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Student> searchStudents(@Param("query") String query, Pageable pageable);

    @Query("SELECT COUNT(s) FROM Student s WHERE s.department.id = :deptId AND s.active = true")
    Long countByDepartmentIdAndActiveTrue(@Param("deptId") Long deptId);
}
