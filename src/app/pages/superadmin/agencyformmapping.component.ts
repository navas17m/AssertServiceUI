
import { Component, Pipe } from '@angular/core';
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { AgencyFormMapping } from './DTO/agencyformmapping';
//.@Pipe({ name: 'filter' }) 
@Component({   
        selector: 'agencyformmapping',                
        templateUrl: './agencyformmapping.component.template.html',
})

export class AgencyFormMappingComponent {
    IsLoading = false;  
    agencyProfileList = null;
    AgencyFormMappingNModuleCnfg;
    agencyProfileId = 0;   
    lstAgencyFormMapping = [];
    AgencyFormMappingList;
    ModuleCnfgList;
    //Accordion
    isGroupOpen = false;
    testc = 'aa';
    controllerName = "AgencyFormMapping";

    constructor(private _router: Router, private apiService: APICallService, private pComponent: PagesComponent) {

        this.apiService.get("AgencyProfile","getall").then(data => this.agencyProfileList = data);
        //_agencyProfileService.getAgencyList().subscribe(data => this.agencyProfileList = data);
        if (Common.GetSession("AgencyProId") != null)
        {           
            this.loadAgencyFormMapping(Common.GetSession("AgencyProId"));
        }      
    }  
   
    loadAgencyFormMapping(value)
    {               
        this.agencyProfileId = value;
        this.apiService.get(this.controllerName, "GetAllByAgencyProfileId", this.agencyProfileId).then(data => { this.AgencyFormMappingNModuleCnfg = data; });             
        //this._agencyFormMappingService.GetAllByAgencyProfileId(value).subscribe(data => { this.AgencyFormMappingNModuleCnfg = data; });
    }
    
    agencyFormMappingSubmit(): void {
     //   console.log(this.AgencyFormMappingNModuleCnfg);

        if (this.AgencyFormMappingNModuleCnfg) {
            this.IsLoading = true;
            for (let insAFM of this.AgencyFormMappingNModuleCnfg.AgencyFormMappingList) {
                if (insAFM.IsActive != insAFM.OriginalIsActive) {
                    var _insAFM = new AgencyFormMapping();
                    _insAFM.AgencyFormMappingId = insAFM.AgencyFormMappingId;
                    _insAFM.AgencyProfileId = insAFM.AgencyProfileId == 0 ? this.agencyProfileId : insAFM.AgencyProfileId;
                    _insAFM.FormCnfg.FormCnfgId = insAFM.FormCnfg.FormCnfgId;
                    _insAFM.IsActive = insAFM.IsActive;
                    this.lstAgencyFormMapping.push(_insAFM);
                }
            }

            this.apiService.post(this.controllerName, "Save", this.lstAgencyFormMapping).then(data => this.Respone(data));
            //this._agencyFormMappingService.postAgencyFormMapping(this.lstAgencyFormMapping).then(data => this.Respone(data));      
        }
    }

    checkNuncheckAll = false;
    fncheckNuncheckAll(value,checked) {        
        this.checkNuncheckAll = !this.checkNuncheckAll;

        if (checked) {
            for (let insAFM of this.AgencyFormMappingNModuleCnfg.AgencyFormMappingList) {
                if (insAFM.FormCnfg.ModuleCnfg.ModuleCnfgId == value)
                    insAFM.IsActive = true;
            }
        }
        else {
            for (let insAFM of this.AgencyFormMappingNModuleCnfg.AgencyFormMappingList) {
                if (insAFM.FormCnfg.ModuleCnfg.ModuleCnfgId == value)
                    insAFM.IsActive = false;
            }
        }
    }

    private Respone(data) {
        this.IsLoading = false;
        if (data.IsError == true) {
            alert(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.pComponent.alertSuccess(Common.GetUpdateSuccessfullMsg);    
            this.lstAgencyFormMapping = [];
        }
    }   
}