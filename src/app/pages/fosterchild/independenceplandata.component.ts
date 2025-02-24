
import { APICallService } from '../services/apicallservice.service';
import { Component, Pipe, ViewChild, OnInit, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common, deepCopy, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat}  from  '../common'
import { IndependenceplanComboDTO } from './DTO/independenceplandto'
import { PagesComponent } from '../pages.component'
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import {SimpleTimer} from 'ng2-simple-timer';
import { ValChangeDTO} from '../dynamic/ValChangeDTO';
import { environment } from '../../../environments/environment';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
declare var window: any;
declare var $: any;
@Component({
    selector: 'IndependencePlanData',
    templateUrl: './independenceplandata.component.template.html',
})

export class IndependencePlanComponent {
    controllerName = "ChildIndependencePlan";
    objIndependenceplanComboDTO: IndependenceplanComboDTO = new IndependenceplanComboDTO();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    submitted = false;
    dynamicformcontrol = [];
    dynamicformcontrolOG = [];
    _Form: FormGroup;
    SequenceNo;
    objQeryVal;
    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    ChildId: number;
    AgencyProfileId;
    CarerParentId;
    ChildDetailsActive = "active";
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
    insChildDetails;

    CarerName;
    CarerSSWName;
    //Print
    insChildDetailsTemp;
    ChildCode;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    //History
    @ViewChild('btnViewIndependencePlan') infobtnViewIndependencePlan: ElementRef;
    lstChildIndependencePlanHistoryOG = [];
    lstChildIndependencePlanHistory = [];
    hisChildIndependencePlanHistory = [];
    LASocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=297;
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private module: PagesComponent,
        private st: SimpleTimer, private renderer: Renderer2, private apiService: APICallService) {
        this.LASocialWorkerId = Common.GetSession("ChildLASocialWorkerId");
        this.AgencyProfileId = Common.GetSession("AgencyProfileId");
        this.route.params.subscribe(data => this.objQeryVal = data);

        if (this.objQeryVal.mid == 16) {
            if (Common.GetSession("ReferralChildId") != null && Common.GetSession("ReferralChildId") != "null") {
                this.ChildId = parseInt(Common.GetSession("ReferralChildId"));
                this.CarerName = Common.GetSession("CarerName");
                if (this.CarerName == "null") {
                    this.CarerName = "Not Placed";
                    this.CarerParentId = 0;
                }
                else this.CarerParentId = parseInt(Common.GetSession("CarerId"));
                this.CarerSSWName = Common.GetSession("SSWName");
                if (this.CarerSSWName == "null")
                    this.CarerSSWName = "Not Assigned";
                this.bindHistory();
            }
            else {
                Common.SetSession("UrlReferral", "pages/referral/independenceplan/16");
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);
            }
        }
        else if (this.objQeryVal.mid == 4) {
            if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null") {
                this.ChildId = parseInt(Common.GetSession("ChildId"));
                this.CarerName = Common.GetSession("CarerName");
                if (this.CarerName == "null") {
                    this.CarerName = "Not Placed";
                    this.CarerParentId = 0;
                }
                else this.CarerParentId = parseInt(Common.GetSession("CarerId"));
                this.CarerSSWName = Common.GetSession("SSWName");
                if (this.CarerSSWName == "null")
                    this.CarerSSWName = "Not Assigned";
                this.bindHistory();
            }
            else {
                Common.SetSession("UrlReferral", "pages/child/independenceplan/4");
                this._router.navigate(['/pages/child/childprofilelist/1/4']);
            }
        }

        if (Common.GetSession("SelectedChildProfile") != null) {
            this.insChildDetailsTemp = JSON.parse(Common.GetSession("SelectedChildProfile"));
            this.ChildCode = this.insChildDetailsTemp.ChildCode;
        }

        //Doc
        this.formId = 297;
        this.FormCnfgId = 297;
        this.TypeId = this.ChildId;
        this.tblPrimaryKey = this.ChildId;
        this.objIndependenceplanComboDTO.SequenceNo = this.ChildId;

        this._Form = _formBuilder.group({});
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });

        this.objUserAuditDetailDTO.ActionId = 4;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.formId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);

        //Get Save as Draft Info
        this.objSaveDraftInfoDTO.SequenceNo = this.ChildId;
        this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        this.objSaveDraftInfoDTO.TypeId = this.ChildId;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
            if (data) {
                let temp = JSON.parse(data.JsonData);
                this.SequenceNo = 1;
                this.dynamicformcontrol = temp.LstAgencyFieldMapping;
                this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
                let tempDoc = JSON.parse(data.JsonList);
                if (tempDoc != null)
                    this.isUploadDoc = tempDoc[0].IsDocumentExist;
            }
            else {
                //Get GetDynamicControls
                this.objIndependenceplanComboDTO.SequenceNo = this.ChildId;
                this.objIndependenceplanComboDTO.AgencyProfileId = this.AgencyProfileId;
                this.objIndependenceplanComboDTO.ChildId = this.ChildId;
                this.apiService.post(this.controllerName, "GetDynamicControls", this.objIndependenceplanComboDTO).then(data => {

                    this.dynamicformcontrol = data.LstAgencyFieldMapping;
                    this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);

                    let val1 = data.LstAgencyFieldMapping.filter(x => x.FieldCnfg.FieldName == "IndependencePlanDate");
                    if (val1.length > 0 && val1[0].FieldValue != null && val1[0].FieldValue != "") {
                        this.showbtnSaveDraft = false;
                        this.SequenceNo = 1;
                    }

                    let val2 = data.LstAgencyFieldMapping.filter(x => x.FieldCnfg.FieldName == "CarerParentId");
                    if (val2.length > 0 && val2[0].FieldCnfg.DisplayName != null && val2[0].FieldCnfg.DisplayName != "") {
                        this.CarerName = val2[0].FieldCnfg.DisplayName;
                        this.CarerParentId = parseInt(val2[0].FieldValue);
                    }
                    let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                    if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                        this.CarerSSWName = val3[0].FieldCnfg.DisplayName;

                });
            }
        });
    }


    bindHistory() {
        this.apiService.get(this.controllerName, "GetAllByChildId", this.ChildId).then(data => {
            this.lstChildIndependencePlanHistoryOG = data.lstChildIndependencePlanNew;
            this.lstChildIndependencePlanHistory = data.lstChildIndependencePlanHistory;
        });
    }

    fnViewChildIndependencePlanHistory(SequenceNo) {
        this.hisChildIndependencePlanHistory = [];
        let data = this.lstChildIndependencePlanHistoryOG.filter(x => x.FieldName != 'IsActive' &&
            x.FieldName != 'CreatedDate'
            && x.FieldName != 'CreatedUserId'
            && x.FieldName != 'UpdatedDate'
            && x.FieldName != 'UpdatedUserId'
            && x.FieldName != 'SiblingParentSno'
            && x.FieldName != 'CarerChildSNo'
            && x.FieldName != 'SaveAsDraftStatus'
            && x.FieldName != 'SocialWorkerId'
            && x.FieldName != 'CarerParentId' && x.SequenceNo == SequenceNo);
        if (data.length > 0) {
            this.hisChildIndependencePlanHistory = data;
        }
        let event = new MouseEvent('click', { bubbles: true });
        this.infobtnViewIndependencePlan.nativeElement.dispatchEvent(event);
    }

    fnChildDetailsTab() {
        this.ChildDetailsActive = "active";
        this.DocumentActive = "";
    }


    fnDocumentDetailTab() {
        this.ChildDetailsActive = "";
        this.DocumentActive = "active";
    }

    isDirty = true;
    DocOk = true;
    IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(dynamicForm, dynamicformbuilder,
        UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {


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
            this.ChildDetailsActive = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicformbuilder);
        }
        else if (IsUpload && !uploadFormBuilder.valid) {
            this.ChildDetailsActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }

        if (dynamicformbuilder.valid && this.DocOk) {

            this.isDirty = true;
            if (Compare(dynamicForm, this.dynamicformcontrolOG)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {

                let val1 = dynamicForm.filter(x => x.FieldName == "CarerParentId");
                if (val1.length > 0 && (val1[0].FieldValue == null || val1[0].FieldValue == ''))
                    val1[0].FieldValue = Common.GetSession("CarerId");

                if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y")){
                let val2 = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
                if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == '')) {
                    val2[0].FieldValue = Common.GetSession("SSWId");
                }

                let valLASW = dynamicForm.filter(x => x.FieldName == "LASocialWorkerId");
                if (valLASW.length > 0 && (valLASW[0].FieldValue == null || valLASW[0].FieldValue == ''))
                  valLASW[0].FieldValue = this.LASocialWorkerId;
                }
                let val22 = dynamicForm.filter(x => x.FieldName == "SaveAsDraftStatus");
                if (val22.length > 0)
                    val22[0].FieldValue = "0";

                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";

                this.objIndependenceplanComboDTO.NotificationEmailIds = EmailIds;
                this.objIndependenceplanComboDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.objIndependenceplanComboDTO.AgencyProfileId = this.AgencyProfileId;
                this.objIndependenceplanComboDTO.DynamicValue = dynamicForm;
                this.objIndependenceplanComboDTO.ChildId = this.ChildId;
                this.apiService.save(this.controllerName, this.objIndependenceplanComboDTO, "save").then(data => this.Respone(data, type, IsUpload, this.skipAlert));
            }
            else {
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
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
            this.dynamicformcontrolOG = ConvertDateAndDateTimeSaveFormat(this.dynamicformcontrolOG);
            this.showbtnSaveDraft = false;
            this.SequenceNo = 1;
            if (type == "save") {
                this.objUserAuditDetailDTO.ActionId =1;
                if (skipAlert)
                    this.module.alertSuccess(Common.GetSaveSuccessfullMsg);                    
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.ChildId);
                }
            }
            else {
                this.objUserAuditDetailDTO.ActionId =2;
                if (skipAlert)
                    this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);                    
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.ChildId);
                }
            }
            if (skipAlert) {

                //Get GetDynamicControls  rebind
                this.objIndependenceplanComboDTO.SequenceNo = this.ChildId;
                this.objIndependenceplanComboDTO.AgencyProfileId = this.AgencyProfileId;
                this.objIndependenceplanComboDTO.ChildId = this.ChildId;
                this.apiService.post(this.controllerName, "GetDynamicControls", this.objIndependenceplanComboDTO).then(data => {

                    this.dynamicformcontrol = data.LstAgencyFieldMapping;
                    this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);

                    let val1 = data.LstAgencyFieldMapping.filter(x => x.FieldCnfg.FieldName == "IndependencePlanDate");
                    if (val1.length > 0 && val1[0].FieldValue != null && val1[0].FieldValue != "") {
                        this.showbtnSaveDraft = false;
                        this.SequenceNo = 1;
                    }

                    let val2 = data.LstAgencyFieldMapping.filter(x => x.FieldCnfg.FieldName == "CarerParentId");
                    if (val2.length > 0 && val2[0].FieldCnfg.DisplayName != null && val2[0].FieldCnfg.DisplayName != "") {
                        this.CarerName = val2[0].FieldCnfg.DisplayName;
                        this.CarerParentId = parseInt(val2[0].FieldValue);
                    }
                    let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                    if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                        this.CarerSSWName = val3[0].FieldCnfg.DisplayName;

                });

                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.formId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            }
            this.bindHistory();
            this.skipAlert = true;
            this.objIndependenceplanComboDTO.IsSubmitted = true;
        }
    }
    private ResponeDraft(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
            this.SequenceNo = 1;
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.ChildId);
                }
                if (!this.showAlert)
                    this.module.alertSuccess(Common.GetSaveDraftSuccessfullMsg);
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.ChildId);
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
        if (InsValChange.currnet.FieldCnfg.FieldName == "CarerParentId") {
            InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "SocialWorkerId") {
            InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "LASocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }
    }
    fnSaveDraft(dynamicForm, IsUpload, uploadFormBuilder) {
        this.submitted = false;
        let userId: number = parseInt(Common.GetSession("UserProfileId"));
        this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
        this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.ChildId;
        this.objSaveDraftInfoDTO.CreatedUserId = userId;
        this.objSaveDraftInfoDTO.UpdatedUserId = userId;

        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid)
                this.fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder);
        }
        else
            this.fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder);

        this.dynamicformcontrol.forEach(item => {
            if (item.FieldCnfg.FieldName == "SaveAsDraftStatus") {
                item.IsVisible = false;
            }
        });
    }
    fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder) {
        let type = "save";
        this.isDirty = true;
        if (CompareSaveasDraft(this.dynamicformcontrol, this.dynamicformcontrolOG)) {
            this.isDirty = false;
        }
        if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
            this.objIndependenceplanComboDTO.SequenceNo = this.ChildId;
            this.objIndependenceplanComboDTO.LstAgencyFieldMapping = this.dynamicformcontrol;

            if (this.SequenceNo > 0)
                type = "update";
            this.fnUpdateDynamicForm(dynamicForm, IsUpload);
            this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
            this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.objIndependenceplanComboDTO);
            this.objSaveDraftInfoDTO.SequenceNo = this.ChildId;
            this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
        }
        else {
            this.showAutoSave = false;
            if (this.showAlert == false && this.IsNewOrSubmited == 1)
                this.module.alertWarning(Common.GetNoChangeAlert);
            else if (this.showAlert == false && this.IsNewOrSubmited == 2)
                this.module.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
            this.showAlert = false;
        }
    }
    private fnUpdateDynamicForm(dynamicForm, IsUpload) {
        dynamicForm.forEach(item => {
            item.AgencyProfileId = this.AgencyProfileId;
            item.SequenceNo = this.SequenceNo;
            item.ChildId = this.ChildId;
            if (item.FieldName == "SaveAsDraftStatus")
                item.FieldValue = "1";
            if (IsUpload)
                item.IsDocumentExist = true;
            else
                item.IsDocumentExist = this.isUploadDoc;
        });
    }

    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('IndependencePlan180', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('IndependencePlan180', () => this.timer2callback());
            this.timer2button = 'Unsubscribe';

        }
    }
    timer2callback() {
        //this.counter2++;
        if (this.isReadOnly == "0" || this.isReadOnly == null) {
            if (this.isFirstTime) {
                this.showAutoSave = true;
                let event = new MouseEvent('click', { bubbles: true });
                if (this.showbtnSaveDraft == false) {
                    this.saveDraftText = "Record auto-saved @";
                    this.skipAlert = false;
                    this.objIndependenceplanComboDTO.IsSubmitted = false;
                    this.btnSubmit.fnClick();
                }
                else if (this.showbtnSaveDraft == true) {
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
        this.st.delTimer('IndependencePlan180');
    }

    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateChildIndependencePlanPDF/" + this.ChildId + "," + this.ChildId + "," + this.AgencyProfileId + "," + this.CarerParentId;
        this.objUserAuditDetailDTO.ActionId = 7;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnDonloadWord() {
        window.location.href = this.apiURL + "GenerateChildIndependencePlanWord/" + this.ChildId + "," + this.ChildId + "," + this.AgencyProfileId + "," + this.CarerParentId;
        this.objUserAuditDetailDTO.ActionId = 6;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateChildIndependencePlanPrint", this.ChildId + "," + this.ChildId + "," + this.AgencyProfileId + "," + this.CarerParentId).then(data => {
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
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
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
            this.objNotificationDTO.Body = this.ChildId + "," + this.ChildId + "," + this.AgencyProfileId + "," + this.CarerParentId;
            this.apiService.post("GeneratePDF", "EmailChildIndependencePlan", this.objNotificationDTO).then(data => {
                if (data == true)
                {
                    this.module.alertSuccess("Email Send Successfully..");    
                    this.objUserAuditDetailDTO.ActionId = 9;
                    this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                    this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                    this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
                    this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                    this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                    this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
                    Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);    
                }                    
                else
                    this.module.alertDanger("Email not Send Successfully..");
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
