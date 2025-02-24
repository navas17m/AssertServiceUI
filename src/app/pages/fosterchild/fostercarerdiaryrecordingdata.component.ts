import { Component, Pipe, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Common, deepCopy, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat}  from  '../common'
import { FosterCarerDiaryRecording } from './DTO/fostercarerdiaryrecording'
import { ValChangeDTO} from '../dynamic/ValChangeDTO';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import {SimpleTimer} from 'ng2-simple-timer';
//import { ConfigTableValuesService} from '../services/configtablevalues.service'
import { ConfigTableNames } from '../configtablenames'
import { ConfigTableNamesDTO} from '../superadmin/DTO/configtablename';
import { environment } from '../../../environments/environment';
import { APICallService } from '../services/apicallservice.service';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { PreviewNextValueService } from '../common/previewnextvalueservice.component'
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
declare var window: any;
declare var $: any;

//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'fostercarerdiaryrecordingdata',
    templateUrl: './fostercarerdiaryrecordingdata.component.template.html',
})

export class FosterCarerDiaryRecordingDataComponent {
    @ViewChild('btnLockModel') lockModal: ElementRef;
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    apiURL = environment.api_url + "/api/GeneratePDF/";
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objFosterCarerDiaryRecording: FosterCarerDiaryRecording = new FosterCarerDiaryRecording();
    submitted = false; submittedUpload = false;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    dynamicformcontrol = []; dynamicformcontrolOrginal = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    formId; tblPrimaryKey;
    @ViewChild('uploads') uploadCtrl;
    TypeId;
    CarerName; UserName;
    CarerSSWName;
    CarerParentId;
    ChildID: number;
    AgencyProfileId: number;
    ShowSubmitLockBtn = true;
    FCDiaryRecordingTabActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    isLoadingSAD: boolean = false;
    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true;
    showAlert: boolean = false; isUploadDoc: boolean = false;
    controllerName = "FosterCarerDiaryRecording";
    lstSubject:any=[];
    isSujectChangedFirsttime=false;
    LASocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=84;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private _router: Router, private modal: PagesComponent,
        private st: SimpleTimer, private renderer: Renderer2,
        //private _cnfgTblValueServices: ConfigTableValuesService,
        private insPreviewNextValueService:PreviewNextValueService) {
        this.route.params.subscribe(data => this.objQeryVal = data);

        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.LASocialWorkerId = Common.GetSession("ChildLASocialWorkerId");
        this.objFosterCarerDiaryRecording.AgencyProfileId = this.AgencyProfileId;
        this.objFosterCarerDiaryRecording.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objFosterCarerDiaryRecording.SequenceNo = this.SequenceNo;

        } else {
            this.objFosterCarerDiaryRecording.SequenceNo = 0;
            apiService.post(this.controllerName, "GetDynamicControls", this.objFosterCarerDiaryRecording).then(data => {
                this.dynamicformcontrol = data.filter((x:any)=>x.ControlLoadFormat=='Default');
                let getSubject=data.filter((x:any)=> x.FieldCnfg.FieldName == "Subject");
                if(getSubject.length>0)
                {
                   this.lstSubject=getSubject[0].ConfigTableValues;
                   this.isSujectChangedFirsttime=true;
                }
            });
        }


        //Doc
        this.formId = 84;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;

        this._Form = _formBuilder.group({});

        this.CarerName = Common.GetSession("CarerName");
        if (this.CarerName == "null")
            this.CarerName = "Not Placed";

        this.CarerSSWName = Common.GetSession("SSWName");
        if (this.CarerSSWName == "null")
            this.CarerSSWName = "Not Assigned";

        this.UserName = Common.GetSession("UserName");

        if (Common.GetSession("SaveAsDraft") == "N") {
            if (this.SequenceNo != 0) {
                this.showbtnSaveDraft = false;
                this.ShowSubmitLockBtn = false;
            }
            apiService.post(this.controllerName, "GetDynamicControls", this.objFosterCarerDiaryRecording).then(data => {
                this.dynamicformcontrol = data.filter((x:any)=>x.ControlLoadFormat=='Default');;
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);

                let getSubject=data.filter((x:any)=> x.FieldCnfg.FieldName == "Subject");
                if(getSubject.length>0)
                {
                   this.lstSubject=getSubject[0].ConfigTableValues;
                }

                let val1 = data.filter(x => x.FieldCnfg.FieldName == "UpdatedUserId");
                if (val1.length > 0 && val1[0].FieldCnfg.DisplayName != null)
                    this.UserName = val1[0].FieldCnfg.DisplayName;

                let val2 = data.filter(x => x.FieldCnfg.FieldName == "CarerParentId");
                if (val2.length > 0 && val2[0].FieldCnfg.DisplayName != null && val2[0].FieldCnfg.DisplayName != "") {
                    this.CarerName = val2[0].FieldCnfg.DisplayName;
                }

                let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                    this.CarerSSWName = val3[0].FieldCnfg.DisplayName;

                    this.isSujectChangedFirsttime=true;
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

                let getSubject=this.dynamicformcontrol.filter((x:any)=> x.FieldCnfg.FieldName == "Subject");
                if(getSubject.length>0)
                {
                   this.lstSubject=getSubject[0].ConfigTableValues;
                }
                this.isSujectChangedFirsttime=false;
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
        this.objFosterCarerDiaryRecording.SequenceNo = SequenceNo;
            this.objFosterCarerDiaryRecording.AgencyProfileId = this.AgencyProfileId;
            this.objFosterCarerDiaryRecording.ChildId = this.ChildID;
            if(tempObj.value.SaveAsDraftStatus=="Submitted")
            {
                this.apiService.post(this.controllerName, "GetDynamicControls", this.objFosterCarerDiaryRecording).then(data => {
                // console.log(data);
                    if(data && data[0].UniqueID!=0)
                    {
                        this.dynamicformcontrol.forEach(item=>{
                            let inFieldValue = data.filter(subItem => subItem.FieldCnfg.FieldCnfgId == item.FieldCnfg.FieldCnfgId)[0].FieldValue;
                            item.UniqueID = data.filter(subItem => subItem.FieldCnfg.FieldCnfgId == item.FieldCnfg.FieldCnfgId)[0].UniqueID;
                            switch (item.FieldCnfg.FieldDataTypeCnfg.Name) {
                                case "date":
                                    {
                                        item.FieldValue= this.modal.GetDateEditFormat(inFieldValue);
                                        break;
                                    }
                                case "datetime":
                                    {
                                        item.FieldValue = this.modal.GetDateTimeEditFormat(inFieldValue);
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

                        // console.log(this.dynamicformcontrol);
                        // console.log(this.dynamicformcontrolOrginal);

                        let val1 = data.filter(x => x.FieldCnfg.FieldName == "UpdatedUserId");
                        if (val1.length > 0 && val1[0].FieldCnfg.DisplayName != null)
                            this.UserName = val1[0].FieldCnfg.DisplayName;

                        let val2 = data.filter(x => x.FieldCnfg.FieldName == "CarerParentId");
                        if (val2.length > 0 && val2[0].FieldCnfg.DisplayName != null && val2[0].FieldCnfg.DisplayName != "") {
                            this.CarerName = val2[0].FieldCnfg.DisplayName;
                        }

                        let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                        if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                            this.CarerSSWName = val3[0].FieldCnfg.DisplayName;

                        Common.SetSession("SaveAsDraft","N");
                        this.showbtnSaveDraft = false;
                        this.ShowSubmitLockBtn = false;
                    }
                });
            }
            else
            {
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
                this.objSaveDraftInfoDTO.TypeId = this.ChildID;
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
                        //             item.FieldValue= this.modal.GetDateEditFormat(inFieldValue);
                        //             break;
                        //         }
                        //     case "datetime":
                        //         {
                        //             item.FieldValue = this.modal.GetDateTimeEditFormat(inFieldValue);
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
                    this.ShowSubmitLockBtn = true;
                });
            }

    }

    fnBack()
    {
        this._router.navigate(['/pages/child/fostercarerdiaryrecordinglist/4/'+this.objQeryVal.apage]);
    }

    fnFCDiaryRecordingTab() {
        this.FCDiaryRecordingTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.FCDiaryRecordingTabActive = "";
        this.DocumentActive = "active";
    }

    fnLockConfirmClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.lockModal.nativeElement.dispatchEvent(event);
    }
    isDirty = true;
    DocOk = true; IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds, inslockValue) {
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
        // alert(inslockValue);
        if (!mainFormBuilder.valid) {
            this.FCDiaryRecordingTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.FCDiaryRecordingTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.FCDiaryRecordingTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }


        // console.log(dynamicForm);


        if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '' && this.DocOk) {
            this.isDirty = true;
          //  console.log(dynamicForm);
           // console.log(this.dynamicformcontrolOrginal);

          //  console.log("111111111111111111111111");

            if (this.SequenceNo != 0 && Compare(dynamicForm, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y")){
                let val = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
                if (val.length > 0 && (val[0].FieldValue == null || val[0].FieldValue == ''))
                    val[0].FieldValue = Common.GetSession("SSWId");

                let valLASW = dynamicForm.filter(x => x.FieldName == "LASocialWorkerId");
                if (valLASW.length > 0 && (valLASW[0].FieldValue == null || valLASW[0].FieldValue == ''))
                  valLASW[0].FieldValue = this.LASocialWorkerId;
                }
                let valCP = dynamicForm.filter(x => x.FieldName == "CarerParentId");
                if (valCP.length > 0 && (valCP[0].FieldValue == null || valCP[0].FieldValue == ''))
                    valCP[0].FieldValue = Common.GetSession("CarerId");

                let valLock = dynamicForm.filter(x => x.FieldName == "IsLocked");
                if (valLock.length > 0 && (valLock[0].FieldValue == null || valLock[0].FieldValue == "0")) {
                    valLock[0].FieldValue = inslockValue;
                }

                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraft") == "N")
                    type = "update";
                this.objFosterCarerDiaryRecording.NotificationEmailIds = EmailIds;
                this.objFosterCarerDiaryRecording.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.objFosterCarerDiaryRecording.SequenceNo = this.SequenceNo;
                this.objFosterCarerDiaryRecording.DynamicValue = dynamicForm;
                this.objFosterCarerDiaryRecording.ChildId = this.ChildID;
                this.apiService.save(this.controllerName, this.objFosterCarerDiaryRecording, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
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

        let val1 = dynamicForm.filter(x => x.FieldName == "CarerParentId");
        if (val1.length > 0)
            val1[0].FieldValue = Common.GetSession("CarerId");

        let val2 = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
        if (val2.length > 0)
            val2[0].FieldValue = Common.GetSession("SSWId");

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

        let val1 = dynamicForm.filter(x => x.FieldName == "CarerParentId");
        if (val1.length > 0)
            val1[0].FieldValue = Common.GetSession("CarerId");

        let val2 = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
        if (val2.length > 0)
            val2[0].FieldValue = Common.GetSession("SSWId");

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
                this.objFosterCarerDiaryRecording.SequenceNo = this.SequenceNo;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload, false));
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
                this.objFosterCarerDiaryRecording.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);

                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                //console.log(this.objSaveDraftInfoDTO);
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload, false));
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
            //if (item.FieldName == "IsLocked") {
            //    if (item.FieldValue == "1")
            //        item.FieldValue = "Yes";
            //    else
            //        item.FieldValue = "No";
            //}
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
                this._router.navigate(['/pages/child/fostercarerdiaryrecordinglist/4/'+this.objQeryVal.apage]);
            }
                
            this.skipAlert = true;
            this.objFosterCarerDiaryRecording.IsSubmitted = true;
        }
    }
    private ResponeDraft(data, type, IsUpload, skipAlert: boolean) {
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
    //lstSubject = [];
    DynamicOnValChange(InsValChange: ValChangeDTO) {
        //if (this.SequenceNo != 0 && this.SequenceNo != null) {
        //    if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord") {
        //        InsValChange.currnet.IsVisible = false;
        //    }
        //}
        if (InsValChange.currnet.FieldCnfg.FieldName == "SiblingParentSno") {
            InsValChange.currnet.IsVisible = false;
        }
         if (InsValChange.currnet.FieldCnfg.FieldName == "SaveAsDraftStatus") {
            InsValChange.currnet.IsVisible = false;
        }
         if (InsValChange.currnet.FieldCnfg.FieldName == "IsLocked") {
            InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "LASocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }
        //  if (InsValChange.currnet.FieldCnfg.FieldName == "NotificationEmailAddresses" && InsValChange.newValue==null) {
        //     InsValChange.currnet.IsVisible = false;
        //    // console.log(InsValChange);
        // }

        let insNotificationEmailAddresses = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "NotificationEmailAddresses");
        if (insNotificationEmailAddresses.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "NotificationDate") {

          //  console.log(InsValChange);
            if (InsValChange.currnet.FieldValue)
                insNotificationEmailAddresses[0].IsVisible = true;
            else
                insNotificationEmailAddresses[0].IsVisible = false;
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


        let CarerParentId = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "CarerParentId");
        if (CarerParentId.length > 0)
            CarerParentId[0].IsVisible = false;


        let SocialWorkerId = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
        if (SocialWorkerId.length > 0)
            SocialWorkerId[0].IsVisible = false;



        if (InsValChange.currnet.FieldCnfg.FieldName == "EntryTypeId" && InsValChange.newValue != null && InsValChange.newValue != 0) {

            let Subject = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "Subject");
            if (Subject.length > 0) {
                if (!this.showbtnSaveDraft ) {
                    Subject[0].ConfigTableValues = [];
                    let filterSubject = this.lstSubject.filter(x => x.ParentId == InsValChange.newValue);
                    if (filterSubject.length > 0) {
                        Subject[0].ConfigTableValues = filterSubject;
                        let checkValid = filterSubject.filter(x => x.CofigTableValuesId == Subject[0].FieldValue);
                        if (checkValid.length == 0) {
                            Subject[0].FieldValue = null;
                        }
                    }
                }
                else if(this.isSujectChangedFirsttime==true) {
                    this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
                    this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
                    this.objConfigTableNamesDTO.Name = ConfigTableNames.DiaryRecordingSubject;
                    //this._cnfgTblValueServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => {
                    this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => {
                        let ConfigTableValues = data.filter(x => x.ParentId == InsValChange.newValue);
                        if (ConfigTableValues.length > 0) {
                            Subject[0].ConfigTableValues = ConfigTableValues;
                        }
                        else
                            Subject[0].ConfigTableValues = [];
                    });
                }
                this.isSujectChangedFirsttime=true;
            }
        }

    }
    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('fcDR180', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('fcDR180', () => this.timer2callback());
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
                    this.objFosterCarerDiaryRecording.IsSubmitted = false;
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
        this.st.delTimer('fcDR180');
    }

    fnDonloadPDF() {
        var carerName = this.CarerName.replace('/', '\'');
        window.location.href = this.apiURL + "GenerateDiaryRecordingPDF/" + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName + "," + this.CarerSSWName;
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
        window.location.href = this.apiURL + "GenerateDiaryRecordingWord/" + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName + "," + this.CarerSSWName;
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
        this.apiService.get("GeneratePDF", "GenerateDiaryRecordingPrint", this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName + "," + this.CarerSSWName).then(data => {
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
            this.objNotificationDTO.Body = this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + carerName + "," + this.CarerSSWName;
            this.apiService.post("GeneratePDF", "EmailDiaryRecording", this.objNotificationDTO).then(data => {
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
