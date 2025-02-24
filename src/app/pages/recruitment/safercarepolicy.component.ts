import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleTimer } from 'ng2-simple-timer';
import { environment } from '../../../environments/environment';
import { Common, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat, deepCopy } from '../common';
import { ValChangeDTO } from '../dynamic/ValChangeDTO';
import { ListBoxOptions } from '../listbox/listbox';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { SaferCarePolicyDTO } from './DTO/safercarepolicy';
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';
declare var window: any;
declare var $: any;
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'SaferCarePolicy',
    templateUrl: './safercarepolicy.component.template.html',
})

export class SaferCarePolicyComponent implements OnInit {
    @ViewChild('ddChildList') ddLChildIds;
  //  @ViewChild('ddCarerList') ddLCarerIds;
    controllerName = "CarerSaferPolicy";
    dynamicformcontrol = [];
    dynamicformcontrolOrginal = [];
    objSaferCarePolicyDTO: SaferCarePolicyDTO = new SaferCarePolicyDTO();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    IsFirstLoad = true;
    DateofEntry = new Date();
    submitted = false;
    _Form: FormGroup;
    childList = [];
    childMultiSelectValues = [];
    carerList = [];
    arrayCarerList = [];
    carerMultiSelectValues = [];
    rtnList = [];
    arrayChildList = [];
    objQeryVal;
    childListVisible = true;
    //Doc
    FormCnfgId;
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerParentId: number;
    AgencyProfileId: number;
    SequenceNo;
    SectionAActive = "active";
    SectionBActive;
    DocumentActive;
    isLoading: boolean = false;
    insTempChilds:any;


    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true;
    showAlert: boolean = false; isUploadDoc: boolean = false;
    IsChildinPlacement = 2;
    //Print
    insCarerDetails;
    CarerCode;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    selectedChildren: any[];
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;SocialWorkerId;
    isLoadingSAD: boolean = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private _router: Router, private module: PagesComponent, private st: SimpleTimer,
        private renderer: Renderer2, private apiService: APICallService) {

        this.activatedroute.params.subscribe(data => {
            this.objQeryVal = data;
            this.SequenceNo = this.objQeryVal.id;
        });
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });

        if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 49;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.SocialWorkerId = Common.GetSession("ACarerSSWId");
            this.BindChildId();
            if (Common.GetSession("SelectedCarerProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
            }
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 29;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.SocialWorkerId = Common.GetSession("CarerSSWId");
            this.BindChildId();
            if (Common.GetSession("SelectedApplicantProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
            }
        }
        if(Common.GetSession("ViweDisable")=='1'){
          this.objUserAuditDetailDTO.ActionId = 4;
          this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
          this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
          this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
          this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
          this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
          this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
          Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
          }
        this._Form = _formBuilder.group({
            ChildId: ['0', Validators.required],
            options: [],
        });

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        //  this.BindCarer();
        //Doc
        this.formId = 29;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.objQeryVal.id;

        this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 24;


        if (this.SequenceNo != 0) {
          this.IsFirstLoad = false;
        }

        if (this.objQeryVal.id != "0") {
            this.childListVisible = false;
        }
        else {

            this.objSaferCarePolicyDTO.CarerParentId = this.CarerParentId;
            this.objSaferCarePolicyDTO.SequenceNo = this.SequenceNo;
            this.objSaferCarePolicyDTO.AgencyProfileId = this.AgencyProfileId;
            this.objSaferCarePolicyDTO.ControlLoadFormat = ["SectionA", "SectionB"];
            this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
              this.objAgencyKeyNameValueCnfgDTO = data;

            this.apiService.post(this.controllerName, "GetDynamicControls", this.objSaferCarePolicyDTO).then(data => {
                //  safeServices.GetDynamicControls(this.objSaferCarePolicyDTO).then(data => {
                this.dynamicformcontrol = data;
                if (this.IsFirstLoad == true && this.objAgencyKeyNameValueCnfgDTO.IsApproved==true && this.objAgencyKeyNameValueCnfgDTO.Value != null){
                  this.dynamicformcontrol.forEach(element => {
                    if(element.FieldCnfg.FieldName == "InspectionDate"){
                      let date= new Date();
                      element.FieldValue= this.module.GetDateEditFormat(date);
                    }
                  });
                }
                if (this.objQeryVal.id != "0") {
                    if (data[0].ChildIds[0] == -1)
                        this.IsChildinPlacement = 2;
                    else {
                        this.IsChildinPlacement = 1;
                        //this.ddLChildIds.optionsModel = data[0].ChildIds;
                        this.insTempChilds=data[0].ChildIds;
                    }
                    let date = this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == 'CreatedDate');
                    if (this.objSaferCarePolicyDTO.SequenceNo != 0 && date.length > 0 && date[0].FieldValue != null) {
                        this.DateofEntry = date[0].FieldValue;
                    }
                }

            });
          });
        }
        if (Common.GetSession("SaveAsDraft") == "N") {
            if (this.SequenceNo != 0)
            {
                this.showbtnSaveDraft = false;
            }
            else
            {
             this.objSaferCarePolicyDTO.IsChildinPlacement=false;
            }
            this.objSaferCarePolicyDTO.CarerParentId = this.CarerParentId;
            this.objSaferCarePolicyDTO.SequenceNo = this.SequenceNo;
            this.objSaferCarePolicyDTO.AgencyProfileId = this.AgencyProfileId;
            this.objSaferCarePolicyDTO.ControlLoadFormat = ["SectionA", "SectionB"];

            this.apiService.post(this.controllerName, "GetDynamicControls", this.objSaferCarePolicyDTO).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                if (this.SequenceNo != "0") {
                    if (data[0].ChildIds[0] == -1) {
                        this.IsChildinPlacement = 2;
                    }
                    else {
                        this.IsChildinPlacement = 1;
                      //  this.ddLChildIds.optionsModel = data[0].ChildIds;
                      this.insTempChilds=data[0].ChildIds;
                    }
                    let date = this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == 'CreatedDate');
                    if (this.objSaferCarePolicyDTO.SequenceNo != 0 && date.length > 0 && date[0].FieldValue != null) {
                        this.DateofEntry = date[0].FieldValue;
                    }
                    var $input = $('input[type="radio"]');
                    $input.attr("disabled", true);
                    // this.ddLChildIds.disable = true;
                }
            });
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                this.dynamicformcontrol = JSON.parse(data.JsonData);
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                this.objSaferCarePolicyDTO.ChildId = this.dynamicformcontrol[0].ChildIds;
                let tempDoc = JSON.parse(data.JsonList);

                let date = this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == 'CreatedDate');
                if (date.length > 0 && date[0].FieldValue != null) {
                    this.DateofEntry = date[0].FieldValue;
                }
                if (this.objQeryVal.id != "0") {
                    if (this.dynamicformcontrol[0].ChildIds[0] == -1) {
                        this.IsChildinPlacement = 2;
                        //we use CarerParentIdsLst for store carer parentids
                        // this.ddLCarerIds.optionsModel = this.dynamicformcontrol[0].CarerParentIdsLst;
                    }
                    else {
                        this.IsChildinPlacement = 1;

                        //this.ddLChildIds.optionsModel = this.dynamicformcontrol[0].ChildIds;
                        this.insTempChilds=this.dynamicformcontrol[0].ChildIds;
                    }
                }
                if (tempDoc != null)
                    this.isUploadDoc = tempDoc[0].IsDocumentExist;
            });
        }

    }

    fnLoadChildList(data) {
        //Multiselect dropdown array forming code.
        if (data) {
            data.forEach(item => {
                this.arrayChildList.push({ id: item.ChildId, name: item.ChildName });
            });

            if(this.arrayChildList.length>0)
            {
                setTimeout(() => {
                    this.fnSetDefalultMultiSelect();
                  }, 1000)
            }
        }
    }

    fnPolicySpecificChange(val)
    {
        if(this.SequenceNo==0)
        {
            this.objSaferCarePolicyDTO.CarerParentId = this.CarerParentId;
            this.objSaferCarePolicyDTO.SequenceNo = this.SequenceNo;
            this.objSaferCarePolicyDTO.AgencyProfileId = this.AgencyProfileId
            this.objSaferCarePolicyDTO.ControlLoadFormat = ["SectionA", "SectionB"];
            this.objSaferCarePolicyDTO.IsChildinPlacement=val;
            this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
              this.objAgencyKeyNameValueCnfgDTO = data;
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objSaferCarePolicyDTO).then(data => {
                this.dynamicformcontrol = data;
                if (this.IsFirstLoad == true && this.objAgencyKeyNameValueCnfgDTO.IsApproved==true && this.objAgencyKeyNameValueCnfgDTO.Value != null){
                  this.dynamicformcontrol.forEach(element => {
                    if(element.FieldCnfg.FieldName == "InspectionDate"){
                      let date= new Date();
                      element.FieldValue= this.module.GetDateEditFormat(date);
                    }
                  });
                }
            });
          });
        }
    }


    fnSetDefalultMultiSelect(){
        //this.ddLChildIds.optionsModel = this.insTempChilds;
        this.selectedChildren = this.insTempChilds;
        if (Common.GetSession("SaveAsDraft") == "N")
        {
            //var $input = $('input[type="radio"]');
            //$input.attr("disabled", true);
            this.ddLChildIds.disable = true;
        }
    }

    fnChildNameChange(val) {
        if (val != "" && val == -1) {
            var $input = $('#ddlAddtoChild');
            $input.attr("disabled", true);
        }
        else {
            var $input = $('#ddlAddtoChild');
            $input.removeAttr("disabled");
        }
    }

    //BindCarer() {
    //    if (this.AgencyProfileId != null && this.CarerParentId != null) {
    //        this.apiService.get("CarerInfo", "GetApprovedCarerByAgencytId", this.AgencyProfileId).then(data => {
    //            this.carerList = data;
    //            this.fnLoadCarerList(data);
    //        });
    //    }
    //}
    //fnLoadCarerList(data) {
    //    //Multiselect dropdown array forming code.
    //    if (data) {
    //        data.filter(x => x.CarerParentId != this.CarerParentId).forEach(item => {
    //            this.arrayCarerList.push({ id: item.CarerParentId, name: item.PCFullName + item.SCFullName + " (" + item.CarerCode + ")" });
    //        });
    //    }
    //}

    fnBack()
    {

        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/safercarepolicylist/13/'+ this.objQeryVal.apage]);
        else
            this._router.navigate(['/pages/fostercarer/safecarepolicylist/3/'+ this.objQeryVal.apage]);
    }

    BindChildId() {
        if (this.CarerParentId != null) {
            this.apiService.get(this.controllerName, "GetChildByParentId", this.CarerParentId).then(data => {
                // this.safeServices.getChildByParentId(this.CarerParentId).then(data => {
                this.childList = data;
                this.fnLoadChildList(data);
            });
        }
    }

    change(options) {
        this.childMultiSelectValues = Array.apply(null, options)  // convert to real Array
            .filter(option => option.selected)
            .map(option => option.value)
    }

    BindListOption(option) {
        option.forEach(item => {
            let add: ListBoxOptions = new ListBoxOptions();
            add.Id = 1;
            add.Value = "";
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
    isDirty = true;
    ShowChildName = false;
    DocOk = true;
    IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(mainFormBuilder, SectionADynamic, SectionADynamicformbuilder, SectionBDynamic, SectionBDynamicformbuilder,
        UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
        this.submitted = true;
        this.isDirty = true;
        this.DocOk = true;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        if (!mainFormBuilder.valid) {
            this.SectionAActive = "active";
            this.SectionBActive = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(mainFormBuilder);
        } else if (!SectionADynamicformbuilder.valid) {
            this.SectionAActive = "active";
            this.SectionBActive = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(SectionADynamicformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.SectionAActive = "";
            this.SectionBActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }
        this.ShowChildName = false;
        if (this.IsChildinPlacement == 2) {
            this.childMultiSelectValues = [];
            this.childMultiSelectValues.push(-1);
            // this.carerMultiSelectValues = ddCarerList;
        }
        else {
            ////  this.carerMultiSelectValues = [];
            //this.childMultiSelectValues = this.ddLChildIds.BindValue;
            this.childMultiSelectValues = this.selectedChildren;
            //if (!this.ddLChildIds.BindValue) {
            if(!this.selectedChildren){
                this.DocOk = false;
                this.ShowChildName = true;
            }
        }

        if (this.DocOk && mainFormBuilder.valid && SectionADynamicformbuilder.valid && SectionBDynamicformbuilder.valid) {

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
                if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraft") == "N")
                    type = "update";
                if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y") ){
                let val2 = SectionADynamic.filter(x => x.FieldName == "SocialWorkerId");
                if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == ''))
                {
                    val2[0].FieldValue = this.SocialWorkerId;
                }
            }
                //  this.objSaferCarePolicyDTO.CarerListIds = this.carerMultiSelectValues;
                this.objSaferCarePolicyDTO.ChildListId = this.childMultiSelectValues;
                this.objSaferCarePolicyDTO.DynamicValue = SectionADynamic;
                this.objSaferCarePolicyDTO.CarerParentId = this.CarerParentId;
                this.objSaferCarePolicyDTO.SequenceNo = this.SequenceNo;
                this.objSaferCarePolicyDTO.AgencyProfileId = this.AgencyProfileId;
                this.objSaferCarePolicyDTO.NotificationEmailIds = EmailIds;
                this.objSaferCarePolicyDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.apiService.save(this.controllerName, this.objSaferCarePolicyDTO, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
            }
            else {
                this.submitText=Common.GetSubmitText;
                this.showAutoSave = false;
                if (this.skipAlert && this.IsNewOrSubmited == 1)
                    this.module.alertWarning(Common.GetNoChangeAlert);
                else if (this.skipAlert && this.IsNewOrSubmited == 2)
                    this.module.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.skipAlert = true;
            }
        }
    }

    private Respone(data, type, IsUpload, skipAlert: boolean) {

        if (data.IsError == true) {
            this.isLoading = false;
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            this.dynamicformcontrolOrginal = ConvertDateAndDateTimeSaveFormat(this.dynamicformcontrolOrginal);
            if (type == "save") {
                if (IsUpload) {
                    //  this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                    this.uploadCtrl.fnUploadAllForMultiUser(data.OtherSequenceNumber);
                }
                if (skipAlert){
                    this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                    this.objUserAuditDetailDTO.ActionId =1;
                    this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                }
            }
            else {
                this.isLoading = false;
                this.submitText=Common.GetSubmitText;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                if (skipAlert){
                    this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                    this.objUserAuditDetailDTO.ActionId =2;
                    this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                }
            }
            if (skipAlert) {
                if (this.objQeryVal.mid == 13)
                    this._router.navigate(['/pages/recruitment/safercarepolicylist/13/'+this.objQeryVal.apage]);
                else
                    this._router.navigate(['/pages/fostercarer/safecarepolicylist/3/'+this.objQeryVal.apage]);
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            }
            this.skipAlert = true;
            this.objSaferCarePolicyDTO.IsSubmitted = true;
        }
    }
    private ResponeDraft(data, type, IsUpload) {
        this.isLoading = false;
        this.isLoadingSAD = false;
        this.saveAsDraftText=Common.GetSaveasDraftText;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
                if (!this.showAlert)
                    this.module.alertSuccess(Common.GetSaveDraftSuccessfullMsg);
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
                if (!this.showAlert)
                    this.module.alertSuccess(Common.GetUpdateDraftSuccessfullMsg);
            }
            this.showAlert = false;
        }
    }
    DynamicOnValChange(InsValChange: ValChangeDTO) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "SaveAsDraftStatus") {
            InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.newValue != null && InsValChange.newValue != '' && InsValChange.currnet.FieldCnfg.FieldName == "InspectionDate") {
          let setNextInspectionDate = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "NextInspectionDate");
          if (setNextInspectionDate.length > 0 && this.objAgencyKeyNameValueCnfgDTO.IsApproved==true && this.objAgencyKeyNameValueCnfgDTO.Value != null) {
              if (setNextInspectionDate[0].FieldValue == null|| this.IsFirstLoad == true) {
                  let count = this.objAgencyKeyNameValueCnfgDTO.Value.split(',')[0];
                  let yearMonth = this.objAgencyKeyNameValueCnfgDTO.Value.split(',')[1];
                  if ((yearMonth == "Year" || yearMonth == "year") && count != null) {
                      let YearCount = parseInt(count) * 12;
                      let currtdateYear = new Date(this.module.GetDateSaveFormat(InsValChange.newValue));
                      let data: Date = new Date(currtdateYear.setMonth(currtdateYear.getMonth() + YearCount));
                      setNextInspectionDate[0].FieldValue = data.toISOString().split('T')[0];
                      setNextInspectionDate[0].FieldValue = this.module.GetDateEditFormat(setNextInspectionDate[0].FieldValue);
                  }
                  else if ((yearMonth == "Month" || yearMonth == "month") && count != null) {
                      let currtdateMonth = new Date(this.module.GetDateSaveFormat(InsValChange.newValue));
                      let data = new Date(currtdateMonth.setMonth(currtdateMonth.getMonth() + parseInt(count)));
                      setNextInspectionDate[0].FieldValue = data.toISOString().split('T')[0];
                      setNextInspectionDate[0].FieldValue = this.module.GetDateEditFormat(setNextInspectionDate[0].FieldValue);

                  }
                }
              }
          }
    }
    fnSaveDraft(SectionADynamic, SectionBDynamic, IsUpload, uploadFormBuilder) {

        this.submitted = false;
        let dynamicCtrl = [];
        SectionADynamic.forEach(item => {
            dynamicCtrl.push(item);
        });
        SectionBDynamic.forEach(item => {
            dynamicCtrl.push(item);
        });

        let userId: number = parseInt(Common.GetSession("UserProfileId"));
        this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
        this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
        this.objSaveDraftInfoDTO.CreatedUserId = userId;
        this.objSaveDraftInfoDTO.UpdatedUserId = userId;

        this.objSaveDraftInfoDTO.CarerParentId = this.objSaferCarePolicyDTO.ChildId;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid)
                this.fnSubSaveDraft(dynamicCtrl, IsUpload, uploadFormBuilder);
        }
        else
            this.fnSubSaveDraft(dynamicCtrl, IsUpload, uploadFormBuilder);
        Common.SetSession("SaveAsDraft", "Y");
        this.dynamicformcontrol.forEach(item => {
            if (item.FieldCnfg.FieldName == "SaveAsDraftStatus") {
                item.IsVisible = false;
            }
        });
    }
    fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder) {
        let type = "save";
        let date = this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == 'CreatedDate');
        if (date.length > 0 && date[0].FieldValue == null) {
            date[0].FieldValue = new Date();
        }
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
                //console.log(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                // this.sdService.save(this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));

            }
            else {
                this.saveAsDraftText=Common.GetSaveasDraftText;
                this.isLoadingSAD = true;
                this.showAutoSave = false;
                if (this.showAlert == false && this.IsNewOrSubmited == 1)
                    this.module.alertWarning(Common.GetNoChangeAlert);
                else if (this.showAlert == false && this.IsNewOrSubmited == 2)
                    this.module.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.showAlert = false;
                this.isLoadingSAD = false;
            }
        }
        else {
            this.isLoadingSAD = true;
            this.apiService.get(this.controllerName, "GetNextSequenceNo", this.formId).then(data => {
                //  this.safeServices.GetNextSequenceNo(this.formId).then(data => {
                this.SequenceNo = parseInt(data);
                this.tblPrimaryKey = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);

                this.objSaferCarePolicyDTO.SequenceNo = this.SequenceNo;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;

                //console.log(dynamicForm);
                //   this.sdService.save(this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data =>{ this.ResponeDraft(data, type, IsUpload)});
            });
        }

    }
    private fnUpdateDynamicForm(dynamicForm, IsUpload) {
        let childName = "";
        let childIds = "";
        if(this.IsChildinPlacement==1)
        {
            //this.ddLChildIds.BindValue.forEach(x => {
            if(this.selectedChildren!=null)
            {
                this.selectedChildren.forEach(x => {
                    childIds += x + ",";
                    let id: number = x;
                    let insChildName = this.childList.filter(x => x.ChildId == id);
                    if (insChildName.length > 0) {
                        childName += insChildName[0].ChildCode + ',';
                    }
                });
            }
        }
        if (childName != null && childName != "")
        {
            childName = childName.substring(0, childName.length - 1)
        }

        //let insChildId;
        // if (this.IsChildinPlacement == 2)
        //     insChildId = -1;
        // else if (this.IsChildinPlacement == 1)
        //     insChildId = childIds;


        dynamicForm.forEach(item => {
            item.AgencyProfileId = this.AgencyProfileId;
            item.SequenceNo = this.SequenceNo;
            item.CarerParentId = this.CarerParentId;
            item.ChildId = -1;
            if (item.FieldName == "SaveAsDraftStatus")
                item.FieldValue = "1";
            if (IsUpload)
                item.IsDocumentExist = true;
            else
                item.IsDocumentExist = this.isUploadDoc;
            item.ChildName = childName;
        });
    }
    private fnUpdateDynamicformcontrol(dynamicformcontrol) {
        this.childMultiSelectValues = [];
        dynamicformcontrol.forEach(item => {
            if (this.IsChildinPlacement == 2) {
                this.childMultiSelectValues = [];
                this.childMultiSelectValues.push(-1);
                // item.CarerParentIdsLst = this.ddLCarerIds.BindValue;
            }
            else {
                // item.CarerParentIdsLst = null;
                //this.childMultiSelectValues = this.ddLChildIds.BindValue;
                this.childMultiSelectValues = this.selectedChildren;
            }
            item.ChildIds = this.childMultiSelectValues;
        });

    }

    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('safeCareCarer180', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('safeCareCarer180', () => this.timer2callback());
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
        this.st.delTimer('safeCareCarer180');
    }

    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateCarerSafeCarePolicyPDF/" + this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
        this.objUserAuditDetailDTO.ActionId =7;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnDonloadWord() {
        window.location.href = this.apiURL + "GenerateCarerSafeCarePolicyWord/" + this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
        this.objUserAuditDetailDTO.ActionId =6;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateCarerSafeCarePolicyPrint", this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId).then(data => {
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
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
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
            this.isLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
            this.apiService.post("GeneratePDF", "EmailCarerSafeCarePolicy", this.objNotificationDTO).then(data => {
                if (data == true){
                    this.module.alertSuccess("Email Sent Successfully..");
                    this.objUserAuditDetailDTO.ActionId =9;
                    this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                    this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                    this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                    this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                    this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
                    this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
                    Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                }
                else
                    this.module.alertDanger("Email not Sent Successfully..");
                this.fnCancelClick();
                this.isLoading = false;
            });

        }
    }
    fnCancelClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoCancel.nativeElement.dispatchEvent(event);
    }
}
