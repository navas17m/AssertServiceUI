import { Component, Pipe, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { Location} from '@angular/common';
import { ChildHealthTherapyInfo} from './DTO/childhealththerapyinfo'
import { ValChangeDTO } from '../dynamic/ValChangeDTO'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'childhealththerapyinfo',
    templateUrl: './childhealththerapyinfo.component.template.html',
})

export class ChildHealthTherapyInfoComponent {
    objChildHealthTherapyInfo: ChildHealthTherapyInfo = new ChildHealthTherapyInfo();
    submitted = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    ChildID: number;
    AgencyProfileId: number;
    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    TherapyTabActive = "active";
    DocumentActive;
    isLoading: boolean = false; controllerName = "ChildHealthTherapyInfo"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=118;
    constructor(private apiService: APICallService, private location: Location, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {
        
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildHealthTherapyInfo.AgencyProfileId = this.AgencyProfileId;
        this.objChildHealthTherapyInfo.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objChildHealthTherapyInfo.SequenceNo = this.SequenceNo;
        }
        else {
            this.objChildHealthTherapyInfo.SequenceNo = 0;
        }

        apiService.post(this.controllerName,"GetDynamicControls",this.objChildHealthTherapyInfo).then(data => { this.dynamicformcontrol = data; });
        this._Form = _formBuilder.group({});
        //Doc
        this.formId = 118;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;

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

    fnTherapyTab() {
        this.TherapyTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.TherapyTabActive = "";
        this.DocumentActive = "active";
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.TherapyTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.TherapyTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.TherapyTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.TherapyTabActive = "active";
            this.DocumentActive = "";
        }

        if (IsUpload) {
            this.submittedUpload = true;
            if (mainFormBuilder.valid && subformbuilder.valid && uploadFormBuilder.valid && dynamicForm != '') {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                this.objChildHealthTherapyInfo.DynamicValue = dynamicForm;
                this.objChildHealthTherapyInfo.ChildId = this.ChildID;
                this.apiService.save(this.controllerName,this.objChildHealthTherapyInfo, type).then(data => this.Respone(data, type, IsUpload));
            }
        }
        else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            this.objChildHealthTherapyInfo.DynamicValue = dynamicForm;
            this.objChildHealthTherapyInfo.ChildId = this.ChildID;
            this.apiService.save(this.controllerName,this.objChildHealthTherapyInfo, type).then(data => this.Respone(data, type, IsUpload));
        }
    }

    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/child/childhealththerapyinfolist/19']);
        }
    }

    DnamicOnValChange(InsValChange: ValChangeDTO) {
        let CAMHSReferralDetails = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "CAMHSReferralDetails");
        if (CAMHSReferralDetails[0] != null && InsValChange.currnet.FieldCnfg.FieldName == "HasReferToCAMHS") {
            CAMHSReferralDetails[0].IsVisible = false;
            if (InsValChange.currnet.FieldCnfg.FieldName == "HasReferToCAMHS" && InsValChange.newValue == 1) {
                CAMHSReferralDetails[0].IsVisible = true;
            }
            else {
                CAMHSReferralDetails[0].IsVisible = false;
            }
        }
        let CAMHSAppointmentDetails = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "CAMHSAppointmentDetails");
        if (CAMHSAppointmentDetails[0] != null && InsValChange.currnet.FieldCnfg.FieldName == "HasCAMHSAppointment") {
            CAMHSAppointmentDetails[0].IsVisible = false;
            if (InsValChange.currnet.FieldCnfg.FieldName == "HasCAMHSAppointment" && InsValChange.newValue == 1) {
                CAMHSAppointmentDetails[0].IsVisible = true;
            }
            else {
                CAMHSAppointmentDetails[0].IsVisible = false;
            }
        }

        let OtherTherapyDetails = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "OtherTherapyDetails");
        if (OtherTherapyDetails[0] != null && InsValChange.currnet.FieldCnfg.FieldName == "HasOtherTherapy") {
            OtherTherapyDetails[0].IsVisible = false;
            if (InsValChange.currnet.FieldCnfg.FieldName == "HasOtherTherapy" && InsValChange.newValue == 1) {
                OtherTherapyDetails[0].IsVisible = true;
            }
            else {
                OtherTherapyDetails[0].IsVisible = false;
            }
        }

        let PleaseEnterTheDetail = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "MentalHealthAssessmentDetails");
        if (PleaseEnterTheDetail[0] != null && InsValChange.currnet.FieldCnfg.FieldName == "HasMentalHealthAssessment") {
            PleaseEnterTheDetail[0].IsVisible = false;
            if (InsValChange.currnet.FieldCnfg.FieldName == "HasMentalHealthAssessment" && InsValChange.newValue == 1) {
                PleaseEnterTheDetail[0].IsVisible = true;
            }
            else {
                PleaseEnterTheDetail[0].IsVisible = false;
            }
        }

    }    
}