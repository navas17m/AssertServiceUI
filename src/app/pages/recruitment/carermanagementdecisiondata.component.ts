import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerManagementDecisionDTO } from './DTO/carermanagementdecisiondto';


@Component({
    selector: 'CarerManagementDecisionData',
    templateUrl: './carermanagementdecisiondata.component.template.html',

})

export class CarerManagementDecisionDataComponent {
    controllerName = "CarerManagementDecision";
    objCarerManagementDecisionDTO: CarerManagementDecisionDTO = new CarerManagementDecisionDTO();
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

    ManagementDecisionActive = "active";
    DocumentActive;
    isLoading: boolean = false;SocialWorkerId;

    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private module: PagesComponent, private apiService: APICallService) {

        this.route.params.subscribe(data => this.objQeryVal = data);

        if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 280;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.SocialWorkerId = Common.GetSession("ACarerSSWId");
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 280;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.SocialWorkerId = Common.GetSession("CarerSSWId");
        }

        this.objCarerManagementDecisionDTO.CarerParentId = this.CarerParentId;
        this.SequenceNo = this.objQeryVal.Id;

        //Doc
        this.formId = 280;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.SequenceNo;

        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objCarerManagementDecisionDTO.SequenceNo = this.SequenceNo;
        } else {
            this.objCarerManagementDecisionDTO.SequenceNo = 0;
        }
        this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerManagementDecisionDTO).then(data => {
            this.dynamicformcontrol = data;
        });

        this._Form = _formBuilder.group({});
    }

    fnManagementDecision() {
        this.ManagementDecisionActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.ManagementDecisionActive = "";
        this.DocumentActive = "active";
    }

    DocOk = true;
    clicksubmit(dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
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
            this.ManagementDecisionActive = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.ManagementDecisionActive = "";
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
            this.objCarerManagementDecisionDTO.NotificationEmailIds = EmailIds;
            this.objCarerManagementDecisionDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.objCarerManagementDecisionDTO.DynamicValue = dynamicForm;
            this.objCarerManagementDecisionDTO.CarerParentId = this.CarerParentId;
            this.apiService.save(this.controllerName, this.objCarerManagementDecisionDTO, type).then(data => this.Respone(data, type, IsUpload));

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
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
            }
            else {
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
            }
            this._router.navigate(['/pages/fostercarer/carermanagementdecisionlist/' + this.objQeryVal.mid]);
        }
    }
}