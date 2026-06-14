package com.bigboss.bigboss_backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bigboss.bigboss_backend.entity.Bill;


public interface BillRepository 
extends JpaRepository<Bill,Long>{

}