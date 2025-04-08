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
import { KeyPerformanceIndicatorDTO } from './DTO/keyperformanceindicatordto';


@Component({
    selector: 'keyperformanceindicator',
    templateUrl: './keyperformanceindicator.component.template.html',
})

export class KeyPerformanceIndicatorComponent {
    public returnVal:any[];
    _Form: FormGroup;    
    objKeyPerformanceIndicatorDTO: KeyPerformanceIndicatorDTO = new KeyPerformanceIndicatorDTO();    
    submitted = false;   
    isLoading: boolean = false;
    controllerName = "KeyPerformanceIndicator";   
    lstStrategyLastMaintenance=[];
    lstKeyPerformanceIndicatorCategory=[];    
    carerIds; lstKeyPerformanceIndicatorName=[];
    objQeryVal; type="save";
    constructor(private apiService: APICallService, private activatedroute: ActivatedRoute, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
        //this.objUserCarerMappingDTO.ExpiryDate = null;  
        this.apiService.get(this.controllerName, "GetKeyPerformanceIndicatorCategorys").then(data => {
            this.lstKeyPerformanceIndicatorCategory=data;   
            //console.log(this.objAssertRegisterDTO);                  
        });       
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });   
        if (this.objQeryVal.id != 0 && this.objQeryVal.id != null) {
            this.type="update";
            this.apiService.get(this.controllerName, "GetKeyPerformanceIndicator",this.objQeryVal.id).then(data => {
                this.objKeyPerformanceIndicatorDTO=data;   
                console.log(this.objKeyPerformanceIndicatorDTO);                  
            });
        }          
        
        this._Form = _formBuilder.group({
            KeyPerformanceIndicatorCategory: ['', Validators.required],
            KeyPerformanceIndicatorName:['',Validators.required],
            Description:[''],
            
        });  
    }
    fnLoadKeyPerformanceIndicatorName(id)
    {
        this.apiService.get(this.controllerName, "GetKeyPerformanceIndicatorNames",id).then(data => { this.lstKeyPerformanceIndicatorName = data; })
    }
    fnBack(){
        this._router.navigate(['/pages/systemadmin/keyperformanceindicatorlist/0']);
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
                this.objKeyPerformanceIndicatorDTO.IsActive=true;
                this.objKeyPerformanceIndicatorDTO.UserId=parseInt(Common.GetSession("UserId"));
                this.objKeyPerformanceIndicatorDTO.MunicipalId=parseInt(Common.GetSession("MunicipalId"));
                this.objKeyPerformanceIndicatorDTO.SubMunicipalId=parseInt(Common.GetSession("SubMunicipalId"));
                
                this.apiService.post(this.controllerName, "AddKeyPerformanceIndicator", this.objKeyPerformanceIndicatorDTO).then(data => {this.Respone("save")});
            }
            else
            {
                this.apiService.put(this.controllerName, "UpdateKeyPerformanceIndicator", this.objKeyPerformanceIndicatorDTO).then(data => {this.Respone("save")});
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
