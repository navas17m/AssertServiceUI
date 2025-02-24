import { Component, ViewChild, OnInit, Renderer2, ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Common, deepCopy, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat}  from  '../common'
import { ChildSchedule6 } from './DTO/childschedule6dto';
import { PagesComponent } from '../pages.component';
import { ValChangeDTO} from '../dynamic/ValChangeDTO';
import { ConfigTableValuesDTO } from '../superadmin/DTO/configtablevalues';
import { ChildProfile } from '../child/DTO/childprofile';
import { UserProfile } from '../systemadmin/DTO/userprofile';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import {SimpleTimer} from 'ng2-simple-timer';
import { environment } from '../../../environments/environment';
import { APICallService } from '../services/apicallservice.service';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
declare var window: any;
declare var $: any;

@Component({
    selector: 'childSchedule6data',
    templateUrl: './childschedule6data.component.template.html',
})

export class ChildSchedule6DataComponent implements OnInit {
    objSchedule6: ChildSchedule6 = new ChildSchedule6();
    objChildProfile: ChildProfile = new ChildProfile();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = []; dynamicformcontrolOrginal = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    formId;
    tblPrimaryKey; TypeId;
    @ViewChild('uploads') uploadCtrl;
    urnNumber;
    objUserProfile: UserProfile = new UserProfile();
    lstChildProfileConfigValues = []; lstCarerConfigValues = []; lstSWConfigValues = []; lstEmployeeConfigValues = [];
    AgencyProfileId: number;
    ChildID: number;
    tab1Active = "active";
    tab2Active = "";
    IsLoading = false;
    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true; controllerName = "ChildSchedule6";
    showAlert: boolean = false; isUploadDoc: boolean = false;
    //Print
    insChildDetailsTemp;
    ChildCode;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=362;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router,
        private modal: PagesComponent,
        private st: SimpleTimer, private renderer: Renderer2) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        this.urnNumber = Common.GetSession("URNNumber");
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSchedule6.AgencyProfileId = this.AgencyProfileId;
        this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.objSchedule6.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.id;
        this.fnLoadDDL();
        this.objSchedule6.SequenceNo = this.SequenceNo;

        if (Common.GetSession("SelectedChildProfile") != null) {
            this.insChildDetailsTemp = JSON.parse(Common.GetSession("SelectedChildProfile"));
            this.ChildCode = this.insChildDetailsTemp.ChildCode;
        }
        //Doc
        this.formId = 362;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;

        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objSchedule6.SequenceNo = this.SequenceNo;
            this.tblPrimaryKey = this.SequenceNo;
        }
        else {
            this.objSchedule6.SequenceNo = 0;
            apiService.post(this.controllerName, "GetDynamicControls", this.objSchedule6).then(data => { this.dynamicformcontrol = data; });
        }
        this._Form = _formBuilder.group({});
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });

        if (Common.GetSession("SaveAsDraft") == "N") {
            if (this.SequenceNo != 0)
                this.showbtnSaveDraft = false;
            this.objSchedule6.SequenceNo = this.SequenceNo;
            this.objSchedule6.AgencyProfileId = this.AgencyProfileId;
            apiService.post(this.controllerName, "GetDynamicControls", this.objSchedule6).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            });
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.TypeId = this.ChildID;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;

            this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {

                this.dynamicformcontrol = JSON.parse(data.JsonData);
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                let tempDoc = JSON.parse(data.JsonList);
                if (tempDoc != null)
                    this.isUploadDoc = tempDoc[0].IsDocumentExist;
            });
        }

        if (Common.GetSession("ViweDisable") == '1') {
            this.objUserAuditDetailDTO.ActionId = 4;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    fnLoadDDL() {
        this.objChildProfile.AgencyProfileId = this.AgencyProfileId;
        this.objChildProfile.ChildStatusId = 19;
        this.objChildProfile.CreatedUserId = parseInt(Common.GetSession("UserProfileId"));
        this.apiService.post("ChildProfile", "GetAllChildNameWithStatus", this.objChildProfile).then(data => {
            this.lstChildProfileConfigValues = data;
        });

        this.apiService.get("CarerInfo", "GetApprovedOnholdResignedTerminatedCarer").then(data => {
            data.forEach(item => {
                let objCTV = new ConfigTableValuesDTO();
                objCTV.CofigTableValuesId = item.CarerParentId;
                if(item.SCFullName)
                 objCTV.Value = item.PCFullName +' / '+item.SCFullName+ ' (' + item.CarerCode + ')';
                else
                  objCTV.Value = item.PCFullName +' (' + item.CarerCode + ')';
                this.lstCarerConfigValues.push(objCTV);
            });
        });

        this.objUserProfile.UserTypeCnfg.UserTypeId = 3;
        this.objUserProfile.AgencyProfile.AgencyProfileId = this.AgencyProfileId;
        this.apiService.post("UserProfile", "GetAllByUserTypeId", this.objUserProfile).then(data => {
            data.forEach(item => {
                let objCTV = new ConfigTableValuesDTO();
                objCTV.CofigTableValuesId = item.UserProfileId;
                objCTV.Value = item.PersonalInfo.FullName;
                this.lstSWConfigValues.push(objCTV);
            });
        });
        this.objUserProfile.UserTypeCnfg.UserTypeId = 9;
        this.apiService.post("UserProfile", "GetAllByUserTypeId", this.objUserProfile).then(data => {
            data.forEach(item => {
                let objCTV = new ConfigTableValuesDTO();
                objCTV.CofigTableValuesId = item.UserProfileId;
                objCTV.Value = item.PersonalInfo.FullName;
                this.lstEmployeeConfigValues.push(objCTV);
            });
        });

    }

    fnTab1Active() {
        this.tab1Active = "active";
        this.tab2Active = "";
    }
    fnTab2Active() {
        this.tab1Active = "";
        this.tab2Active = "active";
    }
    isDirty = true;
    DocOk; IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(mainFormBuilder, dynamicForm, dynamicformbuilder, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
        this.submitted = true;
        this.DocOk = true;

        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        if (!dynamicformbuilder.valid) {
            this.tab1Active = "active";
            this.tab2Active = "";
            this.modal.GetErrorFocus(dynamicformbuilder);
        }
        else if (IsUpload && !uploadFormBuilder.valid) {
            this.tab1Active = "";
            this.tab2Active = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }


        if (dynamicformbuilder.valid && dynamicForm != '' && this.DocOk) {
            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(dynamicForm, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.IsLoading = true;
                let type = "save";
                if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraft") == "N") {
                    type = "update";
                }
                this.objSchedule6.NotificationEmailIds = EmailIds;
                this.objSchedule6.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.objSchedule6.SequenceNo = this.SequenceNo;
                this.objSchedule6.AgencyProfileId = this.AgencyProfileId;
                this.objSchedule6.DynamicValue = dynamicForm;
                this.apiService.save(this.controllerName, this.objSchedule6, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
            }
            else {
                this.showAutoSave = false;
                if (this.skipAlert && this.IsNewOrSubmited == 1)
                    this.modal.alertWarning(Common.GetNoChangeAlert);
                else if (this.skipAlert && this.IsNewOrSubmited == 2)
                    this.modal.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.skipAlert = true;
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
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid)
                this.fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder);
        }
        else
            this.fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder);
        Common.SetSession("SaveAsDraft", "Y");
    }
    fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder) {
        let type = "save";
        if (this.SequenceNo > 0) {
            type = "update";
            this.isDirty = true;
            if (this.SequenceNo != 0 && CompareSaveasDraft(this.dynamicformcontrol, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {

                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objSchedule6.SequenceNo = this.SequenceNo;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
            }
            else {
                this.showAutoSave = false;
                if (this.showAlert == false && this.IsNewOrSubmited == 1)
                    this.modal.alertWarning(Common.GetNoChangeAlert);
                else if (this.showAlert == false && this.IsNewOrSubmited == 2)
                    this.modal.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.showAlert = false;
            }
        }
        else {
            this.apiService.get(this.controllerName, "GetNextSequenceNo", this.formId).then(data => {
                this.SequenceNo = parseInt(data);
                this.tblPrimaryKey = this.SequenceNo;
                this.objSchedule6.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);

                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                //console.log(this.objSaveDraftInfoDTO);
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
            });
        }

    }

    private fnUpdateDynamicForm(dynamicForm, IsUpload) {
        dynamicForm.forEach(item => {
            item.AgencyProfileId = this.AgencyProfileId;
            item.SequenceNo = this.SequenceNo;
            if (item.FieldName == "SaveAsDraftStatus")
                item.FieldValue = "1";
            if (IsUpload)
                item.IsDocumentExist = true;
            else
                item.IsDocumentExist = this.isUploadDoc;
        });
    }
    private Respone(data, type, IsUpload, skipAlert: boolean) {
        this.IsLoading = false;
        if (data.IsError == true) {
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
                    this.uploadCtrl.fnUploadChildSiblingNParent(data.lstChildSiblingNParent);
                }
                if (skipAlert)
                    this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadChildSiblingNParent(data.lstChildSiblingNParent);
                }                
                if (skipAlert)
                    this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            if (skipAlert)
            {
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                this._router.navigate(['/pages/child/Schedule6list/4']);
            }
                
            this.skipAlert = true;
        }
    }
    private ResponeDraft(data, type, IsUpload) {
        this.IsLoading = false;
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

    DynamicOnValChange(InsValChange: ValChangeDTO) {

        if (InsValChange.currnet.FieldCnfg.FieldName == "SiblingParentSno") {
            InsValChange.currnet.IsVisible = false;
        }

        if(Common.GetSession("HasChildSiblings")=='false')
        {
            if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord") {
                InsValChange.currnet.IsVisible = false;
            }
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord") {
            if (InsValChange.newValue == "1" || InsValChange.newValue == true)
             {
              InsValChange.all.forEach(item => {
                  if (item.FieldCnfg.FieldName == "SelectSiblings")
                      item.IsVisible = true;
              });
            }
          else {
              InsValChange.all.forEach(item => {
                  if (item.FieldCnfg.FieldName == "SelectSiblings")
                      item.IsVisible = false;
              });
          }
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "EventTypeId") {

            let lstchildMissingField=["ChildMissingReason","ChildMissingDate","ChildReturnDate","MissingDetails","OutcomeOfMissing","WasReturnInterviewConducted","ActionTakenByCarer","ActionTakenPreventReoccurrence"];

            let lstNonChildMissingFields=["PersonCompletingReport","WasPoliceCalledtoHome","DetailsofEvent","BackgroundofCase","OutcomeofCase","InvestigationUndertaken","AgencyActionTaken",
                                        "HospitalAdmission","Section47Offences","SupportOfferedDuringInvestigation","IndependentSupportOfferedInfo",
                                    "RegisteredManagerInformed","RegisteredManagerInformedDate","RegisteredManagerRecommendation","TeamManagerRecommendation"];
            if(InsValChange.currnet.GridDisplayField=="Missing Child Placement")
            {
                let templist= InsValChange.all.filter(x => lstchildMissingField.indexOf(x.FieldCnfg.FieldName)!=-1);
                templist.forEach(item=>{
                    item.IsVisible=true;
                })

                let templistNonMissing= InsValChange.all.filter(x => lstNonChildMissingFields.indexOf(x.FieldCnfg.FieldName)!=-1);
                templistNonMissing.forEach(item=>{
                    item.IsVisible=false;
                })
            }
            else
            {
                let templist= InsValChange.all.filter(x => lstchildMissingField.indexOf(x.FieldCnfg.FieldName)!=-1);
                templist.forEach(item=>{
                    item.IsVisible=false;
                })

                let templistNonMissing= InsValChange.all.filter(x => lstNonChildMissingFields.indexOf(x.FieldCnfg.FieldName)!=-1);
                templistNonMissing.forEach(item=>{
                    item.IsVisible=true;
                })

            }
        }


        if (InsValChange.currnet.FieldCnfg.FieldName == "SaveAsDraftStatus") {
            InsValChange.currnet.IsVisible = false;
        }

        //Code for remove allegation about person
        if (InsValChange.currnet.FieldCnfg.FieldName == "EventAgainstPersonCategoryId") {

            let AllegationAboutPersonNameDropdown = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "EventAgainstPersonNameDropdown");
            if (this.SequenceNo == 0)
                AllegationAboutPersonNameDropdown[0].FieldValue = null;
            switch (InsValChange.currnet.GridDisplayField) {
                case "Child/Young Person":
                    {
                        AllegationAboutPersonNameDropdown[0].ConfigTableValues = this.lstChildProfileConfigValues;
                        break;
                    }
                case "Foster Carer":
                    {
                        AllegationAboutPersonNameDropdown[0].ConfigTableValues = this.lstCarerConfigValues;
                        break;
                    }
                case "Child Social Worker":
                    {
                        AllegationAboutPersonNameDropdown[0].ConfigTableValues = this.lstSWConfigValues;
                        break;
                    }
                //case "Other Professional":
                //    {
                //        AllegationAboutPersonNameDropdown[0].ConfigTableValues = this.lstEmployeeConfigValues;
                //        break;
                //   // }
            }


            let ddlnameAboutPerson = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "EventAgainstPersonNameDropdown");
            let txtNameAboutPerson = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "EventAgainstPersonName");
            if (InsValChange.currnet.GridDisplayField == "Child Parents" || InsValChange.currnet.GridDisplayField == "Others" || InsValChange.currnet.GridDisplayField == "Other Professional") {

                if (ddlnameAboutPerson.length > 0) {
                    //   console.log(ddlnameAboutPerson);
                    ddlnameAboutPerson[0].IsMandatory = false;
                    ddlnameAboutPerson[0].IsVisible = false;
                }

                if (txtNameAboutPerson.length > 0) {
                    txtNameAboutPerson[0].IsMandatory = true;
                    txtNameAboutPerson[0].IsVisible = true;
                }

            }
            else {

                if (ddlnameAboutPerson.length > 0) {
                    ddlnameAboutPerson[0].IsMandatory = true;
                    ddlnameAboutPerson[0].IsVisible = true;
                }

                if (txtNameAboutPerson.length > 0) {
                    txtNameAboutPerson[0].IsMandatory = false;
                    txtNameAboutPerson[0].IsVisible = false;
                }

            }
        }
    }
    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('ChildSchedule6180', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('ChildSchedule6180', () => this.timer2callback());
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
                    this.btnSubmit.fnClick();
                }
                else {
                    this.showAlert = true;
                    this.saveDraftText = "Draft auto-saved @";
                    this.btnSaveDraft.nativeElement.dispatchEvent(event);
                }
                this.draftSavedTime = Date.now();
            }
            this.isFirstTime = true;
        }
    }
    ngOnDestroy() {
        this.st.delTimer('ChildSchedule6180');
    }

    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateChildSchedule6PDF/" + this.ChildCode + "," + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId;
        this.objUserAuditDetailDTO.ActionId = 7;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnDonloadWord() {
        window.location.href = this.apiURL + "GenerateChildSchedule6Word/" + this.ChildCode + "," + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId;
        this.objUserAuditDetailDTO.ActionId = 6;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateChildSchedule6Print", this.ChildCode + "," + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId).then(data => {
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
        this.objUserAuditDetailDTO.ActionId = 8;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
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
            this.IsLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.ChildCode + "," + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId;
            this.apiService.post("GeneratePDF", "EmailChildSchedule6", this.objNotificationDTO).then(data => {
                if (data == true)
                {
                    this.modal.alertSuccess("Email Send Successfully..");
                    this.objUserAuditDetailDTO.ActionId = 9;
                    this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                    this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                    this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
                    this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                    this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                    this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
                    Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                }                    
                else
                    this.modal.alertDanger("Email not Send Successfully..");
                this.fnCancelClick();
                this.IsLoading = false;
            });
        }
    }
    fnCancelClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoCancel.nativeElement.dispatchEvent(event);
    }
}
