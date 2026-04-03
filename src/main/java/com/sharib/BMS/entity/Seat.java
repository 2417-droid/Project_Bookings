package com.sharib.BMS.entity;

import com.sharib.BMS.enums.SeatType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "seats")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false )
    private String SeatNumber;

    @Column(name = "seat_row")
    private String row;   //A K L

    @Column(name = "seat_col")
    private Integer col; //1,2,3,

    @Enumerated(EnumType.STRING)
    private SeatType seatType;  //REGULAR

    @ManyToOne
    @JoinColumn(name="screen_id",nullable = false)
    private Screen screen;
}
