
import { Component, ElementRef, Pipe, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleTimer } from 'ng2-simple-timer';
import { environment } from '../../../environments/environment';
import { Common, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat, deepCopy, DynamicValueDTO } from '../common';
import { ValChangeDTO } from '../dynamic/ValChangeDTO';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
//import {ChildSupervisoryHomeVisitService } from '../services/childsupervisoryhomevisit.service'
import { ChildSupervisoryHomeVisitDTO } from './DTO/childsupervisoryhomevisitdto';
declare var window: any;
declare var $: any;

//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'childsupervisoryhomevisitdata',
    templateUrl: './childsupervisoryhomevisitdata.component.template.html',
})

export class ChildSupervisoryHomeVisitDataComponent {
    @ViewChild('btnLockModel') lockModal: ElementRef;
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    apiURL = environment.api_url + "/api/GeneratePDF/";
    controllerName = "ChildSupervisoryHomeVisit";
    objChildSupervisoryHomeVisitDTO: ChildSupervisoryHomeVisitDTO = new ChildSupervisoryHomeVisitDTO();
    submitted = false;
    dynamicformcontrol = [];
    dynamicformcontrolOrginal = [];
    _Form: FormGroup;
    isVisibleMandatoryMsg;
    SequenceNo;
    CarerSHVSequenceNo;
    objQeryVal;
    lstChild;
    IsEnable;
    ShowSubmitLockBtn = true;
    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerParentId: number;
    AgencyProfileId: number;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    ChildSectionAActive = "active";
    ChildSectionBActive;
    ChildDocumentActive;
    isLoading: boolean = false;
    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true;
    ShowError = false;
    showAlert: boolean = false; isUploadDoc: boolean = false; carerName;
    pdfChildId = 0;
    ChildSectionBVisible = true;
    CarerSSWName;
    ChildDOB;
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    isLoadingSAD: boolean = false;
    isSaving: boolean = false;
    LASocialWorkerId;
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private module: PagesComponent,
        private apiService: APICallService, private st: SimpleTimer, private renderer: Renderer2) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        this.objChildSupervisoryHomeVisitDTO.AgencyProfileId = this.AgencyProfileId;
        this.CarerSSWName = Common.GetSession("ACarerSSWName");
        this.LASocialWorkerId = Common.GetSession("ChildLASocialWorkerId");
        if (this.CarerSSWName == "null" || this.CarerSSWName == null)
            this.CarerSSWName = "Not Assigned";
        //Doc
        this.formId = 100;
        this.TypeId = 0;
        this.tblPrimaryKey = this.objQeryVal.Sno;
        this.bindChildList();
        if (this.objQeryVal.Id != 0 && this.objQeryVal.Id != 'undefined') {
            this.objChildSupervisoryHomeVisitDTO.ChildId = this.objQeryVal.Id;
            this.pdfChildId = this.objChildSupervisoryHomeVisitDTO.ChildId;
            //   this.fuChangeChild(this.pdfChildId);
        }
        this.objChildSupervisoryHomeVisitDTO.ControlLoadFormat = ["Child Section A", "Child Section B"];

        this._Form = _formBuilder.group({
            ChildId: ['0', Validators.required],
        });

        this.CarerSHVSequenceNo = this.objQeryVal.CarerSHVno;
        this.SequenceNo = this.objQeryVal.Sno;
        if (this.CarerSHVSequenceNo != 0 && this.CarerSHVSequenceNo != null) {
            this.objChildSupervisoryHomeVisitDTO.CarerSHVSequenceNo = this.CarerSHVSequenceNo;
        } else {
            this.objChildSupervisoryHomeVisitDTO.CarerSHVSequenceNo = 0;
        }
        this.objChildSupervisoryHomeVisitDTO.SequenceNo = this.SequenceNo;

        if (Common.GetSession("SaveAsDraft") == "N") {
            if (this.SequenceNo != 0) {
                this.ShowSubmitLockBtn = false;
                this.showbtnSaveDraft = false;
            }
            this.objChildSupervisoryHomeVisitDTO.SequenceNo = this.SequenceNo;
            this.objChildSupervisoryHomeVisitDTO.AgencyProfileId = this.AgencyProfileId;
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objChildSupervisoryHomeVisitDTO).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                    this.CarerSSWName = val3[0].FieldCnfg.DisplayName;
                this.seTabVisible();
                if (this.objQeryVal.Id != 0)
                    this.IsEnable = true;

                this.fuChangeChild(this.pdfChildId);
            });
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.TypeId = this.CarerSHVSequenceNo;
            this.objSaveDraftInfoDTO.CarerParentId = this.CarerParentId;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                this.dynamicformcontrol = JSON.parse(data.JsonData);
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                this.seTabVisible();
                if (this.dynamicformcontrol[0].ChildId != 0) {
                    this.objChildSupervisoryHomeVisitDTO.ChildId = this.dynamicformcontrol[0].ChildId;
                    this.pdfChildId = this.dynamicformcontrol[0].ChildId;
                    this.fuChangeChild(this.pdfChildId);
                }
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
    }

    seTabVisible() {
        let sectionB = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Child Section B');
        if (sectionB.length > 0)
            this.ChildSectionBVisible = false;
    }

    private bindChildList() {
        this.apiService.get(this.controllerName, "GetSHVCarersPlacedChild", this.CarerParentId).then(data => {
            this.lstChild = data
        });
    }
    isChildDirty = false;
    childName;
    fuChangeChild(id) {
        let temp = this.lstChild.filter(T => T.ChildId == id)
        if (temp.length > 0) {
            this.ChildDOB = temp[0].PersonalInfo.DateOfBirth;
        }
    }
    fnChildChange(id) {
        this.pdfChildId = id;
        this.TypeId = id;
        this.lstChild.forEach(T => {
            if (T.ChildId == id) {
                this.childName = T.PersonalInfo.FullName + "(" + T.ChildCode + ")";
                this.ChildDOB = T.PersonalInfo.DateOfBirth;
                this.isChildDirty = true;
            }
        });


        let temp = this.lstChild.filter(T => T.ChildId == id)
        if (temp.length > 0) {

            let temDynaLocalAuthority = this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == "LocalAuthority");
            if (temDynaLocalAuthority.length > 0) {
                temDynaLocalAuthority[0].FieldValue = temp[0].LocalAuthority.LocalAuthorityName;
            }

            let temDynaDateStartofPlacement = this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == "DateStartofPlacement");
            if (temDynaDateStartofPlacement.length > 0 && temp[0].PlacementDate != "0001-01-01T00:00:00") {
                temDynaDateStartofPlacement[0].FieldValue = this.module.GetDateEditFormat(temp[0].PlacementDate);
            }

            let temDynaDateofLastPEP = this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == "DateofLastPEP");
            if (temDynaDateofLastPEP.length > 0 && temp[0].PEPDate != "0001-01-01T00:00:00") {
                temDynaDateofLastPEP[0].FieldValue = this.module.GetDateEditFormat(temp[0].PEPDate);
            }

            let temDynaDateofLastEHCP = this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == "DateofLastEHCP");
            if (temDynaDateofLastEHCP.length > 0 && temp[0].EHCPDate != "0001-01-01T00:00:00") {
                temDynaDateofLastEHCP[0].FieldValue = this.module.GetDateEditFormat(temp[0].EHCPDate);
            }


        }

    }

    fnChildSectionA() {
        this.ChildSectionAActive = "active";
        this.ChildSectionBActive = "";
        this.ChildDocumentActive = "";
    }
    fnChildSectionB() {
        this.ChildSectionAActive = "";
        this.ChildSectionBActive = "active";
        this.ChildDocumentActive = "";
    }
    fnDocumentDetail() {
        this.ChildSectionAActive = "";
        this.ChildSectionBActive = "";
        this.ChildDocumentActive = "active";
    }

    fnLockConfirmClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.lockModal.nativeElement.dispatchEvent(event);
    }
    isDirty = true;
    DocOk = true; IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(mainFormBuilder, SectionAdynamicValue, SectionAdynamicForm, SectionBdynamicValue, SectionBdynamicForm, UploadDocIds, IsUpload, uploadFormBuilder, inslockValue, AddtionalEmailIds, EmailIds) {

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
            this.ChildSectionAActive = "active";
            this.ChildSectionBActive = "";
            this.ChildDocumentActive = "";
            this.module.GetErrorFocus(mainFormBuilder);
        } else if (!SectionAdynamicForm.valid || this.ShowError) {
            this.ChildSectionAActive = "active";
            this.ChildSectionBActive = "";
            this.ChildDocumentActive = "";
            this.module.GetErrorFocus(SectionAdynamicForm);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.ChildSectionAActive = "";
            this.ChildSectionBActive = "";
            this.ChildDocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        } else {
            this.ChildSectionAActive = "active";
            this.ChildSectionBActive = "";
            this.ChildDocumentActive = "";
        }

        if (mainFormBuilder.valid && SectionAdynamicForm.valid && SectionBdynamicForm.valid && this.DocOk && !this.ShowError) {
            SectionBdynamicValue.forEach(item => {
                SectionAdynamicValue.push(item);
            });

            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(SectionAdynamicValue, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoading = true;
                this.isSaving=true;
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

                let valDOV = SectionAdynamicValue.filter(x => x.FieldName == "DateOfVisitChild");
                if (Common.GetSession("SaveAsDraft") == "Y" && valDOV.length == 0) {
                    let add = new DynamicValueDTO();
                    add.DisplayName = "Date Of Visit";
                    add.FieldCnfgId = 2476;
                    add.FieldDataTypeName = "datetime";
                    add.FieldName = "DateOfVisitChild";
                    add.FieldValue = Common.GetSession("HomeVisitDate");
                    add.FieldValueText = "Date Of Visit";
                    SectionAdynamicValue.push(add);
                }
                let valSocialWorkerId = SectionAdynamicValue.filter(x => x.FieldName == "SocialWorkerId");
                if(this.SequenceNo == 0){
                
                if (valSocialWorkerId.length > 0 && (valSocialWorkerId[0].FieldValue == null || valSocialWorkerId[0].FieldValue == "0"))
                    valSocialWorkerId[0].FieldValue = Common.GetSession("ACarerSSWId");
            }
                else if (Common.GetSession("SaveAsDraft") == "Y" && valSocialWorkerId.length == 0) {
                    let add = new DynamicValueDTO();
                    add.DisplayName = "SocialWorkerId";
                    add.FieldCnfgId = 2478;
                    add.FieldDataTypeName = "string";
                    add.FieldName = "SocialWorkerId";
                    add.FieldValue = Common.GetSession("ACarerSSWId");
                    add.FieldValueText = "SocialWorkerId";
                    SectionAdynamicValue.push(add);
                }


                let valCarerParentId = SectionAdynamicValue.filter(x => x.FieldName == "CarerParentId");
                if (valCarerParentId.length > 0 && (valCarerParentId[0].FieldValue == null || valCarerParentId[0].FieldValue == "0"))
                    valCarerParentId[0].FieldValue = this.CarerParentId;
                else if (Common.GetSession("SaveAsDraft") == "Y" && valCarerParentId.length == 0) {
                    let add = new DynamicValueDTO();
                    add.DisplayName = "CarerParentId";
                    add.FieldCnfgId = 2477;
                    add.FieldDataTypeName = "string";
                    add.FieldName = "CarerParentId";
                    add.FieldValue = Common.GetSession("ACarerParentId");
                    add.FieldValueText = "CarerParentId";
                    SectionAdynamicValue.push(add);
                }
                if(this.SequenceNo == 0){
                  let valLASW = SectionAdynamicValue.filter(x => x.FieldName == "LASocialWorkerId");
                if (valLASW.length > 0 && (valLASW[0].FieldValue == null || valLASW[0].FieldValue == ''))
                  valLASW[0].FieldValue = this.LASocialWorkerId;
                }
                this.objChildSupervisoryHomeVisitDTO.NotificationEmailIds = EmailIds;
                this.objChildSupervisoryHomeVisitDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.objChildSupervisoryHomeVisitDTO.DynamicValue = SectionAdynamicValue;
                this.apiService.save(this.controllerName, this.objChildSupervisoryHomeVisitDTO, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
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
        this.isSaving=false;
        if (data.IsError == true) {
            this.isLoading = false;
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            this.dynamicformcontrolOrginal = ConvertDateAndDateTimeSaveFormat(this.dynamicformcontrolOrginal);
            if (type == "save") {
                if (skipAlert)
                    this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                if (IsUpload) {

                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
            }
            else {
                this.isLoading = false;
                this.submitText=Common.GetSubmitText;
                if (skipAlert)
                    this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
            }

            this.objChildSupervisoryHomeVisitDTO.IsSubmitted = true;
            if (skipAlert)
                this._router.navigate(['/pages/fostercarer/childsupervisoryhomevisitlist', this.CarerSHVSequenceNo,this.objQeryVal.apage]);
        }
    }

    fnBack()
    {
        this._router.navigate(['/pages/fostercarer/childsupervisoryhomevisitlist', this.CarerSHVSequenceNo,this.objQeryVal.apage]);

    }


    private ResponeDraft(data, type, IsUpload) {
        this.isLoadingSAD = false;
        this.isSaving=false;
        this.saveAsDraftText=Common.GetSaveasDraftText;
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.objChildSupervisoryHomeVisitDTO.IsSubmitted = true;
            this.isChildDirty = false;
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
            this.skipAlert = true;
        }
    }
    DynamicOnValChange(InsValChange: ValChangeDTO) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "SaveAsDraftStatus") {
            InsValChange.currnet.IsVisible = false;
        }
        else if (InsValChange.currnet.FieldCnfg.FieldName == "LASocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }

        // console.log(InsValChange);
        if (InsValChange.currnet.FieldCnfg.FieldName == "AttendancePercentage" && InsValChange.currnet.FieldValue == null) {
            InsValChange.currnet.FieldValue = "0";
        }


        if (InsValChange.currnet.FieldCnfg.FieldName == "IsLocked") {
            InsValChange.currnet.IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "SchoolDaysSinceLastSHV" || InsValChange.currnet.FieldCnfg.FieldName == "DaysAttendedSchoolSinceLastSHV") {

            let valSchoolDays = InsValChange.all.find(x => x.FieldCnfg.FieldName == "SchoolDaysSinceLastSHV").FieldValue;
            let valAttendedSchool = InsValChange.all.find(x => x.FieldCnfg.FieldName == "DaysAttendedSchoolSinceLastSHV").FieldValue;
            let valAttendancePercentage = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "AttendancePercentage");
            if (valSchoolDays != null && valAttendedSchool != null && valSchoolDays != "0" && valAttendedSchool != "0") {


                if (parseInt(valAttendedSchool) > parseInt(valSchoolDays)) {
                    if (valAttendancePercentage.length > 0) {
                        valAttendancePercentage[0].FieldValue = "0";
                        this.ShowError = true;
                        // this.module.alertInfo("Attended school days should not be greater than actual school days");
                    }
                }
                else {
                    this.ShowError = false;
                    let val = (parseInt(valAttendedSchool) * 100) / parseInt(valSchoolDays);
                    if (valAttendancePercentage.length > 0) {
                        val = Math.round(val);
                        valAttendancePercentage[0].FieldValue = val.toString();
                    }
                }
            }
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord") {
            InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "SelectSiblings") {
            InsValChange.currnet.IsVisible = false;
        }

    }
    fnSaveDraft(SectionAdynamicValue, SectionBdynamicValue, IsUpload, uploadFormBuilder) {
        this.submitted = false;
        this.dynamicformcontrol[0].ChildId = this.TypeId;
        SectionBdynamicValue.forEach(item => {
            SectionAdynamicValue.push(item);
        });

        let userId: number = parseInt(Common.GetSession("UserProfileId"));
        this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
        this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.CarerSHVSequenceNo;
        this.objSaveDraftInfoDTO.CarerParentId = this.CarerParentId;
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
            if (this.isDirty || this.isChildDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoadingSAD = true;
                this.isSaving=true;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objChildSupervisoryHomeVisitDTO.SequenceNo = this.SequenceNo;
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
                    this.module.alertWarning(Common.GetNoChangeAlert);
                else if (this.showAlert == false && this.IsNewOrSubmited == 2)
                    this.module.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.showAlert = false;
                this.isLoadingSAD = false;
            }
        }
        else {
            this.isSaving=true;
            this.isLoadingSAD = true;
            this.apiService.get(this.controllerName, "GetNextSequenceNo", 100).then(data => {
                this.SequenceNo = parseInt(data);
                this.tblPrimaryKey = this.SequenceNo;
                this.objChildSupervisoryHomeVisitDTO.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objSaveDraftInfoDTO.TypeId = this.CarerSHVSequenceNo;
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
            item.ChildName = this.childName;
            item.ChildId = this.pdfChildId;
            item.DateOfVisit = new Date(Common.GetSession("HomeVisitDate"));
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
        this.st.newTimer('childsuperhv180', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('childsuperhv180', () => this.timer2callback());
            this.timer2button = 'Unsubscribe';

        }
    }
    timer2callback() {
        //this.counter2++;
        if(!this.isSaving)
        {
        if (this.isReadOnly == "0" || this.isReadOnly == null) {
            if (this.isFirstTime) {
                this.objChildSupervisoryHomeVisitDTO.IsSubmitted = false;
                this.showAutoSave = true;
                let event = new MouseEvent('click', { bubbles: true });
                if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraft") == "N") {
                    this.saveDraftText = "Record auto-saved @";
                    this.skipAlert = false;
                    this.submitText=Common.GetAutoSaveProgressText;
                    if (this.SequenceNo > 0 && this.showbtnSaveDraft == false)
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
    }
    ngOnDestroy() {
        this.st.delTimer('childsuperhv180');
    }

    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateChildSupervisoryHomeVisitPDF/" + this.pdfChildId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + this.objChildSupervisoryHomeVisitDTO.CarerSHVSequenceNo;
    }
    fnDonloadWord() {
        window.location.href = this.apiURL + "GenerateChildSupervisoryHomeVisitWord/" + this.pdfChildId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + this.objChildSupervisoryHomeVisitDTO.CarerSHVSequenceNo;
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateChildSupervisoryHomeVisitPrint", this.pdfChildId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + this.objChildSupervisoryHomeVisitDTO.CarerSHVSequenceNo).then(data => {
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
            this.isLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.pdfChildId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + this.objChildSupervisoryHomeVisitDTO.CarerSHVSequenceNo;
            this.apiService.post("GeneratePDF", "EmailChildSupervisoryHomeVisit", this.objNotificationDTO).then(data => {
                if (data == true)
                    this.module.alertSuccess("Email Send Successfully..");
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
