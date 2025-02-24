import { Component, Pipe, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common, deepCopy, Compare, ConvertDateAndDateTimeSaveFormat}  from  '../common'
import { ChildSchoolReportsDTO} from './DTO/childschoolreportsdto'
import { ValChangeDTO} from '../dynamic/ValChangeDTO';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'ChildSchoolReports',
    templateUrl: './childschoolreportsdata.components.template.html',
})
     
export class ChildSchoolReportsComponent {
    objChildSchoolReport: ChildSchoolReportsDTO = new ChildSchoolReportsDTO();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = []; dynamicformcontrolOrginal = [];
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
    SchoolReportTabActive = "active";
    DocumentActive;
    isLoading: boolean = false; controllerName = "ChildSchoolReport";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=288;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder, private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildSchoolReport.AgencyProfileId = this.AgencyProfileId;
        this.objChildSchoolReport.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildSchoolReport.SequenceNo = this.SequenceNo;
        } else {
            this.objChildSchoolReport.SequenceNo = 0;
        }

        apiService.post(this.controllerName, "GetDynamicControls", this.objChildSchoolReport).then(data => {
            this.dynamicformcontrol = data;
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
        });
        this._Form = _formBuilder.group({});
         
        //Doc
        this.formId = 288;
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

    fnSchoolReportTab() {
        this.SchoolReportTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.SchoolReportTabActive = "";
        this.DocumentActive = "active";
    }
    isDirty = true;
    DocOk = true;
    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {
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
            this.SchoolReportTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.SchoolReportTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.SchoolReportTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.SchoolReportTabActive = "active";
            this.DocumentActive = "";
        }

        if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '' && this.DocOk) {
            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(dynamicForm, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                this.objChildSchoolReport.SequenceNo = this.SequenceNo;
                this.objChildSchoolReport.DynamicValue = dynamicForm;
                this.objChildSchoolReport.ChildId = this.ChildID;
                this.apiService.save(this.controllerName, this.objChildSchoolReport, type).then(data => this.Respone(data, type, IsUpload));
            }
            else {
                this.modal.alertWarning(Common.GetNoChangeAlert);
            }
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
            this._router.navigate(['/pages/child/schoolreportslist/18']);
        }
    }
    
    DynamicOnValChange(InsValChange: ValChangeDTO) {  
        let val2 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "SchoolAddress");
        if (val2.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "SchoolChildAttends" && InsValChange.currnet.FieldValue != null) {
            if (InsValChange.currnet.FieldValue) {
                this.apiService.get("ChildSchoolInfo", "GetById", InsValChange.currnet.FieldValue).then(data => {
                    val2[0].FieldValue = data;
                });
            } 
            else
                val2[0].FieldValue = null;
        }
    }
}