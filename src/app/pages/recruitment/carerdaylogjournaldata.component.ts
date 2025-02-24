import { UserAuditHistoryDetailDTO } from './../common';
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
import { PreviewNextValueService } from '../common/previewnextvalueservice.component'
//deepCopy, Compare
import { CarerDayLogJournal } from './DTO/carerdaylogjournal';
import { sequence } from '@angular/animations';
declare var window: any;
declare var $: any;
import * as moment from 'moment';
//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'carerdaylogjournaldata',
    templateUrl: './carerdaylogjournaldata.component.template.html',
})

export class CarerDayLogJournalData {
    controllerName = "CarerDayLogJournal";
    objCarerDayLogJournal: CarerDayLogJournal = new CarerDayLogJournal();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    submitted = false;
    dynamicformcontrol = [];
    dynamicformcontrolOrginal = [];

    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    //Doc
    FormCnfgId;
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerParentId: number;
    AgencyProfileId;
    DaylogTabActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    draftSavedTime; isLoadingSAD: boolean = false;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true;
    showAlert: boolean = false; isUploadDoc: boolean = false;
    SocialWorkerName;
    SocialWorkerId;
    UserName;
    DateofEntry = new Date();
    //Print
    insCarerDetails;
    CarerCode;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private module: PagesComponent,
        private st: SimpleTimer, private renderer: Renderer2, private apiService: APICallService,
        private insPreviewNextValueService:PreviewNextValueService) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.SequenceNo = this.objQeryVal.Id;
        if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 50;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.SocialWorkerName = Common.GetSession("ACarerSSWName");
            this.SocialWorkerId = Common.GetSession("ACarerSSWId");
            if (Common.GetSession("SelectedCarerProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
            }
        } else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 30;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.SocialWorkerName = Common.GetSession("CarerSSWName");
            this.SocialWorkerId = Common.GetSession("CarerSSWId");
            if (Common.GetSession("SelectedApplicantProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
            }
        }

        if (this.SocialWorkerName == "null")
            this.SocialWorkerName = "Not Assigned";
        this.UserName = Common.GetSession("UserName");

        //Doc
        this.formId = 30;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.SequenceNo;
        this.objCarerDayLogJournal.SequenceNo = this.SequenceNo;

        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objCarerDayLogJournal.SequenceNo = this.SequenceNo;
        } else {
            this.objCarerDayLogJournal.SequenceNo = 0;
            this.objCarerDayLogJournal.CarerParentId = this.CarerParentId;
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerDayLogJournal).then(data => {
                this.dynamicformcontrol = data;
                let val1 = data.filter(x => x.FieldCnfg.FieldName == "UpdatedUserId");
                if (val1.length > 0 && val1[0].FieldCnfg.DisplayName != null)
                    this.UserName = val1[0].FieldCnfg.DisplayName;

                let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                    this.SocialWorkerName = val3[0].FieldCnfg.DisplayName;

                let val4 = data.filter(x => x.FieldCnfg.FieldName == "CreatedDate");
                if (val4.length > 0 && val4[0].FieldValue != null)
                    this.DateofEntry = val4[0].FieldValue;
            });
        }

        this._Form = _formBuilder.group({});
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });

        this.AgencyProfileId = Common.GetSession("AgencyProfileId");
        if (Common.GetSession("SaveAsDraft") == "N") {
            if (this.SequenceNo != 0)
                this.showbtnSaveDraft = false;
            this.objCarerDayLogJournal.SequenceNo = this.objQeryVal.Id;
            this.objCarerDayLogJournal.AgencyProfileId = this.AgencyProfileId;
            this.objCarerDayLogJournal.CarerParentId = this.CarerParentId;
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerDayLogJournal).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                let val1 = data.filter(x => x.FieldCnfg.FieldName == "UpdatedUserId");
                if (val1.length > 0 && val1[0].FieldCnfg.DisplayName != null)
                    this.UserName = val1[0].FieldCnfg.DisplayName;

                let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                    this.SocialWorkerName = val3[0].FieldCnfg.DisplayName;

                let val4 = data.filter(x => x.FieldCnfg.FieldName == "CreatedDate");
                if (val4.length > 0 && val4[0].FieldValue != null)
                    this.DateofEntry = val4[0].FieldValue;
            });

        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = this.objQeryVal.Id;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                this.dynamicformcontrol = JSON.parse(data.JsonData);
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                let tempDoc = JSON.parse(data.JsonList);
                if (tempDoc != null)
                    this.isUploadDoc = tempDoc[0].IsDocumentExist;
            });
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
    }
    fnFindPreviewSeqNo()
    {
        // console.log("previous");
     //  console.log(this.insPreviewNextValueService.GetListValues());
       // console.log("old");

        const index= this.insPreviewNextValueService.GetListValues().findIndex(x=> x.key===this.SequenceNo);
        let tempObj = this.insPreviewNextValueService.GetListValues()[index+1];
      //  console.log(tempObj);
        //let val=this.insPreviewNextValueService.GetListValues().filter(x=> x.key > tempObj.key)
        //console.log(val);
        if(tempObj)
        {
          //  console.log(val[val.length-1].key);
            this.SequenceNo=tempObj.key;
            this.tblPrimaryKey=this.SequenceNo;
            this.fnLoadPreviewNextData(tempObj)
            this.uploadCtrl.fnSetPrimaryKeyId(this.SequenceNo);
        }
    }
    fnFindNextSeqNo()
    {
       // console.log("next");
      //   console.log(this.insPreviewNextValueService.GetListValues());
        // console.log(this.SequenceNo);
        const index= this.insPreviewNextValueService.GetListValues().findIndex(x=> x.key===this.SequenceNo);
        let tempObj = this.insPreviewNextValueService.GetListValues()[index-1];
      //  console.log(tempObj);
       // let val=this.insPreviewNextValueService.GetListValues().filter(x=>x.key< tempObj.key)
        if(tempObj)
        {
           // console.log(val[0].key);
            this.SequenceNo=tempObj.key;
            this.tblPrimaryKey=this.SequenceNo;
            this.fnLoadPreviewNextData(tempObj);
            this.uploadCtrl.fnSetPrimaryKeyId(this.SequenceNo);
        }
    }

    fnLoadPreviewNextData(tempObj)
    {
       // console.log(tempObj)
        let SequenceNo=tempObj.key;
      //  console.log(SequenceNo);
        this.tblPrimaryKey = SequenceNo;
        this.objCarerDayLogJournal.SequenceNo = SequenceNo;
            this.objCarerDayLogJournal.AgencyProfileId = this.AgencyProfileId;
            this.objCarerDayLogJournal.CarerParentId = this.CarerParentId;
            if(tempObj.value.SaveAsDraftStatus=="Submitted")
            {


            this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerDayLogJournal).then(data => {
               // console.log(data);
                if(data && data[0].UniqueID!=0)
                {
                    this.dynamicformcontrol.forEach(item=>{
                        let inFieldValue = data.filter(subItem => subItem.FieldCnfg.FieldCnfgId == item.FieldCnfg.FieldCnfgId)[0].FieldValue;
                        item.UniqueID = data.filter(subItem => subItem.FieldCnfg.FieldCnfgId == item.FieldCnfg.FieldCnfgId)[0].UniqueID;
                        switch (item.FieldCnfg.FieldDataTypeCnfg.Name) {
                            case "date":
                                {
                                    item.FieldValue= this.module.GetDateEditFormat(inFieldValue);
                                    break;
                                }
                            case "datetime":
                                {
                                    item.FieldValue = this.module.GetDateTimeEditFormat(inFieldValue);
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
                    // console.log("22222222222");
                    // console.log(tempObj.value);
                    this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
                    this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
                    this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
                    this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
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
                        //             item.FieldValue= this.module.GetDateEditFormat(inFieldValue);
                        //             break;
                        //         }
                        //     case "datetime":
                        //         {
                        //             item.FieldValue = this.module.GetDateTimeEditFormat(inFieldValue);
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

        if (this.objQeryVal.mid == 13)
        this._router.navigate(['/pages/recruitment/carerdaylogjournallist/13/'+this.objQeryVal.apage]);
        else
        this._router.navigate(['/pages/fostercarer/carerdaylogjournallist/3/'+this.objQeryVal.apage]);
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
    DocOk = true;
    IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
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

        if (!subformbuilder.valid) {
            this.DaylogTabActive = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.DaylogTabActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }
        if (subformbuilder.valid && this.DocOk) {
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
                let val2 = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
                if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == ''))
                    val2[0].FieldValue = this.SocialWorkerId;
                }

                // let val23 = dynamicForm.filter(x => x.FieldName == "SaveAsDraftStatus");
                // if (val23.length > 0)
                //     val23[0].FieldValue =0;

                this.objCarerDayLogJournal.NotificationEmailIds = EmailIds;
                this.objCarerDayLogJournal.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.objCarerDayLogJournal.AgencyProfileId = this.AgencyProfileId;
                this.objCarerDayLogJournal.DynamicValue = dynamicForm;
                this.objCarerDayLogJournal.CarerParentId = this.CarerParentId;
                this.apiService.save(this.controllerName, this.objCarerDayLogJournal, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
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
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                if (skipAlert)
                    this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadChildSiblingNParent(data.lstChildSiblingNParent);
                }
            }
            else {
                this.isLoading = false;
                this.submitText=Common.GetSubmitText;
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                if (skipAlert)
                    this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadChildSiblingNParent(data.lstChildSiblingNParent);
                }
            }
            if (skipAlert) {
              this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
              this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
              this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
              this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
              this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
              Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                if (this.objQeryVal.mid == 13)
                    this._router.navigate(['/pages/recruitment/carerdaylogjournallist/13/'+this.objQeryVal.apage]);
                else
                    this._router.navigate(['/pages/fostercarer/carerdaylogjournallist/3/'+this.objQeryVal.apage]);
            }
            this.skipAlert = true;
            this.objCarerDayLogJournal.IsSubmitted = true;
        }
    }
    private ResponeDraft(data, type, IsUpload) {
        this.isLoadingSAD = false;
        this.saveAsDraftText=Common.GetSaveasDraftText;
        this.isLoading = false;
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
        else if (InsValChange.currnet.FieldCnfg.FieldName == "CarerChildSNo") {
            InsValChange.currnet.IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "SocialWorkerId") {
            InsValChange.currnet.IsVisible = false;
        }

        // if (InsValChange.currnet.FieldCnfg.FieldName == "NotificationEmailAddresses") {
        //     InsValChange.currnet.IsVisible = false;
        // }


        let insNotificationEmailAddresses = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "NotificationEmailAddresses");
        if (insNotificationEmailAddresses.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "NotificationDate") {
            if (InsValChange.newValue || InsValChange.currnet.FieldValue)
                insNotificationEmailAddresses[0].IsVisible = true;
            else
                insNotificationEmailAddresses[0].IsVisible = false;
        }
    }
    fnSaveDraft(dynamicForm, IsUpload, uploadFormBuilder) {
        this.submitted = false;
        let userId: number = parseInt(Common.GetSession("UserProfileId"));
        this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
        this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
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
        this.dynamicformcontrol.forEach(item => {
            if (item.FieldCnfg.FieldName == "SaveAsDraftStatus") {
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
                this.isLoadingSAD = true;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objCarerDayLogJournal.SequenceNo = this.SequenceNo;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                //this.sdService.save(this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
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
                this.SequenceNo = parseInt(data);
                this.tblPrimaryKey = this.SequenceNo;
                this.objCarerDayLogJournal.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);

                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                //console.log(this.objSaveDraftInfoDTO);
                //this.sdService.save(this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));

            });

        }

    }
    private fnUpdateDynamicForm(dynamicForm, IsUpload) {
        dynamicForm.forEach(item => {
            item.AgencyProfileId = this.AgencyProfileId;
            item.SequenceNo = this.SequenceNo;
            item.CarerParentId = this.CarerParentId;
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
        this.st.newTimer('carerDaylog180', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('carerDaylog180', () => this.timer2callback());
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
                    this.objCarerDayLogJournal.IsSubmitted = false;
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
        this.st.delTimer('carerDaylog180');
    }


    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateCarerDaylogPDF/" + this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
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
        window.location.href = this.apiURL + "GenerateCarerDaylogWord/" + this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
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
        this.apiService.get("GeneratePDF", "GenerateCarerDaylogPrint", this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId).then(data => {
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
            this.apiService.post("GeneratePDF", "EmailCarerDaylog", this.objNotificationDTO).then(data => {
                if (data == true){
                    this.module.alertSuccess("Email Send Successfully..");
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
