import { APICallService } from '../services/apicallservice.service';
import { Component, Pipe, ViewChild, OnInit, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common, deepCopy, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat}  from  '../common'
import { ChildRiskAssessmentNewComboDTO,ChildRiskAssessmentNewDTO, ChildRiskAssessmentNewSignificantDTO, ChildRiskAssessmentNewRisksCausingDTO } from './DTO/childriskassessmentnewdto'
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
    selector: 'ChildRiskAssessmentData',
    templateUrl: './childriskassessmentnewdata.component.templste.html',
})

export class ChildRiskAssessmentNewDataComponent {
    controllerName = "ChildRiskAssessmentNew";
    objChildRiskAssessmentNewDTO:ChildRiskAssessmentNewDTO=new ChildRiskAssessmentNewDTO();
    objChildRiskAssessmentNewComboDTO: ChildRiskAssessmentNewComboDTO = new ChildRiskAssessmentNewComboDTO();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    submitted = false;
    dynamicformcontrol = [];
    dynamicformcontrolSignificant = [];
    dynamicformcontrolRiskCausing = [];
    dynamicformcontrolOG = [];
    _Form: FormGroup;
    SequenceNo;
    objQeryVal;
    //Doc
    FormCnfgId;
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    ChildId: number;
    AgencyProfileId;
    CarerParentId;
    ChildDetailsActive = "active";
    ChildInformationActive;
    ChildRiskDetailsActive;
    DelegatedAuthorityActive;
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
    significantList = [];
    significantColumns=[{prop:'Date', name:'Date', width:150},
                {prop:'Risk', name:'Risk', width:400}];
    riskList = [];
    riskColumns = [{prop:'Cause', name:'Risk Associated with', width:100},
    {prop:'Category', name:'Assessment to Risk Level', width:100},
    {prop:'Details', name:'Details of Risk', width:200},
    {prop:'ManageRisk', name:'Action Taken to Minimise and Manage the Risk', width:200}];
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    isLoadingSAD: boolean = false;
    LASocialWorkerId;//carries the value of Agency Social worker ID
    SocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private module: PagesComponent,
        private st: SimpleTimer, private renderer: Renderer2, private apiService: APICallService) {
        this.CarerName = Common.GetSession("CarerName");
        if (this.CarerName == "null") {
            this.CarerName = "Not Placed";
            this.CarerParentId = 0;
        }
        else this.CarerParentId = parseInt(Common.GetSession("CarerId"));
        this.AgencyProfileId = Common.GetSession("AgencyProfileId");
        this.LASocialWorkerId = Common.GetSession("SSWId");
        this.SocialWorkerId = Common.GetSession("ChildLASocialWorkerId");
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

        this.apiService.get("ChildExploitation", "GetChildInfo", this.ChildId).then(data => {
            this.insChildDetails = data;
            if (this.insChildDetails && this.insChildDetails.LocalAuthoritySWInfo)
                this.ChildSSWName = this.insChildDetails.LocalAuthoritySWInfo.LocalAuthoritySWInfoName;
        });
        //Doc
        this.formId = 239;
        this.FormCnfgId = 239;
        this.TypeId = this.ChildId;
        this.tblPrimaryKey = this.objQeryVal.id;
        this.objChildRiskAssessmentNewComboDTO.ChildId=this.ChildId;

        this.SequenceNo=this.objQeryVal.id;
        this._Form = _formBuilder.group({});
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });

        /////////New
        this.objChildRiskAssessmentNewComboDTO.SequenceNo = this.objQeryVal.id;
        this.objChildRiskAssessmentNewComboDTO.AgencyProfileId = this.AgencyProfileId
        this.objChildRiskAssessmentNewComboDTO.ControlLoadFormat = ["ChildDetails", "ChildInfo", "DelegatedAutho", "Significant", "Risk"];
        if (this.SequenceNo == 0 ) {
            apiService.post(this.controllerName, "GetDynamicControls", this.objChildRiskAssessmentNewComboDTO).then(data => {
                this.dynamicformcontrol = data.LstAgencyFieldMapping;
                this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol.filter(x => x.ControlLoadFormat != 'Significant' && x.ControlLoadFormat != 'Risk'));
                this.setTabVisible();
                this.dynamicformcontrolSignificant = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Significant');
                this.dynamicformcontrolRiskCausing = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Risk');

                this. isLoadinig=true;
                apiService.post(this.controllerName, "GetDynamicControlsNew", this.objChildRiskAssessmentNewComboDTO).then(data => {
                    this. isLoadinig=false;
                    this.LoadAlreadyStoreSignificant(data.lstChildRiskAssessmentNewSignificant);
                    this.LoadAlreadyStoreRisk(data.lstChildRiskAssessmentNewRisksCausing);
                });
            });
        }

        if (this.SequenceNo != 0 && Common.GetSession("SaveAsDraftrisk") == "N") {
            if (this.SequenceNo != 0)
                this.showbtnSaveDraft = false;
            apiService.post(this.controllerName, "GetDynamicControls", this.objChildRiskAssessmentNewComboDTO).then(data => {
                this.dynamicformcontrol = data.LstAgencyFieldMapping;
                this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol.filter(x => x.ControlLoadFormat != 'Significant' && x.ControlLoadFormat != 'Risk'));
                this.setTabVisible();

                this.dynamicformcontrolSignificant = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Significant');
                this.dynamicformcontrolRiskCausing = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Risk');

                this. isLoadinig=true;
                apiService.post(this.controllerName, "GetDynamicControlsNew", this.objChildRiskAssessmentNewComboDTO).then(data => {
                    this. isLoadinig=false;
                    this.LoadAlreadyStoreSignificant(data.lstChildRiskAssessmentNewSignificant);
                    this.LoadAlreadyStoreRisk(data.lstChildRiskAssessmentNewRisksCausing);
                });

                let val2 = data.LstAgencyFieldMapping.filter(x => x.FieldCnfg.FieldName == "CarerParentId");
                if (val2.length > 0 && val2[0].FieldCnfg.DisplayName != null && val2[0].FieldCnfg.DisplayName != "") {
                    this.CarerName = val2[0].FieldCnfg.DisplayName;
                    this.CarerParentId = parseInt(val2[0].FieldValue);
                }
                let val3 = data.LstAgencyFieldMapping.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
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
                let temp = JSON.parse(data.JsonData);
                this.dynamicformcontrol = temp.LstAgencyFieldMapping;
                this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol.filter(x => x.ControlLoadFormat != 'Significant' && x.ControlLoadFormat != 'Risk'));
                let tempDoc = JSON.parse(data.JsonList);
                if (tempDoc != null)
                    this.isUploadDoc = tempDoc[0].IsDocumentExist;
                this.dynamicformcontrolSignificant = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Significant');
                this.dynamicformcontrolRiskCausing = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Risk');
                this.LoadAlreadyStoreSignificant(temp.lstChildRiskAssessmentNewSignificant);
                this.LoadAlreadyStoreRisk(temp.lstChildRiskAssessmentNewRisksCausing);
                this.setTabVisible();
            });
        }
        ////End

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

        // //Get Save as Draft Info
        // this.objSaveDraftInfoDTO.SequenceNo = this.ChildId;
        // this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        // this.objSaveDraftInfoDTO.TypeId = this.ChildId;
        // this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        // this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
        //     if (data) {

        //         let temp = JSON.parse(data.JsonData);
        //         this.SequenceNo = 1;
        //         this.dynamicformcontrol = temp.LstAgencyFieldMapping;
        //         this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol.filter(x => x.ControlLoadFormat != 'Significant' && x.ControlLoadFormat != 'Risk'));
        //         let tempDoc = JSON.parse(data.JsonList);
        //         if (tempDoc != null)
        //             this.isUploadDoc = tempDoc[0].IsDocumentExist;
        //         this.dynamicformcontrolSignificant = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Significant');
        //         this.dynamicformcontrolRiskCausing = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Risk');
        //         this.LoadAlreadyStoreSignificant(temp.lstChildRiskAssessmentNewSignificant);
        //         this.LoadAlreadyStoreRisk(temp.lstChildRiskAssessmentNewRisksCausing);
        //         this.setTabVisible();
        //        // this.IsVisibleFCSing=true;
        //     }
        //     else {
        //         //Get GetDynamicControls

        //         this.objChildRiskAssessmentNewComboDTO.SequenceNo = this.ChildId;
        //         this.objChildRiskAssessmentNewComboDTO.AgencyProfileId = this.AgencyProfileId;
        //         this.objChildRiskAssessmentNewComboDTO.ChildId = this.ChildId;
        //         this.apiService.post(this.controllerName, "GetDynamicControls", this.objChildRiskAssessmentNewComboDTO).then(data => {

        //             this.dynamicformcontrol = data.LstAgencyFieldMapping;
        //             //console.log(this.dynamicformcontrol);
        //             if(this.dynamicformcontrol[0].UniqueID>0)
        //             {
        //                 this.IsVisibleFCSing=true;
        //             }

        //             this.IsFCSignatureSigned=data.IsFCSignatureSigned;
        //             this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol.filter(x => x.ControlLoadFormat != 'Significant' && x.ControlLoadFormat != 'Risk'));
        //             this.setTabVisible();
        //             this.dynamicformcontrolSignificant = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Significant');
        //             this.dynamicformcontrolRiskCausing = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Risk');
        //             this.LoadAlreadyStoreSignificant(data.lstChildRiskAssessmentNewSignificant);
        //             this.LoadAlreadyStoreRisk(data.lstChildRiskAssessmentNewRisksCausing);

        //             let val1 = data.LstAgencyFieldMapping.filter(x => x.FieldCnfg.FieldName == "DateofAssessment");
        //             if (val1.length > 0 && val1[0].FieldValue != null && val1[0].FieldValue != "") {
        //                 this.showbtnSaveDraft = false;
        //                 this.SequenceNo = 1;
        //             }

        //             let val2 = data.LstAgencyFieldMapping.filter(x => x.FieldCnfg.FieldName == "CarerParentId");
        //             if (val2.length > 0 && val2[0].FieldCnfg.DisplayName != null && val2[0].FieldCnfg.DisplayName != "") {
        //                 this.CarerName = val2[0].FieldCnfg.DisplayName;
        //                 this.CarerParentId = parseInt(val2[0].FieldValue);
        //             }
        //             let val3 = data.LstAgencyFieldMapping.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
        //             if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null) {
        //                 this.ChildSSWName = val3[0].FieldCnfg.DisplayName;
        //             }

        //         });

        //     }
        // });

    }
    ChildInformaVisible = true;
    ChildRiskDetailsVisible = true;
    DelegatedAuthorityVisible = true;
    setTabVisible() {
        let insChildInformaVisible = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'ChildInfo');
        if (insChildInformaVisible.length > 0) {
            this.ChildInformaVisible = false;
        }

        let insChildRiskDetailsVisible = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'Risk');
        if (insChildRiskDetailsVisible.length > 0) {
            this.ChildRiskDetailsVisible = false;
        }
        let insDelegatedAuthorityVisible = this.dynamicformcontrol.filter(x => x.ControlLoadFormat == 'DelegatedAutho');
        if (insDelegatedAuthorityVisible.length > 0) {
            this.DelegatedAuthorityVisible = false;
        }
    }

    fnChildDetailsTab() {
        this.ChildDetailsActive = "active";
        this.ChildInformationActive = "";
        this.ChildRiskDetailsActive = "";
        this.DelegatedAuthorityActive = "";
        this.DocumentActive = "";
    }

    fnChildInformationTab() {
        this.ChildDetailsActive = "";
        this.ChildInformationActive = "active";
        this.ChildRiskDetailsActive = "";
        this.DelegatedAuthorityActive = "";
        this.DocumentActive = "";
    }
    fnChildRiskDetailsTab() {
        this.ChildDetailsActive = "";
        this.ChildInformationActive = "";
        this.ChildRiskDetailsActive = "active";
        this.DelegatedAuthorityActive = "";
        this.DocumentActive = "";
    }
    fnDelegatedAuthorityTab() {
        this.ChildDetailsActive = "";
        this.ChildInformationActive = "";
        this.ChildRiskDetailsActive = "";
        this.DelegatedAuthorityActive = "active";
        this.DocumentActive = "";
    }

    fnDocumentDetailTab() {
        this.ChildDetailsActive = "";
        this.ChildInformationActive = "";
        this.ChildRiskDetailsActive = "";
        this.DelegatedAuthorityActive = "";
        this.DocumentActive = "active";
    }

    isDirty = true;
    DocOk = true;
    IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(dynamicForm, dynamicformbuilder,
        dynamicFormChildInfo, dynamicformbuilderChildInfo,
        dynamicFormDelegatedAutho, dynamicformbuilderDelegatedAutho,
        UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
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
        else if (!dynamicformbuilderChildInfo.valid) {
            this.ChildDetailsActive = "";
            this.ChildInformationActive = "active";
            this.ChildRiskDetailsActive = "";
            this.DelegatedAuthorityActive = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicformbuilderChildInfo);
        } else if (!dynamicformbuilderDelegatedAutho.valid) {
            this.ChildDetailsActive = "";
            this.ChildInformationActive = "";
            this.ChildRiskDetailsActive = "";
            this.DelegatedAuthorityActive = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicformbuilderDelegatedAutho);
        }
        else if (IsUpload && !uploadFormBuilder.valid) {
            this.ChildDetailsActive = "";
            this.ChildInformationActive = "";
            this.ChildRiskDetailsActive = "";
            this.DelegatedAuthorityActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }

        if (dynamicformbuilder.valid && dynamicformbuilderChildInfo.valid && dynamicformbuilderDelegatedAutho.valid && this.DocOk) {
            dynamicFormChildInfo.forEach(item => {
                dynamicForm.push(item);
            });

            dynamicFormDelegatedAutho.forEach(item => {
                dynamicForm.push(item);
            });
            this.isDirty = true;
            if (Compare(dynamicForm, this.dynamicformcontrolOG)) {
                this.isDirty = false;
            }
            if (this.isDirty || this.SingnificantDirty || this.RiskDirty || (IsUpload && uploadFormBuilder.valid)) {

                let val1 = dynamicForm.filter(x => x.FieldName == "CarerParentId");
                if (val1.length > 0 && (val1[0].FieldValue == null || val1[0].FieldValue == ''))
                    val1[0].FieldValue = Common.GetSession("CarerId");

                if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y")){
                let val2 = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
                if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == '')) {
                    val2[0].FieldValue = this.SocialWorkerId;
                }

                let valLASW = dynamicForm.filter(x => x.FieldName == "LASocialWorkerId");
                if (valLASW.length > 0 && (valLASW[0].FieldValue == null || valLASW[0].FieldValue == ''))
                  valLASW[0].FieldValue = this.LASocialWorkerId;
                }
                let val22 = dynamicForm.filter(x => x.FieldName == "SaveAsDraftStatus");
                if (val22.length > 0)
                    val22[0].FieldValue = "0";

                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraftrisk") == "N"  )
                    type = "update";

                this.objChildRiskAssessmentNewComboDTO.lstChildRiskAssessmentNewSignificant = this.globalobjSignificantList;
                this.objChildRiskAssessmentNewComboDTO.lstChildRiskAssessmentNewRisksCausing = this.globalobjRiskList;
                this.objChildRiskAssessmentNewComboDTO.NotificationEmailIds = EmailIds;
                this.objChildRiskAssessmentNewComboDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.objChildRiskAssessmentNewComboDTO.AgencyProfileId = this.AgencyProfileId;
                this.objChildRiskAssessmentNewComboDTO.DynamicValue = dynamicForm;
                this.objChildRiskAssessmentNewComboDTO.ChildId = this.ChildId;
                this.objChildRiskAssessmentNewComboDTO.SequenceNo=this.SequenceNo;
                this.apiService.save(this.controllerName, this.objChildRiskAssessmentNewComboDTO,type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
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

    fnBack()
    {
        this._router.navigate(['/pages/child/childriskassessmentlist/4/'+this.objQeryVal.apage]);
    }

    private Respone(data, type, IsUpload, skipAlert: boolean) {
        if (data.IsError == true) {
            this.isLoading = false;
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.RiskDirty = false;
            this.SingnificantDirty = false;
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
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
            }
            if (skipAlert) {
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                this._router.navigate(['/pages/child/childriskassessmentlist/4/'+this.objQeryVal.apage]);
            }
            this.skipAlert = true;
            this.objChildRiskAssessmentNewComboDTO.IsSubmitted = true;
            this.changeSingificantStatus();
            this.changeRiskCausingStatus();
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
            this.RiskDirty = false;
            this.SingnificantDirty = false;
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
        if (InsValChange.currnet.FieldCnfg.FieldName == "LASocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "SiblingParentSno") {
            InsValChange.currnet.IsVisible = false;
        }

        if(Common.GetSession("HasChildSiblings")=='false')
        {
            if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord") {
                InsValChange.currnet.IsVisible = false;
            }
        }
        if(this.SequenceNo != 0 && Common.GetSession("SaveAsDraftrisk") == "N")
        {
            if(InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord" || InsValChange.currnet.FieldCnfg.FieldName == "SelectSiblings")
              InsValChange.currnet.IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord") {
            if (InsValChange.newValue == "1" || InsValChange.newValue == true) {
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
    fnSaveDraft(dynamicForm, dynamicFormChildInfo, dynamicFormDelegatedAutho,
        SignificantForm, RiskForm,
        IsUpload, uploadFormBuilder) {
        this.submitted = false;
        let userId: number = parseInt(Common.GetSession("UserProfileId"));
        this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
        this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
       // this.objSaveDraftInfoDTO.TypeId = this.ChildId;
        this.objSaveDraftInfoDTO.CreatedUserId = userId;
        this.objSaveDraftInfoDTO.UpdatedUserId = userId;

        dynamicFormChildInfo.forEach(item => {
            dynamicForm.push(item);
        });

        dynamicFormDelegatedAutho.forEach(item => {
            dynamicForm.push(item);
        });

        SignificantForm.forEach(item => {
            dynamicForm.push(item);
        });

        RiskForm.forEach(item => {
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
        let type = "save";
        if (this.SequenceNo > 0) {
                type = "update";

            this.isDirty = true;
            if (CompareSaveasDraft(this.dynamicformcontrol.filter(x => x.ControlLoadFormat != 'Significant' && x.ControlLoadFormat != 'Risk'), this.dynamicformcontrolOG)) {
                this.isDirty = false;
            }
            if (this.isDirty || this.SingnificantDirty || this.RiskDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoadingSAD = true;
                this.objChildRiskAssessmentNewComboDTO.SequenceNo = this.SequenceNo;
                this.objChildRiskAssessmentNewComboDTO.lstChildRiskAssessmentNewSignificant = this.globalobjSignificantList;
                this.objChildRiskAssessmentNewComboDTO.lstChildRiskAssessmentNewRisksCausing = this.globalobjRiskList;
                this.objChildRiskAssessmentNewComboDTO.LstAgencyFieldMapping = this.dynamicformcontrol;

                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objSaveDraftInfoDTO.TypeId=this.ChildId;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.objChildRiskAssessmentNewComboDTO);
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
                this.objChildRiskAssessmentNewComboDTO.SequenceNo = this.SequenceNo;
                this.objChildRiskAssessmentNewComboDTO.lstChildRiskAssessmentNewSignificant = this.globalobjSignificantList;
                this.objChildRiskAssessmentNewComboDTO.lstChildRiskAssessmentNewRisksCausing = this.globalobjRiskList;
                this.objChildRiskAssessmentNewComboDTO.LstAgencyFieldMapping = this.dynamicformcontrol;

                this.objChildRiskAssessmentNewComboDTO.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objSaveDraftInfoDTO.TypeId=this.ChildId;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.objChildRiskAssessmentNewComboDTO);
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
                    this.objChildRiskAssessmentNewComboDTO.IsSubmitted = false;
                    this.submitText=Common.GetAutoSaveProgressText;
                    this.btnSubmit.fnClick();
                }
                else if (this.showbtnSaveDraft == true) {
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
        this.st.delTimer('ChildRiskNew180');
    }

    //---Dynamic Grid
    objSignificantList: ChildRiskAssessmentNewSignificantDTO[] = [];
    objSignificantListInsert = [];
    globalobjSignificantList = [];
    submittedSignificant = false;
    convertToSignificantGrid(objInput){
        this.significantList = [];
        objInput.forEach(item =>{
            let temp:any= {};
            item.forEach(subitem => {
            temp.StatusId = subitem.StatusId;
            if(subitem.FieldName==="SignificantDate")
                temp.Date = moment(subitem.FieldValue).format("DD/MM/YYYY");
            else if (subitem.FieldName ==="SignificantRisk")
                temp.Risk=subitem.FieldValue;
            });
            this.significantList.push(temp);
        });
        this.significantList = [...this.significantList];
    }
    LoadAlreadyStoreSignificant(data) {

        if (data != null) {
            data.forEach(item => {
                this.objSignificantList = [];
                item.forEach(subItem => {
                    if (subItem.StatusId != 3) {
                        let add: ChildRiskAssessmentNewSignificantDTO = new ChildRiskAssessmentNewSignificantDTO();
                        add.FieldCnfgId = subItem.FieldCnfgId;
                        add.FieldName = subItem.FieldName;
                        add.FieldValue = subItem.FieldValue;
                        add.FieldDataTypeName = subItem.FieldDataTypeName;
                        add.FieldValueText = subItem.FieldValueText;
                        add.UniqueID = subItem.UniqueID;
                        add.SequenceNo = subItem.SequenceNo;
                        add.StatusId = subItem.StatusId;
                        this.objSignificantList.push(add);
                        this.objSignificantListInsert.push(add);
                    }
                });
                if (this.objSignificantList.length > 0)
                    this.globalobjSignificantList.push(this.objSignificantList);
            });
            this.convertToSignificantGrid(this.globalobjSignificantList);
        }

    }
    SingnificantDirty = false;
    AddSingnificantDetails(dynamicVal, dynamicForm) {
        this.objSignificantList = [];

        if (dynamicForm.valid) {
            dynamicVal.forEach(item => {
                let add: ChildRiskAssessmentNewSignificantDTO = new ChildRiskAssessmentNewSignificantDTO();
                add.FieldCnfgId = item.FieldCnfgId;
                add.FieldName = item.FieldName;
                add.FieldValue = item.FieldValue;
                add.FieldDataTypeName = item.FieldDataTypeName;
                add.FieldValueText = item.FieldValueText;
                add.StatusId = 1;
                add.UniqueID = 0;
                this.objSignificantList.push(add);
                this.objSignificantListInsert.push(add);

            })
            this.globalobjSignificantList.push(this.objSignificantList);
            this.convertToSignificantGrid(this.globalobjSignificantList);
            this.submittedSignificant = false;
            this.SingnificantDirty = true;
            this.dynamicformcontrolSignificant.forEach(itemTemp => {
                this.dynamicformcontrolSignificant.filter(item => item.FieldValue = null);

            });
            //  this.dynamicformcontroldata = this.dynamicformcontroldataOrginal;
            //this.dynamicformcontroldataGrid = this.dynamicformcontroldata.filter(item => item.ControlLoadFormat == 'Default.Grid.0');
        }
        else
            this.submittedSignificant = true;
    }

    EditSingnificantList(index) {
        this.SignificantId = index;
        this.isEdit = true;
        let tempObj = this.globalobjSignificantList[index];
        tempObj.forEach(itemTemp => {
            // this.dynamicformcontrolSignificant.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId)[0].FieldValue = itemTemp.FieldValue;
            let val = this.dynamicformcontrolSignificant.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId);
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

    DeleteSingnificantList(index) {
        let temp = this.globalobjSignificantList[index];
        temp.forEach(item => {
            item.StatusId = 3;
        });
        this.SingnificantDirty = true;
        this.significantList[index].StatusId=3;
        this.significantList=[...this.significantList];
    }

    UpdateSingnificantDetails(dynamicVal, dynamicForm) {

        if (dynamicForm.valid) {
            this.isEdit = false;
            let temp = this.globalobjSignificantList[this.SignificantId];
            temp.forEach(item => {
                item.FieldValue = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValue;
                item.FieldValueText = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValueText;
                item.StatusId = 2;
            });
            this.SingnificantDirty = true;
            this.convertToSignificantGrid(this.globalobjSignificantList);
            this.dynamicformcontrolSignificant.forEach(itemTemp => {
                this.dynamicformcontrolSignificant.filter(item => item.FieldValue = null);

            });
            this.submittedSignificant = false;
        }
        else
            this.submittedSignificant = true;
        this.SignificantId = null;
    }

    CancelEditSingnificant() {
        this.isEdit = false;
        this.SignificantId = null;
        this.dynamicformcontrolSignificant.forEach(itemTemp => {
            this.dynamicformcontrolSignificant.filter(item => item.FieldValue = null);

        });
    }

    changeSingificantStatus()
    {
        this.globalobjSignificantList.forEach(data=>{
            data.forEach(item => {
                item.StatusId = 4;
            });
        })
    }

    isEdit = false;
    SignificantId;

    //---End




    //---Dynamic Grid Risk
    objRiskList: ChildRiskAssessmentNewRisksCausingDTO[] = [];
    objRiskListInsert = [];
    globalobjRiskList = [];
    submittedRisk = false;
    convertToRiskGrid(objInput){
        this.riskList = [];
        objInput.forEach(item =>{
            let temp:any= {};
            item.forEach(subitem => {
            temp.StatusId = subitem.StatusId;
            if(subitem.FieldName==="RiskDetails")
                temp.Details = subitem.FieldValue;
            else if (subitem.FieldName ==="CategoryofRisk")
                temp.Category=subitem.FieldValue;
            else if (subitem.FieldName ==="RisksCausingConcern")
                temp.Cause=subitem.FieldValueText;
            else if (subitem.FieldName === "ActionTakentoManageRisk")
                temp.ManageRisk=subitem.FieldValue;
            });
            this.riskList.push(temp);
        });
        this.riskList = [...this.riskList];
    }
    LoadAlreadyStoreRisk(data) {

        if (data != null) {
            data.forEach(item => {
                this.objRiskList = [];
                item.forEach(subItem => {
                    if (subItem.StatusId != 3) {
                        let add: ChildRiskAssessmentNewRisksCausingDTO = new ChildRiskAssessmentNewRisksCausingDTO();
                        add.FieldCnfgId = subItem.FieldCnfgId;
                        add.FieldName = subItem.FieldName;
                        add.FieldValue = subItem.FieldValue;
                        add.FieldDataTypeName = subItem.FieldDataTypeName;
                        add.FieldValueText = subItem.FieldValueText;
                        add.UniqueID = subItem.UniqueID;
                        add.SequenceNo = subItem.SequenceNo;
                        add.StatusId = subItem.StatusId;
                        this.objRiskList.push(add);
                        this.objRiskListInsert.push(add);
                    }
                });
                if (this.objRiskList.length > 0)
                    this.globalobjRiskList.push(this.objRiskList);
            });
            //console.log(this.globalobjRiskList);
            this.convertToRiskGrid(this.globalobjRiskList);
        }
    }
    RiskDirty = false;
    AddRiskDetails(dynamicVal, dynamicForm) {
        this.objRiskList = [];

        if (dynamicForm.valid) {
            dynamicVal.forEach(item => {
                let add: ChildRiskAssessmentNewRisksCausingDTO = new ChildRiskAssessmentNewRisksCausingDTO();
                add.FieldCnfgId = item.FieldCnfgId;
                add.FieldName = item.FieldName;
                add.FieldValue = item.FieldValue;
                add.FieldDataTypeName = item.FieldDataTypeName;
                add.FieldValueText = item.FieldValueText;
                add.StatusId = 1;
                add.UniqueID = 0;
                this.objRiskList.push(add);
                this.objRiskListInsert.push(add);

            })
            this.globalobjRiskList.push(this.objRiskList);
            this.submittedRisk = false;
            this.RiskDirty = true;
            this.convertToRiskGrid(this.globalobjRiskList);
            this.dynamicformcontrolRiskCausing.forEach(itemTemp => {
                this.dynamicformcontrolRiskCausing.filter(item => item.FieldValue = null);

            });
            //  this.dynamicformcontroldata = this.dynamicformcontroldataOrginal;
            //this.dynamicformcontroldataGrid = this.dynamicformcontroldata.filter(item => item.ControlLoadFormat == 'Default.Grid.0');
        }
        else
            this.submittedRisk = true;
    }

    EditRiskList(index) {
        this.RiskId = index;
        this.isEditRisk = true;
        let tempObj = this.globalobjRiskList[index];
        // tempObj.forEach(itemTemp => {
        //     this.dynamicformcontrolRiskCausing.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId)[0].FieldValue = itemTemp.FieldValue;
        // });

        tempObj.forEach(itemTemp => {
            let val = this.dynamicformcontrolRiskCausing.filter(item => item.FieldCnfg.FieldCnfgId == itemTemp.FieldCnfgId);
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

    DeleteRiskList(index) {
        let temp = this.globalobjRiskList[index];
        temp.forEach(item => {
            item.StatusId = 3;
        });
        this.RiskDirty = true;
        this.riskList[index].StatusId=3;
        this.riskList = [...this.riskList];
    }

    UpdateRiskDetails(dynamicVal, dynamicForm) {

        if (dynamicForm.valid) {
            this.isEditRisk = false;
            let temp = this.globalobjRiskList[this.RiskId];
            temp.forEach(item => {
                item.FieldValue = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValue;
               // item.FieldValueText = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValueText;
                let FieldValueText = dynamicVal.filter(subItem => subItem.FieldCnfgId == item.FieldCnfgId)[0].FieldValueText;
                if(FieldValueText)
                  item.FieldValueText =FieldValueText;
                item.StatusId = 2;
            });
            this.RiskDirty = true;
            this.convertToRiskGrid(this.globalobjRiskList);
            this.dynamicformcontrolRiskCausing.forEach(itemTemp => {
                this.dynamicformcontrolRiskCausing.filter(item => item.FieldValue = null);

            });
            this.submittedRisk = false;
        }
        else
            this.submittedRisk = true;
        this.RiskId = null;
    }

    CancelEditRisk() {
        this.isEditRisk = false;
        this.RiskId = null;
        this.dynamicformcontrolRiskCausing.forEach(itemTemp => {
            this.dynamicformcontrolRiskCausing
                .filter(item => item.FieldValue = null);

        });
    }

    changeRiskCausingStatus()
    {
        this.globalobjRiskList.forEach(data=>{
            data.forEach(item => {
                item.StatusId = 4;
            });
        });
    }
    isEditRisk = false;
    RiskId;

    //---End



    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateChildRiskAssessmentNewPDF/" + this.ChildCode + "," + this.ChildId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + this.CarerParentId;
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
        window.location.href = this.apiURL + "GenerateChildRiskAssessmentNewWord/" + this.ChildCode + "," + this.ChildId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + this.CarerParentId;
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
        this.apiService.get("GeneratePDF", "GenerateChildRiskAssessmentNewPrint", this.ChildCode + "," + this.ChildId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + this.CarerParentId).then(data => {
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
            this.isLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.ChildCode + "," + this.ChildId + "," + this.SequenceNo + "," + this.AgencyProfileId + "," + this.CarerParentId;
            this.apiService.post("GeneratePDF", "EmailChildRiskAssessmentNew", this.objNotificationDTO).then(data => {
                if (data == true)
                {
                    this.module.alertSuccess("Email Send Successfully..");
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
