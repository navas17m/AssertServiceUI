import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,AbstractControl, ValidationErrors  } from '@angular/forms';
import * as moment from 'moment';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CustomerDetailsDTO } from './DTO/customerdetailsdto';
import { ContactValidator } from '../validator/contact.validator';
import { valHooks } from 'jquery';

@Component({
    selector: 'CustomerDetails',
    templateUrl: './customerdetails.component.template.html',
})

export class CustomerDetailsComponent {

    _Form: FormGroup;
    objCustomerDetailsDTO: CustomerDetailsDTO = new CustomerDetailsDTO();
    submitted = false;
    AssignedChildList=[];
    isLoading: boolean = false;
    controllerName = "CustomerDetails";   
    custId:number=0;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
       
        this.LoadCustomer();
        this._Form = _formBuilder.group({
            CardNumber: ['', [Validators.required,
                Validators.minLength(16)                
            ]],
            ExpMonth: ['', [Validators.required, 
                Validators.minLength(2),               
                Validators.pattern('^(0?[0-9]|1[0-2])$'),
                ]],
            ExpYear: ['', [Validators.required,
                Validators.pattern('^(2[4-9]|[3-4][0-9]|5[0-5])$'),
                Validators.minLength(2)   
            ]],
            Cvc: ['', [Validators.required,Validators.minLength(3)]],
            EmailId: ['', [Validators.required,Validators.email]],
            BillingAddress: ['', Validators.required],
            
        });
       
        //parseInt(Common.GetSession("AgencyProfileId"))
    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;    
      }
      
    creditCardValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) {
          return null;
        }
    
        const regex = new RegExp('^[0-9]{16}$');
        if (!regex.test(value)) {
          return { invalidCreditCardNumber: true };
        }   
        
      }
      
    LoadCustomer() {        
        this.apiService.get(this.controllerName, "GetById").then(data => {
            if(data!=null)
            {
                this.objCustomerDetailsDTO = data; 
                this.custId=this.objCustomerDetailsDTO.CustomerDetailsId;
            }
        })
       
    }   

    

Submit(form) {
    this.submitted = true;      
    if (form.valid ) {
        this.isLoading = true;    
        this.objCustomerDetailsDTO.UpdatedUserId=parseInt(Common.GetSession("UserProfileId"));
        this.objCustomerDetailsDTO.CustomerDetailsId=this.custId;
        this.apiService.post(this.controllerName, "Save", this.objCustomerDetailsDTO).then(data => {
            this.Respone(data, "save")            
        });       
       
    }    
}

    private Respone(data, type) {
        this.submitted = false;
        this.isLoading = false;
        this.custId=data.AgencyProfileId;
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save")
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
          
        }
    }

}
