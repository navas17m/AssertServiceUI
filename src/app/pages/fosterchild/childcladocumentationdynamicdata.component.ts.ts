import { Component, Pipe } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common, deepCopy, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat}  from  '../common'
import { ChildCLADocumentationDynamicDTO} from './DTO/childcladocumentationdynamicldto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'ChildCLADocumentation',
    templateUrl: './childcladocumentationdynamicdata.component.template.html',
})

export class ChildCLADocumentationDynamicComponent {
    objChildCLADocumentationDynamicDTO: ChildCLADocumentationDynamicDTO = new ChildCLADocumentationDynamicDTO();
    submitted = false;
    dynamicformcontrol = [];dynamicformcontrolOrginal = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    formId;
    ChildID: number;
    AgencyProfileId: number;
    isLoading: boolean = false; controllerName = "ChildCLADocumentationDynamic";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=219;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router,
        private modal: PagesComponent) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.ChildID = parseInt(Common.GetSession("ChildId"));
       
        this.objChildCLADocumentationDynamicDTO.AgencyProfileId = this.AgencyProfileId;
        this.objChildCLADocumentationDynamicDTO.ChildId = this.ChildID;
        this.objChildCLADocumentationDynamicDTO.SequenceNo = this.objQeryVal.Id; 
        apiService.post(this.controllerName, "GetDynamicControls", this.objChildCLADocumentationDynamicDTO).then(data => {
             this.dynamicformcontrol = data; 
             this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
       });
       this.formId = 219;
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

    isDirty = true;
    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.modal.GetErrorFocus(mainFormBuilder);
        }
        else if (!subformbuilder.valid) {
            this.modal.GetErrorFocus(subformbuilder);
        }

        if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isDirty = true;
            
            if (this.SequenceNo != 0 && Compare(dynamicForm, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty) {
                this.isLoading = true;
                let type = "save";
                if (this.objQeryVal.Id != 0)
                    type = "update";

                this.objChildCLADocumentationDynamicDTO.DynamicValue = dynamicForm;
                this.objChildCLADocumentationDynamicDTO.ChildId = this.ChildID;
                this.apiService.save(this.controllerName, this.objChildCLADocumentationDynamicDTO, type).then(data => this.Respone(data, type));
            }
            else {
                    this.modal.alertWarning(Common.GetNoChangeAlert);
            }
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
            this._router.navigate(['/pages/child/cladocumentationdynamiclist/4']);
        }
    }
}