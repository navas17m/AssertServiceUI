import { Component,ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CustomerPriceDetailsDTO } from './DTO/customerpricedetailsdto';
import { Router } from '@angular/router';

@Component({
    selector: 'CustomerPriceDetailsList',
    templateUrl: './customerpricedetailslist.component.template.html',
})

export class CustomerPriceDetailsList {
    @ViewChild('btnAddExpense') infobtnAddExpense: ElementRef;
    @ViewChild('btnAddExpenseCancel') infobtnAddExpenseCancel: ElementRef;
    _Form: FormGroup;_FormLI: FormGroup;
    objCustomerPriceDetailsDTO: CustomerPriceDetailsDTO = new CustomerPriceDetailsDTO();
   
    submitted = false;
    AssignedChildList=[];
    isLoading: boolean = false;    
    controllerName = "CustomerPriceDetails";   
    lstAgencyProfile=[];
    
 
    columns =[
        {name:'Agency Name',prop:'AgencyName',sortable:false,width:'200'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
       ];
     
    constructor(private apiService: APICallService,  private _router: Router, private pComponent: PagesComponent) {
       
       this.Load();
        //parseInt(Common.GetSession("AgencyProfileId"))
    }
   
    Load() {    
        this.apiService.get(this.controllerName, "GetAllAgency").then(data => {           
                this.lstAgencyProfile = data;            
        })     
   
    }   
    fnAddData() {
        this._router.navigate(['/pages/systemadmin/customerpricedetails/0']);
    }
    onEdit(editData){      
        this._router.navigate(['/pages/systemadmin/customerpricedetails', editData.AgencyProfileId]);
    }

}
