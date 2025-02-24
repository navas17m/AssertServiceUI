import { Component, Pipe, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { Location} from '@angular/common';
import { ChildSanctionDetailsDTO } from './DTO/childsanctiondetailsdto'
import { ValChangeDTO} from '../dynamic/ValChangeDTO';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'childsanctiondetails',
    templateUrl: './childsanctiondetails.component.template.html',
})

export class ChildSanctionDetailsComponent {
    objChildSanctionDetails: ChildSanctionDetailsDTO = new ChildSanctionDetailsDTO();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    formId; tblPrimaryKey;
    @ViewChild('uploads') uploadCtrl;
    TypeId;
    ChildID: number;
    AgencyProfileId: number;
    CarerName; UserName;
    CarerSSWName;
    SanctionTabActive = "active";
    DocumentActive;
    isLoading: boolean = false; controllerName = "ChildSanctionDetails";
    LASocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=99;
    constructor(private apiService: APICallService,private location: Location, private _formBuilder: FormBuilder, private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        if (Common.GetSession("ChildId") != null) {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        }
        this.LASocialWorkerId = Common.GetSession("ChildLASocialWorkerId");
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildSanctionDetails.AgencyProfileId = this.AgencyProfileId;
        this.objChildSanctionDetails.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildSanctionDetails.SequenceNo = this.SequenceNo;
        }
        else {
            this.objChildSanctionDetails.SequenceNo = 0;
        }

        this.CarerName = Common.GetSession("CarerName");
        if (this.CarerName == "null")
            this.CarerName = "Not Placed";

        this.CarerSSWName = Common.GetSession("SSWName");
        if (this.CarerSSWName == "null")
            this.CarerSSWName = "Not Assigned";

        this.UserName = Common.GetSession("UserName");

        apiService.post(this.controllerName,"GetDynamicControls",this.objChildSanctionDetails).then(data =>
        {
            this.dynamicformcontrol = data;

            let val1 = data.filter(x => x.FieldCnfg.FieldName == "UpdatedUserId");
            if (val1.length > 0 && val1[0].FieldCnfg.DisplayName != null)
                this.UserName = val1[0].FieldCnfg.DisplayName;

            let val2 = data.filter(x => x.FieldCnfg.FieldName == "CarerParentId");
            if (val2.length > 0 && val2[0].FieldCnfg.DisplayName != null) {
                this.CarerName = val2[0].FieldCnfg.DisplayName;
            }
            let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
            if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                this.CarerSSWName = val3[0].FieldCnfg.DisplayName;

        });
        this._Form = _formBuilder.group({});
        //Doc
        this.formId = 99;
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

    fnSanctionTab() {
        this.SanctionTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.SanctionTabActive = "";
        this.DocumentActive = "active";
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.SanctionTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.SanctionTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.SanctionTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        } else {
            this.SanctionTabActive = "active";
            this.DocumentActive = "";
        }

        let val1 = dynamicForm.filter(x => x.FieldName == "CarerParentId");
        if (val1.length > 0 && (val1[0].FieldValue == null || val1[0].FieldValue == ''))
            val1[0].FieldValue = Common.GetSession("CarerId");
        if(this.SequenceNo==0){
        let val2 = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
        if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == ''))
            val2[0].FieldValue = Common.GetSession("SSWId");

        let valLASW = dynamicForm.filter(x => x.FieldName == "LASocialWorkerId");
        if (valLASW.length > 0 && (valLASW[0].FieldValue == null || valLASW[0].FieldValue == ''))
          valLASW[0].FieldValue = this.LASocialWorkerId;
        }

        if (IsUpload) {
            this.submittedUpload = true;
            if (mainFormBuilder.valid && subformbuilder.valid && uploadFormBuilder.valid && dynamicForm != '') {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                this.objChildSanctionDetails.DynamicValue = dynamicForm;
                this.objChildSanctionDetails.ChildId = this.ChildID;
                this.apiService.save(this.controllerName,this.objChildSanctionDetails, type).then(data => this.Respone(data, type, IsUpload));
            }
        }
        else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            this.objChildSanctionDetails.DynamicValue = dynamicForm;
            this.objChildSanctionDetails.ChildId = this.ChildID;
            this.apiService.save(this.controllerName,this.objChildSanctionDetails, type).then(data => this.Respone(data, type, IsUpload));
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
            this._router.navigate(['/pages/child/childsanctiondetailslist/4']);
        }
    }

    DynamicOnValChange(InsValChange: ValChangeDTO) {

        let CarerParentId = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "CarerParentId");
        if (CarerParentId.length > 0)
            CarerParentId[0].IsVisible = false;


        let SocialWorkerId = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
        if (SocialWorkerId.length > 0)
            SocialWorkerId[0].IsVisible = false;

        let LASocialWorkerId = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "LASocialWorkerId");
        if (LASocialWorkerId.length > 0)
          LASocialWorkerId[0].IsVisible = false;
    }
}
