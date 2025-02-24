import { QueryList } from '@angular/core';
import { Component, ElementRef, ViewChild, ViewChildren, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SimpleTimer } from 'ng2-simple-timer';
import { environment } from '../../../environments/environment';
import { Common, Compare, CompareSaveasDraft, CompareStaticValue, deepCopy } from '../common';
import { ConfigTableNames } from '../configtablenames';
import { ContactVisible } from '../contact/contact';
import { ValChangeDTO } from '../dynamic/ValChangeDTO';
import { PagesComponent } from '../pages.component';
import { PersonalInfoVisible } from '../personalinfo/personalinfo';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { BackupCarerDTO } from './DTO/backupcarer';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';
import { data } from 'jquery';
import { ComplianceDTO } from '../superadmin/DTO/compliance';
declare var $: any;
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'BackupCarer',
    templateUrl: './backupcarer.component.template.html',
    styles: [`[required]  {
        border-left: 5px solid blue;
    }

   .ng-valid[required], .ng-valid.required  {
            border-left: 5px solid #42A948; /* green */
}
   label + .ng-invalid:not(form)  {
        border-left: 5px solid #a94442; /* red */
}`],
})

export class BackupCarerComponet {
    controllerName = "BackupCarer";
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objBackUpCarerDTO: BackupCarerDTO = new BackupCarerDTO();
    objBackUpCarerDTOOrginal;
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    objContactVisible: ContactVisible = new ContactVisible();
    objPersonalInfoVisible: PersonalInfoVisible = new PersonalInfoVisible();
    objQeryVal;
    dynamicformcontrol = [];
    dynamicformcontrolOrginal = [];

    submitted = false;
    ethinicityList = [];
    religionList = [];
    languagesSpokenList = [];
    CarerId;
    CarerCode;
    SequenceNo = 0;
    _Form: FormGroup;
    //Doc
    FormCnfgId;
    formId;
    draftformCnfgId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerParentId: number;
    AgencyProfileId: number;
    insCarerDetails;
    BackupCarerActive = "active";
    DocumentActive;
    TrainingDetailsActive;
    StatutoryChecksActive;
    isLoading: boolean = false;
    //Save as draft
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    draftSequenceNo = 0;
    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit1') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true;
    SaveasDraft = false;
    showAlert: boolean = true; isUploadDoc: boolean = false;
    @ViewChildren('ngSelect') ngSelectElements: QueryList<NgSelectComponent>;
    elem:any;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    isLoadingSAD: boolean = false;SocialWorkerId;
    lstCarerTrainingProfile=[];
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(_formBuilder: FormBuilder, private _router: Router, private activatedroute: ActivatedRoute,
        private modal: PagesComponent, private apiService: APICallService, private st: SimpleTimer, private renderer: Renderer2) {

        this.setVisible();
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        if (this.objQeryVal.mid == 3) {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
            this.SocialWorkerId = Common.GetSession("ACarerSSWId");
            this.CarerParentId = this.insCarerDetails.CarerParentId;
            this.CarerCode = this.insCarerDetails.CarerCode;
            this.FormCnfgId = 62;
        } else if (this.objQeryVal.mid == 13) {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
            this.SocialWorkerId = Common.GetSession("CarerSSWId");
            this.CarerParentId = this.insCarerDetails.CarerParentId;
            this.CarerCode = this.insCarerDetails.CarerCode;
            this.FormCnfgId = 34;
        }
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.CarerId = this.objQeryVal.id;
        this.SequenceNo = this.objQeryVal.SeqNo;
        this.draftSequenceNo = parseInt(this.objQeryVal.drSeqNo);
        //   this.CarerParentId = parseInt(Common.GetSession("BCCarerParentId"));
        //   this.CarerCode = Common.GetSession("BCCarerCode");
        //Doc
        this.formId = 34;
        this.TypeId = this.CarerParentId;

        this._Form = _formBuilder.group({
            EthinicityId: ['0'],
            ReligionId: ['0'],
            IsChecksRequired: [''],
            BCPractisingStatus: [''],
        });
        this.BindBackCarerInfo();
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
        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Ethnicity;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.ethinicityList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Religion;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.religionList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Language;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.languagesSpokenList = data; });
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });

        //Get Set Are Checks Required
        if(this.SequenceNo==0)
        {
            this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 20;
            this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
                if(data)
                {
                    this.objAgencyKeyNameValueCnfgDTO = data;
                    if(this.objAgencyKeyNameValueCnfgDTO.Value!=null && this.objAgencyKeyNameValueCnfgDTO.Value=="1")
                    {
                        this.objBackUpCarerDTO.BackupCarerInfo.IsChecksRequired=true;
                    }
                }
            });
        }

    }

    BindBackCarerInfo() {

        if (this.draftSequenceNo == 0) {

            this.tblPrimaryKey = this.CarerId;
            //Get Carer Info
            if (this.CarerId != null && this.CarerId != 0) {
                this.draftformCnfgId = 34;
                this.showbtnSaveDraft = false;
                this.objBackUpCarerDTO.CarerId = this.CarerId;
                this.apiService.get(this.controllerName, "GetByCarerId", this.objBackUpCarerDTO.CarerId).then(data => {
                    this.objBackUpCarerDTO.BackupCarerInfo = data;
                    this.objBackUpCarerDTOOrginal = deepCopy<any>(this.objBackUpCarerDTO.BackupCarerInfo);
                });


                this.apiService.get(this.controllerName,"GetTrainingByCarerId",this.CarerId).then(data=>{
                    console.log(data)
                    this.LoadStatutoryCheck(data.LstCompliance);
                    this.lstCarerTrainingProfile=data.LstCarerTrainingCourseDate;
                })
            }
            //Get Dynamic Controls
            this.objBackUpCarerDTO.SequenceNo = this.SequenceNo;
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objBackUpCarerDTO).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            });
        }
        else if (this.draftSequenceNo != 0) {
            this.draftformCnfgId = 0;
            this.tblPrimaryKey = this.draftSequenceNo;
            //Get Save as Draft
            this.showbtnSaveDraft = true;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.SequenceNo = this.draftSequenceNo;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                this.SaveasDraft = true;
                if (data != null) {
                    let jsonData = JSON.parse(data.JsonData);
                    this.objBackUpCarerDTO = jsonData;
                    this.dynamicformcontrol = this.objBackUpCarerDTO.DynamicControls;

                    this.objBackUpCarerDTOOrginal = deepCopy<any>(this.objBackUpCarerDTO);
                    // this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                }
            });
            //End
        }
    }

    setVisible() {
        //Set Personal Info Visible
        this.objPersonalInfoVisible.ImageIdVisible = false;
        this.objPersonalInfoVisible.PreviousNameVisible = false;
        this.objPersonalInfoVisible.AgeVisible = false;
        //Set Conact Info Visible
        this.objContactVisible.CountryIdVisible = false;
        this.objContactVisible.CountyIdVisible = false;
        this.objContactVisible.AddressLine2Visible = false;
        this.objContactVisible.PostalCodeVisible = false;
        this.objContactVisible.FaxVisible = false;
        this.objContactVisible.CityVisible = false;
        this.objContactVisible.MobilePhoneVisible = false;
        this.objContactVisible.OfficePhoneVisible = false;
        this.objContactVisible.EmailIdMandatory = false;
        this.objContactVisible.AlternativeEmailIdVisible = false;
        this.objContactVisible.EmergencyContactVisible = false;
    }

    fnBackupCarer() {
        this.BackupCarerActive = "active";
        this.DocumentActive = "";
        this.TrainingDetailsActive="";
        this.StatutoryChecksActive="";
    }

    fnDocumentDetail() {
        this.BackupCarerActive = "";
        this.DocumentActive = "active";
        this.TrainingDetailsActive="";
        this.StatutoryChecksActive="";
    }

    fnTrainingDetails()
    {
        this.BackupCarerActive = "";
        this.DocumentActive = "";
        this.TrainingDetailsActive="active";
        this.StatutoryChecksActive="";
    }

    fnStatutoryChecks()
    {
        this.BackupCarerActive = "";
        this.DocumentActive = "";
        this.TrainingDetailsActive="";
        this.StatutoryChecksActive="active";
    }

    IsNewOrSubmited = 1;//New=1 and Submited=2
    isOK = false;
    JoinOk = true;
    DocOk = true;
    isDirty = false;
    clicksubmit(MainForm, PersInfo, PersInfoForm, ConatactInfo, ConatactInfoForm,
        languagesSpoken, dynamicformValue, dynamicformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {

        for(let element of this.ngSelectElements.toArray()){
            if(element.hasValue == false){
                this.elem = element;
                break;
            }
        }

        this.DocOk = true;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        if (!MainForm.valid) {
            this.BackupCarerActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(MainForm,this.elem);
        } else if (!PersInfoForm.valid) {
            this.BackupCarerActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(PersInfoForm);
        } else if (!ConatactInfoForm.valid) {
            this.BackupCarerActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(ConatactInfoForm);
        } else if (!dynamicformbuilder.valid) {
            this.BackupCarerActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(dynamicformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.BackupCarerActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }

        //this.isDirty = false;
        //if (MainForm.dirty || PersInfoForm.dirty || ConatactInfoForm.dirty || dynamicformbuilder.dirty || uploadFormBuilder.dirty) {
        //    this.isDirty = true;
        //}

        this.isOK = false;
        this.JoinOk = true;
        this.submitted = true;
        if (MainForm.valid && PersInfoForm.valid && ConatactInfoForm.valid && dynamicformbuilder.valid && this.DocOk) {
            this.draftformCnfgId = 34;
            this.objBackUpCarerDTO.BackupCarerInfo.CarerParentId = this.CarerParentId;
            this.objBackUpCarerDTO.BackupCarerInfo.CarerCode = this.CarerCode;
            this.objBackUpCarerDTO.BackupCarerInfo.PersonalInfo = PersInfo;
            this.objBackUpCarerDTO.BackupCarerInfo.ContactInfo = ConatactInfo;
            if (languagesSpoken != undefined && languagesSpoken != null)
                this.objBackUpCarerDTO.BackupCarerInfo.LanguagesSpokenIds = languagesSpoken;
            let val2 = dynamicformValue.filter(x => x.FieldName == "SocialWorkerId");
                if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == ''))
                {
                    val2[0].FieldValue = this.SocialWorkerId;
                }
            this.objBackUpCarerDTO.DynamicValue = dynamicformValue;
            this.objBackUpCarerDTO.CarerId = this.CarerId;
            this.objBackUpCarerDTO.AgencyProfileId = this.AgencyProfileId;
            this.objBackUpCarerDTO.DraftSequenceNo = this.draftSequenceNo;
            this.objBackUpCarerDTO.BackupCarerInfo.PersonalInfo.DateOfBirth = this.modal.GetDateSaveFormat(this.objBackUpCarerDTO.BackupCarerInfo.PersonalInfo.DateOfBirth);

            this.isDirty = true;
            if (this.objQeryVal.id != 0
                && CompareStaticValue(this.objBackUpCarerDTO.BackupCarerInfo, this.objBackUpCarerDTOOrginal)
                && Compare(dynamicformValue, this.dynamicformcontrolOrginal)
            ) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoading = true;
                let type = "save";
                if (this.objQeryVal.id != 0)
                    type = "update";
                this.apiService.save(this.controllerName, this.objBackUpCarerDTO, type).then(data => { this.Respone(data, type, IsUpload, this.skipAlert); });
            }
            else {
                this.submitText=Common.GetSubmitText;
                this.objBackUpCarerDTO.BackupCarerInfo.PersonalInfo.DateOfBirth = this.modal.GetDateEditFormat(this.objBackUpCarerDTO.BackupCarerInfo.PersonalInfo.DateOfBirth);
                this.showAutoSave = false;
                if (this.skipAlert && this.IsNewOrSubmited == 1)
                    this.modal.alertWarning(Common.GetNoChangeAlert);
                else if (this.skipAlert && this.IsNewOrSubmited == 2)
                    this.modal.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.skipAlert = true;
            }
        }
    }


    private Respone(data, type, IsUpload, skipAlert: boolean) {
        this.objBackUpCarerDTO.BackupCarerInfo.PersonalInfo.DateOfBirth = this.modal.GetDateEditFormat(this.objBackUpCarerDTO.BackupCarerInfo.PersonalInfo.DateOfBirth);

        if (data.IsError == true) {
            this.isLoading = false;
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.objBackUpCarerDTOOrginal = deepCopy<any>(this.objBackUpCarerDTO.BackupCarerInfo);

            if (type == "save") {
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                if (IsUpload) {
                    //   alert(data.SequenceNumber);
                    if (skipAlert)
                        this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
            }
            else {
                this.isLoading = false;
                this.submitText=Common.GetSubmitText;
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                if (skipAlert)
                    this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.CarerId);
                }
            }
            if (skipAlert) {
                if (this.objQeryVal.mid == 13)
                    this._router.navigate(['/pages/recruitment/backupcarerlist/13']);
                else
                    this._router.navigate(['/pages/recruitment/backupcarerlist/3']);
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            }

            this.skipAlert = true;
        }
    }

    DynamicOnValChange(InsValChange: ValChangeDTO) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "SaveAsDraftStatus") {
            InsValChange.currnet.IsVisible = false;
        }
    }

    //save as draft
    fnSaveDraft(MainForm, PersInfo, PersInfoForm, ConatactInfo, ConatactInfoForm,
        languagesSpoken, dynamicformValue, dynamicformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {

        this.objBackUpCarerDTO.BackupCarerInfo.CarerParentId = this.CarerParentId;
        this.objBackUpCarerDTO.BackupCarerInfo.CarerCode = this.CarerCode;
        this.objBackUpCarerDTO.BackupCarerInfo.PersonalInfo = PersInfo;
        this.objBackUpCarerDTO.BackupCarerInfo.ContactInfo = ConatactInfo;
        if (languagesSpoken != undefined && languagesSpoken != null)
            this.objBackUpCarerDTO.BackupCarerInfo.LanguagesSpokenIds = languagesSpoken;

        if (this.objBackUpCarerDTO.BackupCarerInfo.IsChecksRequired == undefined)
            this.objBackUpCarerDTO.BackupCarerInfo.IsChecksRequired = null;

        this.objBackUpCarerDTO.DynamicValue = dynamicformValue;
        this.objBackUpCarerDTO.CarerId = this.CarerId;
        this.objBackUpCarerDTO.AgencyProfileId = this.AgencyProfileId;
        this.objBackUpCarerDTO.BackupCarerInfo.PersonalInfo.DateOfBirth = this.modal.GetDateSaveFormat(this.objBackUpCarerDTO.BackupCarerInfo.PersonalInfo.DateOfBirth);
        this.objBackUpCarerDTO.DynamicControls = [];
        this.objBackUpCarerDTO.DynamicControls = this.dynamicformcontrol;
        this.fnSubSaveDraft(IsUpload);
    }

    fnSubSaveDraft(IsUpload) {
        let userId: number = parseInt(Common.GetSession("UserProfileId"));
        this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
        this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
        this.objSaveDraftInfoDTO.CreatedUserId = userId;
        this.objSaveDraftInfoDTO.UpdatedUserId = userId;
        this.draftformCnfgId = 0;

        if (IsUpload)
            this.objBackUpCarerDTO.BackupCarerInfo.IsDocumentExist = true;


        let type = "save";
        if (this.draftSequenceNo > 0) {
            type = "update";
            this.isDirty = true;
            if (this.draftSequenceNo != 0
                && CompareStaticValue(this.objBackUpCarerDTO.BackupCarerInfo, this.objBackUpCarerDTOOrginal.BackupCarerInfo)
                && CompareSaveasDraft(this.objBackUpCarerDTO.DynamicControls, this.objBackUpCarerDTOOrginal.DynamicControls)
            ) {
                this.isDirty = false;
            }
            if (this.isDirty) {
                this.isLoadingSAD = true;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(this.objBackUpCarerDTO);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.objBackUpCarerDTO);
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload, this.draftSequenceNo, this.objBackUpCarerDTO));
            }
            else {
                this.saveAsDraftText=Common.GetSaveasDraftText;
                this.isLoadingSAD = true;
                this.objBackUpCarerDTO.BackupCarerInfo.PersonalInfo.DateOfBirth = this.modal.GetDateEditFormat(this.objBackUpCarerDTO.BackupCarerInfo.PersonalInfo.DateOfBirth);
                this.showAutoSave = false;
                if (this.showAlert == true && this.IsNewOrSubmited == 1)
                    this.modal.alertWarning(Common.GetNoChangeAlert);
                else if (this.showAlert == true && this.IsNewOrSubmited == 2)
                    this.modal.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.showAlert = true;
                this.isLoadingSAD = false;
            }
        }
        else {
            this.isLoadingSAD = true;
            this.apiService.get(this.controllerName, "GetNextSequenceNo").then(data => {
                this.draftSequenceNo = data;
                this.tblPrimaryKey = this.draftSequenceNo;
                this.objSaveDraftInfoDTO.SequenceNo = this.draftSequenceNo;
                this.objBackUpCarerDTO.DraftSequenceNo = this.draftSequenceNo;
                this.objBackUpCarerDTO.BackupCarerInfo.DraftSequenceNo = this.draftSequenceNo;

                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.objBackUpCarerDTO);
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(this.objBackUpCarerDTO);
                this.TypeId = this.CarerParentId;
                this.tblPrimaryKey = this.draftSequenceNo;
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data =>
                    this.ResponeDraft(data, type, IsUpload, this.draftSequenceNo, this.objBackUpCarerDTO));
            });
        }

    }
    private ResponeDraft(data, type, IsUpload, SequenceNo, val) {
        this.isLoadingSAD = false;
        this.saveAsDraftText=Common.GetSaveasDraftText;
        if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.objBackUpCarerDTOOrginal = deepCopy<any>(this.objBackUpCarerDTO);
        }

        this.objBackUpCarerDTO.BackupCarerInfo.PersonalInfo.DateOfBirth = this.modal.GetDateEditFormat(this.objBackUpCarerDTO.BackupCarerInfo.PersonalInfo.DateOfBirth);
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(SequenceNo);
                }
                if (this.showAlert)
                    this.modal.alertSuccess(Common.GetSaveDraftSuccessfullMsg);
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(SequenceNo);
                }
                if (this.showAlert)
                    this.modal.alertSuccess(Common.GetUpdateDraftSuccessfullMsg);
            }
        }
        this.showAlert = true;
    }


    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('BackUpCarerAutoSave', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('BackUpCarerAutoSave', () => this.timer2callback());
            this.timer2button = 'Unsubscribe';

        }
    }

    timer2callback() {
        //this.counter2++;

        if (this.isReadOnly == "0" || this.isReadOnly == null) {

            if (this.isFirstTime) {
                this.showAutoSave = true;
                let event = new MouseEvent('click', { bubbles: true });
                if (!this.showbtnSaveDraft) {
                    this.showAlert = false;
                    this.saveDraftText = "Record auto-saved @";
                    this.skipAlert = false;
                    this.submitText=Common.GetAutoSaveProgressText;
                    this.btnSubmit.fnClick();
                }
                else {
                    this.showAlert = false;
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
        this.st.delTimer('BackUpCarerAutoSave');
    }

    //Pdf
    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateBackUpCarerPDF/" + this.CarerCode + "," + this.CarerParentId + "," + this.CarerId + "," + this.SequenceNo  + "," + this.draftSequenceNo + "," + this.AgencyProfileId;
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

        window.location.href = this.apiURL + "GenerateBackUpCarerWord/" + this.CarerCode + "," + this.CarerParentId+ "," + this.CarerId + "," + this.SequenceNo + "," + this.draftSequenceNo + "," + this.AgencyProfileId;
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

        this.apiService.get("GeneratePDF", "GenerateBackUpCarerPrint", this.CarerCode + "," + this.CarerParentId+ "," + this.CarerId+ "," + this.SequenceNo  + "," + this.draftSequenceNo + "," + this.AgencyProfileId).then(data => {
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
            this.objNotificationDTO.Body = this.CarerCode + "," + this.CarerParentId + "," + this.CarerId+ "," + this.SequenceNo+ "," + this.draftSequenceNo + "," + this.AgencyProfileId;
            this.apiService.post("GeneratePDF", "EmailBackUpCarer", this.objNotificationDTO).then(data => {
                if (data == true){
                    this.modal.alertSuccess("Email Send Successfully..");
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


    objStatutoryCheckListInsur=[];
    objStatutoryCheckList=[];
    globalObjStatutoryCheckListInsur = [];
    globalObjStatutoryCheckList = [];
    globalPrimaryCheckList = [];
    globalSecondCheckList = [];
    globalCarerFamilyCheckList = [];
    globalBackupCarerCheckList = [];
    globalBackupCarerFamilyCheckList = [];
    globalPrimaryInsuList = [];
    globalSecondInsuCheckList = [];
    LoadStatutoryCheck(data) {
        this.globalObjStatutoryCheckList = [];
        this.globalObjStatutoryCheckListInsur = [];

        this.globalPrimaryCheckList = [];
        this.globalSecondCheckList = [];
        this.globalCarerFamilyCheckList = [];
        this.globalBackupCarerCheckList = [];
        this.globalBackupCarerFamilyCheckList = [];
        //  console.log(data);
        if (data != null) {
            data.forEach(item => {
                this.objStatutoryCheckList = [];
                this.objStatutoryCheckListInsur = [];
                item.forEach(subItem => {

                    let add: ComplaintInfo = new ComplaintInfo();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.DisplayName = subItem.DisplayName;
                    add.ComplianceCheckId = subItem.ComplianceCheckId;
                    add.UserProfileId = subItem.UserProfileId;
                    add.CheckName = subItem.CheckName;
                    add.MemberTypeId = subItem.MemberTypeId;
                    add.MemberName = subItem.MemberName;
                    add.BackupCarerName = subItem.BackupCarerName;
                    add.DisplayName = subItem.DisplayName;
                    this.objStatutoryCheckList.push(add);

                });

                //if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 4)
                 this.globalBackupCarerCheckList.push(this.objStatutoryCheckList);
               // else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 5)
               // this.globalBackupCarerFamilyCheckList.push(this.objStatutoryCheckList);
            });
        }
    }


}

export class ComplaintInfo {
    FieldCnfgId: number;
    FieldName: string;
    FieldValue: string;
    SequenceNo: number;
    FieldDataTypeName: string;
    FieldValueText: string;
    StatusId: number;
    UniqueID: number;
    DisplayName: string;
    ComplianceCheckId: number;
    UserProfileId: number;
    CheckName: string;
    MemberTypeId: string;
    MemberName: string;
    BackupCarerName: string;
}
