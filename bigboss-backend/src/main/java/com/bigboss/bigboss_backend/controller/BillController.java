package com.bigboss.bigboss_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.bigboss.bigboss_backend.entity.Bill;
import com.bigboss.bigboss_backend.service.BillService;


@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins="*")
public class BillController {



@Autowired
private BillService service;






@GetMapping
public List<Bill> getAll(){

return service.getAll();

}







@GetMapping("/{id}")
public Bill getOne(
@PathVariable Long id
){

return service.getById(id);

}







@PostMapping
public Bill create(
@RequestBody Bill bill
){

return service.save(bill);

}


@PutMapping("/{id}")
public Bill update(
@PathVariable Long id,
@RequestBody Bill bill
){

return service.update(id,bill);

}



@DeleteMapping("/{id}")
public String delete(
@PathVariable Long id
){

service.delete(id);

return "Bill Deleted";

}


}