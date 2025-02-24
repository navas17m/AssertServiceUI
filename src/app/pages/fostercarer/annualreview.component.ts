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
import { AnnualReviewDTO } from './DTO/annualreview';
import { AnnualReviewPlacementInfoDTO } from './DTO/annualreviewplacementinfo';
import * as moment from 'moment';
declare var window: any;
declare var $: any;
import { UserAuditHistoryDetailDTO } from '../common';
@Component({
    selector: 'AnnualReview',
    templateUrl: './annualreview.component.template.html',
    styles: [`[required]  {
        border-left: 5px solid blue;
    }

    .ng-valid[required], .ng-valid.required  {
            border-left: 5px solid #42A948; /* green */
    }
    .ng-invalid:not(form)  {
        border-left: 5px solid #a94442; /* red */
    }`]
})

export class AnnualReviewComponet {
    public returnVal:any[];
    AttendedDateValid: boolean;
    @ViewChild('btnLockModel') lockModal: ElementRef;
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    controllerName = "CarerAnnualReview";
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    dynamicformcontrol = [];
    dynamicformcontrolPlacementInfo = [];
    dynamicformcontrolOG = [];
    objAnnualReviewgetDTO: AnnualReviewDTO = new AnnualReviewDTO();
    objAnnualReviewDTO: AnnualReviewDTO = new AnnualReviewDTO();
    objComplianceDTO: ComplianceDTO = new ComplianceDTO();
    submitted = false;
    _Form: FormGroup;
    objQeryVal;
    CarerInfos;
    insCarerId;
    globalObjCourseAttendedList = [];
    globalObjStatutoryCheckList = [];
    globalObjStatutoryCheckListInsur = [];
    Placements;
    ApprovalRecomVal = [];
    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    //Dynamic Grid
    childList
    childListTemp;
    deletbtnAccess = false;
    globalObjAtteStatusList = [];globalObjAtteStatusListOG = [];
    objPlacementInfoList: AnnualReviewPlacementInfoDTO[] = [];
    submittedStatus = false;
    dynamicformcontroldataGrid;
    dynamicformcontroldataGridOG;
    CarerParentId: number;
    insCarerDetails;
    isLoadingSAD: boolean = false;
    Page1Active = "active";
    Page2Active = "";
    Page3Active = "";
    Page4Active = "";
    Page5Active = "";
    PlacementPageActive = "";
    DocumentActive = "";
    isLoading: boolean = false;
    SocialWorkerName;
    SocialWorkerId;
    insApprRecomStatusChange = 0;
    //Print
    CarerCode;
    SequenceNo: number;
    AgencyProfileId: number;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    ///SaveDraftInfo
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true;
    SaveasDraft = false;
    showAlert: boolean = false; isUploadDoc: boolean = false;
    IsFirstLoad = true;
    insDirtyApprovalRecommendation = false;
    @ViewChild('ApprovalRecommendation') childApprovalRecommendation;
    Page2Visible = true;
    Page3Visible = true;
    Page4Visible = true;
    PlacementInfoVisible = true;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=53;
    constructor(private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private _router: Router,
        private module: PagesComponent, private st: SimpleTimer,
        private apiService: APICallService, private renderer: Renderer2) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3]);
        }
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        this.SequenceNo = this.objQeryVal.id;
        if (Common.GetSession("SelectedCarerProfile") != null) {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
            this.CarerCode = this.insCarerDetails.CarerCode;
        }

        if (this.SequenceNo != 0) {
            this.IsFirstLoad = false;
        }
        this.deletbtnAccess = this.module.GetDeletAccessPermission(53);
        this.SocialWorkerName = Common.GetSession("ACarerSSWName");
        this.SocialWorkerId = Common.GetSession("ACarerSSWId");

        if (this.SocialWorkerName == "null")
            this.SocialWorkerName = "Not Assigned";
        //doc
        this.formId = 53;
        Common.SetSession("formcnfgid", this.formId);
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.objQeryVal.id;
        this.objComplianceDTO.CarerParentId = this.CarerParentId;
        this.objComplianceDTO.SequenceNo = this.SequenceNo;
        this.objAnnualReviewDTO.SequenceNo = this.SequenceNo;
        //Get Dynamic Controls
        if (Common.GetSession("SaveAsDraft") == "N") {
            this.objAnnualReviewgetDTO.CarerParentId = this.CarerParentId;
            this.objAnnualReviewgetDTO.SequenceNo = parseInt(this.tblPrimaryKey);
            this.objAnnualReviewgetDTO.SequenceNum = parseInt(this.tblPrimaryKey);
            this.objAnnualReviewDTO.SequenceNo = parseInt(this.tblPrimaryKey);
            this.objAnnualReviewgetDTO.ControlLoadFormat = ["Page1", "Page2", "Page3", "Page4", "Page5", "PlacementInfo"];
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objAnnualReviewgetDTO).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol.filter(item => item.ControlLoadFormat != "PlacementInfo" && item.ControlLoadFormat !="PlacementInfo.Grid"));

                this.dynamicformcontroldataGrid = this.dynamicformcontrol.filter(item => item.ControlLoadFormat == "PlacementInfo");
                this.dynamicformcontroldataGridOG = deepCopy<any>(this.dynamicformcontroldataGrid);

                //this.objComplianceDTO.ReviewDate = data.filter(item => item.FieldCnfg.FieldName == "ReviewDate").FieldValue;
                let ReviewDate = data.filter(item => item.FieldCnfg.FieldName == "ReviewDate");
                if (ReviewDate.length > 0)
                    this.objComplianceDTO.ReviewDate = ReviewDate[0].FieldValue;

                if (this.objAnnualReviewgetDTO.SequenceNo != 0 && this.objComplianceDTO.ReviewDate != null) {
                    this.showbtnSaveDraft = false;
                }
                let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                    this.SocialWorkerName = val3[0].FieldCnfg.DisplayName;

                this.setTabVisible();
            });
        }
        else {
            this.objAnnualReviewDTO.SequenceNo = this.objQeryVal.id;
            this.objSaveDraftInfoDTO.SequenceNo = this.objQeryVal.id;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                let temp = JSON.parse(data.JsonData);
                this.dynamicformcontrol = temp.dynamicformcontrol;
                this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol.filter(item => item.ControlLoadFormat != "PlacementInfo" && item.ControlLoadFormat != "PlacementInfo.Grid"));
                this.dynamicformcontroldataGridOG = deepCopy<any>(this.dynamicformcontrol.filter(item => item.ControlLoadFormat == "PlacementInfo"));
                this.dynamicformcontroldataGrid = this.dynamicformcontrol.filter(item => item.ControlLoadFormat == "PlacementInfo");
                this.ApprovalRecomVal = temp.ApprovalRecomList;
                this.globalObjAtteStatusList = temp.ChildPlacementInfo;
                //this.globalObjAtteStatusListOG=temp.ChildPlacementInfo;
                let tempDoc = JSON.parse(data.JsonList);
                if (tempDoc != null)
                    this.isUploadDoc = tempDoc[0].IsDocumentExist;
                this.setTabVisible();
            });
        }

        //Get Annuai review Statutory Check
        this.BindStatutoryCheck();
        //Get Carer info
        this.GetCarerInfo();

        this._Form = _formBuilder.group({
            ChildId: ['0', Validators.required],
        });

        //Get New Review Agency Config Value
        this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 1;

        this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
            this.objAgencyKeyNameValueCnfgDTO = data;
        });

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
          this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
          this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
          this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
          Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
          }
    }

    fnBack()
    {
        this._router.navigate(['/pages/fostercarer/annualreviewlist/3/'+this.objQeryVal.apage]);
    }

    setTabVisible() {
        let insPage2Visible = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Page2');
        if (insPage2Visible.length > 0) {
            this.Page2Visible = false;
        }

        let isnPage3Visible = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Page3');
        if (isnPage3Visible.length > 0)
            this.Page3Visible = false;

        let insPage4Visible = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Page4');
        if (insPage4Visible.length > 0)
            this.Page4Visible = false;

        let insPlacementInfo = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'PlacementInfo');
        if (insPlacementInfo.length > 0)
            this.PlacementInfoVisible = false;
    }


    fnSaveDraft(form, p1Form, p1formbuilder, p2Form, p2formbuilder, p3Form, p3formbuilder,
        p4Form, p4formbuilder, p5Form, p5formbuilder, IsUpload, uploadFormBuilder, ApprovalRecom,
        ApprovalRecommendationDirty,
        placementInfoForm, placementInfoformbuilder,) {
        p2Form.forEach(item => {
            p1Form.push(item);
        });

        p3Form.forEach(item => {
            p1Form.push(item);
        });

        p4Form.forEach(item => {
            p1Form.push(item);
        });

        p5Form.forEach(item => {
            p1Form.push(item);
        });


        if (this.SequenceNo != 0 && !CompareSaveasDraft(this.dynamicformcontroldataGrid, this.dynamicformcontroldataGridOG)) {
          this.AnnualReviewPlacementInfoDirty=true;
        }

        this.objAnnualReviewDTO.DynamicValue = p1Form;
        this.objAnnualReviewDTO.ApprovalRecomList = ApprovalRecom;
        this.objAnnualReviewDTO.ChildPlacementInfo = this.globalObjAtteStatusList;
        //   console.log("2");
        //  console.log(this.objAnnualReviewDTO);

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
                this.fnSubSaveDraft(p1Form, IsUpload, this.objAnnualReviewDTO, uploadFormBuilder, ApprovalRecommendationDirty);
        }
        else
            this.fnSubSaveDraft(p1Form, IsUpload, this.objAnnualReviewDTO, uploadFormBuilder, ApprovalRecommendationDirty);
        Common.SetSession("SaveAsDraft", "Y");
        this.dynamicformcontrol.forEach(item => {
            if (item.FieldCnfg.FieldName == "SaveAsDraftStatus") {
                item.IsVisible = false;
            }
        });
    }
    IsNewOrSubmited = 1;//New=1 and Submited=2
    isDirty = true;
    fnSubSaveDraft(dynamicForm, IsUpload, objAnnualReviewDTO: AnnualReviewDTO, uploadFormBuilder, ApprovalRecommendationDirty) {
        let type = "save";
        objAnnualReviewDTO.dynamicformcontrol = this.dynamicformcontrol;
        let tempdynamicformcontrol = deepCopy<any>(this.dynamicformcontrol.filter(item => item.ControlLoadFormat != "PlacementInfo" && item.ControlLoadFormat != "PlacementInfo.Grid"));
        if (this.SequenceNo > 0) {
            type = "update";
            this.isDirty = true;
            if (this.SequenceNo != 0 && CompareSaveasDraft(tempdynamicformcontrol, this.dynamicformcontrolOG)) {
                this.isDirty = false;
            }
            if (this.isDirty ||this.AnnualReviewPlacementInfoDirty || ApprovalRecommendationDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoading = true;
                this.isLoadingSAD = true;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objAnnualReviewgetDTO.SequenceNo = this.SequenceNo;
                this.objAnnualReviewDTO.SequenceNo = this.SequenceNo;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(objAnnualReviewDTO);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
            }
            else {
                this.saveAsDraftText=Common.GetSaveasDraftText;
                this.isLoadingSAD = true;
                this.showAutoSave = false;
                if (this.skipAlert && this.IsNewOrSubmited == 1)
                    this.module.alertWarning(Common.GetNoChangeAlert);
                else if (this.skipAlert && this.IsNewOrSubmited == 2)
                    this.module.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.skipAlert = true;
                this.isLoadingSAD = false;
            }
        }
        else {
            this.isLoadingSAD = true;
            this.apiService.get(this.controllerName, "GetNextSequenceNo", this.formId).then(data => {
                this.SequenceNo = parseInt(data);
                this.tblPrimaryKey = this.SequenceNo;
                this.objAnnualReviewgetDTO.SequenceNo = this.SequenceNo;
                this.objAnnualReviewDTO.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(objAnnualReviewDTO);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
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
    private ResponeDraft(data, type, IsUpload) {
        this.isLoadingSAD = false;
        this.saveAsDraftText=Common.GetSaveasDraftText;
        this.isLoading = false;
        this.childApprovalRecommendation.fnSetDirty(false);
        this.AnnualReviewPlacementInfoDirty = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            let tempdynamicformcontrol = deepCopy<any>(this.dynamicformcontrol.filter(item => item.ControlLoadFormat != "PlacementInfo" && item.ControlLoadFormat != "PlacementInfo.Grid"));
            this.dynamicformcontrolOG = deepCopy<any>(tempdynamicformcontrol);

            this.dynamicformcontroldataGridOG = deepCopy<any>(this.dynamicformcontroldataGrid);

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

    BindStatutoryCheck() {
        this.apiService.post("StatutoryCheck", "GetAnnualReviwe", this.objComplianceDTO).then(data => {
            this.LoadStatutoryCheck(data);
        })
    }

    clickBindStatutoryCheck() {
        this.objComplianceDTO.IsStaCheckReload = true;
        this.objAnnualReviewDTO.IsStaCheckReload = true;
        this.apiService.post("StatutoryCheck", "GetAnnualReviwe", this.objComplianceDTO).then(data => {
            this.LoadStatutoryCheck(data);
        })
    }

    fnPage1() {
        this.Page1Active = "active";
        this.Page2Active = "";
        this.Page3Active = "";
        this.Page4Active = "";
        this.Page5Active = "";
        this.PlacementPageActive = "";
        this.DocumentActive = "";
    }
    fnPage2() {
        this.Page1Active = "";
        this.Page2Active = "active";
        this.Page3Active = "";
        this.Page4Active = "";
        this.Page5Active = "";
        this.PlacementPageActive = "";
        this.DocumentActive = "";
    }
    fnPage3() {
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "active";
        this.Page4Active = "";
        this.Page5Active = "";
        this.PlacementPageActive = "";
        this.DocumentActive = "";
    }
    fnPage4() {
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "";
        this.Page4Active = "active";
        this.Page5Active = "";
        this.PlacementPageActive = "";
        this.DocumentActive = "";
    }
    fnPage5() {
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "";
        this.Page4Active = "";
        this.Page5Active = "active";
        this.PlacementPageActive = "";
        this.DocumentActive = "";
    }
    fnPlacementPage() {
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "";
        this.Page4Active = "";
        this.Page5Active = "";
        this.PlacementPageActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "";
        this.Page4Active = "";
        this.Page5Active = "";
        this.PlacementPageActive = "";
        this.DocumentActive = "active";
    }

    fnLockConfirmClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.lockModal.nativeElement.dispatchEvent(event);
    }
    DocOk = true;
    SubmitAnnualReview(form, p1Form, p1formbuilder, p2Form, p2formbuilder, p3Form, p3formbuilder,
        p4Form, p4formbuilder, p5Form, p5formbuilder,
        UploadDocIds, IsUpload, uploadFormBuilder, ApprovalRecom, AddtionalEmailIds, EmailIds, inslockValue, ApprovalRecommendationDirty,
        placementInfoForm, placementInfoformbuilder) {
       //  console.log(AddtionalEmailIds);
       //  console.log(EmailIds);
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

        if (!p1formbuilder.valid) {
            this.Page1Active = "active";
            this.Page2Active = "";
            this.Page3Active = "";
            this.Page4Active = "";
            this.Page5Active = "";
            this.PlacementPageActive = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(p1formbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.Page1Active = "";
            this.Page2Active = "";
            this.Page3Active = "";
            this.Page4Active = "";
            this.Page5Active = "";
            this.PlacementPageActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }

        if (p1formbuilder.valid && this.DocOk) {

            p2Form.forEach(item => {
                p1Form.push(item);
            });

            p3Form.forEach(item => {
                p1Form.push(item);
            });

            p4Form.forEach(item => {
                p1Form.push(item);
            });

            p5Form.forEach(item => {
                p1Form.push(item);
            });



            let type = "save";
            if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraft") == "N")
                type = "update";
            if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y") ){
            let val2 = p1Form.filter(x => x.FieldName == "SocialWorkerId");
            if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == ''))
                val2[0].FieldValue = this.SocialWorkerId;
            }
            let valSaveAsDraftStatus = p1Form.filter(x => x.FieldName == "SaveAsDraftStatus");
            if (valSaveAsDraftStatus.length > 0 && (valSaveAsDraftStatus[0].FieldValue == null || valSaveAsDraftStatus[0].FieldValue == ''))
                valSaveAsDraftStatus[0].FieldValue = 0;

            let valLock = p1Form.filter(x => x.FieldName == "IsLocked");
            if (valLock.length > 0 && (valLock[0].FieldValue == null || valLock[0].FieldValue == "0"))
                valLock[0].FieldValue = inslockValue;
            else if (Common.GetSession("SaveAsDraft") == "Y" && valLock.length == 0) {
                let add = new DynamicValueDTO();
                add.DisplayName = "IsLocked";
                add.FieldCnfgId = 2414;
                add.FieldDataTypeName = "bit";
                add.FieldName = "IsLocked";
                add.FieldValue = inslockValue;
                add.FieldValueText = "IsLocked";
                p1Form.push(add);
            }

            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(p1Form, this.dynamicformcontrolOG)
            ) {
                this.isDirty = false;
            }
            if (this.SequenceNo != 0 && Compare(this.globalObjAtteStatusList, this.globalObjAtteStatusListOG)
            ) {
                this.AnnualReviewPlacementInfoDirty = false;
            }

            if (this.isDirty
                || ApprovalRecommendationDirty || (IsUpload && uploadFormBuilder.valid)
                || this.AnnualReviewPlacementInfoDirty == true
            ) {

              placementInfoForm.filter(x => x.FieldName != 'IsActive' && x.FieldName != 'CreatedDate' && x.FieldName != 'UpdatedDate' && x.FieldName != 'CreatedUserId' && x.FieldName != 'UpdatedUserId' && x.FieldName != 'SaveAsDraftStatus')
              .forEach(item => {
                  p1Form.push(item);
              });

                this.isLoading = true;
                this.objAnnualReviewDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
                this.objAnnualReviewDTO.DynamicValue = p1Form;
                this.objAnnualReviewDTO.CarerParentId = this.CarerParentId;
                this.objAnnualReviewDTO.ApprovalRecomList = ApprovalRecom;
                this.objAnnualReviewDTO.SequenceNo = parseInt(this.tblPrimaryKey);
                this.objAnnualReviewDTO.ChildPlacementInfo = this.globalObjAtteStatusList;
                this.objAnnualReviewDTO.NotificationEmailIds = EmailIds;
                this.objAnnualReviewDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.objAnnualReviewDTO.SequenceNo = this.SequenceNo;
               // console.log(this.objAnnualReviewDTO);
                this.apiService.save(this.controllerName, this.objAnnualReviewDTO, type).then(data => {
                    this.Respone(data, type, IsUpload, this.skipAlert)
                });
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

    private Respone(data, type, IsUpload, skipAlert:boolean) {
        this.childApprovalRecommendation.fnSetDirty(false);
        this.AnnualReviewPlacementInfoDirty = false;

        if (data.IsError == true) {
            this.isLoading = false;
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.isLoading = false;
            this.IsNewOrSubmited = 2;
            let tempdynamicformcontrol = deepCopy<any>(this.dynamicformcontrol.filter(item => item.ControlLoadFormat != "PlacementInfo" && item.ControlLoadFormat != "PlacementInfo.Grid"));
            this.dynamicformcontrolOG = deepCopy<any>(tempdynamicformcontrol);
            this.dynamicformcontrolOG = ConvertDateAndDateTimeSaveFormat(this.dynamicformcontrolOG);

            let tempdynamicformcontrol1 = deepCopy<any>(this.dynamicformcontroldataGrid);
            this.dynamicformcontroldataGridOG = deepCopy<any>(tempdynamicformcontrol1);
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
                if (skipAlert) {
                    this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                    this.objUserAuditDetailDTO.ActionId =1;
                    this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                    //  this._router.navigate(['/pages/fostercarer/placementreview', data.SequenceNumber]);
                }
            }
            else {
                this.isLoading = false;
                this.submitText=Common.GetSubmitText;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                if (skipAlert)
                    this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            }

            ///Change Status for Approval Recommadation,Placement Info
            this.insApprRecomStatusChange = 1;
            if (this.globalObjAtteStatusList.length > 0) {
                this.globalObjAtteStatusList.forEach(itemMain => {
                    itemMain.filter(x => x.StatusId == 1).forEach(item => {
                        item.StatusId = 0;
                    })
                })
            }
            //End

            if (skipAlert)
                this._router.navigate(['/pages/fostercarer/annualreviewlist/3/'+this.objQeryVal.apage]);

            this.skipAlert = true;
            this.objAnnualReviewDTO.IsSubmitted = true;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    insPrimaryCarerLastMedicalDate;
    insSecondCarerLastMedicalDate;
    //Annual Review Statutory Check List
    objStatutoryCheckList = [];
    objStatutoryCheckListInsur = [];
    NonInsurancField = ["ReceivedDate", "RenewDate"];
    InsurancField = ["InsurerName", "PolicyNumber", "ValidtoDate"];
    PrimaryCheckVisi = false;
    SecondCheckVisi = false;
    CarerFamilyCheckVisi = false;
    BackupCarerCheckVisi = false;
    BackupCarerFamilyCheckVisi = false;
    PrimaryInsuCheckVisi = false;
    SecondInsuCheckVisi = false;
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

                    //Set Visible
                    if (subItem.MemberTypeId == 1)
                        this.PrimaryCheckVisi = true;
                    else if (subItem.MemberTypeId == 2)
                        this.SecondCheckVisi = true;
                    else if (subItem.MemberTypeId == 3)
                        this.CarerFamilyCheckVisi = true;
                    else if (subItem.MemberTypeId == 4)
                        this.BackupCarerCheckVisi = true;
                    else if (subItem.MemberTypeId == 5)
                        this.BackupCarerFamilyCheckVisi = true;
                });

                if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 1)
                    this.globalPrimaryCheckList.push(this.objStatutoryCheckList);
                else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 2)
                    this.globalSecondCheckList.push(this.objStatutoryCheckList);
                else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 3)
                    this.globalCarerFamilyCheckList.push(this.objStatutoryCheckList);
                else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 4)
                    this.globalBackupCarerCheckList.push(this.objStatutoryCheckList);
                else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 5)
                    this.globalBackupCarerFamilyCheckList.push(this.objStatutoryCheckList);
            });

            //set PrimaryCarerLastMedicalDate and  SecondCarerLastMedicalDate
            if(this.SequenceNo ==0 || Common.GetSession("SaveAsDraft") == "Y")
            {
                this.globalPrimaryCheckList.forEach(item=>{
                    let temp=item.filter(x=>x.CheckName== "Medical Advisor" && x.FieldName == "ReceivedFromMedicalAdvisorDate");
                    if(temp.length>0 && temp[0].FieldValue!=null&& temp[0].FieldValue!="")
                    {
                        let dynamictemp=this.dynamicformcontrol.filter(x=>x.FieldCnfg.FieldName=="PrimaryCarerLastMedicalDate");
                        if(dynamictemp.length>0)
                        {
                        dynamictemp[0].FieldValue=moment(temp[0].FieldValue).format("DD/MM/YYYY");
                        }
                    }

                })

                this.globalSecondCheckList.forEach(item=>{
                    let temp=item.filter(x=>x.CheckName== "Medical Advisor" && x.FieldName == "ReceivedFromMedicalAdvisorDate");
                    if(temp.length>0 &&  temp[0].FieldValue !=null&& temp[0].FieldValue!="")
                    {
                        let dynamictemp=this.dynamicformcontrol.filter(x=>x.FieldCnfg.FieldName=="SecondCarerLastMedicalDate");
                        if(dynamictemp.length>0)
                        {
                            dynamictemp[0].FieldValue=moment(temp[0].FieldValue).format("DD/MM/YYYY");
                        }
                    }
                })
            }
        }
    }
    lstCarerTrainingProfile;
    //Get Carer info//
    GetCarerInfo() {
        this.apiService.post(this.controllerName, "GetByParentId", this.objComplianceDTO).then(data => {
            this.CarerInfos = data;
            this.insCarerId = data.CarerId;
            this.childList = data.ChildPlacement;
            this.childListTemp = data.ChildPlacement;
            Common.SetSession("AnnualRevChildPlacement", JSON.stringify(this.childList));
            if(this.globalObjAtteStatusList.length>0)
            {
                this.childList.forEach(element => {
                    this.globalObjAtteStatusList.forEach((placement:any)=>{
                        let temp= placement.filter(x=>x.ChildId==element.ChildId);
                        if(temp.length>0)
                        {
                            this.childList=this.childList.filter(x=>x.ChildId != element.ChildId);
                            this.childListTemp =this.childList
                        }

                    })
                });

            }

            this.lstCarerTrainingProfile = data.LstCarerTrainingCourseDate;

            this.Placements = data.Placements;
            this.ApprovalRecomVal = data.ApprovalRecomList;
            this.LoadAlreadyChildPlacementInfo(data.ChildPlacementInfo);
        });
    }
    //Placement Info Dynamic Grd
    childName;
    fnChildChange(values) {
        if (values != null && values != "") {
            let cName = this.childList.find((item: any) => item.ChildId == values).ChildName;
            let cAge = this.childList.find((item: any) => item.ChildId == values).ChildAge;
            //  alert(cName);
            //  alert(cAge);
            this.childName = cName + " (" + cAge + ")"
        }
        //  alert(this.childName);
    }
    //---Dynamic Grid
    AnnualReviewPlacementInfoDirty = false;
    objAttendedStatusListInsert = [];
    LoadAlreadyChildPlacementInfo(data) {

        //    console.log(data);
        if (data != null) {
            data.forEach(item => {
                this.objPlacementInfoList = [];
                item.forEach(subItem => {
                    let add: AnnualReviewPlacementInfoDTO = new AnnualReviewPlacementInfoDTO();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.StatusId = 4;
                    add.DisplayName = subItem.DisplayName;
                    add.ChildName = subItem.ChildName + " (" + subItem.ChildAge + ")";
                    add.ChildId = subItem.ChildId;
                    this.objPlacementInfoList.push(add);
                    this.objAttendedStatusListInsert.push(add);

                    //remove already stored child
                    let check = this.childList.filter(x => x.ChildId == subItem.ChildId);
                    if (check.length > 0) {
                      //console.log("Id "+subItem.ChildId);
                      this.childList=this.childList.filter(x=>x.ChildId != subItem.ChildId);

                    //  const index: number = this.childListTemp.findIndex(x => x.ChildId == subItem.ChildId);
                    //  this.childList.splice(index, 1);
                      //console.log(this.childList);

                    }
                });
                this.globalObjAtteStatusList.push(this.objPlacementInfoList);
            });
        }

        //   console.log(this.globalObjAtteStatusList);
    }
    AddAttendedDetails(dynamicVal, dynamicForm, ChildId) {

       // console.log(this.globalObjAtteStatusList);
        let isValid=true
        this.globalObjAtteStatusList.forEach((placement:any)=>{

           let temp= placement.filter(x=>x.ChildId==ChildId && x.StatusId !=3);
           if(temp.length>0)
           {
             isValid=false;
           }

        })

        if(isValid)
        {
            this.objPlacementInfoList = [];
            this.submittedStatus = true;
            if (dynamicForm.valid && ChildId != null && ChildId != 0) {
                dynamicVal.forEach(item => {
                    let add: AnnualReviewPlacementInfoDTO = new AnnualReviewPlacementInfoDTO();
                    add.FieldCnfgId = item.FieldCnfgId;
                    add.FieldName = item.FieldName;
                    add.FieldValue = item.FieldValue;
                    add.FieldDataTypeName = item.FieldDataTypeName;
                    add.FieldValueText = item.FieldValueText;
                    add.StatusId = 1;
                    add.UniqueID = 0;
                    add.DisplayName = item.DisplayName;
                    add.ChildName = this.childName;
                    add.ChildId = ChildId;
                    this.objPlacementInfoList.push(add);
                    this.objAttendedStatusListInsert.push(add);
                })
                this.AnnualReviewPlacementInfoDirty = true;

              //  const index: number = this.childListTemp.findIndex(x => x.ChildId == ChildId);
               // this.childList.splice(index, 1);

                this.childList=this.childList.filter(x => x.ChildId != ChildId);
                //  console.log(this.childListTemp)
                //  console.log(this.childList)

                this.globalObjAtteStatusList.push(this.objPlacementInfoList);
                this.submittedStatus = false;
                this.dynamicformcontrolPlacementInfo = this.dynamicformcontrol.filter(item => item.ControlLoadFormat == "PlacementInfo");


                this.dynamicformcontroldataGrid.forEach(itemTemp => {
                    this.dynamicformcontroldataGrid.filter(item => item.FieldValue = null);

                });

                this.objAnnualReviewDTO.PlacementChildId = null;
                this.childName = "";
            }
            else {
                this.module.GetErrorFocus(dynamicForm);
                this.module.GetErrorFocus(this._Form);
            }
        }
        else
        {
            this.module.alertDanger("Placement review details already exist for "+this.childName);
        }
    }
    EditAttendedStatusList(index) {

        //  this.childList = this.childListTemp;

        this.AttendedStatusId = index;
        this.isEdit = true;
        let tempObj = this.globalObjAtteStatusList[index];
        tempObj.forEach(itemTemp => {
            this.dynamicformcontroldataGrid.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId)[0].FieldValue = itemTemp.FieldValue;
            this.objAnnualReviewDTO.PlacementChildId = itemTemp.ChildId;
            this.childName = itemTemp.ChildName;
        });
        Common.SetSession("AnnualRevChildPlacementEdit", JSON.stringify(this.childList));
        let insChildPlacement = JSON.parse(Common.GetSession("AnnualRevChildPlacement"));
        let temp = insChildPlacement.filter(x => x.ChildId == this.objAnnualReviewDTO.PlacementChildId);
        if (temp.length > 0) {
            temp.forEach(T => {
                this.childList.push(T);
            });
        }

    }
    DeleteAttendedStatusList(index) {
        let childId;
        let temp = this.globalObjAtteStatusList[index];
        temp.forEach(item => {
            item.StatusId = 3;
            childId = item.ChildId;


        });
        this.AnnualReviewPlacementInfoDirty = true;
        if (temp.length > 0) {

            let insChildPlacement = JSON.parse(Common.GetSession("AnnualRevChildPlacement"));
            let temp1 = insChildPlacement.filter(x => x.ChildId == temp[0].ChildId);
            if (temp1.length > 0) {
                temp1.forEach(T => {
                    this.childList.push(T);
                });
            }
        }
    }
    UpdateAttendedDetails(dynamicVal, dynamicForm, ChildId) {

        let recordCount:number=0
        this.globalObjAtteStatusList.forEach((placement:any)=>{

           let temp= placement.filter(x=>x.ChildId==ChildId && x.StatusId !=3);
           if(temp.length>0)
           {
            recordCount++;
           }

        })

        if(recordCount==0 || recordCount==1)
        {

            this.submittedStatus = true;
            if (dynamicForm.valid) {
                this.isEdit = false;
                let temp = this.globalObjAtteStatusList[this.AttendedStatusId];
                temp.forEach(item => {
                    item.FieldValue = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValue;
                    item.FieldValueText = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValueText;
                    item.StatusId = 2;
                    item.ChildId = ChildId;
                    item.ChildName = this.childName;
                });
                this.AnnualReviewPlacementInfoDirty = true;
               // const index: number = this.childListTemp.findIndex(x => x.ChildId == ChildId);
               // this.childList.splice(index, 1);
                this.childList=this.childList.filter(x => x.ChildId != ChildId);

                this.AttendedStatusId = null;
                this.dynamicformcontroldataGrid.forEach(itemTemp => {
                    this.dynamicformcontroldataGrid.filter(item => item.FieldValue = null);

                });
                this.submittedStatus = false;
                this.objAnnualReviewDTO.PlacementChildId = null;
                this.childName = "";
            }
        }
        else
        {
            this.module.alertDanger("Placement review details already exist for "+this.childName);
        }

    }
    CancelEdit() {

        if (this.isEdit) {
            this.dynamicformcontroldataGrid.forEach(itemTemp => {
                this.dynamicformcontroldataGrid.filter(item => item.FieldValue = null);

            });

            this.objAnnualReviewDTO.PlacementChildId = null;
            this.childName = "";

            this.childList = [];
            let temp = JSON.parse(Common.GetSession("AnnualRevChildPlacementEdit"));
            if (temp.length > 0) {
                temp.forEach(T => {
                    this.childList.push(T);
                });
            }
        }
        this.isEdit = false;
        this.AttendedStatusId = null;
    }
    isEdit = false;
    AttendedStatusId;
    //---End
    DynamicOnValChange(InsValChange: ValChangeDTO) {

        if (InsValChange.currnet.FieldCnfg.FieldName == "SocialWorkerId") {
            InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "IsLocked") {
            InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "SaveAsDraftStatus") {
            InsValChange.currnet.IsVisible = false;
        }

        if (this.insCarerDetails.SCFullName == null && InsValChange.currnet.FieldCnfg.FieldName == "SecondCarerLastMedicalDate") {
            InsValChange.currnet.IsVisible = false;
        }


        let val2 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "IsRegisteredChildMinderComments");
        if (val2.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "IsRegisteredChildMinder") {
            if (InsValChange.newValue)
                val2[0].IsVisible = true;
            else
                val2[0].IsVisible = false;
        }

        if (InsValChange.newValue != null && InsValChange.newValue != '' && InsValChange.currnet.FieldCnfg.FieldName == "ReviewDate") {
            let setNextReviewDate = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "NextReviewDate");
            if (setNextReviewDate.length > 0 && this.objAgencyKeyNameValueCnfgDTO.IsApproved==true && this.objAgencyKeyNameValueCnfgDTO.Value != null) {
                if (setNextReviewDate[0].FieldValue == null || this.IsFirstLoad == true) {
                    let count = this.objAgencyKeyNameValueCnfgDTO.Value.split(',')[0];
                    let yearMonth = this.objAgencyKeyNameValueCnfgDTO.Value.split(',')[1];
                    if ((yearMonth == "Year" || yearMonth == "year") && count != null) {
                        let YearCount = parseInt(count) * 12;
                        let currtdateYear = new Date(this.module.GetDateSaveFormat(InsValChange.newValue));
                        let data: Date = new Date(currtdateYear.setMonth(currtdateYear.getMonth() + YearCount));
                        setNextReviewDate[0].FieldValue = data.toISOString().split('T')[0];
                        setNextReviewDate[0].FieldValue = this.module.GetDateEditFormat(setNextReviewDate[0].FieldValue);
                    }
                    else if ((yearMonth == "Month" || yearMonth == "month") && count != null) {
                        let currtdateMonth = new Date(this.module.GetDateSaveFormat(InsValChange.newValue));
                        let data = new Date(currtdateMonth.setMonth(currtdateMonth.getMonth() + parseInt(count)));
                        setNextReviewDate[0].FieldValue = data.toISOString().split('T')[0];
                        setNextReviewDate[0].FieldValue = this.module.GetDateEditFormat(setNextReviewDate[0].FieldValue);

                    }
                }
            }

            //CommencementDate
            let setCommencementDate = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "CommencementDate");
            if (setCommencementDate.length > 0 && this.objAgencyKeyNameValueCnfgDTO.IsApproved==true && this.objAgencyKeyNameValueCnfgDTO.Value != null) {
                if (setCommencementDate[0].FieldValue == null || this.IsFirstLoad == true) {
                    let count = this.objAgencyKeyNameValueCnfgDTO.Value.split(',')[0];
                    let yearMonth = this.objAgencyKeyNameValueCnfgDTO.Value.split(',')[1];
                    if ((yearMonth == "Year" || yearMonth == "year") && count != null) {
                        let YearCount = parseInt(count) * 10;
                        let currtdateYear = new Date(this.module.GetDateSaveFormat(InsValChange.newValue));
                        let data: Date = new Date(currtdateYear.setMonth(currtdateYear.getMonth() + YearCount));
                        setCommencementDate[0].FieldValue = data.toISOString().split('T')[0];
                        setCommencementDate[0].FieldValue = this.module.GetDateEditFormat(setCommencementDate[0].FieldValue);
                    }
                    else if ((yearMonth == "Month" || yearMonth == "month") && count != null) {
                        let count1:number = parseInt(count)-2;
                        let currtdateMonth = new Date(this.module.GetDateSaveFormat(InsValChange.newValue));
                        let data = new Date(currtdateMonth.setMonth(currtdateMonth.getMonth() + count1));
                        setCommencementDate[0].FieldValue = data.toISOString().split('T')[0];
                        setCommencementDate[0].FieldValue = this.module.GetDateEditFormat(setCommencementDate[0].FieldValue);

                    }
                }
            }

            //SubmissiontoManagementDate
            let setSubmissiontoManagementDate = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "SubmissiontoManagementDate");
            if (setSubmissiontoManagementDate.length > 0 && this.objAgencyKeyNameValueCnfgDTO.IsApproved==true && this.objAgencyKeyNameValueCnfgDTO.Value != null) {
                if (setSubmissiontoManagementDate[0].FieldValue == null || this.IsFirstLoad == true) {
                    let count = this.objAgencyKeyNameValueCnfgDTO.Value.split(',')[0];
                    let yearMonth = this.objAgencyKeyNameValueCnfgDTO.Value.split(',')[1];
                    if ((yearMonth == "Year" || yearMonth == "year") && count != null) {
                        let YearCount = parseInt(count) * 11;
                        let currtdateYear = new Date(this.module.GetDateSaveFormat(InsValChange.newValue));
                        let data: Date = new Date(currtdateYear.setMonth(currtdateYear.getMonth() + YearCount));
                        setSubmissiontoManagementDate[0].FieldValue = data.toISOString().split('T')[0];
                        setSubmissiontoManagementDate[0].FieldValue = this.module.GetDateEditFormat(setSubmissiontoManagementDate[0].FieldValue);
                    }
                    else if ((yearMonth == "Month" || yearMonth == "month") && count != null) {
                        let count1:number = parseInt(count)-1;
                        let currtdateMonth = new Date(this.module.GetDateSaveFormat(InsValChange.newValue));
                        let data = new Date(currtdateMonth.setMonth(currtdateMonth.getMonth() + count1));
                        setSubmissiontoManagementDate[0].FieldValue = data.toISOString().split('T')[0];
                        setSubmissiontoManagementDate[0].FieldValue = this.module.GetDateEditFormat(setSubmissiontoManagementDate[0].FieldValue);

                    }
                }
            }

            //SubmissiontoRODate
            let setSubmissiontoRODate = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "SubmissiontoRODate");
            if (setSubmissiontoRODate.length > 0 && this.objAgencyKeyNameValueCnfgDTO.IsApproved==true && this.objAgencyKeyNameValueCnfgDTO.Value != null) {
                if (setSubmissiontoManagementDate[0].FieldValue == null || this.IsFirstLoad == true) {
                    let count = this.objAgencyKeyNameValueCnfgDTO.Value.split(',')[0];
                    let yearMonth = this.objAgencyKeyNameValueCnfgDTO.Value.split(',')[1];
                    if ((yearMonth == "Year" || yearMonth == "year") && count != null) {
                        let YearCount = parseInt(count) * 12;
                        let currtdateYear = new Date(this.module.GetDateSaveFormat(InsValChange.newValue));
                        let data: Date = new Date(currtdateYear.setMonth(currtdateYear.getMonth() + YearCount));

                        let data1 = new Date(data.setDate(data.getDate() -7));

                        setSubmissiontoRODate[0].FieldValue = data.toISOString().split('T')[0];
                        setSubmissiontoRODate[0].FieldValue = this.module.GetDateEditFormat(setSubmissiontoRODate[0].FieldValue);
                    }
                    else if ((yearMonth == "Month" || yearMonth == "month") && count != null) {
                        let currtdateMonth = new Date(this.module.GetDateSaveFormat(InsValChange.newValue));
                        let data = new Date(currtdateMonth.setMonth(currtdateMonth.getMonth() + parseInt(count)));
                        let data1 = new Date(data.setDate(data.getDate() -7));
                        setSubmissiontoRODate[0].FieldValue = data1.toISOString().split('T')[0];
                        setSubmissiontoRODate[0].FieldValue = this.module.GetDateEditFormat(setSubmissiontoRODate[0].FieldValue);

                    }
                }
            }
        }

        if (InsValChange.newValue != null && InsValChange.newValue != '' && InsValChange.currnet.FieldCnfg.FieldName == "NextReviewDate") {
            //CommencementDate
            let setCommencementDate = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "CommencementDate");
            if (setCommencementDate.length > 0) {
                if (setCommencementDate[0].FieldValue == null || this.IsFirstLoad == true) {
                    let currtdateMonth = new Date(this.module.GetDateSaveFormat(InsValChange.newValue));
                    let data = new Date(currtdateMonth.setMonth(currtdateMonth.getMonth() -2));
                    setCommencementDate[0].FieldValue = data.toISOString().split('T')[0];
                    setCommencementDate[0].FieldValue = this.module.GetDateEditFormat(setCommencementDate[0].FieldValue);

                }
            }

            //SubmissiontoManagementDate
            let setSubmissiontoManagementDate = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "SubmissiontoManagementDate");
            if (setSubmissiontoManagementDate.length > 0) {
                if (setSubmissiontoManagementDate[0].FieldValue == null || this.IsFirstLoad == true) {
                    let currtdateMonth = new Date(this.module.GetDateSaveFormat(InsValChange.newValue));
                    let data = new Date(currtdateMonth.setMonth(currtdateMonth.getMonth() -1));
                    setSubmissiontoManagementDate[0].FieldValue = data.toISOString().split('T')[0];
                    setSubmissiontoManagementDate[0].FieldValue = this.module.GetDateEditFormat(setSubmissiontoManagementDate[0].FieldValue);
                }
            }

            //SubmissiontoRODate
            let setSubmissiontoRODate = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "SubmissiontoRODate");
            if (setSubmissiontoRODate.length > 0 ) {
                if (setSubmissiontoManagementDate[0].FieldValue == null || this.IsFirstLoad == true) {
                    let currtdateMonth = new Date(this.module.GetDateSaveFormat(InsValChange.newValue));8
                    let data1 = new Date(currtdateMonth.setDate(currtdateMonth.getDate() -7));
                    setSubmissiontoRODate[0].FieldValue = data1.toISOString().split('T')[0];
                    setSubmissiontoRODate[0].FieldValue = this.module.GetDateEditFormat(setSubmissiontoRODate[0].FieldValue);
                }
            }

        }
    }

    //PDF
    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateCarerAnnualReviewPDF/" + this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
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
        window.location.href = this.apiURL + "GenerateCarerAnnualReviewWord/" + this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
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
        this.apiService.get("GeneratePDF", "GenerateCarerAnnualReviewPrint", this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId).then(data => {
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
            this.apiService.post("GeneratePDF", "EmailCarerAnnualReview", this.objNotificationDTO).then(data => {
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
    //Save as draft
    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('AnnualReviewCarerAutoSave', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('AnnualReviewCarerAutoSave', () => this.timer2callback());
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
                    this.objAnnualReviewDTO.IsSubmitted = false;
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
        this.st.delTimer('AnnualReviewCarerAutoSave');
        Common.SetSession("formcnfgid", "0");
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
