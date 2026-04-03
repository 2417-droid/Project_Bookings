package com.sharib.BMS.repository;

import com.sharib.BMS.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User , Long> {
    // function name is the language of JPA
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
