import { Location } from '@angular/common';
import { Component, Pipe, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerImmunisationInfo } from './DTO/carerimmunisationinfo';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'carerimmunisationinfo',
    templateUrl: './carerimmunisationinfodata.component.template.html',

})

export class CarerImmunisationInfoComponent {
    objCarerImmunisationInfo: CarerImmunisationInfo = new CarerImmunisationInfo();
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
    CarerParentId: number;
    AgencyProfileId: number;
    insCarerDetails;
    SocialWorkerId;
    ImmunisationTabActive = "active";
    DocumentActive;
    isLoading: boolean = false; controllerName = "CarerImmunisationInfo";
    CarerList = []; lstcarerIdsSelectValues = [];
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private apiService: APICallService, private location: Location, private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute, private _router: Router, private modal: PagesComponent) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3]);
        }
        this.SocialWorkerId = Common.GetSession("ACarerSSWId");
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objCarerImmunisationInfo.CarerParentId = this.CarerParentId;
        this.objCarerImmunisationInfo.ControlLoadFormat = ["Default"];
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objCarerImmunisationInfo.SequenceNo = this.SequenceNo;
        } else {
            this.objCarerImmunisationInfo.SequenceNo = 0;
        }

        apiService.post(this.controllerName, "GetDynamicControls", this.objCarerImmunisationInfo).then(data => {

            this.dynamicformcontrol = data.lstAgencyFieldMapping;
            this.objCarerImmunisationInfo.CarerId = data.CarerId;
        });
        this._Form = _formBuilder.group({
            CarerId: ['0', Validators.required],
        });
        this.BindCarer();
        //Doc
        this.formId = 217;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.SequenceNo;
        if(Common.GetSession("ViweDisable")=='1'){
          this.objUserAuditDetailDTO.ActionId = 4;
          this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
          this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
          this.objUserAuditDetailDTO.FormCnfgId = this.formId;
          this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
          this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
          this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
          Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
          }
    }
    private BindCarer() {

        this.apiService.get("CarerInfo", "GetAllTypeByCarerParentId", this.CarerParentId).then(data => {
            // this.carerServices.GetByCarerParentId(this.CarerParentId).then(data => {
            this.CarerList = data;
        })
    }
    CarerChange(options) {
        this.lstcarerIdsSelectValues = Array.apply(null, options)  // convert to real Array
            .filter(option => option.selected)
            .map(option => option.value)
    }

    fnImmunisationTab() {
        this.ImmunisationTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.ImmunisationTabActive = "";
        this.DocumentActive = "active";
    }
    DocOk = true;
    IsOk = true;
    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {
        this.submitted = true;
        this.DocOk = true;
        this.IsOk = true;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        if (!mainFormBuilder.valid) {
            this.ImmunisationTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.ImmunisationTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.ImmunisationTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.ImmunisationTabActive = "active";
            this.DocumentActive = "";
        }

        if (this.SequenceNo == 0 && this.lstcarerIdsSelectValues.length == 0)
            this.IsOk = false;

        if (this.IsOk && mainFormBuilder.valid && subformbuilder.valid && this.DocOk) {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            if(this.SequenceNo == 0){
            let val2 = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
            if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == ''))
            {
                val2[0].FieldValue = this.SocialWorkerId;
            }
        }
            this.objCarerImmunisationInfo.CarerIds = this.lstcarerIdsSelectValues;
            this.objCarerImmunisationInfo.DynamicValue = dynamicForm;
            this.objCarerImmunisationInfo.CarerParentId = this.CarerParentId;
            // this.apiService.save(this.controllerName, this.objCarerImmunisationInfo, type).then(data => this.Respone(data, type, IsUpload));

            if (type == "update")
                this.apiService.save(this.controllerName, this.objCarerImmunisationInfo, type).then(data => this.Respone(data, type, IsUpload));
            else
                this.apiService.post(this.controllerName, "SaveMultiByCarerIds", this.objCarerImmunisationInfo).then(data => this.Respone(data, type, IsUpload));
        }
    }
    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAllForMultiUser(data.OtherSequenceNumber);
                }
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            }
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/fostercarer/carerimmunisationinfolist/3']);
            this._router.navigate(['/pages/fostercarer/carerunannouncedhomevisitlist', 3,this.objQeryVal.apage]);

        }
    }
}
