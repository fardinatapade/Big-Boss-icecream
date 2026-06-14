package com.bigboss.bigboss_backend.controller;

import com.bigboss.bigboss_backend.entity.CateringInfo;
import com.bigboss.bigboss_backend.repository.CateringRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catering")
@CrossOrigin(origins = "*")
public class CateringController {

    @Autowired
    private CateringRepository cateringRepository;

    @GetMapping
    public List<CateringInfo> getAllCatering() {
        return cateringRepository.findAll();
    }

    @PostMapping
    public CateringInfo addCatering(@RequestBody CateringInfo cateringInfo) {
        return cateringRepository.save(cateringInfo);
    }

    @PutMapping("/{id}")
    public CateringInfo updateCatering(
            @PathVariable Long id,
            @RequestBody CateringInfo updatedData) {

        CateringInfo catering = cateringRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catering not found"));

        catering.setCatering(updatedData.getCatering());
        catering.setOwner(updatedData.getOwner());
        catering.setContact(updatedData.getContact());

        return cateringRepository.save(catering);
    }

    @DeleteMapping("/{id}")
    public String deleteCatering(@PathVariable Long id) {
        cateringRepository.deleteById(id);
        return "Deleted Successfully";
    }
}