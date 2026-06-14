package com.bigboss.bigboss_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bigboss.bigboss_backend.entity.IcecreamRate;

public interface IcecreamRateRepository
        extends JpaRepository<IcecreamRate, Long> {
}