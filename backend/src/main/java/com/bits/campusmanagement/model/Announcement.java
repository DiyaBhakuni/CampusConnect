package com.bits.campusmanagement.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Audience audience = Audience.ALL;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by", nullable = false)
    @ToString.Exclude
    private User postedBy;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime postedAt = LocalDateTime.now();

    @Builder.Default
    private boolean active = true;

    public enum Audience {
        ALL, STUDENTS, FACULTY
    }
}
