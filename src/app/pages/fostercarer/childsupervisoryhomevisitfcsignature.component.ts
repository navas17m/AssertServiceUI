import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import {Common}  from  '../common'
import { ChildSupervisoryHomeVisitDTO } from './DTO/childsupervisoryhomevisitdto';
import { Router, ActivatedRoute } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

declare var window: any;
declare var $: any;

@Component({
    selector: 'ChildSupervisoryHomeVisitFCSignature',
    templateUrl: './childsupervisoryhomevisitfcsignature.component.html',
})

export class ChildSHVFCSignatureComponents {
    objChildSupervisoryHomeVisitDTO: ChildSupervisoryHomeVisitDTO = new ChildSupervisoryHomeVisitDTO();
    submitted = false;
    _Form: FormGroup;
    rtnList = [];
    objQeryVal;UserTypeId;
    childListVisible = true; CarerParentId;
    childIds = [];
    btnSaveText = "Save";
    arrayCarerList = [];
    carerMultiSelectValues = [];
    dynamicformcontrol = [];
    lstCarerSecA = [];
    arrayChildList = []; carerName;
    dropdownvisible = true;
    ChildID: number;
    AgencyProfileId: number;
    CarerParentIdsLst: any = [];
    //Autofocus
    ChildDetailTabActive = "active";
    ChildYPTabActive = "";
    FosterHomeTabActive = "";
    HealthTabActive = "";
    EducationTabActive = "";
    ContactTabActive = "";
    DocumentActive;
     //Tab Visibele
     ChildYPVisible = true;
     FosterVisible = true;
     HealthVisible = true;
     EducationVisible = true;
     ContactVisible = true;
    //Progress bar
    isLoading: boolean = false;
    SequenceNo;
    controllerName = "ChildSupervisoryHomeVisit";
    carerSHVSqno;
    //Signature
    lstAgencySignatureCnfg=[];
    AgencySignatureHidden=false;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private _router: Router, private modal: PagesComponent,
        private renderer: Renderer2) {

       

        //Bind Signature
         this.apiService.get("AgencySignatureCnfg", "GetMappedSignature", 100).then(data => {this.lstAgencySignatureCnfg=data});
       // this.inssignatureValue = "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gVJAzCiJPECAAAECBAgQIECAAAECBAh0EhAzOm3DLAQIECBAgAABAgQIECBAgEApIGaURB4gQIAAAQIECBAgQIAAAQIEOgmIGZ22YRYCBAgQIECAAAECBAgQIECgFBAzSiIPECBAgAABAgQIECBAgAABAp0ExIxO2zALAQIECBAgQIAAAQIECBAgUAqIGSWRBwgQIECAAAECBAgQIECAAIFOAmJGp22YhQABAgQIECBAgAABAgQIECgFxIySyAMECBAgQIAAAQIECBAgQIBAJwExo9M2zEKAAAECBAgQIECAAAECBAiUAmJGSeQBAgQIECBAgAABAgQIECBAoJOAmNFpG2YhQIAAAQIECBAgQIAAAQIESgExoyTyAAECBAgQIECAAAECBAgQINBJQMzotA2zECBAgAABAgQIECBAgAABAqWAmFESeYAAAQIECBAgQIAAAQIECBDoJCBmdNqGWQgQIECAAAECBAgQIECAAIFSQMwoiTxAgAABAgQIECBAgAABAgQIdBIQMzptwywECBAgQIAAAQIECBAgQIBAKSBmlEQeIECAAAECBAgQIECAAAECBDoJiBmdtmEWAgQIECBAgAABAgQIECBAoBQQM0oiDxAgQIAAAQIECBAgQIAAAQKdBMSMTtswCwECBAgQIECAAAECBAgQIFAKiBklkQcIECBAgAABAgQIECBAgACBTgJiRqdtmIUAAQIECBAgQIAAAQIECBAoBcSMksgDBAgQIECAAAECBAgQIECAQCcBMaPTNsxCgAABAgQIECBAgAABAgQIlAJiRknkAQIECBAgQIAAAQIECBAgQKCTgJjRaRtmIUCAAAECBAgQIECAAAECBEoBMaMk8gABAgQIECBAgAABAgQIECDQSUDM6LQNsxAgQIAAAQIECBAgQIAAAQKlgJhREnmAAAECBAgQIECAAAECBAgQ6CQgZnTahlkIECBAgAABAgQIECBAgACBUkDMKIk8QIAAAQIECBAgQIAAAQIECHQSEDM6bcMsBAgQIECAAAECBAgQIECAQCkgZpREHiBAgAABAgQIECBAgAABAgQ6CYgZnbZhFgIECBAgQIAAAQIECBAgQKAUEDNKIg8QIECAAAECBAgQIECAAAECnQTEjE7bMAsBAgQIECBAgAABAgQIECBQCogZJZEHCBAgQIAAAQIECBAgQIAAgU4CYkanbZiFAAECBAgQIECAAAECBAgQKAXEjJLIAwQIECBAgAABAgQIECBAgEAnATGj0zbMQoAAAQIECBAgQIAAAQIECJQCYkZJ5AECBAgQIECAAAECBAgQIECgk8A/JOtliEiEkpUAAAAASUVORK5CYII=";
        this._Form = _formBuilder.group({
            AgencySignatureCnfgId:['0',Validators.required]
        });

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.SequenceNo = this.objQeryVal.Id;
        //this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildSupervisoryHomeVisitDTO.ChildId = this.objQeryVal.cid;
        this.objChildSupervisoryHomeVisitDTO.SequenceNo = this.objQeryVal.childsqno;

        this.objChildSupervisoryHomeVisitDTO.CarerSHVSequenceNo = this.objQeryVal.carersqno;

        this.UserTypeId= Common.GetSession("UserTypeId");
        if(this.UserTypeId==4)
        {
            this.objChildSupervisoryHomeVisitDTO.AgencySignatureCnfgId=1;
            this.AgencySignatureHidden=true;
            this.AgencySignatureCnfgChange(1);
        }
        
      //  this.BindCarer();
        this.BindChildSHVDetails();
        //this._Form = _formBuilder.group({
        //});

      //  this.qno=this.objQeryVal.Id; 
        //  if (this.objQeryVal.Id != "0" && this.objQeryVal.cid != "undefined")
        //      this.apiService.get("ChildSaferPolicy", "GetCarerName", this.objQeryVal.cid).then(item => {
        //          this.carerName = item;
        //  });
    }
    // BindCarer() {
    //     if (this.AgencyProfileId != null) {
    //         this.apiService.get("CarerInfo", "GetApprovedCarerByAgencytId", this.AgencyProfileId).then(data => {
    //             this.fnLoadCarerList(data);
    //         });
    //     }
    // }
    // fnLoadCarerList(data) {
    //     //Multiselect dropdown array forming code.
    //     if (data) {
    //         data.forEach(item => {
    //             this.arrayCarerList.push({ id: item.CarerParentId, name: item.PCFullName + item.SCFullName + " (" + item.CarerCode + ")" });
    //         });

    //     }
    // }

    fnChildDetailTab() {
        this.ChildDetailTabActive = "active";
        this.ChildYPTabActive = "";
        this.DocumentActive = "";
    }
    fnChildYPTab() {
        this.ChildDetailTabActive = "";
        this.ChildYPTabActive = "active";
        this.DocumentActive = "";
    }
  
    fnDocumentDetailTab() {
        this.ChildDetailTabActive = "";
        this.ChildYPTabActive = "";
        this.FosterHomeTabActive = "";
        this.HealthTabActive = "";
        this.EducationTabActive = "";
        this.ContactTabActive = "";
        this.DocumentActive = "active";
    }
    seTabVisible() {

        let insChildYPVisible = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Child Section B');
        if (insChildYPVisible.length > 0) {
            this.ChildYPVisible = false;
        }
    }

    AgencySignatureCnfgChange(id) {
        this.submitted=false;
        this.objChildSupervisoryHomeVisitDTO.AgencySignatureCnfgId=id;
        this.BindSingnature();
    }

    BindSingnature()
    { 
        this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objChildSupervisoryHomeVisitDTO).then(data => {
        this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'ChildFCSignature');
         });
    }
        
    BindChildSHVDetails() {
      
            this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objChildSupervisoryHomeVisitDTO).then(data => {
                
                this.lstCarerSecA = data.filter(x => x.ControlLoadFormat != 'ChildFCSignature');
                //this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'ChildFCSignature');
                this.seTabVisible();
            });
       
    }
    clicksubmit(SectionAdynamicValue, SectionAdynamicForm) {
        this.submitted = true;

        if (SectionAdynamicForm.valid) {
            let type = "save";

            this.objChildSupervisoryHomeVisitDTO.DynamicValue = SectionAdynamicValue;
            this.objChildSupervisoryHomeVisitDTO.CarerSHVSequenceNo = this.carerSHVSqno;
            this.apiService.post(this.controllerName, "SaveFcSignature", this.objChildSupervisoryHomeVisitDTO).then(data => this.Respone(data, type));
        }
        else {
            this.ChildDetailTabActive = "";
            this.ChildYPTabActive = "";
            this.FosterHomeTabActive = "";
            this.HealthTabActive = "";
            this.EducationTabActive = "";
            this.ContactTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(SectionAdynamicForm);
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            this._router.navigate(['/pages/fostercarer/childsupervisoryhomevisitlist/'+this.objQeryVal.carersqno]);
        }
    }
}