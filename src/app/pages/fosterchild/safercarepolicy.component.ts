import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleTimer } from 'ng2-simple-timer';
import { environment } from '../../../environments/environment';
import { Common, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat, deepCopy } from '../common';
import { ValChangeDTO } from '../dynamic/ValChangeDTO';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { ChildSaferCarePolicyDTO } from './DTO/childsafercarepolicydto';
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
declare var window: any;
declare var $: any;

@Component({
    selector: 'safercarepolicy',
    templateUrl: './safercarepolicy.component.template.html',
})

export class SafercarePolicy implements OnInit {
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    @ViewChild('ddCarerList') ddLCarerIds;
    @ViewChild('ddChild') ddLChildIds;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    apiURL = environment.api_url + "/api/GeneratePDF/";
    dynamicformcontrol = []; dynamicformcontrolOrginal = [];
    objSaferCarePolicyDTO: ChildSaferCarePolicyDTO = new ChildSaferCarePolicyDTO();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    IsFirstLoad = true;
    DateofEntry = new Date();
    submitted = false;
    _Form: FormGroup;
    childList;
    childMultiSelectValues = [];
    rtnList = [];
    objQeryVal;
    childListVisible = true; CarerParentId;
    childIds = []; btnSaveText = "Save";
    carerIds = [];
    arrayCarerList = [];
    carerMultiSelectValues = [];
    //Doc
    formId;
    tblPrimaryKey;
    @ViewChild('uploads') uploadCtrl;
    TypeId;
    submittedUpload = false;
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
    insTempChilds:any;
    isCarerAvailable:boolean = false;
    isChildAvailable:boolean = false;
    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true;
    showAlert: boolean = false; isUploadDoc: boolean = false;
    controllerName = "ChildSaferPolicy";
    selectedChildren=[];
    selectedCarers=[];
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    isLoadingSAD: boolean = false;
    SocialWorkerId;
    LASocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=98;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private _router: Router, private modal: PagesComponent, private st: SimpleTimer,
        private renderer: Renderer2) {
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.SequenceNo = this.objQeryVal.Id;
        this.ChildID = parseInt(Common.GetSession("ChildId"));
        apiService.get(this.controllerName, "GetChildById", this.ChildID).then(data => { this.fnLoadChild(data)});
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.SocialWorkerId = Common.GetSession("SSWId");
        this.LASocialWorkerId = Common.GetSession("ChildLASocialWorkerId");
        this.BindCarer();
        this.carerName = Common.GetSession("CarerName");

        if (this.carerName == "null" || this.carerName == null || this.carerName==undefined)
        {
            this.carerName = "Not Placed";
           // console.log("carer name "+this.carerName);
        }
         //Get New Review Agency Config Value
         this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
         this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 24;

        if (this.SequenceNo != 0) {
          this.IsFirstLoad = false;
        }
        if (this.objQeryVal.Id != "0") {
            this.dropdownvisible = false;
            this.btnSaveText = "Update";
        }
        else {
            this.objSaferCarePolicyDTO.ChildId = this.ChildID;
            this.objSaferCarePolicyDTO.SequenceNo = this.objQeryVal.Id;
            this.objSaferCarePolicyDTO.AgencyProfileId = this.AgencyProfileId
            this.objSaferCarePolicyDTO.ControlLoadFormat = ["default", "tab1"]
            this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
              this.objAgencyKeyNameValueCnfgDTO = data;

            apiService.post(this.controllerName, "GetDynamicControls", this.objSaferCarePolicyDTO).then(data => {
                this.dynamicformcontrol = data;
                if (this.IsFirstLoad == true && this.objAgencyKeyNameValueCnfgDTO.IsApproved==true && this.objAgencyKeyNameValueCnfgDTO.Value != null){
                  this.dynamicformcontrol.forEach(element => {
                    if(element.FieldCnfg.FieldName == "InspectionDate"){
                      let date= new Date();
                      element.FieldValue= this.modal.GetDateEditFormat(date);
                    }
                  });
                }
            });
          });
        }
        this._Form = _formBuilder.group({
            ChildId: ['0', Validators.required],
        });

        //Doc
        this.formId = 98;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.objQeryVal.Id;

        if (Common.GetSession("SaveAsDraft") == "N") {

            if (this.SequenceNo != 0)
                this.showbtnSaveDraft = false;
            this.objSaferCarePolicyDTO.ChildId = this.ChildID;
            this.objSaferCarePolicyDTO.SequenceNo = this.objQeryVal.Id;
            this.objSaferCarePolicyDTO.AgencyProfileId = this.AgencyProfileId;
            this.objSaferCarePolicyDTO.ControlLoadFormat = ["default", "tab1"];
            apiService.post(this.controllerName, "GetDynamicControls", this.objSaferCarePolicyDTO).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                let date = this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == 'CreatedDate');
                if (this.objSaferCarePolicyDTO.SequenceNo != 0 && date.length > 0 && date[0].FieldValue != null) {
                    this.DateofEntry = date[0].FieldValue;
                }
            });
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = this.objQeryVal.Id;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.TypeId = this.ChildID;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                this.dynamicformcontrol = JSON.parse(data.JsonData);
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                let temp = JSON.parse(data.JsonList);
                let date = temp.filter(x => x.FieldName == 'CreatedDate');
                if (this.objSaferCarePolicyDTO.SequenceNo != 0 && date.length > 0 && date[0].FieldValue != null) {
                    this.DateofEntry = date[0].FieldValue;
                }
                if (this.dynamicformcontrol[0].ChildIds) {
                    //this.ddLChildIds.optionsModel = this.dynamicformcontrol[0].ChildIds;
                    this.selectedChildren = this.dynamicformcontrol[0].ChildIds;
                    this.objSaferCarePolicyDTO.ChildIds = this.dynamicformcontrol[0].ChildIds;
                }
                if (this.dynamicformcontrol[0].CarerParentIdsLst) {
                    //this.ddLCarerIds.optionsModel = this.dynamicformcontrol[0].CarerParentIdsLst;
                    this.selectedCarers =  this.dynamicformcontrol[0].CarerParentIdsLst;
                    this.CarerParentIdsLst = this.dynamicformcontrol[0].CarerParentIdsLst;
                }

            });
        }
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });

        if(Common.GetSession("ViweDisable")=='1'){
            this.objUserAuditDetailDTO.ActionId = 4;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            }
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
            this.isCarerAvailable=true;
        }

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
    isDirty = true;
    DocOk = true; IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(mainFormBuilder, SectionADynamic, SectionADynamicformbuilder, SectionBDynamic, SectionBDynamicformbuilder,
        UploadDocIds, IsUpload, uploadFormBuilder,  AddtionalEmailIds, EmailIds) {

        this.submitted = true;
        this.DocOk = true;

        if (!mainFormBuilder.valid) {
            this.SectionAActive = "active";
            this.SectionBActive = "";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!SectionADynamicformbuilder.valid) {
            this.SectionAActive = "active";
            this.SectionBActive = "";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(SectionADynamicformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.SectionAActive = "";
            this.SectionBActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        //else {
        //    alert();
        //    this.SectionAActive = "active";
        //    this.DocumentActive = "";
        //}

        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        if (this.DocOk && mainFormBuilder.valid && SectionADynamicformbuilder.valid && SectionBDynamicformbuilder.valid) {

            this.isDirty = true;
            this.rtnList.push(SectionBDynamic);
            SectionBDynamic.forEach(item => {
                SectionADynamic.push(item);
            });

            if (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "N" && Compare(SectionADynamic, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {

                this.isLoading = true;
                let type = "save";
                if (SectionADynamic[0].UniqueId != 0)
                    type = "update";
                // if(this.ddLChildIds!=undefined)
                // {
                //     this.objSaferCarePolicyDTO.ChildIds=this.ddLChildIds.optionsModel;
                // }
                //this.objSaferCarePolicyDTO.CarerParentIds = this.carerIds;
                if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y")){
                let val = SectionADynamic.filter(x => x.FieldName == "SocialWorkerId");
                if (val.length > 0 && (val[0].FieldValue == null || val[0].FieldValue == ''))
                  val[0].FieldValue = this.SocialWorkerId;

                let valLASW = SectionADynamic.filter(x => x.FieldName == "LASocialWorkerId");
                if (valLASW.length > 0 && (valLASW[0].FieldValue == null || valLASW[0].FieldValue == ''))
                  valLASW[0].FieldValue = this.LASocialWorkerId;
                }
                this.objSaferCarePolicyDTO.ChildIds = this.selectedChildren;
                this.objSaferCarePolicyDTO.CarerParentIds = this.selectedCarers;
                this.objSaferCarePolicyDTO.SequenceNo = this.SequenceNo;
                this.objSaferCarePolicyDTO.ChildIds.push(this.ChildID);
                this.objSaferCarePolicyDTO.ChildId = this.ChildID;
                this.objSaferCarePolicyDTO.AgencyProfileId = this.AgencyProfileId;
                this.objSaferCarePolicyDTO.DynamicValue = SectionADynamic;
                this.objSaferCarePolicyDTO.CarerParentId = this.CarerParentId;
                this.objSaferCarePolicyDTO.NotificationEmailIds = EmailIds;
                this.objSaferCarePolicyDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.apiService.save(this.controllerName, this.objSaferCarePolicyDTO, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
            }
            else {
                this.submitText=Common.GetSubmitText;
                this.showAutoSave = false;
                if (this.skipAlert && this.IsNewOrSubmited == 1)
                    this.modal.alertWarning(Common.GetNoChangeAlert);
                else if (this.skipAlert && this.IsNewOrSubmited == 2)
                    this.modal.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.skipAlert = true;
            }
        }
    }

    private Respone(data, type, IsUpload, skipAlert: boolean) {

        if (data.IsError == true) {
            this.isLoading = false;
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            this.dynamicformcontrolOrginal = ConvertDateAndDateTimeSaveFormat(this.dynamicformcontrolOrginal);
            if (type == "save") {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadChildSiblingNParent(data.OtherSequenceNumber);
                }
                if (skipAlert)
                    this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);

            }
            else {
                this.isLoading = false;
                this.submitText=Common.GetSubmitText;
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                if (skipAlert)
                    this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);

            }
            this.objSaferCarePolicyDTO.IsSubmitted = true;
            if (skipAlert)
            {
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                this._router.navigate(['/pages/child/safercarepolicylist/4/'+this.objQeryVal.apage]);
            }
                
            this.skipAlert = true;
        }
    }
    private ResponeDraft(data, type, IsUpload) {
        this.isLoading = false;
        this.isLoadingSAD = false;
        this.saveAsDraftText=Common.GetSaveasDraftText;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
                if (!this.showAlert)
                    this.modal.alertSuccess(Common.GetSaveDraftSuccessfullMsg);
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                if (!this.showAlert)
                    this.modal.alertSuccess(Common.GetUpdateDraftSuccessfullMsg);
            }
            this.showAlert = false;
        }
    }

    fnBack()
    {
        this._router.navigate(['/pages/child/safercarepolicylist/4/'+this.objQeryVal.apage]);
    }

    fnLoadChild(data) {
        if (data != null && data != "") {
            this.CarerParentId = data[0].CarerParentId;
            data.forEach(item => {
                if (this.ChildID != item.ChildId) {
                    this.arrayChildList.push({ id: item.ChildId, name: item.ChildFullName });
                }
            }
            );
            this.isChildAvailable= true;

            //if (this.objQeryVal.Id == "0") {
            //    this.apiService.get(this.controllerName, "getCarerName", this.CarerParentId).then(data => { this.carerName = data; });
            //}

        }
        else if (data.length==0)
            this.isChildAvailable= true;

        if (this.objQeryVal.Id != "0" && this.objQeryVal.CId != "undefined")
            this.apiService.get(this.controllerName, "GetCarerName", this.objQeryVal.CId).then(item => { this.carerName = item });
        // else if (this.CarerParentId != null && this.CarerParentId != "")
        //     this.apiService.get(this.controllerName, "getCarerName", this.CarerParentId).then(data => { this.carerName = data; });

    }
    DynamicOnValChange(InsValChange: ValChangeDTO) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "SaveAsDraftStatus") {
            InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "SocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }
        else if (InsValChange.currnet.FieldCnfg.FieldName == "LASocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord"
                || InsValChange.currnet.FieldCnfg.FieldName == "AddtoParent/ChildRecord") {
                InsValChange.currnet.IsVisible = false;
            }
        }
        if (InsValChange.newValue != null && InsValChange.newValue != '' && InsValChange.currnet.FieldCnfg.FieldName == "InspectionDate") {
          let setNextInspectionDate = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "NextInspectionDate");
          if (setNextInspectionDate.length > 0 && this.objAgencyKeyNameValueCnfgDTO.IsApproved==true && this.objAgencyKeyNameValueCnfgDTO.Value != null) {
              if (setNextInspectionDate[0].FieldValue == null|| this.IsFirstLoad == true) {
                  let count = this.objAgencyKeyNameValueCnfgDTO.Value.split(',')[0];
                  let yearMonth = this.objAgencyKeyNameValueCnfgDTO.Value.split(',')[1];
                  if ((yearMonth == "Year" || yearMonth == "year") && count != null) {
                      let YearCount = parseInt(count) * 12;
                      let currtdateYear = new Date(this.modal.GetDateSaveFormat(InsValChange.newValue));
                      let data: Date = new Date(currtdateYear.setMonth(currtdateYear.getMonth() + YearCount));
                      setNextInspectionDate[0].FieldValue = data.toISOString().split('T')[0];
                      setNextInspectionDate[0].FieldValue = this.modal.GetDateEditFormat(setNextInspectionDate[0].FieldValue);
                  }
                  else if ((yearMonth == "Month" || yearMonth == "month") && count != null) {
                      let currtdateMonth = new Date(this.modal.GetDateSaveFormat(InsValChange.newValue));
                      let data = new Date(currtdateMonth.setMonth(currtdateMonth.getMonth() + parseInt(count)));
                      setNextInspectionDate[0].FieldValue = data.toISOString().split('T')[0];
                      setNextInspectionDate[0].FieldValue = this.modal.GetDateEditFormat(setNextInspectionDate[0].FieldValue);

                  }
                }
              }
          }
    }
    fnSaveDraft(dynamicForm, IsUpload, uploadFormBuilder) {

        this.submitted = false;
        let userId: number = parseInt(Common.GetSession("UserProfileId"));
        this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
        this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.ChildID;
        this.objSaveDraftInfoDTO.CreatedUserId = userId;
        this.objSaveDraftInfoDTO.UpdatedUserId = userId;
        this.objSaveDraftInfoDTO.CarerParentId = this.CarerParentId;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid)
                this.fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder);
        }
        else
            this.fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder);
        Common.SetSession("SaveAsDraft", "Y");
        this.dynamicformcontrol.forEach(item => {
            if (item.FieldCnfg.FieldName == "SaveAsDraftStatus") {
                item.IsVisible = false;
            }
        });
    }
    fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder) {
        let type = "save";
        this.fnUpdateDynamicformcontrol(this.dynamicformcontrol);
        if (this.SequenceNo > 0) {
            type = "update";
            this.isDirty = true;
            if (this.SequenceNo != 0 && CompareSaveasDraft(this.dynamicformcontrol, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoadingSAD = true;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objSaferCarePolicyDTO.SequenceNo = this.SequenceNo;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
            }
            else {
                this.saveAsDraftText=Common.GetSaveasDraftText;
                this.isLoadingSAD = true;
                this.showAutoSave = false;
                if (this.showAlert == false && this.IsNewOrSubmited == 1)
                    this.modal.alertWarning(Common.GetNoChangeAlert);
                else if (this.showAlert == false && this.IsNewOrSubmited == 2)
                    this.modal.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.showAlert = false;
                this.isLoadingSAD = false;
            }
        }
        else {
            this.isLoadingSAD = true;
            this.apiService.get(this.controllerName, "GetNextSequenceNo", this.formId).then(data => {
                this.SequenceNo = parseInt(data);
                this.tblPrimaryKey = this.SequenceNo;
                this.objSaferCarePolicyDTO.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);

                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
                dynamicForm.forEach(item => {
                    if (item.FieldName == "SelectSiblings" && item.FieldValue == true) {

                        let arrSiblings = item.FieldValue.split(',');
                        arrSiblings.forEach(sitem => {
                            this.objSaveDraftInfoDTO.SequenceNo = ++this.SequenceNo;
                            this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                            this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                            this.objSaveDraftInfoDTO.TypeId = parseInt(sitem);
                            this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => {
                                data => this.Respone(data, type, IsUpload, true)
                            });
                        });
                    }
                    if (item.FieldName == "AddtoParent/ChildRecord" && item.FieldValue == true) {
                        this.apiService.get("ChildProfile", "GetParentIds", this.ChildID).then(data => {
                            data.forEach(pitem => {
                                this.objSaveDraftInfoDTO.SequenceNo = ++this.SequenceNo;
                                this.objSaveDraftInfoDTO.TypeId = parseInt(pitem);
                                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => {
                                    data => this.Respone(data, type, IsUpload, true)
                                });
                            });
                        });
                    }
                });

            });
        }

    }
    private fnUpdateDynamicForm(dynamicForm, IsUpload) {
        dynamicForm.forEach(item => {
            item.AgencyProfileId = this.AgencyProfileId;
            item.SequenceNo = this.SequenceNo;
            item.CarerName = this.carerName;
            item.CarerParentId = this.CarerParentId;
            if (item.FieldName == "SaveAsDraftStatus")
                item.FieldValue = "1";
            if (IsUpload)
                item.IsDocumentExist = true;
            else
                item.IsDocumentExist = this.isUploadDoc;
        });
    }

    private fnUpdateDynamicformcontrol(dynamicformcontrol) {
        this.childMultiSelectValues = [];
        dynamicformcontrol.forEach(item => {
            ////item.ChildIds = this.objSaferCarePolicyDTO.ChildIds;
            //item.CarerParentIdsLst =this.ddLCarerIds.BindValue;
            //item.ChildIds = this.ddLChildIds.BindValue;
            item.CarerParentIdsLst = this.selectedCarers;
            item.ChildIds = this.selectedChildren;
        });


    }

    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('childSCP180', environment.autoSaveTime);
        this.subscribeTimer2();
    }
    subscribeTimer2() {
        if (this.timer2Id) {
            // Unsubscribe if timer Id is defined
            this.st.unsubscribe(this.timer2Id);
            this.timer2Id = undefined;
            this.timer2button = 'Subscribe';
        } else {
            // Subscribe if timer Id is undefined
            this.timer2Id = this.st.subscribe('childSCP180', () => this.timer2callback());
            this.timer2button = 'Unsubscribe';

        }
    }
    timer2callback() {
        //this.counter2++;
        if (this.isReadOnly == "0" || this.isReadOnly == null) {
            if (this.isFirstTime) {
                this.showAutoSave = true;
                let event = new MouseEvent('click', { bubbles: true });
                if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraft") == "N") {
                    this.saveDraftText = "Record auto-saved @";
                    this.skipAlert = false;
                    this.objSaferCarePolicyDTO.IsSubmitted = false;
                    this.submitText=Common.GetAutoSaveProgressText;
                    this.btnSubmit.fnClick();
                }
                else {
                    this.showAlert = true;
                    this.saveDraftText = "Draft auto-saved @";
                    this.saveAsDraftText=Common.GetSaveasDraftProgressText;
                    this.btnSaveDraft.nativeElement.dispatchEvent(event);
                }
                this.draftSavedTime = Date.now();
            }
            this.isFirstTime = true;
        }
    }
    ngOnDestroy() {
        this.st.delTimer('childSCP180');
    }

    fnDonloadPDF() {
        var carerName=this.carerName;
        if(carerName!="Not Placed" &&  this.carerName != "null" && this.carerName != null && this.carerName!=undefined )
        {
          carerName = this.carerName.replace('/', '\'');
        }
        window.location.href = this.apiURL + "GenerateSafecarePolicyPDF/" + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName;
        this.objUserAuditDetailDTO.ActionId =7;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnDonloadWord() {
        var carerName=this.carerName;
        if(carerName!="Not Placed" &&  this.carerName != "null" && this.carerName != null && this.carerName!=undefined )
        {
          carerName = this.carerName.replace('/', '\'');
        }
        window.location.href = this.apiURL + "GenerateSafecarePolicyWord/" + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName;
        this.objUserAuditDetailDTO.ActionId =6;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnPrint() {
        var carerName=this.carerName;
        if(carerName!="Not Placed" &&  this.carerName != "null" && this.carerName != null && this.carerName!=undefined )
        {
          carerName = this.carerName.replace('/', '\'');
        }
        this.apiService.get("GeneratePDF", "GenerateSafecarePolicyPrint", this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName).then(data => {
            var popupWin;
            // var style = ""; var link = "";
            // var i;
            // for (i = 0; i < $("style").length; i++) {
            //     style = style + $("style")[i].outerHTML;
            // }
            // var j;
            // for (j = 0; j < $("link").length; j++) {
            //     link = link + $("link")[j].outerHTML;
            // }
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
      <html>
        <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Print tab</title>

        <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
    <body onload="window.print();window.close()">${data}</body>
      </html>`);
            popupWin.document.close();
        });
        this.objUserAuditDetailDTO.ActionId =8;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnShowEmail() {
        this.subject = "";
        this.eAddress = "";
        this.submittedprint = false;
        let event = new MouseEvent('click', { bubbles: true });
        this.infoPrint.nativeElement.dispatchEvent(event);
    }
    fnEmail(form) {
        this.submittedprint = true;
        if (form.valid) {
            var carerName=this.carerName;
            if(carerName!="Not Placed" &&  this.carerName != "null" && this.carerName != null && this.carerName!=undefined )
            {
              carerName = this.carerName.replace('/', '\'');
            }
            this.isLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName;
            this.apiService.post("GeneratePDF", "EmailSafecarePolicy", this.objNotificationDTO).then(data => {
                if (data == true)
                {
                    this.modal.alertSuccess("Email Send Successfully..");
                    this.objUserAuditDetailDTO.ActionId =9;
                    this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                    this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                    this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                    this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                    this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                    this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
                    Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                }   
                else
                    this.modal.alertDanger("Email not Send Successfully..");
                this.fnCancelClick();
                this.isLoading = false;
            });

        }
    }
    fnCancelClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoCancel.nativeElement.dispatchEvent(event);
    }

    onSelection(event){
        this.carerIds=event;
        //console.log(this.carerIds);
    }
}
