import { Component, ElementRef, Pipe, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleTimer } from 'ng2-simple-timer';
import { environment } from '../../../environments/environment';
import { Common, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat, deepCopy } from '../common';
import { ValChangeDTO } from '../dynamic/ValChangeDTO';
import { PagesComponent } from '../pages.component';
//import { SaveDraftService } from '../services/savedraft/savedraftinfo.service';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
//import {CarerUnannouncedHomeVisitService } from '../services/carerunannouncedhomevisit.service'
import { CarerUnannouncedHomeVisitDTO,ChildRiskAssessmentNewComboDTO,CarerUnannouncedHomeVisitActionPointsDTO } from './DTO/carerunannouncedhomevisitdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
declare var $: any;
//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'carerunannouncedhomevisitdata',
    templateUrl: './carerunannouncedhomevisitdata.component.template.html',
})

export class CarerUnannouncedHomeVisitDataComponent {
    onjChildRiskAssessmentNewComboDTO:ChildRiskAssessmentNewComboDTO=new ChildRiskAssessmentNewComboDTO();
    controllerName = "CarerUnannouncedHomeVisit";
    objCarerUnannouncedHomeVisitDTO: CarerUnannouncedHomeVisitDTO = new CarerUnannouncedHomeVisitDTO();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    submitted = false;
    dynamicformcontrol = [];
    dynamicformcontrolOrginal = [];
    dynamicformcontrolActionPoints = [];
    _Form: FormGroup;
    isVisibleMandatoryMsg;
    SequenceNo;
    objQeryVal;
    //upload doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerParentId: number;
    AgencyProfileId: number;
    SocialWorkerName;
    SocialWorkerId;
    UnannouncedActive = "active";
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
    CarerCode;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    insCarerDetails;
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    isLoadingSAD: boolean = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=60;
    visibleBirthChildrenGrid = false;
    insCarerId;
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private _router: Router, private module: PagesComponent
        , private st: SimpleTimer, private renderer: Renderer2, private apiService: APICallService) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        this.objCarerUnannouncedHomeVisitDTO.AgencyProfileId = this.AgencyProfileId;
        this.objCarerUnannouncedHomeVisitDTO.CarerParentId = this.CarerParentId;
        this.objCarerUnannouncedHomeVisitDTO.ControlLoadFormat = ["Default","ActionPoints"];
        this.SequenceNo = this.objQeryVal.Id;

        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objCarerUnannouncedHomeVisitDTO.SequenceNo = this.SequenceNo;
        } else {
            this.objCarerUnannouncedHomeVisitDTO.SequenceNo = 0;
            //cuhvServices.getByFormCnfgId(this.objCarerUnannouncedHomeVisitDTO).then(data => { this.dynamicformcontrol = data; });
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerUnannouncedHomeVisitDTO).then(data => {
                 this.dynamicformcontrol = data.LstAgencyFieldMapping;
                 this.dynamicformcontrolActionPoints= data.LstAgencyFieldMapping.filter(x=>x.ControlLoadFormat=="ActionPoints");
                 this.LoadAlreadyStoreActionPoints(data.lstActionPointsList);
                 
                ///Get BirthChildrenGrid
                let IsBirthChildrenGrid = data.LstAgencyFieldMapping.filter(x => x.FieldCnfg.FieldName == "IsBirthChildrenGrid");
                if (IsBirthChildrenGrid.length > 0)
                    this.visibleBirthChildrenGrid = true;
            });
        }

        if (Common.GetSession("SelectedCarerProfile") != null) {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
            this.insCarerId = this.insCarerDetails.CarerId;
        }

        this.SocialWorkerName = Common.GetSession("ACarerSSWName");
        this.SocialWorkerId = Common.GetSession("ACarerSSWId");
       
        if (this.SocialWorkerName == "null")
            this.SocialWorkerName = "Not Assigned";
        //Upload Doc
        this.formId = 60;
        Common.SetSession("formcnfgid", this.formId);
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.SequenceNo;

        if (Common.GetSession("SelectedCarerProfile") != null) {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
            this.CarerCode = this.insCarerDetails.CarerCode;
        }

        this._Form = _formBuilder.group({});
        if (Common.GetSession("SaveAsDraft") == "N") {
            if (this.SequenceNo != 0)
                this.showbtnSaveDraft = false;
            this.objCarerUnannouncedHomeVisitDTO.SequenceNo = this.objQeryVal.Id;
            this.objCarerUnannouncedHomeVisitDTO.AgencyProfileId = this.AgencyProfileId;
            this.objCarerUnannouncedHomeVisitDTO.CarerParentId = this.CarerParentId;
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerUnannouncedHomeVisitDTO).then(data => {
               
                ///Get BirthChildrenGrid
                let IsBirthChildrenGrid = data.LstAgencyFieldMapping.filter(x => x.FieldCnfg.FieldName == "IsBirthChildrenGrid");
                if (IsBirthChildrenGrid.length > 0)
                    this.visibleBirthChildrenGrid = true; 

                this.dynamicformcontrol = data.LstAgencyFieldMapping.filter(x=>x.ControlLoadFormat=="Default");
                this.dynamicformcontrolActionPoints= data.LstAgencyFieldMapping.filter(x=>x.ControlLoadFormat=="ActionPoints");
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                this.LoadAlreadyStoreActionPoints(data.lstActionPointsList);
                let val3 = data.LstAgencyFieldMapping.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
                if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                    this.SocialWorkerName = val3[0].FieldCnfg.DisplayName;
                
                
            });
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = this.objQeryVal.Id;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                let tem= JSON.parse(data.JsonData);
               // console.log(tem);
                this.LoadAlreadyStoreActionPoints(tem.lstActionPointsList);
                this.dynamicformcontrol =tem.LstAgencyFieldMapping;
                this.dynamicformcontrolActionPoints= tem.LstAgencyFieldMapping.filter(x=>x.ControlLoadFormat=="ActionPoints");
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                let tempDoc = JSON.parse(data.JsonList);
                if (tempDoc != null)
                    this.isUploadDoc = tempDoc[0].IsDocumentExist;
                
                ///Get BirthChildrenGrid
                let IsBirthChildrenGrid = tem.LstAgencyFieldMapping.filter(x => x.FieldCnfg.FieldName == "IsBirthChildrenGrid");
                if (IsBirthChildrenGrid.length > 0)
                    this.visibleBirthChildrenGrid = true;
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
          this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
          this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
          this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
          Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
          }
    }

    fnBack()
    {
        this._router.navigate(['/pages/fostercarer/carerunannouncedhomevisitlist', 3,this.objQeryVal.apage]);

    }


    fnUnannounced() {
        this.UnannouncedActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.UnannouncedActive = "";
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
            this.UnannouncedActive = "active";
            this.DocumentActive = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.UnannouncedActive = "active";
            this.DocumentActive = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.UnannouncedActive = "";
            this.DocumentActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }

        if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '' && this.DocOk) {
            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(dynamicForm, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || this.ActionPointsDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraft") == "N")
                    type = "update";
                if(this.SequenceNo == 0){
                let val2 = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
                if (val2.length > 0 && val2[0].FieldValue != '0' && (val2[0].FieldValue == null || val2[0].FieldValue == ''))
                    val2[0].FieldValue = this.SocialWorkerId;
            }
                this.onjChildRiskAssessmentNewComboDTO.NotificationEmailIds = EmailIds;
                this.onjChildRiskAssessmentNewComboDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.onjChildRiskAssessmentNewComboDTO.DynamicValue = dynamicForm;
                this.onjChildRiskAssessmentNewComboDTO.CarerParentId = this.CarerParentId;
                this.onjChildRiskAssessmentNewComboDTO.lstActionPointsList = this.globalobjActionPointsList;
                this.onjChildRiskAssessmentNewComboDTO.SequenceNo=this.SequenceNo;
                this.apiService.save(this.controllerName, this.onjChildRiskAssessmentNewComboDTO, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
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
            this.ActionPointsDirty=false;
            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            this.dynamicformcontrolOrginal = ConvertDateAndDateTimeSaveFormat(this.dynamicformcontrolOrginal);

             if (this.globalobjActionPointsList.length > 0) {
                 this.globalobjActionPointsList.forEach(itemMain => {
                     itemMain.filter(x => x.StatusId == 1).forEach(item => {
                         item.StatusId = 4;
                     })
                 })
             }

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
                if (skipAlert)
                    this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            }
            if (skipAlert){
                this._router.navigate(['/pages/fostercarer/carerunannouncedhomevisitlist', 3,this.objQeryVal.apage]);
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            }
            this.skipAlert = true;
            this.onjChildRiskAssessmentNewComboDTO.IsSubmitted = true;
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
            this.ActionPointsDirty=false;
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

        if (InsValChange.currnet.FieldCnfg.FieldName == "IsBirthChildrenGrid") {
            InsValChange.currnet.IsVisible = false;
        }

        
    }
    fnSaveDraft(dynamicValue, IsUpload, uploadFormBuilder) {
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
                this.fnSubSaveDraft(dynamicValue, IsUpload, uploadFormBuilder);
        }
        else
            this.fnSubSaveDraft(dynamicValue, IsUpload, uploadFormBuilder);
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
            if (this.isDirty ||  this.ActionPointsDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoadingSAD = true;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objCarerUnannouncedHomeVisitDTO.SequenceNo = this.SequenceNo;

                this.onjChildRiskAssessmentNewComboDTO.SequenceNo = this.SequenceNo;
                this.onjChildRiskAssessmentNewComboDTO.lstActionPointsList = this.globalobjActionPointsList;
                this.onjChildRiskAssessmentNewComboDTO.LstAgencyFieldMapping = this.dynamicformcontrol;

                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.onjChildRiskAssessmentNewComboDTO);
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
            this.isLoadingSAD = true;
            this.apiService.get(this.controllerName, "GetNextSequenceNo", this.formId).then(data => {
                this.SequenceNo = parseInt(data);
                this.tblPrimaryKey = this.SequenceNo;
                this.objCarerUnannouncedHomeVisitDTO.SequenceNo = this.SequenceNo;
                this.onjChildRiskAssessmentNewComboDTO.SequenceNo = this.SequenceNo;
                this.onjChildRiskAssessmentNewComboDTO.lstActionPointsList = this.globalobjActionPointsList;
                this.onjChildRiskAssessmentNewComboDTO.LstAgencyFieldMapping = this.dynamicformcontrol;
                this.onjChildRiskAssessmentNewComboDTO.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.onjChildRiskAssessmentNewComboDTO);
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

    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('carerunanonce180', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('carerunanonce180', () => this.timer2callback());
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
                    this.onjChildRiskAssessmentNewComboDTO.IsSubmitted = false; 
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
        this.st.delTimer('carerunanonce180');
        Common.SetSession("formcnfgid", "0");
    }

    //PDF
    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateCarerUnannouncedHomeVisitPDF/" + this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId+ "," + this.insCarerId;
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
        window.location.href = this.apiURL + "GenerateCarerUnannouncedHomeVisitWord/" + this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId+ "," + this.insCarerId;
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
        this.apiService.get("GeneratePDF", "GenerateCarerUnannouncedHomeVisitPrint", this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId+ "," + this.insCarerId).then(data => {
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
            this.objNotificationDTO.Body = this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId+ "," + this.insCarerId;
            this.apiService.post("GeneratePDF", "EmailCarerUnannouncedHomeVisit", this.objNotificationDTO).then(data => {
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

    //---Dynamic Grid
    objActionPointsList: CarerUnannouncedHomeVisitActionPointsDTO[] = [];
    objActionPointsListInsert = [];
    globalobjActionPointsList = [];
    submittedActionPoints = false;
    LoadAlreadyStoreActionPoints(data) {

        if (data != null) {
            data.forEach(item => {
                this.objActionPointsList = [];
                item.forEach(subItem => {
                    if (subItem.StatusId != 3) {
                        let add: CarerUnannouncedHomeVisitActionPointsDTO = new CarerUnannouncedHomeVisitActionPointsDTO();
                        add.FieldCnfgId = subItem.FieldCnfgId;
                        add.FieldName = subItem.FieldName;
                        add.FieldValue = subItem.FieldValue;
                        add.FieldDataTypeName = subItem.FieldDataTypeName;
                        add.FieldValueText = subItem.FieldValueText;
                        add.UniqueID = subItem.UniqueID;
                        add.SequenceNo = subItem.SequenceNo;
                        add.StatusId = subItem.StatusId;
                        this.objActionPointsList.push(add);
                        this.objActionPointsListInsert.push(add);
                    }
                });
                if (this.objActionPointsList.length > 0)
                    this.globalobjActionPointsList.push(this.objActionPointsList);
            });
        }
    }
    ActionPointsDirty = false;
    AddActionPointsDetails(dynamicVal, dynamicForm) {
        this.objActionPointsList = [];

        if (dynamicForm.valid) {
            dynamicVal.forEach(item => {
                let add: CarerUnannouncedHomeVisitActionPointsDTO = new CarerUnannouncedHomeVisitActionPointsDTO();
                add.FieldCnfgId = item.FieldCnfgId;
                add.FieldName = item.FieldName;
                add.FieldValue = item.FieldValue;
                add.FieldDataTypeName = item.FieldDataTypeName;
                add.FieldValueText = item.FieldValueText;
                add.StatusId = 1;
                add.UniqueID = 0;
                this.objActionPointsList.push(add);
                this.objActionPointsListInsert.push(add);

            })
            this.globalobjActionPointsList.push(this.objActionPointsList);
            this.submittedActionPoints = false;
            this.ActionPointsDirty = true;
            this.dynamicformcontrolActionPoints.forEach(itemTemp => {
                this.dynamicformcontrolActionPoints.filter(item => item.FieldValue = null);

            });
            //  this.dynamicformcontroldata = this.dynamicformcontroldataOrginal;
            //this.dynamicformcontroldataGrid = this.dynamicformcontroldata.filter(item => item.ControlLoadFormat == 'Default.Grid.0');
        }
        else
            this.submittedActionPoints = true;
    }

    EditActionPointsList(index) {
        this.ActionPointsId = index;
        this.isEdit = true;
        let tempObj = this.globalobjActionPointsList[index];
        tempObj.forEach(itemTemp => {
            // this.dynamicformcontrolActionPoints.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId)[0].FieldValue = itemTemp.FieldValue;
            let val = this.dynamicformcontrolActionPoints.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId);
            if (val.length > 0) {
                switch (val[0].FieldCnfg.FieldDataTypeCnfg.Name) {
                    case "date":
                        {
                            val[0].FieldValue = this.module.GetDateEditFormat(itemTemp.FieldValue);
                            break;
                        }
                    case "datetime":
                        {
                            val[0].FieldValue = this.module.GetDateTimeEditFormat(itemTemp.FieldValue);
                            break;
                        }
                    default: {
                        val[0].FieldValue = itemTemp.FieldValue;
                    }
                }
            }
        });
        //  this.dynamicformcontroldata = this.dynamicformcontroldataOrginal;
    }

    DeleteActionPointsList(index) {
        let temp = this.globalobjActionPointsList[index];
        temp.forEach(item => {
            item.StatusId = 3;
        });
        this.ActionPointsDirty = true;
    }

    UpdateActionPointsDetails(dynamicVal, dynamicForm) {

        if (dynamicForm.valid) {
            this.isEdit = false;
            let temp = this.globalobjActionPointsList[this.ActionPointsId];
            temp.forEach(item => {
                item.FieldValue = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValue;
                item.FieldValueText = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValueText;
                item.StatusId = 2;
            });
            this.ActionPointsDirty = true;
            this.dynamicformcontrolActionPoints.forEach(itemTemp => {
                this.dynamicformcontrolActionPoints.filter(item => item.FieldValue = null);

            });
            this.submittedActionPoints = false;
        }
        else
            this.submittedActionPoints = true;
        this.ActionPointsId = null;
    }


    CancelEditActionPoints() {
        this.isEdit = false;
        this.ActionPointsId = null;
        this.dynamicformcontrolActionPoints.forEach(itemTemp => {
            this.dynamicformcontrolActionPoints.filter(item => item.FieldValue = null);

        });
    }

    changeActionPointsStatus()
    {
        this.globalobjActionPointsList.forEach(data=>{
            data.forEach(item => {
                item.StatusId = 4;
            });
        })
    }

    isEdit = false;
    ActionPointsId;

    //---End
}
