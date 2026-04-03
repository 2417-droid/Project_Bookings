package com.sharib.BMS.service;


import com.sharib.BMS.dto.LoginRequest;
import com.sharib.BMS.dto.UserRequest;
import com.sharib.BMS.entity.User;
import com.sharib.BMS.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    public User register(UserRequest userRequest){
        if(userRepository.existsByEmail(userRequest.getEmail())){
            throw new RuntimeException("Email already exists" + userRequest.getEmail());
        }
        User user=User.builder()
                .name(userRequest.getName())
                .email(userRequest.getEmail())
                .password(userRequest.getPassword())
                .PhoneNo(userRequest.getPhone())
                .build();
        return userRepository.save(user);
    }
    public User login(LoginRequest loginRequest){
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("email not found" + loginRequest.getEmail()));

        if(!user.getPassword().equals(loginRequest.getPassword())){
            throw new RuntimeException("Invalid password");
        }
        return user;
    }
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
    public User getUserById(Long id){
        return userRepository.findById(id)
                .orElseThrow(()->new RuntimeException("User not found with email: "+id));
    }
}
