package com.bigboss.bigboss_backend.entity;


import jakarta.persistence.*;


@Entity
@Table(name="bill_items")
public class BillItem {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


private String flavor;


private String size;


private Integer quantity;


private Double rate;



public Long getId(){
return id;
}


public String getFlavor(){
return flavor;
}


public void setFlavor(String flavor){
this.flavor=flavor;
}


public String getSize(){
return size;
}


public void setSize(String size){
this.size=size;
}


public Integer getQuantity(){
return quantity;
}


public void setQuantity(Integer quantity){
this.quantity=quantity;
}


public Double getRate(){
return rate;
}


public void setRate(Double rate){
this.rate=rate;
}


}