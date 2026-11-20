package com.bits.campusmanagement.repository;

import com.bits.campusmanagement.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByActiveTrueOrderByEventDateAsc();
    List<Event> findByEventDateGreaterThanEqualAndActiveTrueOrderByEventDateAsc(LocalDate date);
}
