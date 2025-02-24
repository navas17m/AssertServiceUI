import { Component, Pipe, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Common }  from  '../common'
import { ChildManagementDecisionDTO} from './DTO/childmanagementdecisiondto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'ChildManagementDecisionData',
    templateUrl: './childmanagementdecisiondata.component.template.html',
})

export class ChildManagementDecisionDataComponent {
    objChildManagementDecisionDTO: ChildManagementDecisionDTO = new ChildManagementDecisionDTO();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    TypeId;
    formId; tblPrimaryKey;
    @ViewChild('uploads') uploadCtrl;
    ChildID: number;
    AgencyProfileId: number;
    ManagementDecisionTabActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    controllerName = "ChildManagementDecision";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=281;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.objChildManagementDecisionDTO.AgencyProfileId = this.AgencyProfileId;
        this.objChildManagementDecisionDTO.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildManagementDecisionDTO.SequenceNo = this.SequenceNo;
        } else {
            this.objChildManagementDecisionDTO.SequenceNo = 0;
        }

        apiService.post(this.controllerName, "GetDynamicControls", this.objChildManagementDecisionDTO).then(data => { this.dynamicformcontrol = data; });
        //Doc
        this.formId = 281;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;

        this._Form = _formBuilder.group({});

        if (Common.GetSession("ViweDisable") == '1') {
            this.objUserAuditDetailDTO.ActionId = 4;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    fnManagementDecisionTab() {
        this.ManagementDecisionTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.ManagementDecisionTabActive = "";
        this.DocumentActive = "active";
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.ManagementDecisionTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.ManagementDecisionTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.ManagementDecisionTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.ManagementDecisionTabActive = "active";
            this.DocumentActive = "";
        }

        if (IsUpload) {
            this.submittedUpload = true;
            if (mainFormBuilder.valid && subformbuilder.valid && uploadFormBuilder.valid && dynamicForm != '') {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";

                this.objChildManagementDecisionDTO.DynamicValue = dynamicForm;
                this.objChildManagementDecisionDTO.ChildId = this.ChildID;
                this.objChildManagementDecisionDTO.NotificationEmailIds = EmailIds;
                this.objChildManagementDecisionDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.apiService.save(this.controllerName, this.objChildManagementDecisionDTO, type).then(data => this.Respone(data, type, IsUpload));
            }
        }
        else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";

            this.objChildManagementDecisionDTO.DynamicValue = dynamicForm;
            this.objChildManagementDecisionDTO.ChildId = this.ChildID;
            this.objChildManagementDecisionDTO.NotificationEmailIds = EmailIds;
            this.objChildManagementDecisionDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.apiService.save(this.controllerName, this.objChildManagementDecisionDTO, type).then(data => this.Respone(data, type, IsUpload));
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
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/child/childmanagementdecisionlist/4']);
        }
    }
}