import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserCarerMappingDTO } from './DTO/usercarermappingdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
    selector: 'budgetapprovallist',
    templateUrl: './budgetapprovallist.component.template.html',
})

export class BudgetApprovalList {
    public searchText: string = ""; 
    lstBudgetApproval=[];    
    controllerName = "budgetapproval";  
       
    constructor(private apiService: APICallService, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
         
       this.BindBudgetApproval();
    }
    fnGo()
    {
        this._router.navigate(['/pages/systemadmin/budgetapproval/0']);
    }
    fnDelete(id)
    {
        this.apiService.deleteAssert(this.controllerName, "DeleteBudgetApproval",id).then(data => {this.Respone(data)});
        
    }
    fnEdit(id)
    {
        this._router.navigate(['/pages/systemadmin/budgetapproval/'+ id]);
    }
    BindBudgetApproval() {
        this.apiService.get(this.controllerName, "GetBudgetApprovals", parseInt(Common.GetSession("MunicipalId"))).then(data => { 
            this.lstBudgetApproval = data;           
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
