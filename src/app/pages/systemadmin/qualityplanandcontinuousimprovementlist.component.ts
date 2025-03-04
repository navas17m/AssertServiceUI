import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { Router } from '@angular/router';

@Component({
    selector: 'qualityplanandcontinuousimprovementlist',
    templateUrl: './qualityplanandcontinuousimprovementlist.component.template.html',
})

export class QualityPlanandContinuousImprovementList {
    public searchText: string = ""; 
    lstQualityPlanandContinuousImprovement=[];    
    controllerName = "qualityplanandcontinuousimprovement";  
       
    constructor(private apiService: APICallService, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
         
       this.BindBudgetApproval();
    }
    fnGo()
    {
        this._router.navigate(['/pages/systemadmin/qualityplanandcontinuousimprovement/0']);
    }
    fnDelete(id)
    {
        this.apiService.deleteAssert(this.controllerName, "Deletequalityplanandcontinuousimprovement",id).then(data => {this.Respone(data)});
        
    }
    fnEdit(id)
    {
        this._router.navigate(['/pages/systemadmin/qualityplanandcontinuousimprovement/'+ id]);
    }
    BindBudgetApproval() {
        this.apiService.get(this.controllerName, "Getqualityplanandcontinuousimprovements", parseInt(Common.GetSession("MunicipalId"))).then(data => { 
            this.lstQualityPlanandContinuousImprovement = data;           
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
