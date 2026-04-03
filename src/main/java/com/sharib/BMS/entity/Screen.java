package com.sharib.BMS.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "screens")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Screen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false )
    private  String name;

    private Integer totalSeats;

    @ManyToOne
    @JoinColumn(name = "theatre_id" , nullable = false)
    private Theatre theatre;
}
