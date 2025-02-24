import { Component, Pipe } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { ChildCSEDTO} from './DTO/childcsedto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'childcse',
    templateUrl: './childcsedata.component.template.html',
})

export class ChildCSEComponent {
    objChildCSEDTO: ChildCSEDTO = new ChildCSEDTO();
    submitted = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    formId;
    ChildID: number;
    AgencyProfileId: number;
    isLoading: boolean = false; controllerName = "ChildCSE";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=238;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router,
        private modal: PagesComponent) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.ChildID = parseInt(Common.GetSession("ChildId"));
       
        this.objChildCSEDTO.AgencyProfileId = this.AgencyProfileId;
        this.objChildCSEDTO.ChildId = this.ChildID;
        this.objChildCSEDTO.SequenceNo = this.objQeryVal.id; 
        apiService.post(this.controllerName, "GetDynamicControls", this.objChildCSEDTO).then(data => { this.dynamicformcontrol = data; });
        this.formId = 238;
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

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.modal.GetErrorFocus(mainFormBuilder);
        }
        else if (!subformbuilder.valid) {
            this.modal.GetErrorFocus(subformbuilder);
        }

        if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            if (dynamicForm[0].UniqueId != 0)
                type = "update";

            this.objChildCSEDTO.DynamicValue = dynamicForm;
            this.objChildCSEDTO.ChildId = this.ChildID;
            this.apiService.save(this.controllerName, this.objChildCSEDTO, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/child/cselist/4']);
        }
    }
}