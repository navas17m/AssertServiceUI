import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Common } from '../common';
import { CarerApprovalPreferenceDTO } from '../recruitment/DTO/carerapprovalpreference';
import { APICallService } from '../services/apicallservice.service';
//import { CarerApprovalPreferenceService } from '../services/carerapprovalpreference.service'
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'CarerStatusChange',
    templateUrl: './approvalmatching.component.template.html',
})

export class ApprovalMatchingConsiderationComponet {

    controllerName = "CarerApprovalPreference";
    submitted = false;
    _Form: FormGroup;
    objCarerAppPrefe: CarerApprovalPreferenceDTO = new CarerApprovalPreferenceDTO();
    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    public isLoading:boolean = false;
    CarerParentId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=37;
    constructor(private _formBuilder: FormBuilder, private _router: Router,
        private apiService: APICallService) {
        this._Form = _formBuilder.group({
        });

        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        // sessionStorage.clear();
        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 2]);
        }
        else
            this.BindApprovalDetail();

        //doc
        this.formId = 37;

        //Doc
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.CarerParentId;
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    BindApprovalDetail() {
        if (this.CarerParentId != 0 && this.CarerParentId != null) {
            //this._approveServices.getByCarerParentId(this.CarerParentId).then(data => {
            //    this.objCarerAppPrefe = data;
            //});
            this.apiService.get(this.controllerName, "GetByCarerParentId", this.CarerParentId).then(data => {
                this.objCarerAppPrefe = data;
            });
        }
    }

    DocOk
    clicksubmit(UploadDocIds, IsUpload, uploadFormBuilder)
    {
        if (IsUpload) {
            this.uploadCtrl.fnUploadAll(this.CarerParentId);
        }
    }
}
