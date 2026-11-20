package com.bits.campusmanagement.repository;

import com.bits.campusmanagement.model.Faculty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByUserId(Long userId);
    Optional<Faculty> findByEmployeeNumber(String employeeNumber);
    boolean existsByEmployeeNumber(String employeeNumber);
    List<Faculty> findByDepartmentId(Long departmentId);
    List<Faculty> findByActiveTrue();

    @Query("SELECT f FROM Faculty f JOIN f.user u WHERE " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(f.employeeNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Faculty> searchFaculty(@Param("query") String query, Pageable pageable);
}
