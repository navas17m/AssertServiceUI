
import { Component, ViewChild, OnInit, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common, deepCopy, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat}  from  '../common'
import { ParentChildDailyWeeklyRecordingDTO } from './DTO/parentchilddailyweeklyrecordingdto';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChildProfile } from '../child/DTO/childprofile'
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import {SimpleTimer} from 'ng2-simple-timer';
import { ValChangeDTO} from '../dynamic/ValChangeDTO';
import { environment } from '../../../environments/environment';
import { APICallService } from '../services/apicallservice.service';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
declare var window: any;
declare var $: any;

@Component({
    selector: 'ParentChildDailyWeeklyRecordingData',
    templateUrl: './parentchilddailyweeklyrecordingdata.component.template.html',
})

export class ParentChildDailyWeeklyRecordingData implements OnInit {
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    apiURL = environment.api_url + "/api/GeneratePDF/";
    dynamicformcontrol = []; dynamicformcontrolOrginal = [];
    objParentChildDailyWeeklyRecordingDTO: ParentChildDailyWeeklyRecordingDTO = new ParentChildDailyWeeklyRecordingDTO();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    DateofEntry = new Date();
    submitted = false;
    _Form: FormGroup;
    childList;
    childMultiSelectValues = [];
    rtnList = [];
    objQeryVal;
    childListVisible = true; CarerParentId;
    childIds = []; btnSaveText = "Save";
    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    arrayChildList = []; carerName; childName;
    dropdownvisible = true;
    insChildProfileDTO: ChildProfile = new ChildProfile();
    ChildID: number;
    AgencyProfileId: number;
    SequenceNo;

    ChildDetailTabActive = "active";

    DocumentActive;
    isLoading: boolean = false;
    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true;
    showAlert: boolean = false; isUploadDoc: boolean = false;
    controllerName = "ParentChildDailyWeeklyRecording";
    SocialWorkerName; SocialWorkerId;
    ChildLocalAuthorityName; ChildLocalAuthorityId;
    ChildLASocialWorkerName; ChildLASocialWorkerId;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private _router: Router, private modal: PagesComponent, private st: SimpleTimer,
        private renderer: Renderer2) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.insChildProfileDTO = JSON.parse(Common.GetSession("SelectedChildProfile"));
        this.childName = this.insChildProfileDTO.PersonalInfo.FirstName + " " + this.insChildProfileDTO.PersonalInfo.lastName +
            " (" + this.insChildProfileDTO.ChildCode + ")";
        this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));

        this.CarerParentId = parseInt(Common.GetSession("CarerId"));
      //  console.log('carerparentid '+this.CarerParentId);
        this.carerName = Common.GetSession("CarerName");
        if (this.carerName == "null")
            this.carerName = "Not Placed";

        this.SocialWorkerName = Common.GetSession("SSWName");
        if (this.SocialWorkerName == "null")
            this.SocialWorkerName = "Not Assigned";
        this.SocialWorkerId = Common.GetSession("SSWId");

        this.ChildLocalAuthorityId = Common.GetSession("ChildLocalAuthorityId");
        this.ChildLocalAuthorityName = Common.GetSession("ChildLocalAuthorityName");

        this.ChildLASocialWorkerName = Common.GetSession("ChildLASocialWorkerName");
        if (this.ChildLASocialWorkerName == "null")
            this.ChildLASocialWorkerName = "Not Assigned";
        this.ChildLASocialWorkerId = Common.GetSession("ChildLASocialWorkerId");

        this.SequenceNo = this.objQeryVal.Id;
        if (this.objQeryVal.Id != 0 && this.objQeryVal.CId != "undefined") {
            this.btnSaveText = "Update";


        }

        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objParentChildDailyWeeklyRecordingDTO.SequenceNo = this.SequenceNo;
        } else {
            this.objParentChildDailyWeeklyRecordingDTO.SequenceNo = this.objQeryVal.Id;
            this.objParentChildDailyWeeklyRecordingDTO.AgencyProfileId = this.AgencyProfileId
            this.objParentChildDailyWeeklyRecordingDTO.ControlLoadFormat = ["Default"]
            apiService.post(this.controllerName, "GetDynamicControls", this.objParentChildDailyWeeklyRecordingDTO).then(data => {
                this.dynamicformcontrol = data;

            });
        }

        this._Form = _formBuilder.group({
            ChildId: ['0', Validators.required],
        });
        //Doc
        this.formId = 323;
        Common.SetSession("formcnfgid", this.formId);
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.objQeryVal.Id;

        if (Common.GetSession("SaveAsDraft") == "N") {
            if (this.SequenceNo != 0)
                this.showbtnSaveDraft = false;
            this.objParentChildDailyWeeklyRecordingDTO.SequenceNo = this.objQeryVal.Id;
            this.objParentChildDailyWeeklyRecordingDTO.AgencyProfileId = this.AgencyProfileId
            this.objParentChildDailyWeeklyRecordingDTO.ControlLoadFormat = ["Default"]
            apiService.post(this.controllerName, "GetDynamicControls", this.objParentChildDailyWeeklyRecordingDTO).then(data => {
                this.dynamicformcontrol = data;

                let val2 = data.filter(x => x.FieldCnfg.FieldName == "CarerParentId");
                if (val2.length > 0 && val2[0].FieldCnfg.DisplayName != null && val2[0].FieldCnfg.DisplayName != "") {
                    this.carerName = val2[0].FieldCnfg.DisplayName;
                }

                let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                    this.SocialWorkerName = val3[0].FieldCnfg.DisplayName;

                let vaLA = data.filter(x => x.FieldCnfg.FieldName == "LocalAuthorityId");
                if (vaLA.length > 0 && vaLA[0].FieldCnfg.DisplayName != null)
                    this.ChildLocalAuthorityName = vaLA[0].FieldCnfg.DisplayName;

                let vaLASSW = data.filter(x => x.FieldCnfg.FieldName == "LASocialWorkerId");
                if (vaLASSW.length > 0 && vaLASSW[0].FieldCnfg.DisplayName != null)
                    this.ChildLASocialWorkerName = vaLASSW[0].FieldCnfg.DisplayName;


                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
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
            });
        }
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });
    }




    fnChildDetailTab() {
        this.ChildDetailTabActive = "active";
        this.DocumentActive = "";
    }

    fnDocumentDetailTab() {
        this.ChildDetailTabActive = "";
        this.DocumentActive = "active";
    }
    isDirty = true;
    DocOk = true; IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(mainFormBuilder,
        SectionChildDetailsDynamic, SectionChildDetailsformbuilder,
        UploadDocIds, IsUpload, uploadFormBuilder,
        AddtionalEmailIds, EmailIds) {

        this.submitted = true;
        this.DocOk = true;

        if (!mainFormBuilder.valid) {
            this.ChildDetailTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.ChildDetailTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }

        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        if (this.DocOk && mainFormBuilder.valid &&  SectionChildDetailsformbuilder.valid) {


            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(SectionChildDetailsDynamic, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {

                let valCP = SectionChildDetailsDynamic.filter(x => x.FieldName == "CarerParentId");
                if (valCP.length > 0 && (valCP[0].FieldValue == null || valCP[0].FieldValue == '' || valCP[0].FieldValue == '0'))
                {
                    valCP[0].FieldValue = this.CarerParentId;
                }
                let valLA = SectionChildDetailsDynamic.filter(x => x.FieldName == "LocalAuthorityId");
                if (valLA.length > 0 && (valLA[0].FieldValue == null || valLA[0].FieldValue == ''))
                    valLA[0].FieldValue = this.ChildLocalAuthorityId;
                if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y")){
                let val = SectionChildDetailsDynamic.filter(x => x.FieldName == "SocialWorkerId");
                if (val.length > 0 && (val[0].FieldValue == null || val[0].FieldValue == ''))
                    val[0].FieldValue = this.SocialWorkerId;
                let valLASSW = SectionChildDetailsDynamic.filter(x => x.FieldName == "LASocialWorkerId");
                if (valLASSW.length > 0 && (valLASSW[0].FieldValue == null || valLASSW[0].FieldValue == ''))
                     valLASSW[0].FieldValue = this.ChildLASocialWorkerId;
                }
                this.isLoading = true;
                let type = "save";
                if (SectionChildDetailsDynamic[0].UniqueId != 0)
                    type = "update";

               // console.log(SectionChildDetailsDynamic);
                this.objParentChildDailyWeeklyRecordingDTO.SequenceNo = this.SequenceNo;
                this.objParentChildDailyWeeklyRecordingDTO.ChildId = this.ChildID;
                this.objParentChildDailyWeeklyRecordingDTO.AgencyProfileId = this.AgencyProfileId;
                this.objParentChildDailyWeeklyRecordingDTO.DynamicValue = SectionChildDetailsDynamic;
                this.objParentChildDailyWeeklyRecordingDTO.NotificationEmailIds = EmailIds;
                this.objParentChildDailyWeeklyRecordingDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.apiService.save(this.controllerName, this.objParentChildDailyWeeklyRecordingDTO, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
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
    fnSaveDraft(SectionChildDetailsDynamic,
        IsUpload,
        uploadFormBuilder) {

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
                this.fnSubSaveDraft(SectionChildDetailsDynamic, IsUpload, uploadFormBuilder);
        }
        else
            this.fnSubSaveDraft(SectionChildDetailsDynamic, IsUpload, uploadFormBuilder);
        Common.SetSession("SaveAsDraft", "Y");
        this.dynamicformcontrol.forEach(item => {
            if (item.FieldCnfg.FieldName == "AddtoSiblingsRecord" || item.FieldCnfg.FieldName == "AddtoParent/ChildRecord"
                || item.FieldCnfg.FieldName == "SelectSiblings") {
                item.IsVisible = false;
            }
        });
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
                this.objParentChildDailyWeeklyRecordingDTO.SequenceNo = this.SequenceNo;
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
                this.objParentChildDailyWeeklyRecordingDTO.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));

            });
        }

    }
    private fnUpdateDynamicForm(dynamicForm, IsUpload) {
        dynamicForm.forEach(item => {
            item.AgencyProfileId = this.AgencyProfileId;
            item.SequenceNo = this.SequenceNo;
            item.ChildName = this.insChildProfileDTO.PersonalInfo.FirstName + " " + this.insChildProfileDTO.PersonalInfo.lastName;
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
    DynamicOnValChange(InsValChange: ValChangeDTO) {

        if (InsValChange.currnet.FieldCnfg.FieldName == "SaveAsDraftStatus") {
            InsValChange.currnet.IsVisible = false;
        }
        else if (InsValChange.currnet.FieldCnfg.FieldName == "LocalAuthorityId") {
            InsValChange.currnet.IsVisible = false;
        }
        else  if (InsValChange.currnet.FieldCnfg.FieldName == "LASocialWorkerId") {
            InsValChange.currnet.IsVisible = false;
        }

        let val2 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "ToDate");
        if (val2.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "DailyWeeklyReport") {

            let value = InsValChange.currnet.ConfigTableValues.filter(x => x.CofigTableValuesId == InsValChange.newValue);
            if (value.length > 0 && value[0].Value == "Weekly")
                val2[0].IsVisible = true;
            else
                val2[0].IsVisible = false;
        }
    }
    private Respone(data, type, IsUpload, skipAlert: boolean) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            this.dynamicformcontrolOrginal = ConvertDateAndDateTimeSaveFormat(this.dynamicformcontrolOrginal);
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
                if (skipAlert)
                    this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                if (skipAlert)
                    this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            if (skipAlert)
                this._router.navigate(['/pages/child/parentchilddailyweeklylist/4']);
            this.skipAlert = true;
            this.objParentChildDailyWeeklyRecordingDTO.IsSubmitted = true;
        }
    }
    private ResponeDraft(data, type, IsUpload) {
        this.isLoading = false;
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
    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('ParentChildDailyWeeklyRecording180', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('ParentChildDailyWeeklyRecording180', () => this.timer2callback());
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
                    this.objParentChildDailyWeeklyRecordingDTO.IsSubmitted = false;
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
        this.st.delTimer('ParentChildDailyWeeklyRecording180');
        Common.SetSession("formcnfgid", "0");
    }

    fnDonloadPDF() {
        var carerName = this.carerName.replace('/', '\'');
        window.location.href = this.apiURL + "GenerateParentChildDailyWeeklyRecordingPDF/" + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName;
    }
    fnDonloadWord() {
        var carerName = this.carerName.replace('/', '\'');
        window.location.href = this.apiURL + "GenerateParentChildDailyWeeklyRecordingWord/" + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName;
    }
    fnPrint() {
        var carerName = this.carerName.replace('/', '\'');
        this.apiService.get("GeneratePDF", "GenerateParentChildDailyWeeklyRecordingPrint", this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName).then(data => {
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
            var carerName = this.carerName.replace('/', '\'');
            this.isLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName;
            this.apiService.post("GeneratePDF", "EmailParentChildDailyWeeklyRecording", this.objNotificationDTO).then(data => {
                if (data == true)
                    this.modal.alertSuccess("Email Send Successfully..");
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
}
