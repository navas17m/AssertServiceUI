import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { Router } from '@angular/router';

@Component({
    selector: 'complianceandregulatorylist',
    templateUrl: './complianceandregulatorylist.component.template.html',
})

export class ComplianceAndRegulatoryList {
    public searchText: string = ""; 
    lstComplianceAndRegulatory=[];    
    controllerName = "ComplianceAndRegulatory";  
       
    constructor(private apiService: APICallService, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
         
       this.BindBudgetApproval();
    }
    fnGo()
    {
        this._router.navigate(['/pages/systemadmin/complianceandregulatory/0']);
    }
    fnDelete(id)
    {
        this.apiService.deleteAssert(this.controllerName, "DeleteComplianceAndRegulatory",id).then(data => {this.Respone(data)});
        
    }
    fnEdit(id)
    {
        this._router.navigate(['/pages/systemadmin/complianceandregulatory/'+ id]);
    }
    BindBudgetApproval() {
        this.apiService.get(this.controllerName, "GetComplianceAndRegulatorys", parseInt(Common.GetSession("MunicipalId"))).then(data => { 
            this.lstComplianceAndRegulatory = data;           
         })
    } 
     private Respone(data) {      
            if (data == false) {
                this.pComponent.alertDanger(data.ErrorMessage)
            }
            else if (data == true) {            
                this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
                this.BindBudgetApproval();
               
            }
        }

}
