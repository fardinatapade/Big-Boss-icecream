package com.bigboss.bigboss_backend.repository;

import com.bigboss.bigboss_backend.entity.CateringInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CateringRepository extends JpaRepository<CateringInfo, Long> {
}