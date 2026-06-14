package com.bigboss.bigboss_backend.repository;

import com.bigboss.bigboss_backend.entity.StaffCharge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffChargeRepository
        extends JpaRepository<StaffCharge, Long> {
}