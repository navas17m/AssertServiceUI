import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { Router } from '@angular/router';

@Component({
    selector: 'workforcemanagementlist',
    templateUrl: './workforcemanagementlist.component.template.html',
})

export class WorkforceManagementList {
    public searchText: string = ""; 
    lstWorkforceManagement=[];    
    controllerName = "WorkforceManagement";  
       
    constructor(private apiService: APICallService, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
         
       this.BindBudgetApproval();
    }
    fnGo()
    {
        this._router.navigate(['/pages/systemadmin/workforcemanagement/0']);
    }
    fnDelete(id)
    {
        this.apiService.deleteAssert(this.controllerName, "DeleteWorkforceManagement",id).then(data => {this.Respone(data)});
        
    }
    fnEdit(id)
    {
        this._router.navigate(['/pages/systemadmin/workforcemanagement/'+ id]);
    }
    BindBudgetApproval() {
        this.apiService.get(this.controllerName, "GetWorkforceManagements", parseInt(Common.GetSession("UserId"))).then(data => { 
            this.lstWorkforceManagement = data;           
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
