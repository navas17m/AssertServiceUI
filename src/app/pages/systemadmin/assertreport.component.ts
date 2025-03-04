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
    selector: 'assertreport',
    templateUrl: './assertreport.component.template.html',
})

export class AssertReport {
    public searchText: string = "";
    public returnVal:any[];
    _Form: FormGroup;
    arrayCarerList = [];
    objUserCarerMappingDTO: UserCarerMappingDTO = new UserCarerMappingDTO();
    lstUserList = [];
    submitted = false;
    AssignedCarerList = [];
    lstAssertRegister=[];
    isLoading: boolean = false;
    controllerName = "AssertRegister";
    lstMunicipal = [];
    MunicipalId:number;   lstKeyPerformanceIndicator=[]; 
    lstBudgetApproval=[];   lstBudgetPlan=[];    
    constructor(private apiService: APICallService, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
         
        this.apiService.get("Municipal", "GetMunicipal").then(data => {
            this.lstMunicipal = data;           
        })
       //this.BindAssert();
    }
    getReport()
    {
        this.LoadReport();
    }  
    LoadReport() {
        this.apiService.get(this.controllerName, "GetAssertRegisters",this.MunicipalId).then(data => {
             this.lstAssertRegister = data;           
         })
         this.apiService.get("budgetplan", "GetBudgetPlans", this.MunicipalId).then(data => { 
            this.lstBudgetPlan = data;           
         })
         this.apiService.get("budgetapproval", "GetBudgetApprovals", this.MunicipalId).then(data => { 
            this.lstBudgetApproval = data;           
         })
         this.apiService.get("KeyPerformanceIndicator", "GetKeyPerformanceIndicators",  this.MunicipalId).then(data => { 
            this.lstKeyPerformanceIndicator = data;           
         })
        //this.services.getAll().then(data => { this.lstUserList = data; })
    }    

}
