package com.bits.campusmanagement.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate eventDate;
    private String venue;
    private String organizer;
    private String createdBy;
    private LocalDateTime createdAt;
    private boolean active;
}
