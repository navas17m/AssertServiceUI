import { Location } from '@angular/common';
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
import { CarerHealthAndSafetyDTO } from './DTO/carerhealthandsafetydto';
declare var window: any;
declare var $: any;
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'carerhealthandsafetydata',
    templateUrl: './carerhealthandsafetydata.component.template.html',
})

export class CarerHealthAndSafetyDataComponent {
    controllerName = "CarerHealthAndSafetyInfo";
    objCarerHealthAndSafetyDTO: CarerHealthAndSafetyDTO = new CarerHealthAndSafetyDTO();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    submitted = false;
    dynamicformcontrol = [];
    dynamicformcontrolOrginal = [];

    _Form: FormGroup;
    isVisibleMandatoryMsg;
    SequenceNo;
    objQeryVal;
    //Doc
    formId;
    FormCnfgId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerParentId: number;
    AgencyProfileId: number;
    //Visible tab
    PageHCBVisibleTab = true;
    PageIndoorAVisibleTab = true;
    PageIndoorBVisibleTab = true;
    PageIndoorCVisibleTab = true;
    PageIndoorDVisibleTab = true;
    PageIndoorEVisibleTab = true;
    PageOutdoorVisibleTab = true;
    PageBriefVisibleTab = true;
    //Active Tab
    PageHCAActive = "active";
    PageHCBActive;
    PageIndoorAActive;
    PageIndoorBActive;
    PageIndoorCActive;
    PageIndoorDActive;
    PageIndoorEActive;
    PageOutdoorActive;
    PageBriefActive;
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
    //Print
    insCarerDetails;
    CarerCode; SocialWorkerId;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    isLoadingSAD: boolean = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private location: Location, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private module: PagesComponent,
        private st: SimpleTimer, private renderer: Renderer2
        , private apiService: APICallService) {

        this.route.params.subscribe(data => this.objQeryVal = data);

        if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 46;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.SocialWorkerId = Common.GetSession("ACarerSSWId");
            if (Common.GetSession("SelectedCarerProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
            }
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 26;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.SocialWorkerId = Common.GetSession("CarerSSWId");
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

        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objCarerHealthAndSafetyDTO.AgencyProfileId = this.AgencyProfileId;
        this.objCarerHealthAndSafetyDTO.CarerParentId = this.CarerParentId;
        this.objCarerHealthAndSafetyDTO.ControlLoadFormat = ["Conditions A", "Conditions B", "Indoors A", "Indoors B", "Indoors C", "Indoors D", "Indoors E", "Outdoors", "Brief"];
        this.SequenceNo = this.objQeryVal.Id;
        //Doc
        this.formId = 26;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.SequenceNo;

        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objCarerHealthAndSafetyDTO.SequenceNo = this.SequenceNo;
        } else {
            this.objCarerHealthAndSafetyDTO.SequenceNo = 0;
            // cdlServics.getByFormCnfgId(this.objCarerHealthAndSafetyDTO).then(data => { this.dynamicformcontrol = data; });

            this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerHealthAndSafetyDTO).then(data => {
                this.dynamicformcontrol = data;
                this.setVisibleTab();
            });
        }

        this._Form = _formBuilder.group({});

        if (Common.GetSession("SaveAsDraft") == "N") {
            if (this.SequenceNo != 0)
                this.showbtnSaveDraft = false;
            this.objCarerHealthAndSafetyDTO.SequenceNo = this.SequenceNo;
            this.objCarerHealthAndSafetyDTO.AgencyProfileId = this.AgencyProfileId;
            this.objCarerHealthAndSafetyDTO.CarerParentId = this.CarerParentId;
            //cdlServics.getByFormCnfgId(this.objCarerHealthAndSafetyDTO).then(data => {
            //    this.dynamicformcontrol = data;
            //});
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerHealthAndSafetyDTO).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                this.setVisibleTab();
            });
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = this.objQeryVal.Id;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            //this.sdService.getById(this.objSaveDraftInfoDTO).then(data => {
            //    this.dynamicformcontrol = JSON.parse(data.JsonData);
            //});

            this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                this.dynamicformcontrol = JSON.parse(data.JsonData);
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                let tempDoc = JSON.parse(data.JsonList);
                if (tempDoc != null)
                    this.isUploadDoc = tempDoc[0].IsDocumentExist;
                this.setVisibleTab();
            });
        }
    }

    fnPageHCA() {
        this.PageHCAActive = "active";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }
    fnPageHCB() {
        this.PageHCAActive = "";
        this.PageHCBActive = "active";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }
    fnPageIndoorA() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "active";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }
    fnPageIndoorB() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "active";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }
    fnPageIndoorC() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "active";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }
    fnPageIndoorD() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "active";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }
    fnPageIndoorE() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "active";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }
    fnPageOutdoor() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "active";
        this.PageBriefActive = "";
        this.DocumentActive = "";
    }

    fnPageBrief() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.PageHCAActive = "";
        this.PageHCBActive = "";
        this.PageIndoorAActive = "";
        this.PageIndoorBActive = "";
        this.PageIndoorCActive = "";
        this.PageIndoorDActive = "";
        this.PageIndoorEActive = "";
        this.PageOutdoorActive = "";
        this.PageBriefActive = "";
        this.DocumentActive = "active";
    }

    setVisibleTab() {


        let sectionA = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Conditions B');
        if (sectionA.length > 0)
            this.PageHCBVisibleTab = false;
        let sectionB = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Indoors A');
        if (sectionB.length > 0)
            this.PageIndoorAVisibleTab = false;
        let sectionC = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Indoors B');
        if (sectionC.length > 0)
            this.PageIndoorBVisibleTab = false;
        let sectionD = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Indoors C');
        if (sectionD.length > 0)
            this.PageIndoorCVisibleTab = false;
        let sectione = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Indoors D');
        if (sectione.length > 0)
            this.PageIndoorDVisibleTab = false;
        let sectionF = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Indoors E');
        if (sectionF.length > 0)
            this.PageIndoorEVisibleTab = false;
        let sectionH = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Outdoors');
        if (sectionH.length > 0)
            this.PageOutdoorVisibleTab = false;
        let sectionBrief = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Brief');
        if (sectionBrief.length > 0) {
            //   alert("asd");
            this.PageBriefVisibleTab = false;
        }

    }
    isDirty = true;
    DocOk = true;
    IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(mainFormBuilder, SectionAdynamicValue, SectionAdynamicForm, SectionBdynamicValue, SectionBdynamicForm, SectionCdynamicValue,
        SectionCdynamicForm, SectionDdynamicValue, SectionDdynamicForm, SectionEdynamicValue, SectionEdynamicForm, SectionFdynamicValue,
        SectionFdynamicForm, SectionGdynamicValue, SectionGdynamicForm, SectionHdynamicValue, SectionHdynamicForm
        , BriefdynamicValue, BriefdynamicForm
        , UploadDocIds, IsUpload, uploadFormBuilder,
        AddtionalEmailIds, EmailIds) {

        if (!SectionAdynamicForm.valid) {
            this.PageHCAActive = "active";
            this.PageHCBActive = "";
            this.PageIndoorAActive = "";
            this.PageIndoorBActive = "";
            this.PageIndoorCActive = "";
            this.PageIndoorDActive = "";
            this.PageIndoorEActive = "";
            this.PageOutdoorActive = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(SectionAdynamicForm);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.PageHCAActive = "";
            this.PageHCBActive = "";
            this.PageIndoorAActive = "";
            this.PageIndoorBActive = "";
            this.PageIndoorCActive = "";
            this.PageIndoorDActive = "";
            this.PageIndoorEActive = "";
            this.PageOutdoorActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }
        //else {
        //    this.PageHCAActive = "active";
        //    this.DocumentActive = "";
        //}

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

        if (mainFormBuilder.valid && SectionAdynamicForm.valid && SectionBdynamicForm.valid && SectionCdynamicForm.valid
            && SectionDdynamicForm.valid && SectionEdynamicForm.valid && SectionFdynamicForm.valid
            && SectionGdynamicForm.valid && SectionHdynamicForm.valid && this.DocOk) {

            SectionBdynamicValue.forEach(item => {
                SectionAdynamicValue.push(item);
            });

            SectionCdynamicValue.forEach(item => {
                SectionAdynamicValue.push(item);
            });

            SectionDdynamicValue.forEach(item => {
                SectionAdynamicValue.push(item);
            });

            SectionEdynamicValue.forEach(item => {
                SectionAdynamicValue.push(item);
            });

            SectionFdynamicValue.forEach(item => {
                SectionAdynamicValue.push(item);
            });

            SectionGdynamicValue.forEach(item => {
                SectionAdynamicValue.push(item);
            });

            SectionHdynamicValue.forEach(item => {
                SectionAdynamicValue.push(item);
            });

            BriefdynamicValue.forEach(item => {
                SectionAdynamicValue.push(item);
            });
            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(SectionAdynamicValue, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraft") == "N")
                    type = "update";
                if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y") ){
                let val2 = SectionAdynamicValue.filter(x => x.FieldName == "SocialWorkerId");
                if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == ''))
                {
                    val2[0].FieldValue = this.SocialWorkerId;
                }
            }

                this.objCarerHealthAndSafetyDTO.DynamicValue = SectionAdynamicValue;
                this.objCarerHealthAndSafetyDTO.CarerParentId = this.CarerParentId;
                this.objCarerHealthAndSafetyDTO.NotificationEmailIds = EmailIds;
                this.objCarerHealthAndSafetyDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.apiService.save(this.controllerName, this.objCarerHealthAndSafetyDTO, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
            }
            else {
                this.isLoading = false;
                this.isLoadingSAD = false;
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
        this.isLoading = false;
        this.isLoadingSAD = false;
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
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
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
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
                if (skipAlert){
                    this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                    this.objUserAuditDetailDTO.ActionId =2;
                    this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                }
            }
            if (skipAlert) {
                if (this.objQeryVal.mid == 13)
                    this._router.navigate(['/pages/recruitment/carerhealthandsafetylist/13']);
                else
                    this._router.navigate(['/pages/fostercarer/carerhealthandsafetylist/3']);
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            }
            this.skipAlert = true;
            this.objCarerHealthAndSafetyDTO.IsSubmitted = true;
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
    }
    fnSaveDraft(SectionAdynamicValue, SectionBdynamicValue, SectionCdynamicValue,
        SectionDdynamicValue, SectionEdynamicValue, SectionFdynamicValue
        , SectionGdynamicValue, SectionHdynamicValue, BeriefdynamicValue, IsUpload, uploadFormBuilder) {
        this.submitted = false;
        SectionBdynamicValue.forEach(item => {
            SectionAdynamicValue.push(item);
        });

        SectionCdynamicValue.forEach(item => {
            SectionAdynamicValue.push(item);
        });

        SectionDdynamicValue.forEach(item => {
            SectionAdynamicValue.push(item);
        });

        SectionEdynamicValue.forEach(item => {
            SectionAdynamicValue.push(item);
        });

        SectionFdynamicValue.forEach(item => {
            SectionAdynamicValue.push(item);
        });

        SectionGdynamicValue.forEach(item => {
            SectionAdynamicValue.push(item);
        });

        SectionHdynamicValue.forEach(item => {
            SectionAdynamicValue.push(item);
        });

        BeriefdynamicValue.forEach(item => {
            SectionAdynamicValue.push(item);
        });

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
                this.fnSubSaveDraft(SectionAdynamicValue, IsUpload, uploadFormBuilder);
        }
        else
            this.fnSubSaveDraft(SectionAdynamicValue, IsUpload, uploadFormBuilder);
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
                this.objCarerHealthAndSafetyDTO.SequenceNo = this.SequenceNo;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                // this.sdService.save(this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
            }
            else {
                this.saveAsDraftText=Common.GetSaveasDraftText;
                this.isLoadingSAD = false;
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
                //   this.cdlServics.GetNextSequenceNo(this.formId).then(data => {
                this.SequenceNo = parseInt(data);
                this.objCarerHealthAndSafetyDTO.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);

                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                //console.log(this.objSaveDraftInfoDTO);
                //   this.sdService.save(this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
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
        this.st.newTimer('carerhns180', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('carerhns180', () => this.timer2callback());
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
                    this.submitText=Common.GetAutoSaveProgressText;
                    this.btnSubmit.fnClick();
                    this.objCarerHealthAndSafetyDTO.IsSubmitted = true;
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
        this.st.delTimer('carerhns180');
    }


    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateCarerHealthAndSafetyPDF/" + this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
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
        window.location.href = this.apiURL + "GenerateCarerHealthAndSafetyWord/" + this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
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
        this.apiService.get("GeneratePDF", "GenerateCarerHealthAndSafetyPrint", this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId).then(data => {
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
            this.apiService.post("GeneratePDF", "EmailCarerHealthAndSafety", this.objNotificationDTO).then(data => {
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
