import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerHealthAndSafetyDTO } from './DTO/carerhealthandsafetydto';

@Component({
    selector: 'CarerHealthAndSafetyInfoFCSignature',
    templateUrl: './carerhealthandsafetyfcsignature.component.template.html',
})

export class CarerHealthAndSafetyInfoFCSignatureComponet {
    _Form: FormGroup;
    controllerName = "CarerHealthAndSafetyInfo";
    CarerParentId;
    objQeryVal; UserTypeId;
    objCarerHealthAndSafetyDTO: CarerHealthAndSafetyDTO = new CarerHealthAndSafetyDTO();
    objCarerSHV: CarerHealthAndSafetyDTO = new CarerHealthAndSafetyDTO();
    lstCarerSecA = [];
    dynamicformcontrol = [];
    SequenceNo;
    submittedUpload = false;
    AgencyProfileId;
    isLoading: boolean = false;
    submitted = false;
    inssignatureValue;
    expanded = true;
    PageHCBVisibleTab = true;
    PageIndoorAVisibleTab = true;
    PageIndoorBVisibleTab = true;
    PageIndoorCVisibleTab = true;
    PageIndoorDVisibleTab = true;
    PageIndoorEVisibleTab = true;
    PageOutdoorVisibleTab = true;
    PageBriefVisibleTab = true;
    PageHCAActive = "active";
    PageHCBActive;
    PageIndoorAActive;
    PageIndoorBActive;
    PageIndoorCActive;
    PageIndoorDActive;
    PageIndoorEActive;
    PageOutdoorActive;
    PageBriefActive;
    DocumentActive;
    //Signature
    lstAgencySignatureCnfg=[];
    AgencySignatureHidden=false;
    constructor(private _formBuilder: FormBuilder, private activatedroute: ActivatedRoute, private _router: Router,
        private apiService: APICallService, private module: PagesComponent) {

        this._Form = _formBuilder.group({
            AgencySignatureCnfgId:['0',Validators.required],
        });
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.SequenceNo = this.objQeryVal.sno;

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objCarerHealthAndSafetyDTO.AgencyProfileId = this.AgencyProfileId;
        this.objCarerHealthAndSafetyDTO.SequenceNo = this.SequenceNo;

        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 13]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 13]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.objCarerHealthAndSafetyDTO.CarerParentId = this.CarerParentId;
            this.BindHealthAndSafetyDetail();
        }
        else if (this.objQeryVal.mid == 13) {
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.objCarerHealthAndSafetyDTO.CarerParentId = this.CarerParentId;
            this.BindHealthAndSafetyDetail();
        }

        this.UserTypeId = Common.GetSession("UserTypeId");
        if(this.UserTypeId==4)
        {
            this.objCarerHealthAndSafetyDTO.AgencySignatureCnfgId=1;
            this.AgencySignatureHidden=true;
            this.AgencySignatureCnfgChange(1)
        }
        //Bind Signature
        this.apiService.get("AgencySignatureCnfg", "GetMappedSignature", 26).then(data => {this.lstAgencySignatureCnfg=data});
    }

    AgencySignatureCnfgChange(id) {
        this.submitted=false;
        this.objCarerHealthAndSafetyDTO.AgencySignatureCnfgId=id;
        this.BindSingnature();
    }

    BindSingnature()
    { 
        this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objCarerHealthAndSafetyDTO).then(data => {
        this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
         });
    }

    fnPageHCA() {
        this.PageHCAActive = "active";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }
    fnPageHCB() {
        this.PageHCAActive = "";
        this.PageHCBActive = "active";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }
    fnPageIndoorA() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "active";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }
    fnPageIndoorB() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "active";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }
    fnPageIndoorC() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "active";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }
    fnPageIndoorD() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "active";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }
    fnPageIndoorE() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "active";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }
    fnPageOutdoor() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "active";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }

    fnPageBrief() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "active";
    }
    setVisibleTab() {


        let sectionA = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Conditions B');
        if (sectionA.length > 0)
            this.PageHCBVisibleTab = false;
        let sectionB = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Indoors A');
        if (sectionB.length > 0)
            this.PageIndoorAVisibleTab = false;
        let sectionC = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Indoors B');
        if (sectionC.length > 0)
            this.PageIndoorBVisibleTab = false;
        let sectionD = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Indoors C');
        if (sectionD.length > 0)
            this.PageIndoorCVisibleTab = false;
        let sectione = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Indoors D');
        if (sectione.length > 0)
            this.PageIndoorDVisibleTab = false;
        let sectionF = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Indoors E');
        if (sectionF.length > 0)
            this.PageIndoorEVisibleTab = false;
        let sectionH = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Outdoors');
        if (sectionH.length > 0)
            this.PageOutdoorVisibleTab = false;
        let sectionBrief = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Brief');
        if (sectionBrief.length > 0) {
            //   alert("asd");
            this.PageBriefVisibleTab = false;
        }

    }

    BindHealthAndSafetyDetail() {
        if (this.CarerParentId != 0 && this.CarerParentId != null) {
            this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objCarerHealthAndSafetyDTO).then(data => {
                this.lstCarerSecA = data.filter(x => x.ControlLoadFormat != 'FCSignature');
                this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
                this.setVisibleTab();
            });
        }
    }

    clicksubmit(SectionAdynamicValue, SectionAdynamicForm, AddtionalEmailIds, EmailIds) {
        this.submitted = true;

        if (SectionAdynamicForm.valid) {
            this.isLoading=true;
            let type = "save";
            this.objCarerHealthAndSafetyDTO.DynamicValue = SectionAdynamicValue;
            this.objCarerHealthAndSafetyDTO.CarerParentId = this.CarerParentId;
            this.objCarerHealthAndSafetyDTO.NotificationEmailIds = EmailIds;
            this.objCarerHealthAndSafetyDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.apiService.post(this.controllerName, "SaveFcSignature", this.objCarerHealthAndSafetyDTO).then(data => this.Respone(data, type));
        }
        else {
            this.PageHCAActive = "";
            this.PageHCBActive = "";
            this.PageIndoorAActive = "";
            this.PageIndoorBActive = "";
            this.PageIndoorCActive = "";
            this.PageIndoorDActive = "";
            this.PageIndoorEActive = "";
            this.PageOutdoorActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(SectionAdynamicForm);
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            if (this.objQeryVal.mid == 13)
                this._router.navigate(['/pages/recruitment/carerhealthandsafetylist/13']);
            else
                this._router.navigate(['/pages/fostercarer/carerhealthandsafetylist/3']);
        }
    }
}