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
import { QualityPlanandContinuousImprovementDTO } from './DTO/qualityplanandcontinuousimprovementdto';

@Component({
    selector: 'qualityplanandcontinuousimprovement',
    templateUrl: './qualityplanandcontinuousimprovement.component.template.html',
})

export class QualityPlanandContinuousImprovementComponent {
    public returnVal:any[];
    _Form: FormGroup;    
    objQualityPlanandDTO: QualityPlanandContinuousImprovementDTO = new QualityPlanandContinuousImprovementDTO();    
    submitted = false;   
    isLoading: boolean = false;
    controllerName = "QualityPlanandContinuousImprovement";   
    lstYesPartiallyNo=[
        {
          "YesPartiallyNoId": 1,
          "YesPartiallyNo": "Yes"
        },
        {
          "YesPartiallyNoId": 2,
          "YesPartiallyNo": "Partially"
        },
        {
          "YesPartiallyNoId": 3,
          "YesPartiallyNo": "No"
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
            this.apiService.get(this.controllerName, "GetQualityPlanandContinuousImprovement",this.objQeryVal.id).then(data => {
                this.objQualityPlanandDTO=data;   
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
                    this.objQualityPlanandDTO.UploadId=response;
                    this.objQualityPlanandDTO.IsActive=true;
                    this.objQualityPlanandDTO.UserId=parseInt(Common.GetSession("UserId"));
                    this.objQualityPlanandDTO.MunicipalId=parseInt(Common.GetSession("MunicipalId"));
                    this.apiService.post(this.controllerName, "AddQualityPlanandContinuousImprovement", this.objQualityPlanandDTO).then(data => {this.Respone("save")});
                }
                else
                {
                    this.objQualityPlanandDTO.UploadId=response;
                    this.apiService.put(this.controllerName, "UpdateQualityPlanandContinuousImprovementn", this.objQualityPlanandDTO).then(data => {this.Respone("save")});
                }                       
          }, error => {
                        
          });
        } 
        else
        {
            if(this.type=="save")
                {       
                    this.objQualityPlanandDTO.UploadId=0;
                    this.objQualityPlanandDTO.IsActive=true;
                    this.objQualityPlanandDTO.UserId=parseInt(Common.GetSession("UserId"));
                    this.objQualityPlanandDTO.MunicipalId=parseInt(Common.GetSession("MunicipalId"));
                    this.apiService.post(this.controllerName, "AddQualityPlanandContinuousImprovement", this.objQualityPlanandDTO).then(data => {this.Respone("save")});
                }
                else
                {
                    this.objQualityPlanandDTO.UploadId=0;
                    this.apiService.put(this.controllerName, "UpdateQualityPlanandContinuousImprovement", this.objQualityPlanandDTO).then(data => {this.Respone("save")});
                }        
        }           
      }
    fnBack(){
        this._router.navigate(['/pages/systemadmin/qualityplanandcontinuousimprovementlist/0']);
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
