import { Component, ElementRef, Pipe, ViewChild, Renderer2 } from '@angular/core';
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
import { ChildDayLogJournal } from './DTO/childdaylogjournal';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
declare var window: any;
declare var $: any;
import { PreviewNextValueService } from '../common/previewnextvalueservice.component'
//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'childdaylogjournaldata',
    templateUrl: './childdaylogjournaldata.component.template.html',

})

export class ChildDayLogJournalDataComponent {
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    apiURL = environment.api_url + "/api/GeneratePDF/";
    objChildDayLogJournal: ChildDayLogJournal = new ChildDayLogJournal();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    submitted = false;
    submittedUpload = false;
    dynamicformcontrol = [];
    dynamicformcontrolOldValue = [];
    dynamicformcontrolOrginal = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo: number;
    objQeryVal;
    TypeId;
    formId;
    tblPrimaryKey;
    @ViewChild('uploads') uploadCtrl;
    ChildId: number;
    AgencyProfileId: number;
    CarerName;
    CarerParentId;
    DaylogTabActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true; showAlert: boolean = false; isUploadDoc: boolean = false;
    controllerName = "ChildDayLogJournal";
    SocialWorkerName; SocialWorkerId; LASocialWorkerId; UserName; DateofEntry = new Date();
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    isLoadingSAD: boolean = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=74;
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router,
        private model: PagesComponent, private st: SimpleTimer, private apiService: APICallService,
        private insPreviewNextValueService:PreviewNextValueService
    ) {

        this.CarerName = Common.GetSession("CarerName") == "null" ? "Not Placed" : Common.GetSession("CarerName");
        this.CarerParentId = Common.GetSession("CarerId");
        this.SocialWorkerName = Common.GetSession("SSWName");
        this.SocialWorkerId = Common.GetSession("SSWId");
        this.LASocialWorkerId = Common.GetSession("ChildLASocialWorkerId");
        this.route.params.subscribe(data => {

            this.objQeryVal = data;
            if (this.objQeryVal.mid == 4)
                this.ChildId = parseInt(Common.GetSession("ChildId"));
            else
                this.ChildId = parseInt(Common.GetSession("ReferralChildId"));

            this.objChildDayLogJournal.ChildId = this.ChildId;
            this.formId = 74;
            this.TypeId = this.ChildId;
        });
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildDayLogJournal.AgencyProfileId = this.AgencyProfileId;

        if (this.SocialWorkerName == "null")
            this.SocialWorkerName = "Not Assigned";
        this.UserName = Common.GetSession("UserName");

        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildDayLogJournal.SequenceNo = this.SequenceNo;
        } else {
            //alert()
            this.objChildDayLogJournal.SequenceNo = 0;
            apiService.post(this.controllerName, "GetDynamicControls", this.objChildDayLogJournal).then(data => {
                this.dynamicformcontrol = data;
                //console.log(data);
            });
        }
        if (Common.GetSession("SaveAsDraft") == "N") {
            if (this.SequenceNo != 0)
                this.showbtnSaveDraft = false;
            apiService.post(this.controllerName, "GetDynamicControls", this.objChildDayLogJournal).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOldValue = this.dynamicformcontrol;
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                let val = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                if (val.length > 0 && val[0].FieldCnfg.DisplayName != null)
                    this.SocialWorkerName = val[0].FieldCnfg.DisplayName;

                let valCN = data.filter(x => x.FieldCnfg.FieldName == "CarerParentId");
                if (valCN.length > 0 && valCN[0].FieldCnfg.DisplayName != null)
                    this.CarerName = valCN[0].FieldCnfg.DisplayName;

                let val1 = data.filter(x => x.FieldCnfg.FieldName == "UpdatedUserId");
                if (val1.length > 0 && val1[0].FieldCnfg.DisplayName != null)
                    this.UserName = val1[0].FieldCnfg.DisplayName;

                let val2 = data.filter(x => x.FieldCnfg.FieldName == "CreatedDate");
                if (val2.length > 0 && val2[0].FieldValue != null)
                    this.DateofEntry = val2[0].FieldValue;
            });
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.TypeId = this.ChildId;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                this.dynamicformcontrol = JSON.parse(data.JsonData);
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                let tempDoc = JSON.parse(data.JsonList);
                if (tempDoc != null)
                    this.isUploadDoc = tempDoc[0].IsDocumentExist;
                this.dynamicformcontrolOldValue = this.dynamicformcontrol;
            });
            //this.sdService.getById(this.objSaveDraftInfoDTO).then(data => {
            //    this.dynamicformcontrol = JSON.parse(data.JsonData);
            //    let tempDoc = JSON.parse(data.JsonList);
            //    if (tempDoc != null)
            //        this.isUploadDoc = tempDoc[0].IsDocumentExist;
            //    this.dynamicformcontrolOldValue = this.dynamicformcontrol;
            //});
        }
        this._Form = this._formBuilder.group({});
        this._FormPrint = this._formBuilder.group({
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
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
            this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            }
    }

    fnFindPreviewSeqNo()
    {
        const index= this.insPreviewNextValueService.GetListValues().findIndex(x=> x.key===this.SequenceNo);
        let tempObj = this.insPreviewNextValueService.GetListValues()[index+1];
        if(tempObj)
        {
            this.SequenceNo=tempObj.key;
            this.tblPrimaryKey=this.SequenceNo;
            this.fnLoadPreviewNextData(tempObj)
            this.uploadCtrl.fnSetPrimaryKeyId(this.SequenceNo);
        }
    }
    fnFindNextSeqNo()
    {
        const index= this.insPreviewNextValueService.GetListValues().findIndex(x=> x.key===this.SequenceNo);
        let tempObj = this.insPreviewNextValueService.GetListValues()[index-1];
        if(tempObj)
        {
            this.SequenceNo=tempObj.key;
            this.tblPrimaryKey=this.SequenceNo;
            this.fnLoadPreviewNextData(tempObj);
            this.uploadCtrl.fnSetPrimaryKeyId(this.SequenceNo);
        }
    }

    fnLoadPreviewNextData(tempObj)
    {
            let SequenceNo=tempObj.key;
            this.tblPrimaryKey = SequenceNo;
            this.objChildDayLogJournal.SequenceNo = SequenceNo;
            this.objChildDayLogJournal.AgencyProfileId = this.AgencyProfileId;
            this.objChildDayLogJournal.ChildId = this.ChildId;
            if(tempObj.value.SaveAsDraftStatus=="Submitted")
            {
                this.apiService.post(this.controllerName, "GetDynamicControls", this.objChildDayLogJournal).then(data => {
                    if(data && data[0].UniqueID!=0)
                    {
                        this.dynamicformcontrol.forEach(item=>{
                            let inFieldValue = data.filter(subItem => subItem.FieldCnfg.FieldCnfgId == item.FieldCnfg.FieldCnfgId)[0].FieldValue;
                            item.UniqueID = data.filter(subItem => subItem.FieldCnfg.FieldCnfgId == item.FieldCnfg.FieldCnfgId)[0].UniqueID;
                            switch (item.FieldCnfg.FieldDataTypeCnfg.Name) {
                                case "date":
                                    {
                                        item.FieldValue= this.model.GetDateEditFormat(inFieldValue);
                                        break;
                                    }
                                case "datetime":
                                    {
                                        item.FieldValue = this.model.GetDateTimeEditFormat(inFieldValue);
                                        break;
                                    }
                                    case "bit":
                                        {
                                        item.FieldValue = inFieldValue == "1"?true:false;
                                        break;
                                        }
                                    case "radio":
                                    {
                                        item.FieldValue = inFieldValue == "1"?true:false;
                                        break;
                                    }
                                default: {
                                    item.FieldValue = inFieldValue;
                                }
                            }
                        });

                        this.dynamicformcontrolOrginal.forEach(item=>{
                            item.FieldValue = data.filter(subItem => subItem.FieldCnfg.FieldCnfgId == item.FieldCnfg.FieldCnfgId)[0].FieldValue;
                            item.UniqueID = data.filter(subItem => subItem.FieldCnfg.FieldCnfgId == item.FieldCnfg.FieldCnfgId)[0].UniqueID;
                        });
                        let val1 = data.filter(x => x.FieldCnfg.FieldName == "UpdatedUserId");
                        if (val1.length > 0 && val1[0].FieldCnfg.DisplayName != null)
                            this.UserName = val1[0].FieldCnfg.DisplayName;

                        let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                        if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                            this.SocialWorkerName = val3[0].FieldCnfg.DisplayName;

                        let val4 = data.filter(x => x.FieldCnfg.FieldName == "CreatedDate");
                        if (val4.length > 0 && val4[0].FieldValue != null)
                            this.DateofEntry = val4[0].FieldValue;
                        Common.SetSession("SaveAsDraft","N");
                        this.showbtnSaveDraft = false;
                    }
                });
            }
            else
            {
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
                this.objSaveDraftInfoDTO.TypeId = this.ChildId;
                this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
                this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                    let tempDynamicformcontrol = JSON.parse(data.JsonData);

                     //save as draft
                     this.dynamicformcontrol.forEach(item=>{
                        let inFieldValue = tempDynamicformcontrol.filter(subItem => subItem.FieldCnfg.FieldCnfgId == item.FieldCnfg.FieldCnfgId)[0].FieldValue;
                        item.UniqueID =0;
                        item.FieldValue=inFieldValue;
                        // switch (item.FieldCnfg.FieldDataTypeCnfg.Name) {
                        //     case "date":
                        //         {
                        //             item.FieldValue= this.model.GetDateEditFormat(inFieldValue);
                        //             break;
                        //         }
                        //     case "datetime":
                        //         {
                        //             item.FieldValue = this.model.GetDateTimeEditFormat(inFieldValue);
                        //             break;
                        //         }
                        //         case "bit":
                        //             {
                        //             item.FieldValue = inFieldValue == "1"?true:false;
                        //             break;
                        //             }
                        //         case "radio":
                        //         {
                        //             item.FieldValue = inFieldValue == "1"?true:false;
                        //             break;
                        //         }
                        //     default: {
                        //         item.FieldValue = inFieldValue;
                        //     }
                        // }

                    });
                    Common.SetSession("SaveAsDraft","Y");
                    this.showbtnSaveDraft = true;

                });

            }

    }

    fnBack()
    {

        if (this.objQeryVal.mid == 16)
        this._router.navigate(['/pages/referral/childdayloglist/16/'+this.objQeryVal.apage]);
        else
        this._router.navigate(['/pages/child/childdaylogjournal/4/'+this.objQeryVal.apage]);

    }

    fnDaylogTab() {
        this.DaylogTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.DaylogTabActive = "";
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
            this.DaylogTabActive = "active";
            this.DocumentActive = "";
            this.model.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.DaylogTabActive = "active";
            this.DocumentActive = "";
            this.model.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.DaylogTabActive = "";
            this.DocumentActive = "active";
            this.model.GetErrorFocus(uploadFormBuilder);
        }

        if (mainFormBuilder.valid && subformbuilder.valid && this.DocOk) {
            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(dynamicForm, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }

            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraft") == "N")
                    type = "update";
                if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y") ){
                let val = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
                if (val.length > 0 && (val[0].FieldValue == null || val[0].FieldValue == ''))
                    val[0].FieldValue = this.SocialWorkerId;

                let valLASW = dynamicForm.filter(x => x.FieldName == "LASocialWorkerId");
                if (valLASW.length > 0 && (valLASW[0].FieldValue == null || valLASW[0].FieldValue == ''))
                  valLASW[0].FieldValue = this.LASocialWorkerId;
                }
                let valCP = dynamicForm.filter(x => x.FieldName == "CarerParentId");
                if (valCP.length > 0 && (valCP[0].FieldValue == null || valCP[0].FieldValue == ''))
                    valCP[0].FieldValue = this.CarerParentId;

                this.objChildDayLogJournal.NotificationEmailIds = EmailIds;
                this.objChildDayLogJournal.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.objChildDayLogJournal.DynamicValue = dynamicForm;
                this.objChildDayLogJournal.ChildId = this.ChildId;
                this.apiService.save(this.controllerName, this.objChildDayLogJournal, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
            }
            else {
                this.submitText=Common.GetSubmitText;
                this.showAutoSave = false;
                if (this.skipAlert && this.IsNewOrSubmited == 1)
                    this.model.alertWarning(Common.GetNoChangeAlert);
                else if (this.skipAlert && this.IsNewOrSubmited == 2)
                    this.model.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.skipAlert = true;
            }
        }
    }
    fnSaveDraft(dynamicForm, IsUpload, uploadFormBuilder) {

        this.submitted = false;
       //delay(15000);
        let userId: number = parseInt(Common.GetSession("UserProfileId"));
        this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
        this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.ChildId;
        this.objSaveDraftInfoDTO.CreatedUserId = userId;
        this.objSaveDraftInfoDTO.UpdatedUserId = userId;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                //dynamicForm.forEach(item => {
                //    item.IsDocumentExist = true;
                //});
                this.fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder);
            }
        }
        else
            this.fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder);
        Common.SetSession("SaveAsDraft", "Y");
        // this.dynamicformcontrol.forEach(item => {
        //     if (item.FieldCnfg.FieldName == "AddtoSiblingsRecord" || item.FieldCnfg.FieldName == "AddtoParent/ChildRecord"
        //         || item.FieldCnfg.FieldName == "SelectSiblings") {
        //         item.IsVisible = false;
        //     }
        // });
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
                this.objChildDayLogJournal.SequenceNo = this.SequenceNo;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => {this.ResponeDraft(data, type, IsUpload)});
                //this.sdService.save(this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
            }
            else {
                this.saveAsDraftText=Common.GetSaveasDraftText;
                this.isLoadingSAD = true;
                this.showAutoSave = false;
                if (this.showAlert == false && this.IsNewOrSubmited == 1)
                    this.model.alertWarning(Common.GetNoChangeAlert);
                else if (this.showAlert == false && this.IsNewOrSubmited == 2)
                    this.model.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.showAlert = false;
                this.isLoadingSAD = false;
            }
        }
        else {
            this.isLoadingSAD = true;
            this.apiService.get(this.controllerName, "GetNextSequenceNo", this.formId).then(data => {
                this.SequenceNo = parseInt(data);
                this.tblPrimaryKey = this.SequenceNo;
                this.objChildDayLogJournal.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                //console.log(this.objSaveDraftInfoDTO);
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
                //this.sdService.save(this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
                dynamicForm.forEach(item => {
                    if (item.FieldName == "SelectSiblings" && item.FieldValue == true) {

                        let arrSiblings = item.FieldValue.split(',');
                        arrSiblings.forEach(sitem => {
                            this.objSaveDraftInfoDTO.SequenceNo = ++this.SequenceNo;
                            this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                            this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                            this.objSaveDraftInfoDTO.TypeId = parseInt(sitem);
                            this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.Respone(data, type, IsUpload, true));
                            //this.sdService.save(this.objSaveDraftInfoDTO).then(data => {
                            //    data => this.Respone(data, type, IsUpload, true)
                            //});
                        });
                    }
                    // if (item.FieldName == "AddtoParent/ChildRecord" && item.FieldValue == true) {
                    //     this.apiService.get("ChildProfile", "GetParentIds", this.ChildId).then(data => {
                    //         data.forEach(pitem => {
                    //             this.objSaveDraftInfoDTO.SequenceNo = ++this.SequenceNo;
                    //             this.objSaveDraftInfoDTO.TypeId = parseInt(pitem);
                    //             this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                    //             this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                    //             this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.Respone(data, type, IsUpload, true));
                    //             //this.sdService.save(this.objSaveDraftInfoDTO).then(data => {
                    //             //    data => this.Respone(data, type, IsUpload, true)
                    //             //});
                    //         });
                    //     });
                    // }
                });

            });
        }

    }
    private fnUpdateDynamicForm(dynamicForm, IsUpload) {
        dynamicForm.forEach(item => {
            if (IsUpload)
                item.IsDocumentExist = true;
            else
                item.IsDocumentExist = this.isUploadDoc;
            item.AgencyProfileId = this.AgencyProfileId;
            item.SequenceNo = this.SequenceNo;
            if (item.FieldName == "SaveAsDraftStatus")
                item.FieldValue = "1";
        });
    }
    private Respone(data, type, IsUpload, skipAlert: boolean) {
        if (data.IsError == true) {
            this.isLoading = false;
            this.model.alertDanger(data.ErrorMessage)
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
                    this.model.alertSuccess(Common.GetSaveSuccessfullMsg);
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
                    this.model.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            if (skipAlert) {
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                if (this.objQeryVal.mid == 16)
                    this._router.navigate(['/pages/referral/childdayloglist/16/'+this.objQeryVal.apage]);
                else
                    this._router.navigate(['/pages/child/childdaylogjournal/4/'+this.objQeryVal.apage]);
            }
            
            this.skipAlert = true;
            this.objChildDayLogJournal.IsSubmitted = true;
        }
    }
    private ResponeDraft(data, type, IsUpload) {
        this.isLoadingSAD = false;
        this.saveAsDraftText=Common.GetSaveasDraftText;
        if (data.IsError == true) {
            this.model.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
                if (!this.showAlert)
                    this.model.alertSuccess(Common.GetSaveDraftSuccessfullMsg);
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                if (!this.showAlert)
                    this.model.alertSuccess(Common.GetUpdateDraftSuccessfullMsg);
            }
            this.showAlert = false;
        }
    }
    fnDonloadPDF() {
        var carerName = this.CarerName.replace('/', '\'');
        window.location.href = this.apiURL + "GenerateChildDayLogPDF/" + this.ChildId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName + "," + this.SocialWorkerName;
        this.objUserAuditDetailDTO.ActionId =7;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnDonloadWord() {
        var carerName = this.CarerName.replace('/', '\'');
        window.location.href = this.apiURL + "GenerateChildDayLogWord/" + this.ChildId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName + "," + this.SocialWorkerName;
        this.objUserAuditDetailDTO.ActionId =6;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnPrint() {
        var carerName = this.CarerName.replace('/', '\'');
        this.apiService.get("GeneratePDF", "GenerateChildDayLogPrint", this.ChildId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName + "," + this.SocialWorkerName).then(data => {
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
            var carerName = this.CarerName.replace('/', '\'');
            this.isLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.ChildId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName + "," + this.SocialWorkerName;
            this.apiService.post("GeneratePDF", "EmailChildDayLog", this.objNotificationDTO).then(data => {
                if (data == true)
                {
                    this.model.alertSuccess("Email Send Successfully..");
                    this.objUserAuditDetailDTO.ActionId =9;
                    this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                    this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                    this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                    this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                    this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                    this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
                    Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                }                    
                else
                    this.model.alertDanger("Email not Send Successfully..");
                this.fnCancelClick();
                this.isLoading = false;
            });

        }
    }
    fnCancelClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoCancel.nativeElement.dispatchEvent(event);
    }
    DynamicOnValChange(InsValChange: ValChangeDTO) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "SiblingParentSno") {
            InsValChange.currnet.IsVisible = false;
        }
        else if (InsValChange.currnet.FieldCnfg.FieldName == "SocialWorkerId") {
            InsValChange.currnet.IsVisible = false;
        }
        else if (InsValChange.currnet.FieldCnfg.FieldName == "LASocialWorkerId") {
            InsValChange.currnet.IsVisible = false;
        }
        else if (InsValChange.currnet.FieldCnfg.FieldName == "SaveAsDraftStatus") {
            InsValChange.currnet.IsVisible = false;
        }
        else if (InsValChange.currnet.FieldCnfg.FieldName == "CarerChildSNo") {
            InsValChange.currnet.IsVisible = false;
        }
        else if (InsValChange.currnet.FieldCnfg.FieldName == "CarerParentId") {
            InsValChange.currnet.IsVisible = false;
        }
        // else if (InsValChange.currnet.FieldCnfg.FieldName == "NotificationEmailAddresses") {
        //     InsValChange.currnet.IsVisible = false;
        // }


        let insNotificationEmailAddresses = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "NotificationEmailAddresses");
        if (insNotificationEmailAddresses.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "NotificationDate") {
            if (InsValChange.newValue || InsValChange.currnet.FieldValue)
                insNotificationEmailAddresses[0].IsVisible = true;
            else
                insNotificationEmailAddresses[0].IsVisible = false;
        }
        if(Common.GetSession("HasChildParents")=='false')
        {
            if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoParent/ChildRecord") {
                InsValChange.currnet.IsVisible = false;
            }
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

}
    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('childDL180', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('childDL180', () => this.timer2callback());
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
                    this.objChildDayLogJournal.IsSubmitted = false;
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
        this.st.delTimer('childDL180');
    }
    private compareArray(a, b) {
        for (var i = 0, len = a.length; i < len; i++) {
            for (var j = 0, len = b.length; j < len - 1; j++) {
                if (a[i].FieldValue != b[j].FieldValue) {
                    return true;
                }
            }
        }
        return false;
    }
}
