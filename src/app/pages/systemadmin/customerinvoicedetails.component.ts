import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CustomerPriceDetailsDTO } from './DTO/customerpricedetailsdto';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'CustomerInvoiceDetails',
    templateUrl: './customerinvoicedetails.component.template.html',
})

export class CustomerInvoiceDetails {
    apiURL = environment.api_url + "/api/GeneratePDF/";
    _Form: FormGroup;
    objCustomerPriceDetailsDTO: CustomerPriceDetailsDTO = new CustomerPriceDetailsDTO();
    submitted = false;   
    isLoading: boolean = false;    
    controllerName = "CustomerInvoiceDetails";  
  
    lstCustomerInvoiceDetailst = [];
    btnText="Add";
    columns =[
        {name:'Invoice Number',prop:'InvoiceNumber',sortable:false,width:'100'},
        {name:'Invoice Date',prop:'InvoiceDate',sortable:false,width:'150',date:'Y'},
        {name:'Amount(£)',prop:'Amount',sortable:false,width:'80'},
        {name:'Download',prop:'Download',sortable:false,width:'60'},
       ];
    constructor(private apiService: APICallService) {
       
        this.apiService.get(this.controllerName, "GetById").then(data => {           
            this.lstCustomerInvoiceDetailst = data;   
         });
    
    }    
   
    onButtonEvent(item){
        window.location.href = this.apiURL + "GenerateCustomerInvoicePDF/" + item.CustomerInvoiceDetailsId;
    }   

}
