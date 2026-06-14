package com.bigboss.bigboss_backend.entity;


import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;


@Entity
@Table(name="bills")
public class Bill {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


private String invoiceNo;


private LocalDate generatedOn;


private String venue;


private LocalDate eventDate;


private String partyName;


private String mobile;


private Double transportCharges;


private Double iceCreamTotal;


private Double totalStaffCharges;


private Double grandTotal;


private Double totalAmount;


private Double paidAmount=0.0;


private Double remainingAmount;


private String paymentStatus="Pending";



@OneToMany(cascade=CascadeType.ALL)
private List<BillItem> items;



@OneToMany(cascade=CascadeType.ALL)
private List<BillStaff> assignedStaff;



public Long getId(){
return id;
}


public String getInvoiceNo(){
return invoiceNo;
}

public void setInvoiceNo(String invoiceNo){
this.invoiceNo=invoiceNo;
}



public LocalDate getGeneratedOn(){
return generatedOn;
}

public void setGeneratedOn(LocalDate generatedOn){
this.generatedOn=generatedOn;
}



public String getVenue(){
return venue;
}

public void setVenue(String venue){
this.venue=venue;
}



public LocalDate getEventDate(){
return eventDate;
}

public void setEventDate(LocalDate eventDate){
this.eventDate=eventDate;
}



public String getPartyName(){
return partyName;
}

public void setPartyName(String partyName){
this.partyName=partyName;
}



public String getMobile(){
return mobile;
}

public void setMobile(String mobile){
this.mobile=mobile;
}



public Double getTransportCharges(){
return transportCharges;
}

public void setTransportCharges(Double transportCharges){
this.transportCharges=transportCharges;
}



public Double getIceCreamTotal(){
return iceCreamTotal;
}

public void setIceCreamTotal(Double iceCreamTotal){
this.iceCreamTotal=iceCreamTotal;
}



public Double getTotalStaffCharges(){
return totalStaffCharges;
}

public void setTotalStaffCharges(Double totalStaffCharges){
this.totalStaffCharges=totalStaffCharges;
}



public Double getGrandTotal(){
return grandTotal;
}

public void setGrandTotal(Double grandTotal){
this.grandTotal=grandTotal;
}



public Double getTotalAmount(){
return totalAmount;
}

public void setTotalAmount(Double totalAmount){
this.totalAmount=totalAmount;
}



public Double getPaidAmount(){
return paidAmount;
}

public void setPaidAmount(Double paidAmount){
this.paidAmount=paidAmount;
}



public Double getRemainingAmount(){
return remainingAmount;
}

public void setRemainingAmount(Double remainingAmount){
this.remainingAmount=remainingAmount;
}



public String getPaymentStatus(){
return paymentStatus;
}

public void setPaymentStatus(String paymentStatus){
this.paymentStatus=paymentStatus;
}



public List<BillItem> getItems(){
return items;
}

public void setItems(List<BillItem> items){
this.items=items;
}



public List<BillStaff> getAssignedStaff(){
return assignedStaff;
}

public void setAssignedStaff(List<BillStaff> assignedStaff){
this.assignedStaff=assignedStaff;
}


}