package com.bits.campusmanagement.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class EventRequest {
    @NotBlank
    private String title;

    private String description;

    @NotNull
    private LocalDate eventDate;

    private String venue;
    private String organizer;
}
