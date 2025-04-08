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
import { RiskManagementandContingencyPlanDTO } from './DTO/riskmanagementandcontingencyplandto';

@Component({
    selector: 'riskmanagementandcontingencyplan',
    templateUrl: './riskmanagementandcontingencyplan.component.template.html',
})

export class RiskManagementandContingencyPlanComponent {
    public returnVal:any[];
    _Form: FormGroup;    
    objRiskManagementandContingencyPlanDTO: RiskManagementandContingencyPlanDTO = new RiskManagementandContingencyPlanDTO();    
    submitted = false;   
    isLoading: boolean = false;
    controllerName = "RiskManagementandContingencyPlan";   
    lstYesPartiallyNo=[
        {
          "YesPartiallyNoId": 1,
          "YesPartiallyNo": "نعم"
        },
        {
          "YesPartiallyNoId": 2,
          "YesPartiallyNo": "جزئيا"
        },
        {
          "YesPartiallyNoId": 3,
          "YesPartiallyNo": "لا"
        }
      ];
    lstAssetstatus=[];
    lstUtilizationrate=[];lstPriority=[];
    carerIds; 
    objQeryVal; type="save";
    constructor(private apiService: APICallService, private activatedroute: ActivatedRoute, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
        //this.objUserCarerMappingDTO.ExpiryDate = null;         
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });   
        if (this.objQeryVal.id != 0 && this.objQeryVal.id != null) {
            this.type="update";
            this.apiService.get(this.controllerName, "GetRiskManagementandContingencyPlan",this.objQeryVal.id).then(data => {
                this.objRiskManagementandContingencyPlanDTO=data;   
                //console.log(this.objAssertRegisterDTO);                  
            });
        }       
             
        
        this._Form = _formBuilder.group({
            Requirement: ['', Validators.required],
            Description:[],
            YesPartiallyNo:[],
            Reasons:[],
           
        });  
    }
    selectedFile!: File;
    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
      }
      Save() {
        if (this.selectedFile) {
          this.apiService.uploadFile(this.selectedFile).subscribe(response => {
            if(this.type=="save")
                {       
                    this.objRiskManagementandContingencyPlanDTO.UploadId=response;
                    this.objRiskManagementandContingencyPlanDTO.IsActive=true;
                    this.objRiskManagementandContingencyPlanDTO.UserId=parseInt(Common.GetSession("UserId"));
                    this.objRiskManagementandContingencyPlanDTO.MunicipalId=parseInt(Common.GetSession("MunicipalId"));
                    this.objRiskManagementandContingencyPlanDTO.SubMunicipalId=parseInt(Common.GetSession("SubMunicipalId"));
                    this.apiService.post(this.controllerName, "AddRiskManagementandContingencyPlan", this.objRiskManagementandContingencyPlanDTO).then(data => {this.Respone("save")});
                }
                else
                {
                    this.objRiskManagementandContingencyPlanDTO.UploadId=response;
                    this.apiService.put(this.controllerName, "UpdateRiskManagementandContingencyPlan", this.objRiskManagementandContingencyPlanDTO).then(data => {this.Respone("save")});
                }                       
          }, error => {
                        
          });
        } 
        else
        {
            if(this.type=="save")
                {       
                    this.objRiskManagementandContingencyPlanDTO.UploadId=0;
                    this.objRiskManagementandContingencyPlanDTO.IsActive=true;
                    this.objRiskManagementandContingencyPlanDTO.UserId=parseInt(Common.GetSession("UserId"));
                    this.objRiskManagementandContingencyPlanDTO.MunicipalId=parseInt(Common.GetSession("MunicipalId"));
                    this.objRiskManagementandContingencyPlanDTO.SubMunicipalId=parseInt(Common.GetSession("SubMunicipalId"));
                    this.apiService.post(this.controllerName, "AddRiskManagementandContingencyPlan", this.objRiskManagementandContingencyPlanDTO).then(data => {this.Respone("save")});
                }
                else
                {
                    this.objRiskManagementandContingencyPlanDTO.UploadId=0;
                    this.apiService.put(this.controllerName, "UpdateRiskManagementandContingencyPlan", this.objRiskManagementandContingencyPlanDTO).then(data => {this.Respone("save")});
                }        
        }           
      }
    fnBack(){
        this._router.navigate(['/pages/systemadmin/riskmanagementandcontingencyplanlist/0']);
    }     
    IsShowError = false;
    Id :number;
    Submit(form) {
        this.submitted = true;
        // if (form.valid && carerlist.length == 0)
        //     this.IsShowError = true;
       
        if (form.valid ) {
           // console.log(this.objAssertRegisterDTO);
            this.isLoading = true;      
            this.Save(); 
           
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
