import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import {Common}  from  '../common'
import { ChildRiskAssessmentDTO } from './DTO/childriskassessmentdto';
import { Router, ActivatedRoute } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

declare var window: any;
declare var $: any;

@Component({
    selector: 'ChildRiskAssessmentFCSignatureparamount',
    templateUrl: './riskassessmentfcsignatureparamount.component.template.html',
})

export class ChildRiskAssessmentFCSignatureParamountComponents {
    objSaferCarePolicyDTO: ChildRiskAssessmentDTO = new ChildRiskAssessmentDTO();
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
    controllerName = "ChildRiskAssessmentParamount";
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
      //  this.BindCarer();
        this.BindChildRiskAssemenntDetails();
        this._Form = _formBuilder.group({
            AgencySignatureCnfgId:['0',Validators.required],
        });

        this.UserTypeId= Common.GetSession("UserTypeId");
        if(this.UserTypeId==4)
        {
            this.objSaferCarePolicyDTO.AgencySignatureCnfgId=1;
            this.AgencySignatureHidden=true;
        }
          //Bind Signature
          this.apiService.get("AgencySignatureCnfg", "GetMappedSignature", 405).then(data => {this.lstAgencySignatureCnfg=data});

         if (this.objQeryVal.Id != "0" && this.objQeryVal.cid != "undefined")
             this.apiService.get("ChildSaferPolicy", "GetCarerName", this.objQeryVal.cid).then(item => {
                 this.carerName = item;
         });
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

    fnChildDetailTab() {
        this.ChildDetailTabActive = "active";
        this.ChildYPTabActive = "";
        this.FosterHomeTabActive = "";
        this.HealthTabActive = "";
        this.EducationTabActive = "";
        this.ContactTabActive = "";
        this.DocumentActive = "";
    }
    fnChildYPTab() {
        this.ChildDetailTabActive = "";
        this.ChildYPTabActive = "active";
        this.FosterHomeTabActive = "";
        this.HealthTabActive = "";
        this.EducationTabActive = "";
        this.ContactTabActive = "";
        this.DocumentActive = "";
    }
    fnFosterHomeTab() {
        this.ChildDetailTabActive = "";
        this.ChildYPTabActive = "";
        this.FosterHomeTabActive = "active";
        this.HealthTabActive = "";
        this.EducationTabActive = "";
        this.ContactTabActive = "";
        this.DocumentActive = "";
    }
    fnHealthTab() {
        this.ChildDetailTabActive = "";
        this.ChildYPTabActive = "";
        this.FosterHomeTabActive = "";
        this.HealthTabActive = "active";
        this.EducationTabActive = "";
        this.ContactTabActive = "";
        this.DocumentActive = "";
    }
    fnEducationTab() {
        this.ChildDetailTabActive = "";
        this.ChildYPTabActive = "";
        this.FosterHomeTabActive = "";
        this.HealthTabActive = "";
        this.EducationTabActive = "active";
        this.ContactTabActive = "";
        this.DocumentActive = "";
    }
    fnContactTab() {
        this.ChildDetailTabActive = "";
        this.ChildYPTabActive = "";
        this.FosterHomeTabActive = "";
        this.HealthTabActive = "";
        this.EducationTabActive = "";
        this.ContactTabActive = "active";
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
 
    lstCarerSecA = [];
    dynamicformcontrol = [];
    BindChildRiskAssemenntDetails() {
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
            let type = "save";
            this.isLoading=true;
            this.objSaferCarePolicyDTO.DynamicValue = SectionAdynamicValue;
            this.objSaferCarePolicyDTO.CarerParentId = this.CarerParentId;
            this.objSaferCarePolicyDTO.NotificationEmailIds = EmailIds;
            this.objSaferCarePolicyDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.apiService.post(this.controllerName, "SaveFcSignature", this.objSaferCarePolicyDTO).then(data => this.Respone(data, type));
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
            this._router.navigate(['/pages/child/riskassessmentlistparamount/4']);
        }
    }


}