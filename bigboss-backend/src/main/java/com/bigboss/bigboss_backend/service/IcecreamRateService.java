package com.bigboss.bigboss_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bigboss.bigboss_backend.entity.IcecreamRate;
import com.bigboss.bigboss_backend.repository.IcecreamRateRepository;

@Service
public class IcecreamRateService {

    @Autowired
    private IcecreamRateRepository repository;

    public List<IcecreamRate> getAllRates() {
        return repository.findAll();
    }

    public IcecreamRate addRate(IcecreamRate rate) {
        return repository.save(rate);
    }

    public IcecreamRate updateRate(
            Long id,
            IcecreamRate updated) {

        IcecreamRate rate =
                repository.findById(id).orElseThrow();

        rate.setFlavor(updated.getFlavor());
        rate.setRate(updated.getRate());

        return repository.save(rate);
    }

    public void deleteRate(Long id) {
        repository.deleteById(id);
    }
}