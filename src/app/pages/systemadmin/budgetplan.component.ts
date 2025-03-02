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
import { BudgetPlanDTO } from './DTO/budgetplandto';

@Component({
    selector: 'budgetplan',
    templateUrl: './budgetplan.component.template.html',
})

export class BudgetPlanComponent {
    public returnVal:any[];
    _Form: FormGroup;    
    objBudgetPlanDTO: BudgetPlanDTO = new BudgetPlanDTO();    
    submitted = false;   
    isLoading: boolean = false;
    controllerName = "BudgetPlan";   
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
            this.apiService.get(this.controllerName, "GetBudgetPlan",this.objQeryVal.id).then(data => {
                this.objBudgetPlanDTO=data;   
                //console.log(this.objAssertRegisterDTO);                  
            });
        }
        else
        {
            this.objBudgetPlanDTO.ReviewGistoricalData=true;
        }
        
        this._Form = _formBuilder.group({
            MaintenanceManagementStyle: ['', Validators.required],
            MaintenanceStrategy: [],
            HRCosts:[],
            MaterialCosts:[],
            EquipmentCosts:[],
            AdministrativeCosts:[],
            OperationalCosts:[],
            AllocationEmergencyEudget:[],
            EstimationOfMaintenance:[],    
            ReviewGistoricalData:[]        
        });  
    }
    fnBack(){
        this._router.navigate(['/pages/systemadmin/budgetplanlist/0']);
    }  
    typeChange()
    {}
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
                this.objBudgetPlanDTO.IsActive=true;
                this.objBudgetPlanDTO.UserId=parseInt(Common.GetSession("UserId"));
                this.objBudgetPlanDTO.MunicipalId=parseInt(Common.GetSession("MunicipalId"));
                this.apiService.post(this.controllerName, "AddBudgetPlan", this.objBudgetPlanDTO).then(data => {this.Respone("save")});
            }
            else
            {
                this.apiService.put(this.controllerName, "UpdateBudgetPlan", this.objBudgetPlanDTO).then(data => {this.Respone("save")});
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
