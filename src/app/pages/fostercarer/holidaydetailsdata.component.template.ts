import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerHolidayDetailsDTO } from './DTO/holidaydetailsdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'CarerHolidayDetailsData',
    templateUrl: './holidaydetailsdata.component.template.html',

})

export class CarerHolidayDetailsDataComponent {
    controllerName = "CarerHolidayDetails";
    objCarerHolidayDetailsDTO: CarerHolidayDetailsDTO = new CarerHolidayDetailsDTO();
    submitted = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    //Doc
    FormCnfgId;
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerParentId: number;

    HolidayDetailsActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    SocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private module: PagesComponent, private apiService: APICallService) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        this.SocialWorkerId = Common.GetSession("ACarerSSWId");
        this.objCarerHolidayDetailsDTO.CarerParentId = this.CarerParentId;
        this.SequenceNo = this.objQeryVal.id;

        //Doc
        this.formId = 197;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.SequenceNo;

        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objCarerHolidayDetailsDTO.SequenceNo = this.SequenceNo;
        } else {
            this.objCarerHolidayDetailsDTO.SequenceNo = 0;
        }

        this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerHolidayDetailsDTO).then(data => {
            this.dynamicformcontrol = data;

        });

        this._Form = _formBuilder.group({});
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

    fnHolidayDetails() {
        this.HolidayDetailsActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.HolidayDetailsActive = "";
        this.DocumentActive = "active";
    }

    DocOk = true;
    clicksubmit(dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {
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

        if (!subformbuilder.valid) {
            this.HolidayDetailsActive = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.HolidayDetailsActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }

        if (subformbuilder.valid && this.DocOk) {
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
            this.objCarerHolidayDetailsDTO.DynamicValue = dynamicForm;
            this.objCarerHolidayDetailsDTO.CarerParentId = this.CarerParentId;

            this.apiService.save(this.controllerName, this.objCarerHolidayDetailsDTO, type).then(data => this.Respone(data, type, IsUpload));

        }
    }

    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
            }
            else {
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
            }
            this._router.navigate(['/pages/fostercarer/holidaydetailslist/3']);
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
}
