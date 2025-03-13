import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { Router } from '@angular/router';

@Component({
    selector: 'riskmanagementandcontingencyplanlist',
    templateUrl: './riskmanagementandcontingencyplanlist.component.template.html',
})

export class RiskManagementandContingencyPlanList {
    public searchText: string = ""; 
    lstriskmanagementandcontingencyplan=[];    
    controllerName = "riskmanagementandcontingencyplan";  
       
    constructor(private apiService: APICallService, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
         
       this.BindBudgetApproval();
    }
    fnGo()
    {
        this._router.navigate(['/pages/systemadmin/riskmanagementandcontingencyplan/0']);
    }
    fnDelete(id)
    {
        this.apiService.deleteAssert(this.controllerName, "Deleteriskmanagementandcontingencyplan",id).then(data => {this.Respone(data)});
        
    }
    fnEdit(id)
    {
        this._router.navigate(['/pages/systemadmin/riskmanagementandcontingencyplan/'+ id]);
    }
    BindBudgetApproval() {
        this.apiService.get(this.controllerName, "Getriskmanagementandcontingencyplans", parseInt(Common.GetSession("UserId"))).then(data => { 
            this.lstriskmanagementandcontingencyplan = data;           
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
