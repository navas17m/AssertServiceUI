import { Component, Pipe, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { Location} from '@angular/common';
import { ChildEducationAbsenceInfo} from './DTO/childeducationabsenceinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

//.@Pipe({ name: 'groupBy' })
@Component({
        selector: 'childeducationabsenceinfo',
        templateUrl: './childeducationabsenceinfo.component.template.html',
})

export class ChildEducationAbsenceInfoComponent{
    objChildEducationAbsenceInfo: ChildEducationAbsenceInfo = new ChildEducationAbsenceInfo();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    formId;
    TypeId;
    tblPrimaryKey;
    @ViewChild('uploads') uploadCtrl;
    ChildID: number;
    AgencyProfileId: number;
    AbsenseTabActive = "active";
    DocumentActive;
    isLoading: boolean = false; controllerName = "ChildEducationAbsenceInfo"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=103;
    constructor(private apiService: APICallService, private location: Location, private _formBuilder: FormBuilder, 
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {
        this.formId = 103;
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.objChildEducationAbsenceInfo.AgencyProfileId = this.AgencyProfileId;
        this.objChildEducationAbsenceInfo.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildEducationAbsenceInfo.SequenceNo = this.SequenceNo;
        } else
        {
            this.objChildEducationAbsenceInfo.SequenceNo = 0;
        }
        this.TypeId = this.ChildID;
        apiService.post(this.controllerName,"GetDynamicControls",this.objChildEducationAbsenceInfo).then(data => { this.dynamicformcontrol = data; });

        this._Form = _formBuilder.group({});

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

    fnAbsenseTab() {
        this.AbsenseTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.AbsenseTabActive = "";
        this.DocumentActive = "active";
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder
        , AddtionalEmailIds, EmailIds) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.AbsenseTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.AbsenseTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.AbsenseTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.AbsenseTabActive = "active";
            this.DocumentActive = "";
        }

        if (IsUpload) {
            this.submittedUpload = true;
            if (mainFormBuilder.valid && subformbuilder.valid && uploadFormBuilder.valid && dynamicForm != '') {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                this.objChildEducationAbsenceInfo.DynamicValue = dynamicForm;
                this.objChildEducationAbsenceInfo.ChildId = this.ChildID;
                this.objChildEducationAbsenceInfo.NotificationEmailIds = EmailIds;
                this.objChildEducationAbsenceInfo.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.apiService.save(this.controllerName,this.objChildEducationAbsenceInfo, type).then(data => this.Respone(data, type, IsUpload));
            }
        }
        else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            this.objChildEducationAbsenceInfo.DynamicValue = dynamicForm;
            this.objChildEducationAbsenceInfo.ChildId = this.ChildID;
            this.objChildEducationAbsenceInfo.NotificationEmailIds = EmailIds;
            this.objChildEducationAbsenceInfo.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.apiService.save(this.controllerName,this.objChildEducationAbsenceInfo, type).then(data => this.Respone(data, type, IsUpload));
        }
    }

    private Respone(data, type, IsUpload) {   
        this.isLoading = false;   
        if (data.IsError == true) {
            if (IsUpload) {
                this.uploadCtrl.fnUploadAll(data.SequenceNumber);
            }
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
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
            this._router.navigate(['/pages/child/childeducationabsenceinfolist/18']);
        }
    }
}