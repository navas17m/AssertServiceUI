import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { AgencyKeyNameValueCnfgDTO } from './DTO/agencykeynamecnfgdto';

@Component({
    selector: 'AgencyKeyNameCnfg',
    templateUrl: './agencykeynamecnfg.component.template.html',
})

export class AgencyKeyNameCnfgComponet {
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    isVisibleMandatortMsg;
    submitted = false;
    _Form: FormGroup;
    isLoading: boolean = false;
    insKeyNamelist;
    controllerName = "AgencyKeyNameCnfg";

    objApplicationConfigNotesDTO=new ApplicationConfigNotesDTO();
    insAgencyId;
    lstAgencyProfile=[];
    lstAgencyKeyValue=[];
    lstFormtoDaylog=[];
    lstApplicationConfigNotes=[];
    insApplicationConfigurationDTO=new ApplicationConfigurationDTO();
    constructor(private apiService: APICallService, private activatedroute: ActivatedRoute, _formBuilder: FormBuilder,
        private _router: Router, private pcomponent: PagesComponent) {

        this._Form = _formBuilder.group({
            AppliedPage: ['', Validators.required],
            AppliedValue: ['',Validators.required],
        });

        this.apiService.get("AgencyProfile", "GetAll").then(data =>{ 
            this.lstAgencyProfile = data
        });

        this.insAgencyId=this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId;
        this.fnChangeAgencyName(this.insAgencyId);
        
    }

    submittedNote=false;
    fnNotesSubmit(form)
    {
      if(form.valid)
      {
        if(this.isUpdate)
        {
            let temp=this.lstApplicationConfigNotes[this.insIndex];
            if(temp)
            {
                temp.AppliedPage=this.objApplicationConfigNotesDTO.AppliedPage;
                temp.AppliedValue=this.objApplicationConfigNotesDTO.AppliedValue;
                temp.StatusId=1;
            }

        }
        else
        {
            this.submittedNote=true;
            this.objApplicationConfigNotesDTO.StatusId=1;
            this.objApplicationConfigNotesDTO.IsActive=true;
            this.lstApplicationConfigNotes.push(this.objApplicationConfigNotesDTO);
        }
        this.insIndex=0;
        this.isUpdate=false;
        this.objApplicationConfigNotesDTO=new ApplicationConfigNotesDTO();
        this.submittedNote=false;
      }
      else
      {
        this.submittedNote=true;
      }

    }

    fnNotesCancel()
    {  
        this.insIndex=0;
        this.isUpdate=false;
        this.objApplicationConfigNotesDTO=new ApplicationConfigNotesDTO();
    }

    isUpdate=false;
    insIndex=0;
    fnEditNote(item,indexVal)
    {
        this.insIndex=indexVal;
        this.isUpdate=true;
        this.objApplicationConfigNotesDTO.AppliedPage=item.AppliedPage;
        this.objApplicationConfigNotesDTO.AppliedValue=item.AppliedValue;
        this.objApplicationConfigNotesDTO.ApplicationConfigNotesId=item.ApplicationConfigNotesId;
    }

    fnDeleteNote(item)
    {
        item.StatusId=1;
        item.IsActive=false;

    }

    fnChangeAgencyName(id) {
        this.lstAgencyKeyValue=[];
        this.lstFormtoDaylog=[];
        if (id != null && id != '') {
           this.insAgencyId=id;
            this.apiService.get(this.controllerName, "GetApplicationConfiguration", id).then(data =>
            {
                this.lstAgencyKeyValue = data.AgencyKeyNameValueCnfg;
                this.lstFormtoDaylog=data.FormToDaylogEntryCnfg;
                this.lstApplicationConfigNotes=data.ApplicationConfigNotes;
                //console.log(this.lstApplicationConfigNotes);
            });
        }
    }

    fncheckNuncheckFormAll(Id, value) {
        if (value) {
            for (let item of this.lstAgencyKeyValue) {
                if (item.AgencyKeyNameCnfgId == Id)
                    item.IsApproved = true;
            }
        }
        else {
            for (let item of this.lstAgencyKeyValue) {
                if (item.AgencyKeyNameCnfgId == Id)
                   item.IsApproved = false;
            }
        }

    }

    fnSubmit() {
        this.submitted = true;
        this.isLoading = true;
        this.insApplicationConfigurationDTO.AgencyKeyNameValueCnfg=this.lstAgencyKeyValue;
        this.insApplicationConfigurationDTO.FormToDaylogEntryCnfg=this.lstFormtoDaylog;
        this.insApplicationConfigurationDTO.ApplicationConfigNotes=this.lstApplicationConfigNotes;
        this.apiService.post(this.controllerName, "SaveAll", this.insApplicationConfigurationDTO).then(data => this.Respone(data));    
    }

    private Respone(formConfig) {
        this.isLoading = false;
        if (formConfig.IsError == true) {
            this.pcomponent.alertDanger(formConfig.ErrorMessage)
        }
        else {
            if (this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameValueCnfgId == 0 || this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameValueCnfgId == null)
                this.pcomponent.alertSuccess(Common.GetSaveSuccessfullMsg);
            else
                this.pcomponent.alertSuccess(Common.GetUpdateSuccessfullMsg);

            this.fnChangeAgencyName(this.insAgencyId);
           // this.objAgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
            this.submitted = false;
        }
    }


}

export class ApplicationConfigurationDTO{
    AgencyKeyNameValueCnfg=[];
    FormToDaylogEntryCnfg=[];
    ApplicationConfigNotes=[];
}

export class ApplicationConfigNotesDTO
{
    ApplicationConfigNotesId:number;
    AppliedPage:string;
    AppliedValue:string;
    StatusId=0;
    IsActive:boolean;

}