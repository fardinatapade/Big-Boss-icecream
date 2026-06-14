package com.bigboss.bigboss_backend.controller;

import com.bigboss.bigboss_backend.entity.StaffCharge;
import com.bigboss.bigboss_backend.repository.StaffChargeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffChargeController {

    @Autowired
    private StaffChargeRepository repository;

    @GetMapping
    public List<StaffCharge> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public StaffCharge add(
            @RequestBody StaffCharge staff) {

        return repository.save(staff);
    }

    @PutMapping("/{id}")
    public StaffCharge update(
            @PathVariable Long id,
            @RequestBody StaffCharge staff) {

        StaffCharge existing =
                repository.findById(id)
                        .orElseThrow();

        existing.setName(
                staff.getName());

        existing.setCharge(
                staff.getCharge());

        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id) {

        repository.deleteById(id);
    }
}