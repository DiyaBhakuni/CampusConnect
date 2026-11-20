package com.bits.campusmanagement.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AnnouncementResponse {
    private Long id;
    private String title;
    private String content;
    private String audience;
    private String postedBy;
    private LocalDateTime postedAt;
    private boolean active;
}
