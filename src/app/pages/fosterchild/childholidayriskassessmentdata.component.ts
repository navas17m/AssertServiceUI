import { APICallService } from '../services/apicallservice.service';
import { Component, Pipe, ViewChild, OnInit, Renderer2, ElementRef, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common, deepCopy, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat}  from  '../common'
import { ChildHolidayRiskAssessmentDTO} from './DTO/safeguardingdto'
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
    selector: 'childholidayriskassessmentdata',
    templateUrl: './childholidayriskassessmentdata.component.templste.html',
})

export class ChildHolidayRiskAssessmentDataComponent {
    controllerName = "ChildHolidayRiskAssessment";
    objChildHolidayRiskAssessmentDTO:ChildHolidayRiskAssessmentDTO=new ChildHolidayRiskAssessmentDTO();
   // objChildHolidayRiskAssessmentDTO: ChildRiskAssessmentNewComboDTO = new ChildRiskAssessmentNewComboDTO();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    submitted = false;
    dynamicformcontrol = [];
    dynamicformcontrolSignificant = [];
    dynamicformcontrolRiskCausing = [];
    dynamicformcontrolOG = [];
    _Form: FormGroup;
    SequenceNo:number;
    objQeryVal;
    //Doc
    //FormCnfgId;
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    ChildId: number;
    AgencyProfileId :number;
    CarerParentId;
    ChildDetailsActive = "active";
    ChildInformationActive;
    ChildRiskDetailsActive;
    DelegatedAuthorityActive;
    OtherActive
    DocumentActive;
    isLoading: boolean = false;
    accessAutoSave = false;
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
    ChildSSWName;
    //Print
    insChildDetailsTemp;
    ChildCode;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    //History
    @ViewChild('btnViewRiskAssessmentNew') infobtnViewRiskAssessmentNew: ElementRef;
    lstChildRiskAssessmentHistoryOG = [];
    lstChildRiskAssessmentHistory = [];
    hisChildRiskAssessmentHistory = [];
    @ViewChild('btnFCSingnatureRiskAssessmentNew') infobtnFCSingnatureRiskAssessmentNew: ElementRef;
    IsFCSignatureSigned=false;
    IsVisibleFCSing=false;
    lstSignificantOG = [];
    hislstSignificant = [];
    lstRisksCausingOG = [];
    hislstRisksCausing = [];
    isLoadinig=false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=370;
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private module: PagesComponent,
        private st: SimpleTimer, private renderer: Renderer2, private apiService: APICallService) {
        this.CarerName = Common.GetSession("CarerName");
        if (this.CarerName == "null") {
            this.CarerName = "Not Placed";
            this.CarerParentId = 0;
        }
        else this.CarerParentId = parseInt(Common.GetSession("CarerId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.route.params.subscribe(data => this.objQeryVal = data);

        if (this.objQeryVal.mid == 16) {
            if (Common.GetSession("ReferralChildId") != null && Common.GetSession("ReferralChildId") != "null") {
                this.ChildId = parseInt(Common.GetSession("ReferralChildId"));
            }
            else {
                Common.SetSession("UrlReferral", "pages/referral/childriskassessmentnew/16");
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);
            }
        }
        else if (this.objQeryVal.mid == 4) {
            if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null") {
                this.ChildId = parseInt(Common.GetSession("ChildId"));
            }
            else {
                Common.SetSession("UrlReferral", "pages/child/childriskassessmentnew/4");
                this._router.navigate(['/pages/child/childprofilelist/1/4']);
            }
        }

        if (Common.GetSession("SelectedChildProfile") != null) {
            this.insChildDetailsTemp = JSON.parse(Common.GetSession("SelectedChildProfile"));
            this.ChildCode = this.insChildDetailsTemp.ChildCode;
        }

        //Doc
        this.formId = 370;
        this.FormCnfgId = 370;
        this.TypeId = this.ChildId;
        this.tblPrimaryKey = this.objQeryVal.id;
        this.objChildHolidayRiskAssessmentDTO.ChildId=this.ChildId;

        this.SequenceNo=this.objQeryVal.id;
        this._Form = _formBuilder.group({});
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });

        /////////New
        this.objChildHolidayRiskAssessmentDTO.SequenceNo = this.objQeryVal.id;
        this.objChildHolidayRiskAssessmentDTO.AgencyProfileId = this.AgencyProfileId
        this.objChildHolidayRiskAssessmentDTO.ControlLoadFormat = ["DateProposedHoliday","Checklist", "PrePlanningBeforeBooking", "PlanningPrior", "ActivityHoliday","Others"];
        if (this.SequenceNo == 0 ) {
            apiService.post(this.controllerName, "GetDynamicControls", this.objChildHolidayRiskAssessmentDTO).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
                this. isLoadinig=true;
            });
        }

        if (this.SequenceNo != 0 && Common.GetSession("SaveAsDrafHoliday") == "N") {
            if (this.SequenceNo != 0)
                this.showbtnSaveDraft = false;
            apiService.post(this.controllerName, "GetDynamicControls", this.objChildHolidayRiskAssessmentDTO).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
                let val2 = data.filter(x => x.FieldCnfg.FieldName == "CarerParentId");
                if (val2.length > 0 && val2[0].FieldCnfg.DisplayName != null && val2[0].FieldCnfg.DisplayName != "") {
                    this.CarerName = val2[0].FieldCnfg.DisplayName;
                    this.CarerParentId = parseInt(val2[0].FieldValue);
                }
                let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null) {
                    this.ChildSSWName = val3[0].FieldCnfg.DisplayName;
                }
            });
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = this.objQeryVal.id;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.TypeId = this.ChildId;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                this.dynamicformcontrol =  JSON.parse(data.JsonData);
                this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
                let tempDoc = JSON.parse(data.JsonList);
                if (tempDoc != null)
                    this.isUploadDoc = tempDoc[0].IsDocumentExist;
            });
        }
        ////End

        if (Common.GetSession("ViweDisable") == '1') {
            this.objUserAuditDetailDTO.ActionId = 4;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
            this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    fnChildDetailsTab() {
        this.ChildDetailsActive = "active";
        this.ChildInformationActive = "";
        this.ChildRiskDetailsActive = "";
        this.DelegatedAuthorityActive = "";
        this.DocumentActive = "";
        this.OtherActive="";
    }

    fnChildInformationTab() {
        this.ChildDetailsActive = "";
        this.ChildInformationActive = "active";
        this.ChildRiskDetailsActive = "";
        this.DelegatedAuthorityActive = "";
        this.DocumentActive = "";
        this.OtherActive="";
    }
    fnChildRiskDetailsTab() {
        this.ChildDetailsActive = "";
        this.ChildInformationActive = "";
        this.ChildRiskDetailsActive = "active";
        this.DelegatedAuthorityActive = "";
        this.DocumentActive = "";
        this.OtherActive="";
    }
    fnDelegatedAuthorityTab() {
        this.ChildDetailsActive = "";
        this.ChildInformationActive = "";
        this.ChildRiskDetailsActive = "";
        this.DelegatedAuthorityActive = "active";
        this.DocumentActive = "";
        this.OtherActive="";
    }

    fnOtherTab() {
        this.ChildDetailsActive = "";
        this.ChildInformationActive = "";
        this.ChildRiskDetailsActive = "";
        this.DelegatedAuthorityActive = "";
        this.DocumentActive = "";
        this.OtherActive="active";
    }

    fnDocumentDetailTab() {
        this.ChildDetailsActive = "";
        this.ChildInformationActive = "";
        this.ChildRiskDetailsActive = "";
        this.DelegatedAuthorityActive = "";
        this.DocumentActive = "active";
        this.OtherActive="";
    }

    isDirty = true;
    DocOk = true;
    IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(dynamicForm, dynamicformbuilder,
        dynamicForm1, dynamicformbuilder1,
        dynamicForm2, dynamicformbuilder2,
        dynamicForm3, dynamicformbuilder3,
        dynamicForm4, dynamicformbuilder4,
        dynamicForm5, dynamicformbuilder5,
        UploadDocIds, IsUpload, uploadFormBuilder) {
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
            this.ChildInformationActive = "";
            this.ChildRiskDetailsActive = "";
            this.DelegatedAuthorityActive = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicformbuilder);
        }


        if (dynamicformbuilder.valid && this.DocOk) {


            dynamicForm1.forEach(item => {
                dynamicForm.push(item);
            });

            dynamicForm2.forEach(item => {
                dynamicForm.push(item);
            });
            dynamicForm3.forEach(item => {
                dynamicForm.push(item);
            });
            dynamicForm4.forEach(item => {
                dynamicForm.push(item);
            });
            dynamicForm5.forEach(item => {
                dynamicForm.push(item);
            });
            this.isDirty = true;
            if (Compare(dynamicForm, this.dynamicformcontrolOG)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {

                let val1 = dynamicForm.filter(x => x.FieldName == "CarerParentId");
                if (val1.length > 0 && (val1[0].FieldValue == null || val1[0].FieldValue == ''))
                    val1[0].FieldValue = Common.GetSession("CarerId");


                let val2 = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
                if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == '')) {
                    if (this.insChildDetails != null && this.insChildDetails.LocalAuthoritySWInfo != null && this.insChildDetails.LocalAuthoritySWInfo.LocalAuthoritySWInfoId)
                        val2[0].FieldValue = this.insChildDetails.LocalAuthoritySWInfo.LocalAuthoritySWInfoId;
                }

                let val22 = dynamicForm.filter(x => x.FieldName == "SaveAsDraftStatus");
                if (val22.length > 0)
                    val22[0].FieldValue = "0";

                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0 && Common.GetSession("SaveAsDrafHoliday") == "N"  )
                    type = "update";

                this.objChildHolidayRiskAssessmentDTO.AgencyProfileId = this.AgencyProfileId;
                this.objChildHolidayRiskAssessmentDTO.DynamicValue = dynamicForm;
                this.objChildHolidayRiskAssessmentDTO.ChildId = this.ChildId;
                this.objChildHolidayRiskAssessmentDTO.SequenceNo=this.SequenceNo;
                this.apiService.save(this.controllerName, this.objChildHolidayRiskAssessmentDTO,type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
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

    fnBack()
    {
        this._router.navigate(['/pages/child/holidayriskassessmentlist/4']);

    }

    private Respone(data, type, IsUpload, skipAlert: boolean) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {

            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol.filter(x => x.ControlLoadFormat != 'Significant' && x.ControlLoadFormat != 'Risk'));
            this.dynamicformcontrolOG = ConvertDateAndDateTimeSaveFormat(this.dynamicformcontrolOG);
            this.showbtnSaveDraft = false;

            if (type == "save") {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                if (skipAlert)
                    this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
            }
            else {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                if (skipAlert)
                    this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
            }
            if (skipAlert) {
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.formId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                this._router.navigate(['/pages/child/holidayriskassessmentlist/4']);
            }
            this.skipAlert = true;
            this.objChildHolidayRiskAssessmentDTO.IsSubmitted = true;
        }
    }
    private ResponeDraft(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {

            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol.filter(x => x.ControlLoadFormat != 'Significant' && x.ControlLoadFormat != 'Risk'));

            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
                if (!this.showAlert)
                    this.module.alertSuccess(Common.GetSaveDraftSuccessfullMsg);
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
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
    }
    fnSaveDraft(dynamicForm, dynamicForm1, dynamicForm2,
        dynamicForm3, dynamicForm4,dynamicForm5,
        IsUpload, uploadFormBuilder) {
        this.submitted = false;
        let userId: number = parseInt(Common.GetSession("UserProfileId"));
        this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
        this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
       // this.objSaveDraftInfoDTO.TypeId = this.ChildId;
        this.objSaveDraftInfoDTO.CreatedUserId = userId;
        this.objSaveDraftInfoDTO.UpdatedUserId = userId;

        dynamicForm1.forEach(item => {
            dynamicForm.push(item);
        });

        dynamicForm2.forEach(item => {
            dynamicForm.push(item);
        });
        dynamicForm3.forEach(item => {
            dynamicForm.push(item);
        });
        dynamicForm4.forEach(item => {
            dynamicForm.push(item);
        });
        dynamicForm5.forEach(item => {
            dynamicForm.push(item);
        });


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
        //console.log(this.dynamicformcontrol);
        let type = "save";
        if (this.SequenceNo > 0) {
                type = "update";

            this.isDirty = true;
            if (CompareSaveasDraft(this.dynamicformcontrol, this.dynamicformcontrolOG)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.objChildHolidayRiskAssessmentDTO.SequenceNo = this.SequenceNo;
                 this.objChildHolidayRiskAssessmentDTO.DynamicValue = this.dynamicformcontrol;

                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objSaveDraftInfoDTO.TypeId=this.ChildId;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
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
        else {
            this.apiService.get(this.controllerName, "GetNextSequenceNo", this.formId).then(data => {
                this.SequenceNo = parseInt(data);
                this.objChildHolidayRiskAssessmentDTO.SequenceNo = this.SequenceNo;
                this.objChildHolidayRiskAssessmentDTO.DynamicValue = this.dynamicformcontrol;

                this.objChildHolidayRiskAssessmentDTO.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objSaveDraftInfoDTO.TypeId=this.ChildId;
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
        this.st.newTimer('ChildRiskNew180', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('ChildRiskNew180', () => this.timer2callback());
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
                    this.objChildHolidayRiskAssessmentDTO.IsSubmitted = false;
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
        this.st.delTimer('ChildRiskNew180');
    }
    fnDonloadPDF() {
        var carerName = this.CarerName.replace('/', '\'');
        window.location.href = this.apiURL + "GenerateChildHolidayRiskAssessmentPDF/" + this.ChildId + "," + this.SequenceNo + "," + this.AgencyProfileId  ;
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
        var carerName = this.CarerName.replace('/', '\'');
        window.location.href = this.apiURL + "GenerateChildHolidayRiskAssessmentWord/" + this.ChildId + "," + this.SequenceNo + "," + this.AgencyProfileId ;
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
        var carerName = this.CarerName.replace('/', '\'');
        this.apiService.get("GeneratePDF", "GenerateChildHolidayRiskAssessmentPrint", this.ChildId + "," + this.SequenceNo + "," + this.AgencyProfileId ).then(data => {
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
            this.objNotificationDTO.Body = this.ChildId + "," + this.SequenceNo + "," + this.AgencyProfileId  ;
            this.apiService.post("GeneratePDF", "EmailChildHolidayRiskAssessment", this.objNotificationDTO).then(data => {
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
