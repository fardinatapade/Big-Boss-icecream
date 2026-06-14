package com.bigboss.bigboss_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.bigboss.bigboss_backend.entity.IcecreamRate;
import com.bigboss.bigboss_backend.service.IcecreamRateService;

@RestController
@RequestMapping("/api/rates")
@CrossOrigin(origins = "*")
public class IcecreamRateController {

    @Autowired
    private IcecreamRateService service;

    @GetMapping
    public List<IcecreamRate> getAll() {
        return service.getAllRates();
    }

    @PostMapping
    public IcecreamRate add(
            @RequestBody IcecreamRate rate) {

        return service.addRate(rate);
    }

    @PutMapping("/{id}")
    public IcecreamRate update(
            @PathVariable Long id,
            @RequestBody IcecreamRate rate) {

        return service.updateRate(id, rate);
    }

    @DeleteMapping("/{id}")
    public String delete(
            @PathVariable Long id) {

        service.deleteRate(id);

        return "Deleted Successfully";
    }
}