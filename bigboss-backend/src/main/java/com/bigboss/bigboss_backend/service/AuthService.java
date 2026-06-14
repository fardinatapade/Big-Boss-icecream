package com.bigboss.bigboss_backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bigboss.bigboss_backend.entity.Admin;
import com.bigboss.bigboss_backend.repository.AdminRepository;

@Service
public class AuthService {

    @Autowired
    private AdminRepository adminRepository;

    public Admin login(
            String email,
            String password) {

        Optional<Admin> admin =
                adminRepository.findByEmail(email);

        if(admin.isPresent()) {

            if(admin.get()
                    .getPassword()
                    .equals(password)) {

                return admin.get();
            }
        }

        return null;
    }
}