package com.sharib.BMS.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false )
    private String name ;

    @Column(nullable = false)
    private String password;

    @Column(name = "phone", nullable = false) // Use "phone" to match your SQL script
    private String PhoneNo;

    @Column(nullable = false , unique = true)
    private String email ;

    @Column(name = "created_at")
    private LocalDateTime createAt;

    @PrePersist
    protected  void Created(){
        this.createAt = LocalDateTime.now();
    }

}
