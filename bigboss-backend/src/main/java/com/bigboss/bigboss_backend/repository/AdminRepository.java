package com.bigboss.bigboss_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bigboss.bigboss_backend.entity.Admin;

public interface AdminRepository
        extends JpaRepository<Admin, Integer> {

    Optional<Admin> findByEmail(String email);
}