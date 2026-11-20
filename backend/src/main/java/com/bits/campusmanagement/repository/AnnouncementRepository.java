package com.bits.campusmanagement.repository;

import com.bits.campusmanagement.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    @Query("SELECT a FROM Announcement a WHERE a.active = true AND (a.audience = 'ALL' OR a.audience = 'STUDENTS') ORDER BY a.postedAt DESC")
    List<Announcement> findForStudents();

    @Query("SELECT a FROM Announcement a WHERE a.active = true AND (a.audience = 'ALL' OR a.audience = 'FACULTY') ORDER BY a.postedAt DESC")
    List<Announcement> findForFaculty();

    @Query("SELECT a FROM Announcement a WHERE a.active = true ORDER BY a.postedAt DESC")
    List<Announcement> findAllActive();
}
