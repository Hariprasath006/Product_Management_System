package com.example.Product.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Product.model.User;
import com.example.Product.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    public User register(User user) {

        user.setPassword(encoder.encode(user.getPassword())); // 🔒 Encrypt
        return userRepository.save(user);
    }
}
