import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { Router } from '@angular/router';

@Component({
    selector: 'budgetplan',
    templateUrl: './budgetplanlist.component.template.html',
})

export class BudgetPlanList {
    public searchText: string = ""; 
    lstBudgetPlan=[];    
    controllerName = "BudgetPlan";  
       
    constructor(private apiService: APICallService, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
         
       this.BindBudgetPlan();
    }
    fnGo()
    {
        this._router.navigate(['/pages/systemadmin/budgetplan/0']);
    }
    fnDelete(id)
    {
        this.apiService.deleteAssert(this.controllerName, "DeleteBudgetPlan",id).then(data => {this.Respone(data)});
        
    }
    fnEdit(id)
    {
        this._router.navigate(['/pages/systemadmin/budgetplan/'+ id]);
    }
    BindBudgetPlan() {
        this.apiService.get(this.controllerName, "GetBudgetPlans", parseInt(Common.GetSession("UserId"))).then(data => { 
            this.lstBudgetPlan = data;           
         })
    } 
     private Respone(data) {      
            if (data == false) {
                this.pComponent.alertDanger(data.ErrorMessage)
            }
            else if (data == true) {            
                this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
                this.BindBudgetPlan();
               
            }
        }

}
