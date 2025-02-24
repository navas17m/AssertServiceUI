import { Component, Pipe } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerTransferClosingSummaryDTO } from './DTO/carertransferclosingsummarydto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'carertransferclosingsummarydata',
    templateUrl: './carertransferclosingsummarydata.component.template.html',
})

export class CarerTransferClosingSummaryDataComponent {

    controllerName = "CarerTransferClosingSummary";
    objCarerTransferClosingSummaryDTO: CarerTransferClosingSummaryDTO = new CarerTransferClosingSummaryDTO();
    submitted = false;
    dynamicformcontrol;
    _Form: FormGroup;
    isVisibleMandatoryMsg;
    SequenceNo;
    objQeryVal;
    AgencyProfileId: number;
    isLoading: boolean = false;
    formId: number = 61;  SocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=61;
    CarerParentId;
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private _router: Router, private module: PagesComponent, private apiService: APICallService) {

            this.SocialWorkerId = Common.GetSession("ACarerSSWId");
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.objCarerTransferClosingSummaryDTO.AgencyProfileId = this.AgencyProfileId;
        this.objCarerTransferClosingSummaryDTO.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objCarerTransferClosingSummaryDTO.SequenceNo = this.SequenceNo;
        } else {
            this.objCarerTransferClosingSummaryDTO.SequenceNo = 0;
        }
        this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerTransferClosingSummaryDTO).then(data => { this.ResponeDyanmic(data); });
        //  ctcsServices.getByFormCnfgId(this.objCarerTransferClosingSummaryDTO).then(data => { this.ResponeDyanmic(data); });
        this._Form = _formBuilder.group({});
        if(Common.GetSession("ViweDisable")=='1'){
          this.objUserAuditDetailDTO.ActionId = 4;
          this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
          this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
          this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
          this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
          this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
          this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
          Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
          }
    }
    private ResponeDyanmic(data) {
        if (data != null) {
            this.dynamicformcontrol = data;
        }
    }

    clicksubmit(dynamicForm, subformbuilder, AddtionalEmailIds, EmailIds) {
        this.submitted = true;

        if (!subformbuilder.valid) {
            this.module.GetErrorFocus(subformbuilder);
        }
        if (subformbuilder.valid) {
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
            this.objCarerTransferClosingSummaryDTO.DynamicValue = dynamicForm;
            this.objCarerTransferClosingSummaryDTO.NotificationEmailIds = EmailIds;
            this.objCarerTransferClosingSummaryDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            //  this.ctcsServices.post(this.objCarerTransferClosingSummaryDTO, type).then(data => this.Respone(data, type));
            this.apiService.save(this.controllerName, this.objCarerTransferClosingSummaryDTO, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(data, type) {
      console.log(data);
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
            }
            else {
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            }
            this._router.navigate(['/pages/fostercarer/carertransferclosingsummarylist/3']);
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
}
