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
import { WorkforceManagementDTO } from './DTO/workforcemanagementdto';

@Component({
    selector: 'workforcemanagement',
    templateUrl: './workforcemanagement.component.template.html',
})

export class WorkforceManagementComponent {
    public returnVal:any[];
    _Form: FormGroup;    
    objWorkforceManagementDTO: WorkforceManagementDTO = new WorkforceManagementDTO();    
    submitted = false;   
    isLoading: boolean = false;
    controllerName = "WorkforceManagement";   
    lstStrategyLastMaintenance=[];
    lstAssetstatus=[];
    lstUtilizationrate=[];lstPriority=[];
    carerIds; lstWorkforceManagementActivityName=[];
    objQeryVal; type="save";
    constructor(private apiService: APICallService, private activatedroute: ActivatedRoute, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
        //this.objUserCarerMappingDTO.ExpiryDate = null;         
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });   
        this.apiService.get(this.controllerName, "GetWorkforceManagementActivities").then(data => { 
            this.lstWorkforceManagementActivityName = data;           
         })
        if (this.objQeryVal.id != 0 && this.objQeryVal.id != null) {
            this.type="update";
            this.apiService.get(this.controllerName, "GetWorkforceManagement",this.objQeryVal.id).then(data => {
                this.objWorkforceManagementDTO=data;   
                //console.log(this.objAssertRegisterDTO);                  
            });
        }
        else
        {
            this.objWorkforceManagementDTO.YesOrNo=true;            
        }        
        
        this._Form = _formBuilder.group({
            Activity: ['', Validators.required],
            Description:[],
            YesOrNo:[],
            BriefDescription:[],
            CitingReasons:[],
        });  
    }
    fnBack(){
        this._router.navigate(['/pages/systemadmin/workforcemanagementlist/0']);
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
                this.objWorkforceManagementDTO.IsActive=true;
                this.objWorkforceManagementDTO.UserId=parseInt(Common.GetSession("UserId"));
                this.objWorkforceManagementDTO.MunicipalId=parseInt(Common.GetSession("MunicipalId"));
                this.objWorkforceManagementDTO.SubMunicipalId=parseInt(Common.GetSession("SubMunicipalId"));
                this.apiService.post(this.controllerName, "AddWorkforceManagement", this.objWorkforceManagementDTO).then(data => {this.Respone("save")});
            }
            else
            {
                this.apiService.put(this.controllerName, "UpdateWorkforceManagement", this.objWorkforceManagementDTO).then(data => {this.Respone("save")});
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
