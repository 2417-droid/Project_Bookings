package com.sharib.BMS.controller;


import com.sharib.BMS.dto.LoginRequest;
import com.sharib.BMS.dto.UserRequest;
import com.sharib.BMS.entity.User;
import com.sharib.BMS.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/api/users")
@RestController
public class UserController {
    private final UserService userService;
    @PostMapping("/register")
    private ResponseEntity<User> register(@RequestBody UserRequest request)
    {
        return  ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    private ResponseEntity<User> login(@RequestBody LoginRequest request)
    {
        return  ResponseEntity.ok(userService.login(request));
    }

    @GetMapping
    private ResponseEntity<List<User>> getAllUsers()
    {
        return  ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    private ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
}
