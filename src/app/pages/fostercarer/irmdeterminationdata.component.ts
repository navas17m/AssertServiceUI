import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerIRMDeterminationDTO } from './DTO/irmdeterminationdto';

@Component({ 
    selector: 'CarerIRMDeterminationData',
    templateUrl: './irmdeterminationdata.component.template.html',

})

export class CarerIRMDeterminationDataComponent {
    objCarerIRMDeterminationDTO: CarerIRMDeterminationDTO = new CarerIRMDeterminationDTO();
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

    IRMTabActive = "active";
    DocumentActive;SocialWorkerId;
    isLoading: boolean = false; controllerName = "CarerIRMDetermination";

    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute, private _router: Router, private modal: PagesComponent) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3]);
        }
        this.SocialWorkerId = Common.GetSession("ACarerSSWId");
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objCarerIRMDeterminationDTO.CarerParentId = this.CarerParentId;
        this.SequenceNo = this.objQeryVal.Id;
        this.objCarerIRMDeterminationDTO.SequenceNo = this.SequenceNo;
        apiService.post(this.controllerName, "GetDynamicControls", this.objCarerIRMDeterminationDTO).then(data => {
            this.dynamicformcontrol = data;
        });
        this._Form = _formBuilder.group({});
        //Doc
        this.formId = 255;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.SequenceNo;
    }

    fnIRMTab() {
        this.IRMTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.IRMTabActive = "";
        this.DocumentActive = "active";
    }
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
            this.IRMTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.IRMTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.IRMTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }

        if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '' && this.DocOk) {
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
            this.objCarerIRMDeterminationDTO.DynamicValue = dynamicForm;
            this.objCarerIRMDeterminationDTO.CarerParentId = this.CarerParentId;
            this.apiService.save(this.controllerName, this.objCarerIRMDeterminationDTO, type).then(data => this.Respone(data, type, IsUpload));
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
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            this._router.navigate(['/pages/fostercarer/irmdeterminationlist/3']);
        }
    }
}