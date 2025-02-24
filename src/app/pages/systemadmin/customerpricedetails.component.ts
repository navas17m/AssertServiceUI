import { Component,ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CustomerPriceDetailsDTO } from './DTO/customerpricedetailsdto';
import { CustomerPriceLineItemDTO } from './DTO/customerpricedetailsdto';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
    selector: 'CustomerPriceDetails',
    templateUrl: './customerpricedetails.component.template.html',
})

export class CustomerPriceDetails {
    @ViewChild('btnAddExpense') infobtnAddExpense: ElementRef;
    @ViewChild('btnAddExpenseCancel') infobtnAddExpenseCancel: ElementRef;
    _FormLI: FormGroup;
    objCustomerPriceDetailsDTO: CustomerPriceDetailsDTO = new CustomerPriceDetailsDTO();
    objCustomerLIDTO: CustomerPriceLineItemDTO = new CustomerPriceLineItemDTO();
    submitted = false;
    AssignedChildList=[];
    isLoading: boolean = false;    
    controllerName = "CustomerPriceDetails";   
    lstAgencyProfile=[];
    customerPriceDetailsList = [];submittedform = false; lstCusLI=[];
    agencyId:number;customerLIList=[];
    btnText="Submit";CustomerPriceLineItemId:number=0;
    isSaveLI = true;
    objQeryVal;agencyName;
       
    constructor(private apiService: APICallService,private _router: Router, 
        private activatedroute: ActivatedRoute, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
        this.activatedroute.params.subscribe(data => this.objQeryVal = data);
       // this.LoadCustomer();
       this.agencyId =parseInt(this.objQeryVal.id);  
       this._FormLI = _formBuilder.group({
        Description: ['', Validators.required],
        Quantity: ['', Validators.required],
        UnitPrice: ['', Validators.required],           
        });
        this.apiService.get(this.controllerName, "GetAllAgency").then(data => {    
            //this.lstAgencyProfile=data;       
            data.forEach(element => {
                if(element.AgencyProfileId==this.agencyId)
                {
                    this.agencyName=element.AgencyName;                   
                }
            });            
    })
    //alert(this.agencyId);
        if (this.agencyId > 0) {
            this.apiService.get(this.controllerName, "GetById", this.agencyId).then(data => { 
                if(data!=null)
                {                  
                    this.objCustomerPriceDetailsDTO=data;
                    this.lstCusLI=data.CustomerPriceLineItems;
                    // let arrLength = this.lstCusLI.length - 1;
                    // if (arrLength > -1)
                    // {
                    //     this.lstCusLI = this.lstCusLI[arrLength];
                    //     this.CustomerPriceLineItemId = this.objCustomerLIDTO.CustomerPriceLineItemId + 1;
                    // }
                }
            });
        }      
    }    
    onEdit(Id){
        this.isSaveLI=false;
        this.lstCusLI.forEach(item => {
            if (item.CustomerPriceLineItemId == Id)
                this.objCustomerLIDTO = item;
        });

        let event = new MouseEvent('click', { bubbles: true });
        this.submittedform = false;
        this.infobtnAddExpense.nativeElement.dispatchEvent(event);
    }
    fnDelete(Id)
    {
        this.lstCusLI.forEach(item => {
            if (item.CustomerPriceLineItemId == Id)
                item.IsActive = false;
        });
       
    }
    fnAddLineItem(form)
    {
        this.submittedform = true;
        if (form.valid) {     
            if(this.isSaveLI)
            {
                this.objCustomerLIDTO.IsActive=true;       
                this.objCustomerLIDTO.CustomerPriceLineItemId= ++this.CustomerPriceLineItemId;
                this.lstCusLI.push(this.objCustomerLIDTO);         
            }
            let event = new MouseEvent('click', { bubbles: true });
            this.infobtnAddExpenseCancel.nativeElement.dispatchEvent(event);
        }
        
    }
    fnShowLI()
    {
        this.isSaveLI=true;
        this.submitted = true;       
            this.objCustomerLIDTO = new CustomerPriceLineItemDTO();
            let event = new MouseEvent('click', { bubbles: true });
            this.submittedform = false;
            this.infobtnAddExpense.nativeElement.dispatchEvent(event);
    }
    
    Submit() {
        this.submitted = true;      
            if(this.lstCusLI.length > 0) {         
                this.isLoading = true;   
                this.objCustomerPriceDetailsDTO.AgencyProfileId=this.agencyId;
                this.objCustomerPriceDetailsDTO.CustomerPriceLineItems=this.lstCusLI;
                this.objCustomerPriceDetailsDTO.UpdatedUserId=parseInt(Common.GetSession("UserProfileId"));
                this.apiService.post(this.controllerName, "Save", this.objCustomerPriceDetailsDTO).then(data => {
                    this.Respone(data, "save")
                });     
            }    
            else {
                this.pComponent.alertWarning("Please add atleast one line item..");
            }
    }
    private Respone(filedConfig, type) {       
        this.submitted = false;
        this.isLoading = false;
        this.btnText="Submit";
        if (filedConfig.IsError == true) {
            this.pComponent.alertDanger(filedConfig.ErrorMessage)
        }
        else if (filedConfig.IsError == false) {
            if (type == "save")
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
            this._router.navigate(['/pages/systemadmin/customerpricedetailslist/1']);
        }
    }

}
