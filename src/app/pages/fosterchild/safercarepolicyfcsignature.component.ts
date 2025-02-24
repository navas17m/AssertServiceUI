import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import {Common}  from  '../common'
import { ChildSaferCarePolicyDTO} from './DTO/childsafercarepolicydto';
import { Router, ActivatedRoute } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

declare var window: any;
declare var $: any;

@Component({
    selector: 'safercarepolicyfcsignature',
    templateUrl: './safercarepolicyfcsignature.component.template.html',
})

export class SafercarePolicyFCSignatureComponents {
    objSaferCarePolicyDTO: ChildSaferCarePolicyDTO = new ChildSaferCarePolicyDTO();
    submitted = false;
    _Form: FormGroup;
    rtnList = [];
    objQeryVal;
    childListVisible = true; CarerParentId;
    childIds = [];
    btnSaveText = "Save";
    arrayCarerList = [];
    carerMultiSelectValues = [];

    arrayChildList = []; carerName;
    dropdownvisible = true;
    ChildID: number;
    AgencyProfileId: number;
    CarerParentIdsLst: any = [];
    //Autofocus
    SectionAActive = "active";
    SectionBActive;
    DocumentActive;
    //Progress bar
    isLoading: boolean = false;
    SequenceNo;
    controllerName = "ChildSaferPolicy";
    //Signature
    UserTypeId;
    lstAgencySignatureCnfg=[];
    AgencySignatureHidden=false;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private _router: Router, private modal: PagesComponent,
        private renderer: Renderer2) {
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.SequenceNo = this.objQeryVal.sno;
        this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaferCarePolicyDTO.ChildId = this.ChildID;
        this.objSaferCarePolicyDTO.SequenceNo = this.SequenceNo;
        this.objSaferCarePolicyDTO.AgencyProfileId = this.AgencyProfileId;
        this.BindCarer();
        this.BindChildSaferCarerDetail();

        this.UserTypeId= Common.GetSession("UserTypeId");
        if(this.UserTypeId==4)
        {
            this.objSaferCarePolicyDTO.AgencySignatureCnfgId=1;            
            this.AgencySignatureHidden=true;
            this.AgencySignatureCnfgChange(1)
        }
        //Bind Signature
        this.apiService.get("AgencySignatureCnfg", "GetMappedSignature", 98).then(data => {this.lstAgencySignatureCnfg=data});
        this._Form = _formBuilder.group({
            AgencySignatureCnfgId:['0',Validators.required],
        });

        if (this.objQeryVal.Id != "0" && this.objQeryVal.cid != "undefined")
            this.apiService.get(this.controllerName, "GetCarerName", this.objQeryVal.cid).then(item => {
                this.carerName = item;
            });
    }
    BindCarer() {
        if (this.AgencyProfileId != null) {
            this.apiService.get("CarerInfo", "GetApprovedCarerByAgencytId", this.AgencyProfileId).then(data => {
                this.fnLoadCarerList(data);
            });
        }
    }
    fnLoadCarerList(data) {
        //Multiselect dropdown array forming code.
        if (data) {
            data.forEach(item => {
                this.arrayCarerList.push({ id: item.CarerParentId, name: item.PCFullName + item.SCFullName + " (" + item.CarerCode + ")" });
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
    dynamicformcontrol = [];
    BindChildSaferCarerDetail() {
        if (this.ChildID != 0 && this.ChildID != null) {
            this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objSaferCarePolicyDTO).then(data => {
                
                this.lstCarerSecA = data.filter(x => x.ControlLoadFormat != 'FCSignature');
                this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
            });
        }
    }
    clicksubmit(SectionAdynamicValue, SectionAdynamicForm,AddtionalEmailIds, EmailIds) {
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
            this._router.navigate(['/pages/child/safercarepolicylist/4']);
        }
    }


}