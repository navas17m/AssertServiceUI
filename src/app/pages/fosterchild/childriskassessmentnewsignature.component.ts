import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import {Common}  from  '../common'
import { ChildRiskAssessmentDTO } from './DTO/childriskassessmentdto';
import { ChildRiskAssessmentNewComboDTO,ChildRiskAssessmentNewDTO, ChildRiskAssessmentNewSignificantDTO, ChildRiskAssessmentNewRisksCausingDTO } from './DTO/childriskassessmentnewdto'

import { Router, ActivatedRoute } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
 
declare var window: any;
declare var $: any;
@Component({
    selector: 'ChildRiskAssessmentNewFCSignature',
    templateUrl: './childriskassessmentnewsignature.component.template.html',
})

export class ChildRiskAssessmentNewFCSignatureComponents {
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
    controllerName = "ChildRiskAssessmentNew";
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
            this.AgencySignatureCnfgChange(1)
        }

       
          //Bind Signature
          this.apiService.get("AgencySignatureCnfg", "GetMappedSignature", 239
          ).then(data => {this.lstAgencySignatureCnfg=data});

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
        this.dynamicformcontrol = data.LstAgencyFieldMapping.filter(x => x.ControlLoadFormat == 'FCSignature');
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
    seTabVisible() {

        let insChildYPVisible = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'ChildInfo');
        if (insChildYPVisible.length > 0) {
            this.ChildYPVisible = false;
        }
        let insFosterVisible = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'DelegatedAutho');
        if (insFosterVisible.length > 0)
            this.HealthVisible = false;

        let insHealthVisible = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Significant');
        if (insHealthVisible.length > 0)
            this.FosterVisible = false;

    
      

    }

    lstCarerSecA = [];
    dynamicformcontrol = [];
    dynamicformcontrolSignificant=[];
    dynamicformcontrolRiskCausing=[];
    BindChildRiskAssemenntDetails() {
        if (this.ChildID != 0 && this.ChildID != null) {
            this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objSaferCarePolicyDTO).then(data => {
                this.lstCarerSecA = data.LstAgencyFieldMapping.filter(x => x.ControlLoadFormat != 'FCSignature');
                this.dynamicformcontrol = data.LstAgencyFieldMapping.filter(x => x.ControlLoadFormat == 'FCSignature');
                this.dynamicformcontrolSignificant = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Significant');
                this.dynamicformcontrolRiskCausing = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Risk');
                this.seTabVisible();
                this.LoadAlreadyStoreSignificant(data.lstChildRiskAssessmentNewSignificant);
                this.LoadAlreadyStoreRisk(data.lstChildRiskAssessmentNewRisksCausing);
            });
        }
    }
    clicksubmit(SectionAdynamicValue, SectionAdynamicForm) {
        this.submitted = true;

        if (SectionAdynamicForm.valid) {
            let type = "save";
            this.isLoading=true;
            this.objSaferCarePolicyDTO.DynamicValue = SectionAdynamicValue;
            this.objSaferCarePolicyDTO.CarerParentId = this.CarerParentId;
            
          //  this.objSaferCarePolicyDTO.NotificationEmailIds = EmailIds;
            //this.objSaferCarePolicyDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
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
            this._router.navigate(['/pages/child/childriskassessmentlist/4']);
        }
    }


    objSignificantList: ChildRiskAssessmentNewSignificantDTO[] = [];
    objSignificantListInsert = [];
    globalobjSignificantList = [];
    submittedSignificant = false;
    LoadAlreadyStoreSignificant(data) {

        if (data != null) {
            data.forEach(item => {
                this.objSignificantList = [];
                item.forEach(subItem => {
                    if (subItem.StatusId != 3) {
                        let add: ChildRiskAssessmentNewSignificantDTO = new ChildRiskAssessmentNewSignificantDTO();
                        add.FieldCnfgId = subItem.FieldCnfgId;
                        add.FieldName = subItem.FieldName;
                        add.FieldValue = subItem.FieldValue;
                        add.FieldDataTypeName = subItem.FieldDataTypeName;
                        add.FieldValueText = subItem.FieldValueText;
                        add.UniqueID = subItem.UniqueID;
                        add.SequenceNo = subItem.SequenceNo;
                        add.StatusId = subItem.StatusId;
                        this.objSignificantList.push(add);
                        this.objSignificantListInsert.push(add);
                    }
                });
                if (this.objSignificantList.length > 0)
                    this.globalobjSignificantList.push(this.objSignificantList);
            });
        }
    }

    returnVal="";
    objRiskList: ChildRiskAssessmentNewRisksCausingDTO[] = [];
    objRiskListInsert = [];
    globalobjRiskList = [];
    submittedRisk = false;
    LoadAlreadyStoreRisk(data) {
         
        if (data != null) {
            data.forEach(item => {
                this.objRiskList = [];
                item.forEach(subItem => {
                    if (subItem.StatusId != 3) {
                        let add: ChildRiskAssessmentNewRisksCausingDTO = new ChildRiskAssessmentNewRisksCausingDTO();
                        add.FieldCnfgId = subItem.FieldCnfgId;
                        add.FieldName = subItem.FieldName;
                        add.FieldValue = subItem.FieldValue;
                        add.FieldDataTypeName = subItem.FieldDataTypeName;
                        add.FieldValueText = subItem.FieldValueText;
                        add.UniqueID = subItem.UniqueID;
                        add.SequenceNo = subItem.SequenceNo;
                        add.StatusId = subItem.StatusId;
                        this.objRiskList.push(add);
                        this.objRiskListInsert.push(add);
                    }
                }); 
                if (this.objRiskList.length > 0)
                    this.globalobjRiskList.push(this.objRiskList);
            });
        }
    }
}
