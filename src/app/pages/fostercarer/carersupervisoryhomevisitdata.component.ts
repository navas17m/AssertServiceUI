import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleTimer } from 'ng2-simple-timer';
import { environment } from '../../../environments/environment';
import { Common, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat, deepCopy, DynamicValueDTO } from '../common';
import { ValChangeDTO } from '../dynamic/ValChangeDTO';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';
import { ComplianceDTO } from '../superadmin/DTO/compliance';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { CarerSupervisoryHomeVisitDTO } from './DTO/carersupervisoryhomevisitdto';

declare var window: any;
declare var $: any;
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'carersupervisoryhomevisitdata',
    templateUrl: './carersupervisoryhomevisitdata.component.template.html',

})

export class CarerSupervisoryHomeVisitDataComponent {
    @ViewChild('btnLockModel') lockModal: ElementRef;
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    apiURL = environment.api_url + "/api/GeneratePDF/";
    controllerName = "CarerSupervisoryHomeVisit";
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    objCarerSupervisoryHomeVisitDTO: CarerSupervisoryHomeVisitDTO = new CarerSupervisoryHomeVisitDTO();
    objCarerSHV: CarerSupervisoryHomeVisitDTO = new CarerSupervisoryHomeVisitDTO();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    submitted = false;
    dynamicformcontrol = [];
    dynamicformcontrolOrginal = [];
    _Form: FormGroup;
    isVisibleMandatoryMsg;
    SequenceNo;
    objQeryVal;
    CarerParentId: number;
    AgencyProfileId: number;
    //upload doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerSSWName;
    CarerSectionAActive = "active";
    CarerSectionBActive;
    CarerSectionCActive;
    CarerSectionDActive;

    CarerSectionAVisible = true;
    CarerSectionBVisible = true;
    CarerSectionCVisible = true;
    CarerSectionDVisible = true;

    DocumentActive;
    isLoading: boolean = false;

    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmitAdd') btnSubmitAdd;
    @ViewChild('btnSubmitEdit') btnSubmitEdit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true;
    showAlert: boolean = false; isUploadDoc: boolean = false;
    visibleBirthChildrenGrid = false;
    lstCarerTrainingProfile = [];
    insCarerDetails;
    insCarerId=0;
    objComplianceDTO: ComplianceDTO = new ComplianceDTO();
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    isLoadingSAD: boolean = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private _router: Router, private module: PagesComponent,
        private st: SimpleTimer, private renderer: Renderer2, private apiService: APICallService) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objCarerSupervisoryHomeVisitDTO.AgencyProfileId = this.AgencyProfileId;
        this.objCarerSupervisoryHomeVisitDTO.CarerParentId = this.CarerParentId;
        this.objCarerSupervisoryHomeVisitDTO.ControlLoadFormat = ["Carer Section A", "Carer Section B", "Carer Section C", "Carer Section D"];
        this.objComplianceDTO.UserTypeId = 4;
        this.objComplianceDTO.CarerParentId = this.CarerParentId;
        this.objCarerSHV.AgencyProfileId = this.AgencyProfileId;
        this.objCarerSHV.CarerParentId = this.CarerParentId;
        this.SequenceNo = this.objQeryVal.Id;
        this.CarerSSWName = Common.GetSession("ACarerSSWName");
        if (this.CarerSSWName == "null" || this.CarerSSWName == null)
            this.CarerSSWName = "Not Assigned";

        if (Common.GetSession("SelectedCarerProfile") != null) {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
            this.insCarerId = this.insCarerDetails.CarerId;
        }

        //Upload Doc
        this.formId = 59;
        Common.SetSession("formcnfgid", this.formId);
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.SequenceNo;

        if (this.SequenceNo != 0 && this.SequenceNo != null)
            this.objCarerSupervisoryHomeVisitDTO.SequenceNo = this.SequenceNo;
        else {
            this.objCarerSupervisoryHomeVisitDTO.SequenceNo = 0;
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerSupervisoryHomeVisitDTO).then(data => {
                // cdlServics.getByFormCnfgId(this.objCarerSupervisoryHomeVisitDTO).then(data => {
                this.dynamicformcontrol = data;
                this.seTabVisible();
                let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                    this.CarerSSWName = val3[0].FieldCnfg.DisplayName;

                this.CheckGridVisible(data);

            });
        }
        //Get New Review Agency Config Value
        this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = this.AgencyProfileId;
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 7;

        this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
            this.objAgencyKeyNameValueCnfgDTO = data;
        });


        this._Form = _formBuilder.group({});
        if (Common.GetSession("SaveAsDraft") == "N") {
            if (this.SequenceNo != 0)
                this.showbtnSaveDraft = false;
            this.objCarerSupervisoryHomeVisitDTO.SequenceNo = this.SequenceNo;
            this.objCarerSupervisoryHomeVisitDTO.AgencyProfileId = this.AgencyProfileId;
            this.objCarerSupervisoryHomeVisitDTO.CarerParentId = this.CarerParentId;
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerSupervisoryHomeVisitDTO).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                this.seTabVisible();
                let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                    this.CarerSSWName = val3[0].FieldCnfg.DisplayName;
                this.CheckGridVisible(data);
            });
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                this.dynamicformcontrol = JSON.parse(data.JsonData);
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                this.seTabVisible();
                let tempDoc = JSON.parse(data.JsonList);
                if (tempDoc != null)
                    this.isUploadDoc = tempDoc[0].IsDocumentExist;
                this.CheckGridVisible(data);
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
          this.objUserAuditDetailDTO.FormCnfgId = this.formId;
          this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
          this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
          this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
          Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
          }
    }
    StatutoryChecksGridVisible = false;
    CheckGridVisible(data) {
        ///GetCarerTrainingProfile
        let IsTrainingProfileGrid = data.filter(x => x.FieldCnfg.FieldName == "IsTrainingProfileGrid");
        if (IsTrainingProfileGrid.length > 0) {
            let insCreatedDate = data.filter(x => x.FieldCnfg.FieldName == "CreatedDate");
            if (insCreatedDate.length > 0) {
                this.objCarerSHV.CreatedDate = this.module.GetDateSaveFormat(insCreatedDate[0].FieldValue);
                this.GetCarerTrainingProfile();
            }
        }
        ///Get StatutoryChecksGrid
        let IsStatutoryChecksGrid = data.filter(x => x.FieldCnfg.FieldName == "IsStatutoryChecksGrid");
        if (IsStatutoryChecksGrid.length > 0) {
            this.StatutoryChecksGridVisible = true;
            this.GetStatutoryChecksGrid();
        }
        ///Get BirthChildrenGrid
        let IsBirthChildrenGrid = data.filter(x => x.FieldCnfg.FieldName == "IsBirthChildrenGrid");
        if (IsBirthChildrenGrid.length > 0)
            this.visibleBirthChildrenGrid = true;
    }

    lstStatutoryChecks = [];
    GetStatutoryChecksGrid() {
        this.apiService.post("StatutoryCheck", "GetStatutoryCheckAll", this.objComplianceDTO).then(data => {
            this.LoadStatutoryCheck(data);
        })
    }


    GetCarerTrainingProfile() {
        this.apiService.post(this.controllerName, "GetCarerTrainingProfile", this.objCarerSHV).then(data => {
            this.lstCarerTrainingProfile = data;
        });
    }

    seTabVisible() {
        let sectionA = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Carer Section A');
        if (sectionA.length > 0) {
            this.CarerSectionAVisible = false;
            // console.log(sectionA);
        }
        //  console.log("seTabVisible2");
        let sectionB = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Carer Section B');
        if (sectionB.length > 0)
            this.CarerSectionBVisible = false;
        //  console.log("seTabVisible3");
        let sectionC = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Carer Section C');
        if (sectionC.length > 0)
            this.CarerSectionCVisible = false;
        //   console.log(sectionC);
        let sectionD = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Carer Section D');
        if (sectionD.length > 0)
            this.CarerSectionDVisible = false;
        // console.log("seTabVisible5");


    }
    // Statutory Check List
    globalPrimaryCheckList = [];
    globalSecondCheckList = [];
    objStatutoryCheckList = [];
    loading = false;
    insPCCheckId = [];
    insSCCheckId = [];
    insPCCheckIds: ComplianceCheck[] = [];
    insSCCheckIds: ComplianceCheck[] = [];
    headerPrimaryCheckList = [];
    headerSecondCheckList = [];
    LoadStatutoryCheck(data) {
        this.globalPrimaryCheckList = [];
        this.globalSecondCheckList = [];
        if (data != null) {
            data.forEach(maiItem => {
                this.objStatutoryCheckList = [];
                maiItem.forEach(subItem => {
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
                    this.objStatutoryCheckList.push(add);
                });

                if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 1) {
                    //Primary Carer
                    var index = this.insPCCheckId.indexOf(this.objStatutoryCheckList[0].ComplianceCheckId);
                    if (index === -1) {
                        let add: ComplianceCheck = new ComplianceCheck();
                        add.ComplianceCheckId = this.objStatutoryCheckList[0].ComplianceCheckId;
                        add.Name = this.objStatutoryCheckList[0].CheckName;
                        this.insPCCheckIds.push(add);
                        this.insPCCheckId.push(this.objStatutoryCheckList[0].ComplianceCheckId);
                        this.headerPrimaryCheckList.push(this.objStatutoryCheckList);
                        this.globalPrimaryCheckList.push(this.objStatutoryCheckList);
                    }

                }
                else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 2) {
                    //Secondary Carer
                    var index = this.insSCCheckId.indexOf(this.objStatutoryCheckList[0].ComplianceCheckId);
                    if (index === -1) {
                        let add: ComplianceCheck = new ComplianceCheck();
                        add.ComplianceCheckId = this.objStatutoryCheckList[0].ComplianceCheckId;
                        add.Name = this.objStatutoryCheckList[0].CheckName;
                        this.insSCCheckIds.push(add);
                        this.insSCCheckId.push(this.objStatutoryCheckList[0].ComplianceCheckId);
                        this.headerSecondCheckList.push(this.objStatutoryCheckList);
                        this.globalSecondCheckList.push(this.objStatutoryCheckList);
                    }
                }
            });
            this.loading = false;
        }
    }

    //
    fnCarerSectionA() {
        this.CarerSectionAActive = "active";
        this.CarerSectionBActive = "";
        this.CarerSectionCActive = "";
        this.CarerSectionDActive = "";
        this.DocumentActive = "";
    }
    fnCarerSectionB() {
        this.CarerSectionAActive = "";
        this.CarerSectionBActive = "active";
        this.CarerSectionCActive = "";
        this.CarerSectionDActive = "";
        this.DocumentActive = "";
    }
    fnCarerSectionC() {
        this.CarerSectionAActive = "";
        this.CarerSectionBActive = "";
        this.CarerSectionCActive = "active";
        this.CarerSectionDActive = "";
        this.DocumentActive = "";
    }
    fnCarerSectionD() {
        this.CarerSectionAActive = "";
        this.CarerSectionBActive = "";
        this.CarerSectionCActive = "";
        this.CarerSectionDActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.CarerSectionAActive = "";
        this.CarerSectionBActive = "";
        this.CarerSectionCActive = "";
        this.CarerSectionDActive = "";
        this.DocumentActive = "active";
    }
    fnLockConfirmClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.lockModal.nativeElement.dispatchEvent(event);
    }

    isDirty = true;
    DocOk = true; IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(mainFormBuilder, SectionAdynamicValue, SectionAdynamicForm, SectionBdynamicValue, SectionBdynamicForm, SectionCdynamicValue, SectionCdynamicForm, SectionDdynamicValue, SectionDdynamicForm, UploadDocIds, IsUpload, uploadFormBuilder, inslockValue, AddtionalEmailIds, EmailIds) {
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
            this.CarerSectionAActive = "active";
            this.CarerSectionBActive = "";
            this.CarerSectionCActive = "";
            this.CarerSectionDActive = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(mainFormBuilder);
        } else if (!SectionAdynamicForm.valid) {
            this.CarerSectionAActive = "active";
            this.CarerSectionBActive = "";
            this.CarerSectionCActive = "";
            this.CarerSectionDActive = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(SectionAdynamicForm);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.CarerSectionAActive = "";
            this.CarerSectionBActive = "";
            this.CarerSectionCActive = "";
            this.CarerSectionDActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }

        if (mainFormBuilder.valid && SectionAdynamicForm.valid && SectionBdynamicForm.valid && SectionCdynamicForm.valid && SectionDdynamicForm.valid && this.DocOk) {
            if (SectionBdynamicValue != null && SectionBdynamicValue != '') {
                SectionBdynamicValue.forEach(item => {
                    SectionAdynamicValue.push(item);
                });
            }
            if (SectionCdynamicValue != null && SectionCdynamicValue != '') {
                SectionCdynamicValue.forEach(item => {
                    SectionAdynamicValue.push(item);
                });
            }
            if (SectionDdynamicValue != null && SectionDdynamicValue != '') {
                SectionDdynamicValue.forEach(item => {
                    SectionAdynamicValue.push(item);
                });
            }


            if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y") ){
            let val2 = SectionAdynamicValue.filter(x => x.FieldName == "SocialWorkerId");
            if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == "0"))
                val2[0].FieldValue = Common.GetSession("ACarerSSWId");
            }
            let val = SectionAdynamicValue.filter(x => x.FieldName == "HomeVisitDate");
            if (val[0] != null)
                Common.SetSession("HomeVisitDate", val[0].FieldValue);

            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(SectionAdynamicValue, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraft") == "N")
                    type = "update";

                let valLock = SectionAdynamicValue.filter(x => x.FieldName == "IsLocked");
                if (valLock.length > 0 && (valLock[0].FieldValue == null || valLock[0].FieldValue == "0"))
                    valLock[0].FieldValue = inslockValue;
                else if (Common.GetSession("SaveAsDraft") == "Y" && valLock.length == 0) {
                    let add = new DynamicValueDTO();
                    add.DisplayName = "IsLocked";
                    add.FieldCnfgId = 2217;
                    add.FieldDataTypeName = "bit";
                    add.FieldName = "IsLocked";
                    add.FieldValue = inslockValue;
                    add.FieldValueText = "IsLocked";
                    SectionAdynamicValue.push(add);
                }

                this.objCarerSupervisoryHomeVisitDTO.DynamicValue = SectionAdynamicValue;
                this.objCarerSupervisoryHomeVisitDTO.CarerParentId = this.CarerParentId;
                this.objCarerSupervisoryHomeVisitDTO.SupervisingSocialWorker = this.CarerSSWName;
                this.objCarerSupervisoryHomeVisitDTO.NotificationEmailIds = EmailIds;
                this.objCarerSupervisoryHomeVisitDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
                //  this.cdlServics.post(this.objCarerSupervisoryHomeVisitDTO, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
                this.apiService.save(this.controllerName, this.objCarerSupervisoryHomeVisitDTO, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
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
                if (skipAlert){
                    this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                    this.objUserAuditDetailDTO.ActionId =1;
                    this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                }
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
            }
            else {
                this.isLoading = false;
                this.submitText=Common.GetSubmitText;
                if (skipAlert){
                    this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                    this.objUserAuditDetailDTO.ActionId =2;
                    this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                }
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
            }

            if (this.SequenceNo == 0 || this.showbtnSaveDraft) {
                if (skipAlert)
                    this._router.navigate(['/pages/fostercarer/childsupervisoryhomevisitlist', data.SequenceNumber]);
            }
            else {
                if (skipAlert)
                    this._router.navigate(['/pages/fostercarer/carersupervisoryhomevisitlist/3/'+this.objQeryVal.apage]);
            }
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this.skipAlert = true;
            this.objCarerSupervisoryHomeVisitDTO.IsSubmitted = true;
        }
    }

    fnBack()
    {
        this._router.navigate(['/pages/fostercarer/carersupervisoryhomevisitlist/3/'+this.objQeryVal.apage]);
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

        if (InsValChange.currnet.FieldCnfg.FieldName == "IsLocked") {
            InsValChange.currnet.IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "IsTrainingProfileGrid") {
            InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "IsStatutoryChecksGrid") {
            InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "IsBirthChildrenGrid") {
            InsValChange.currnet.IsVisible = false;
        }

        let SocialWorkerId = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
        if (SocialWorkerId.length > 0)
            SocialWorkerId[0].IsVisible = false;


        let val2 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "PleaseStateWhyNot");
        if (val2.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "HaveCarerMonthlyReportsReceived"
            && InsValChange.currnet.ConfigTableValues != null) {

            let val = InsValChange.currnet.ConfigTableValues.filter(x => x.CofigTableValuesId == InsValChange.newValue);
            if (val.length > 0 && val[0].Value == "No")
                val2[0].IsVisible = true;
            else
                val2[0].IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "HomeVisitTypeId") {
            let val = InsValChange.currnet.ConfigTableValues.filter(x => x.Value == "Announced");
            if (val.length > 0) {

                let HomeVisitTypeId = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "HomeVisitTypeId");
                if (HomeVisitTypeId.length > 0) {
                    //Set Default Announced
                    if(!HomeVisitTypeId[0].FieldValue)
                      HomeVisitTypeId[0].FieldValue = JSON.stringify(val[0].CofigTableValuesId);

                    // //Check Show All Home visit type or only Announced
                    // if (this.objAgencyKeyNameValueCnfgDTO.Value != null && this.objAgencyKeyNameValueCnfgDTO.Value == "1")
                    //     HomeVisitTypeId[0].ConfigTableValues = InsValChange.currnet.ConfigTableValues;
                    // else
                    //     HomeVisitTypeId[0].ConfigTableValues = val;
                   // console.log(this.objAgencyKeyNameValueCnfgDTO);
                    //Show Unannounced Visit Type in Home Visit Type DDl or not
                    if (this.objAgencyKeyNameValueCnfgDTO.Value ==null || this.objAgencyKeyNameValueCnfgDTO.Value != "1")
                    {
                        HomeVisitTypeId[0].ConfigTableValues = InsValChange.currnet.ConfigTableValues.filter(x => x.Value != "Unannounced");
                    }

                }
            }
        }
    }
    fnSaveDraft(SectionAdynamicValue, SectionBdynamicValue, SectionCdynamicValue, SectionDdynamicValue,
        IsUpload, uploadFormBuilder) {
        this.submitted = false;
        let val2 = SectionAdynamicValue.filter(x => x.FieldName == "SocialWorkerId");
        if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == "0")) {
            val2[0].FieldValue = Common.GetSession("CarerSSWId");
            val2[0].FieldValueText = this.CarerSSWName;
        }

        SectionBdynamicValue.forEach(item => {
            SectionAdynamicValue.push(item);
        });

        SectionCdynamicValue.forEach(item => {
            SectionAdynamicValue.push(item);
        });

        SectionDdynamicValue.forEach(item => {
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
                this.objCarerSupervisoryHomeVisitDTO.SequenceNo = this.SequenceNo;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                ///   this.sdService.save(this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
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
                ///  this.cdlServics.GetNextSequenceNo(this.formId).then(data => {
                this.SequenceNo = parseInt(data);
                this.tblPrimaryKey = this.SequenceNo;
                this.objCarerSupervisoryHomeVisitDTO.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);

                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                //console.log(this.objSaveDraftInfoDTO);
                //     this.sdService.save(this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));

            });
        }

    }
    private fnUpdateDynamicForm(dynamicForm, IsUpload) {
        dynamicForm.forEach(item => {
            item.AgencyProfileId = this.AgencyProfileId;
            item.SequenceNo = this.SequenceNo;
            item.CarerParentId = this.CarerParentId;
            item.SocialWorker=this.CarerSSWName;
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
        this.st.newTimer('carersuperhv180', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('carersuperhv180', () => this.timer2callback());
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
                    if (this.SequenceNo > 0 && this.showbtnSaveDraft == false) {
                        this.objCarerSupervisoryHomeVisitDTO.IsSubmitted = false;
                        this.submitText=Common.GetAutoSaveProgressText;
                        this.btnSubmitEdit.fnClick();
                    }
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
        this.st.delTimer('carersuperhv180');
        Common.SetSession("formcnfgid", "0");
    }

    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateCarerSupervisoryHomeVisitPDF/" + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + this.insCarerId;
        this.objUserAuditDetailDTO.ActionId =7;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.formId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnDonloadWord() {
        window.location.href = this.apiURL + "GenerateCarerSupervisoryHomeVisitWord/" + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + this.insCarerId;
        this.objUserAuditDetailDTO.ActionId =6;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.formId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateCarerSupervisoryHomeVisitPrint", this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + this.insCarerId).then(data => {
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
        this.objUserAuditDetailDTO.FormCnfgId = this.formId;
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
            this.objNotificationDTO.Body = this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + this.insCarerId;
            this.apiService.post("GeneratePDF", "EmailCarerSupervisoryHomeVisit", this.objNotificationDTO).then(data => {
                if (data == true){
                    this.module.alertSuccess("Email Send Successfully..");
                    this.objUserAuditDetailDTO.ActionId =9;
                    this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                    this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                    this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                    this.objUserAuditDetailDTO.FormCnfgId = this.formId;
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
export class ComplianceCheck {
    ComplianceCheckId: number;
    Name: string;
}
