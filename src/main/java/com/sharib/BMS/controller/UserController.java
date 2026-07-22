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
    public ResponseEntity<User> register(@RequestBody UserRequest request)
    {
        return  ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request)
    {
        return  ResponseEntity.ok(userService.login(request));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers()
    {
        return  ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
}
