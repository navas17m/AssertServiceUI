import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { SaferCarePolicyDTO } from './DTO/safercarepolicy';
declare var window: any;
declare var $: any;

@Component({
    selector: 'SaferCarePolicyFCSignature',
    templateUrl: './safercarepolicyfcsignature.component.template.html',
})

export class SaferCarePolicyFCSignatureComponent {
    controllerName = "CarerSaferPolicy";
    dynamicformcontrol = [];
    dynamicformcontrolOrginal = [];
    objSaferCarePolicyDTO: SaferCarePolicyDTO = new SaferCarePolicyDTO();
    DateofEntry = new Date();
    submitted = false;
    _Form: FormGroup;
    CarerParentId: number;
    AgencyProfileId: number;
    SequenceNo;
    SectionAActive = "active";
    SectionBActive;
    DocumentActive;
    isLoading: boolean = false;
    insCarerDetails;
    CarerCode; objQeryVal;
    IsChildinPlacement = 2;
    UserTypeId;
    lstAgencySignatureCnfg=[];
    AgencySignatureHidden=false;
    constructor(private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private _router: Router, private module: PagesComponent,
        private renderer: Renderer2, private apiService: APICallService) {

        this.UserTypeId= Common.GetSession("UserTypeId");
        if(this.UserTypeId==4)
        {
            this.objSaferCarePolicyDTO.AgencySignatureCnfgId=1;
            this.AgencySignatureHidden=true;
        }
    
        this.activatedroute.params.subscribe(data => {
            this.objQeryVal = data;
            this.SequenceNo = this.objQeryVal.sno;
        });
        this.objSaferCarePolicyDTO.SequenceNo = this.SequenceNo;

        //Bind Signature
        this.apiService.get("AgencySignatureCnfg", "GetMappedSignature", 29).then(data => {this.lstAgencySignatureCnfg=data});

        if (this.objQeryVal.mid == 3) {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.objSaferCarePolicyDTO.CarerParentId = this.CarerParentId;
            if (Common.GetSession("SelectedCarerProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
            }
            this.BindSaferCarerDetail();
        }
        else if (this.objQeryVal.mid == 13) {
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.objSaferCarePolicyDTO.CarerParentId = this.CarerParentId;
            if (Common.GetSession("SelectedApplicantProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
            }
            this.BindSaferCarerDetail();
        }

        this._Form = _formBuilder.group({
            options: [],
            AgencySignatureCnfgId:['0',Validators.required],
        });

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));

    }


    fnSectionA() {
        this.SectionAActive = "active";
        this.SectionBActive = "";
        this.DocumentActive = "";
    }
    fnSectionB() {
        this.SectionAActive = "";
        this.SectionBActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.SectionAActive = "";
        this.SectionBActive = "";
        this.DocumentActive = "active";
    }
    lstCarerSecA = [];
    ChildIds = [];
    BindSaferCarerDetail() {
        if (this.CarerParentId != 0 && this.CarerParentId != null) {
            this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objSaferCarePolicyDTO).then(data => {
                this.lstCarerSecA = data.filter(x => x.ControlLoadFormat != 'FCSignature');
                
                this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
                if (this.lstCarerSecA[0].ChildIds[0] == -1) {
                    this.IsChildinPlacement = 2;
                }
                else {
                    this.IsChildinPlacement = 1;
                    this.ChildIds = this.lstCarerSecA[0].ChildIds;
                    this.BindChildId();
                }
            });
        }
    }
    childList = [];
    insChildsNames = "";
    BindChildId() {
        if (this.CarerParentId != null) {
            this.apiService.get(this.controllerName, "GetChildByParentId", this.CarerParentId).then(data => {
                this.childList = data;
                this.responeChild(data);

            });
        }
    }

    AgencySignatureCnfgChange(id) {
        this.submitted=false;
        this.objSaferCarePolicyDTO.AgencySignatureCnfgId=id;
        this.BindSingnature();
    }

    BindSingnature()
    { 
        this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objSaferCarePolicyDTO).then(data => {
        this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
         });
    }

    responeChild(data) {
        this.ChildIds.forEach(x => {
            this.childList.forEach(a => {
                if (a.ChildId == x) {
                    this.insChildsNames += a.ChildName + "<br>";
                }

            });

        });

    }

    clicksubmit(SectionAdynamicValue, SectionAdynamicForm, AddtionalEmailIds, EmailIds) {
        this.submitted = true;

        if (SectionAdynamicForm.valid) {
            this.isLoading=true;
            let type = "save";
            this.objSaferCarePolicyDTO.DynamicValue = SectionAdynamicValue;
            this.objSaferCarePolicyDTO.CarerParentId = this.CarerParentId;
            this.objSaferCarePolicyDTO.NotificationEmailIds = EmailIds;
            this.objSaferCarePolicyDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.apiService.post(this.controllerName, "SaveFcSignature", this.objSaferCarePolicyDTO).then(data => this.Respone(data, type));
        }
        else {
            this.SectionAActive = "";
            this.SectionBActive = "";
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
                this._router.navigate(['/pages/recruitment/safercarepolicylist/13']);
            else
                this._router.navigate(['/pages/fostercarer/safecarepolicylist/3']);
        }
    }

}
