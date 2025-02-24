import { Component, Pipe, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms'
import {Common}  from  '../common'
import { SafeguardingDTO} from './DTO/safeguardingdto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
        selector: 'safe-riskmanagementoutingsdata',
        templateUrl: './safe-riskmanagementoutingsdata.component.template.html',
})

export class RiskManagementoutingsDataComponent {
    controllerName = "ChildRiskManagementOutings";
    objSafeguardingDTO: SafeguardingDTO = new SafeguardingDTO();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    formId;
    tblPrimaryKey;
    @ViewChild('uploads') uploadCtrl;
    TypeId;
    ChildID: number;
    AgencyProfileId: number;
    mainTabActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=373;
    constructor(private _formBuilder: FormBuilder,
        private allAPIservice: APICallService,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSafeguardingDTO.AgencyProfileId = this.AgencyProfileId;
        this.objSafeguardingDTO.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objSafeguardingDTO.SequenceNo = this.SequenceNo;
        } else {
            this.objSafeguardingDTO.SequenceNo = 0;
        }

        this.allAPIservice.post(this.controllerName,"GetDynamicControls",this.objSafeguardingDTO).then(data => {
             this.dynamicformcontrol = data;
        });

        this._Form = _formBuilder.group({});
        //Doc
        this.formId = 373;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;

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

    fnMainTab() {
        this.mainTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.mainTabActive = "";
        this.DocumentActive = "active";
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.mainTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.mainTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.mainTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.mainTabActive = "active";
            this.DocumentActive = "";
        }

        if (IsUpload) {
            this.submittedUpload = true;
            if (mainFormBuilder.valid && subformbuilder.valid && uploadFormBuilder.valid && dynamicForm != '') {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                this.objSafeguardingDTO.DynamicValue = dynamicForm;
                this.objSafeguardingDTO.ChildId = this.ChildID;
                this.allAPIservice.save(this.controllerName,this.objSafeguardingDTO,type ).then(data =>
                    this.Respone(data, type, IsUpload)
                );
            }
        }
        else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            this.objSafeguardingDTO.DynamicValue = dynamicForm;
            this.objSafeguardingDTO.ChildId = this.ChildID;
            this.allAPIservice.save(this.controllerName,this.objSafeguardingDTO,type).then(data => this.Respone(data, type, IsUpload));
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
            this._router.navigate(['/pages/child/riskmanagementoutingslist/42']);
        }
    }
}
