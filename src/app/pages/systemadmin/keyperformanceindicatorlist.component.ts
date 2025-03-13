import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { Router } from '@angular/router';

@Component({
    selector: 'keyperformanceindicatorlist',
    templateUrl: './keyperformanceindicatorlist.component.template.html',
})

export class KeyPerformanceIndicatorList {
    public searchText: string = ""; 
    lstKeyPerformanceIndicator=[];    
    controllerName = "KeyPerformanceIndicator";  
       
    constructor(private apiService: APICallService, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
         
       this.BindBudgetApproval();
    }
    fnGo()
    {
        this._router.navigate(['/pages/systemadmin/keyperformanceindicator/0']);
    }
    fnDelete(id)
    {
        this.apiService.deleteAssert(this.controllerName, "DeleteKeyPerformanceIndicator",id).then(data => {this.Respone(data)});
        
    }
    fnEdit(id)
    {
        this._router.navigate(['/pages/systemadmin/keyperformanceindicator/'+ id]);
    }
    BindBudgetApproval() {
        this.apiService.get(this.controllerName, "GetKeyPerformanceIndicators", parseInt(Common.GetSession("UserId"))).then(data => { 
            this.lstKeyPerformanceIndicator = data;           
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
