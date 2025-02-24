import { Component, Pipe, ViewChild, OnInit, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Common, deepCopy, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat}  from  '../common'
import { ChildOOHReport } from './DTO/childoohreport'
import { PagesComponent } from '../pages.component';
import { ValChangeDTO} from '../dynamic/ValChangeDTO';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import {SimpleTimer} from 'ng2-simple-timer';
import { environment } from '../../../environments/environment';
import { APICallService } from '../services/apicallservice.service';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
declare var window: any;
declare var $: any;

//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'childoohreportdata',
    templateUrl: './childoohreportdata.component.template.html',
})

export class ChildOOHReportDataComponent implements OnInit {
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    apiURL = environment.api_url + "/api/GeneratePDF/";
    objChildOOHReport: ChildOOHReport = new ChildOOHReport();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = []; dynamicformcontrolOrginal = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    formId; tblPrimaryKey;
    @ViewChild('uploads') uploadCtrl;
    TypeId;
    ChildID: number;
    AgencyProfileId: number;
    CarerName; UserName;
    CarerParentId;

    OOHTabActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    controllerName = "ChildOOHReport";
    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true; showAlert: boolean = false; isUploadDoc: boolean = false;
    SocialWorkerName; SocialWorkerId;
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    isLoadingSAD: boolean = false;
    LASocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=85;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent,
        private st: SimpleTimer, private renderer: Renderer2) {
        this.UserName = Common.GetSession("UserName");


        this.CarerName = Common.GetSession("CarerName");
        if (this.CarerName == "null")
            this.CarerName = "Not Placed";

        this.SocialWorkerName = Common.GetSession("SSWName");
        if (this.SocialWorkerName == "null")
            this.SocialWorkerName = "Not Assigned";

        this.SocialWorkerId = Common.GetSession("SSWId");

        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.LASocialWorkerId = Common.GetSession("ChildLASocialWorkerId");
        this.objChildOOHReport.AgencyProfileId = this.AgencyProfileId;

        this.objChildOOHReport.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildOOHReport.SequenceNo = this.SequenceNo;
        } else {
            this.objChildOOHReport.SequenceNo = 0;
            apiService.post(this.controllerName, "GetDynamicControls", this.objChildOOHReport).then(data => { this.dynamicformcontrol = data; });
        }


        //Doc
        this.formId = 85;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;

        this._Form = _formBuilder.group({});


        if (Common.GetSession("SaveAsDraft") == "N") {
            if (this.SequenceNo != 0)
                this.showbtnSaveDraft = false;
            apiService.post(this.controllerName, "GetDynamicControls", this.objChildOOHReport).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                let val1 = data.filter(x => x.FieldCnfg.FieldName == "UpdatedUserId");
                if (val1.length > 0 && val1[0].FieldCnfg.DisplayName != null)
                    this.UserName = val1[0].FieldCnfg.DisplayName;

                let val2 = data.filter(x => x.FieldCnfg.FieldName == "CarerParentId");
                if (val2.length > 0 && val2[0].FieldCnfg.DisplayName != null && val2[0].FieldCnfg.DisplayName != "") {
                    this.CarerName = val2[0].FieldCnfg.DisplayName;
                }

                let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                    this.SocialWorkerName = val3[0].FieldCnfg.DisplayName;

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

    fnOOHTab() {
        this.OOHTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.OOHTabActive = "";
        this.DocumentActive = "active";
    }
    isDirty = true;
    DocOk = true; IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
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
        if (!mainFormBuilder.valid) {
            this.OOHTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.OOHTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.OOHTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }

        if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '' && this.DocOk) {
            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(dynamicForm, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.objChildOOHReport.NotificationEmailIds = EmailIds;
                this.objChildOOHReport.NotificationAddtionalEmailIds = AddtionalEmailIds;
                if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y") ){
                let val = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
                if (val.length > 0 && (val[0].FieldValue == null || val[0].FieldValue == ''))
                    val[0].FieldValue = this.SocialWorkerId;
                let valLASW = dynamicForm.filter(x => x.FieldName == "LASocialWorkerId");
                if (valLASW.length > 0 && (valLASW[0].FieldValue == null || valLASW[0].FieldValue == ''))
                  valLASW[0].FieldValue = this.LASocialWorkerId;
                }
                let val1 = dynamicForm.filter(x => x.FieldName == "CarerParentId");
                if (val1.length > 0 && (val1[0].FieldValue == null || val1[0].FieldValue == ''))
                    val1[0].FieldValue = Common.GetSession("CarerId");
                let type = "save";
                if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraft") == "N")
                    type = "update";
                this.objChildOOHReport.SequenceNo = this.SequenceNo;
                this.objChildOOHReport.DynamicValue = dynamicForm;
                this.objChildOOHReport.ChildId = this.ChildID;
                this.isLoading = true;
                this.apiService.save(this.controllerName, this.objChildOOHReport, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
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
                this.isLoadingSAD = true;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objChildOOHReport.SequenceNo = this.SequenceNo;
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
                this.objChildOOHReport.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);

                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                //console.log(this.objSaveDraftInfoDTO);
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
                    // if (item.FieldName == "AddtoParent/ChildRecord" && item.FieldValue == true) {
                    //     this.apiService.get("ChildProfile", "GetParentIds", this.ChildID).then(data => {
                    //         data.forEach(pitem => {
                    //             this.objSaveDraftInfoDTO.SequenceNo = ++this.SequenceNo;
                    //             this.objSaveDraftInfoDTO.TypeId = parseInt(pitem);
                    //             this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                    //             this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                    //             this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => {
                    //                 data => this.ResponeDraft(data, type, IsUpload)
                    //             });
                    //         });
                    //     });
                    // }
                });

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
                    this.uploadCtrl.fnUploadChildSiblingNParent(data.lstChildSiblingNParent);
                    //  this.uploadCtrl.fnUploadAll(data.SequenceNumber);
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
                    this.uploadCtrl.fnUploadChildSiblingNParent(data.lstChildSiblingNParent);
                }
                if (skipAlert)
                    this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);

            }
            if (skipAlert)
            {
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                this._router.navigate(['/pages/child/childoohreportlist/4/'+this.objQeryVal.apage]);
            }
                
            this.skipAlert = true;
            this.objChildOOHReport.IsSubmitted = true;
        }
    }
    private ResponeDraft(data, type, IsUpload) {
        this.isLoadingSAD = false;
        this.saveAsDraftText=Common.GetSaveasDraftText;
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

    fnBack()
    {
        this._router.navigate(['/pages/child/childoohreportlist/4/'+this.objQeryVal.apage]);
    }


    DynamicOnValChange(InsValChange: ValChangeDTO) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "SaveAsDraftStatus") {
            InsValChange.currnet.IsVisible = false;
        }
        //if (this.SequenceNo != 0 && this.SequenceNo != null) {
        //    if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord"
        //        || InsValChange.currnet.FieldCnfg.FieldName == "AddtoParent/ChildRecord") {
        //        InsValChange.currnet.IsVisible = false;
        //    }
        //}

        if (InsValChange.currnet.FieldCnfg.FieldName == "SiblingParentSno") {
            InsValChange.currnet.IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "SocialWorkerId") {
            InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "LASocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "CarerParentId") {
            InsValChange.currnet.IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "CallDurration" && InsValChange.currnet.FieldValue == null) {
            InsValChange.currnet.FieldValue = "0 hours, 0 minutes";
        }
        if(Common.GetSession("HasChildSiblings")=='false')
        {
            if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord")
                InsValChange.currnet.IsVisible = false;
        }
        if(Common.GetSession("HasChildParents")=='false')
        {
            if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoParent/ChildRecord")
                InsValChange.currnet.IsVisible = false;
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

        if (InsValChange.currnet.FieldCnfg.FieldName == "CallStartTime" || InsValChange.currnet.FieldCnfg.FieldName == "CallEndTime") {

            let valCallStartTime = InsValChange.all.find(x => x.FieldCnfg.FieldName == "CallStartTime").FieldValue;
            let valCallEndTime = InsValChange.all.find(x => x.FieldCnfg.FieldName == "CallEndTime").FieldValue;
            let valCallDurration = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "CallDurration");

            if (valCallStartTime != null && valCallEndTime != null) {
                let start: string[] = valCallStartTime.split(':');
                let end: string[] = valCallEndTime.split(':');
                let diffInMs: number = new Date(1990, 1, 1, parseInt(end[0]), parseInt(end[1])).getTime() - new Date(1990, 1, 1, parseInt(start[0]), parseInt(start[1])).getTime();
                let mins = Math.floor(diffInMs / 60000);
                let hrs = Math.floor(mins / 60);
                mins = mins % 60;

                if (valCallDurration.length > 0) {
                    let val = hrs + " hours, " + mins + ' minutes';
                    valCallDurration[0].FieldValue = val;
                }
            }
        }
    }

    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('childOoh180', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('childOoh180', () => this.timer2callback());
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
                    this.objChildOOHReport.IsSubmitted = false;
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
        this.st.delTimer('childOoh180');
    }

    fnDonloadPDF() {
        var carerName = this.CarerName.replace('/', '\'');
        window.location.href = this.apiURL + "GenerateOOHReportPDF/" + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName + "," + this.SocialWorkerName;
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
        var carerName = this.CarerName.replace('/', '\'');
        window.location.href = this.apiURL + "GenerateOOHReportWord/" + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName + "," + this.SocialWorkerName;
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
        var carerName = this.CarerName.replace('/', '\'');
        this.apiService.get("GeneratePDF", "GenerateOOHReportPrint", this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName + "," + this.SocialWorkerName).then(data => {
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
            var carerName = this.CarerName.replace('/', '\'');
            this.isLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName + "," + this.SocialWorkerName;
            this.apiService.post("GeneratePDF", "EmailOOHReport", this.objNotificationDTO).then(data => {
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
}
