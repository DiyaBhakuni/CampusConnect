package com.bits.campusmanagement.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String roomNumber;

    private String building;
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private RoomType type = RoomType.CLASSROOM;

    public enum RoomType {
        CLASSROOM, LAB, AUDITORIUM, SEMINAR_HALL
    }
}
