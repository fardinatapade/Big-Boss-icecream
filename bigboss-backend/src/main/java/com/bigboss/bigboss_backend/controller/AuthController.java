package com.bigboss.bigboss_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.bigboss.bigboss_backend.entity.Admin;
import com.bigboss.bigboss_backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/login")
    public Map<String,Object> login(
            @RequestBody Map<String,String> request){

        String email =
                request.get("email");

        String password =
                request.get("password");

        Admin admin =
                authService.login(
                        email,
                        password);

        Map<String,Object> response =
                new HashMap<>();

        if(admin != null){

            response.put("success", true);
            response.put("id", admin.getId());
            response.put("name", admin.getName());
            response.put("email", admin.getEmail());

        }else{

            response.put("success", false);
            response.put(
                    "message",
                    "Invalid Credentials");
        }

        return response;
    }

    
}