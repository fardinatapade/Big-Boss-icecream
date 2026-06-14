package com.bigboss.bigboss_backend.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bigboss.bigboss_backend.entity.Bill;
import com.bigboss.bigboss_backend.repository.BillRepository;



@Service
public class BillService {



@Autowired
private BillRepository repository;






public Bill save(Bill bill){


if(bill.getTotalAmount()==null){

bill.setTotalAmount(
bill.getGrandTotal()
);

}



if(bill.getPaidAmount()==null){

bill.setPaidAmount(0.0);

}



double remaining =
bill.getTotalAmount()
-
bill.getPaidAmount();



bill.setRemainingAmount(remaining);



if(remaining<=0){

bill.setPaymentStatus("Paid");

}
else{

bill.setPaymentStatus("Pending");

}



return repository.save(bill);

}







public List<Bill> getAll(){

return repository.findAll();

}







public Bill getById(Long id){

return repository.findById(id)
.orElseThrow();

}







public Bill update(Long id,Bill data){


Bill bill=getById(id);



bill.setPartyName(data.getPartyName());

bill.setMobile(data.getMobile());

bill.setVenue(data.getVenue());

bill.setPaidAmount(data.getPaidAmount());



bill.setRemainingAmount(

bill.getTotalAmount()
-
bill.getPaidAmount()

);



if(bill.getRemainingAmount()<=0){

bill.setPaymentStatus("Paid");

}
else{

bill.setPaymentStatus("Pending");

}


return repository.save(bill);

}


public void delete(Long id){

repository.deleteById(id);

}


}