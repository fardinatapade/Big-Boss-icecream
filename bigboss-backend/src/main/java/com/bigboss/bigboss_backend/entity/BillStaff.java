package com.bigboss.bigboss_backend.entity;


import jakarta.persistence.*;


@Entity
@Table(name="bill_staff")
public class BillStaff {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


private String name;


private Double charge;



public Long getId(){
return id;
}


public String getName(){
return name;
}


public void setName(String name){
this.name=name;
}


public Double getCharge(){
return charge;
}


public void setCharge(Double charge){
this.charge=charge;
}

}