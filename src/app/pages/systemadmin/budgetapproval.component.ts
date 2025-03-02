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
import { Router,ActivatedRoute } from '@angular/router';
import { AssertRegister } from './DTO/assertregisterdto';
import { BudgetApprovalDTO } from './DTO/budgetapprovaldto';

@Component({
    selector: 'budgetapproval',
    templateUrl: './budgetapproval.component.template.html',
})

export class BudgetApprovalComponent {
    public returnVal:any[];
    _Form: FormGroup;    
    objBudgetApprovalDTO: BudgetApprovalDTO = new BudgetApprovalDTO();    
    submitted = false;   
    isLoading: boolean = false;
    controllerName = "BudgetApproval";   
    lstStrategyLastMaintenance=[];
    lstAssetstatus=[];
    lstUtilizationrate=[];lstPriority=[];
    carerIds; 
    objQeryVal; type="save";
    constructor(private apiService: APICallService, private activatedroute: ActivatedRoute, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
        //this.objUserCarerMappingDTO.ExpiryDate = null;         
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });   
        if (this.objQeryVal.id != 0 && this.objQeryVal.id != null) {
            this.type="update";
            this.apiService.get(this.controllerName, "GetBudgetApproval",this.objQeryVal.id).then(data => {
                this.objBudgetApprovalDTO=data;   
                //console.log(this.objAssertRegisterDTO);                  
            });
        }
        else
        {
            this.objBudgetApprovalDTO.BudgetApprovals=true;
            this.objBudgetApprovalDTO.EmergencyModifications=true;
            this.objBudgetApprovalDTO.BudgetDisparityAction=true;
        }        
        
        this._Form = _formBuilder.group({
            BudgetApprovals: [],
            BudgetApprovalReason:[],
            MonitoringBudgetImplementation:[],
            PeriodicReports:[],
            EmergencyModifications:[],
            EmergencyModificationReason:[],
            BudgetDisparity:[],
            BudgetDisparityAction:[],    
            BudgetDisparityDescription:[]        
        });  
    }
    fnBack(){
        this._router.navigate(['/pages/systemadmin/budgetapprovallist/0']);
    }     
    IsShowError = false;
    Submit(form) {
        this.submitted = true;
        // if (form.valid && carerlist.length == 0)
        //     this.IsShowError = true;
       
        if (form.valid ) {
           // console.log(this.objAssertRegisterDTO);
            this.isLoading = true;      
          
            if(this.type=="save")
            {           
                this.objBudgetApprovalDTO.IsActive=true;
                this.objBudgetApprovalDTO.UserId=parseInt(Common.GetSession("UserId"));
                this.objBudgetApprovalDTO.MunicipalId=parseInt(Common.GetSession("MunicipalId"));
                this.apiService.post(this.controllerName, "AddBudgetApproval", this.objBudgetApprovalDTO).then(data => {this.Respone("save")});
            }
            else
            {
                this.apiService.put(this.controllerName, "UpdateBudgetApproval", this.objBudgetApprovalDTO).then(data => {this.Respone("save")});
            }
            //this.services.post(this.objUserCarerMappingDTO, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(type) {
        this.submitted = false;
        this.isLoading = false;
        this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
        this.fnBack();       
    }
   
}
