import { APICallService } from '../services/apicallservice.service';
import { Component, Pipe, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { PagesComponent } from '../pages.component'
import { ChildD3PersonalInformationDTO } from './DTO/d3personalinfodto'

@Component({
    selector: 'ChildD3PersonalInformation',
    templateUrl: './d3personalinfodata.component.template.html',
})

export class ChildD3PersonalInformationDataComponent {
    controllerName = "ChildD3PersonalInformation";
    objChildD3PersonalInformation: ChildD3PersonalInformationDTO = new ChildD3PersonalInformationDTO();
    submitted = false;
    _Form: FormGroup;
    objQeryVal;
    ChildId: number;
    isLoading: boolean = false;
    insd3InfoActive = "active";
    insDocumentActive = "";
    //Doc
    FormCnfgId;
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router,
        private module: PagesComponent, private apiService: APICallService) {

        this.objChildD3PersonalInformation.InformationDate = null;
        this.ChildId = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        if (this.objQeryVal.id != 0) {
            this.apiService.get(this.controllerName, "GetById", this.objQeryVal.id).then(data => {
                this.objChildD3PersonalInformation = data;
                this.setDate(data);
            });
        }
        this._Form = _formBuilder.group({
            InformationDate: [Validators.required],
            Comments: [],
        });
        //Doc
        this.formId = 256;
        this.TypeId = this.ChildId;
        this.tblPrimaryKey = this.objQeryVal.id;
    }

    fnD3InfoActive() {
        this.insd3InfoActive = "active";
        this.insDocumentActive = "";

    }
    fnDocumentActive() {
        this.insd3InfoActive = "";
        this.insDocumentActive = "active";

    }

    setDate(data) {
        this.objChildD3PersonalInformation.InformationDate = this.module.GetDateEditFormat(data.InformationDate);
    }
    DocOk = true;
    clicksubmit(_Form, UploadDocIds,IsUpload, uploadFormBuilder) {
        this.submitted = true;

        if (!this._Form.valid) {
            this.module.GetErrorFocus(this._Form);
        }
        this.DocOk = true;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }



        if (this._Form.valid && this.DocOk) {
            this.objChildD3PersonalInformation.InformationDate = this.module.GetDateSaveFormat(this.objChildD3PersonalInformation.InformationDate);
            this.objChildD3PersonalInformation.ChildId = this.ChildId;
            this.isLoading = true;
            let type = "save";
            if (this.objQeryVal.id > 0)
                type = "update";
            this.apiService.save(this.controllerName, this.objChildD3PersonalInformation, type).then(data => this.Respone(data, type, IsUpload));
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
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
            }
            this._router.navigate(['/pages/child/d3personalinfolist/4']);
        }
    }
}