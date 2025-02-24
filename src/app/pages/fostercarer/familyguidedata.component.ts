import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerFamilyGuideDTO } from './DTO/familyguidedatadto';
@Component({
    selector: 'CarerFamilyGuide',
    templateUrl: './familyguidedata.component.template.html',
})

export class CarerFamilyGuideComponent {
    controllerName = "CarerFamilyGuide";
    objCarerFamilyGuideDTO: CarerFamilyGuideDTO = new CarerFamilyGuideDTO();
    submitted = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    objQeryVal;
    CarerParentId;
    insCarerDetails;
    isLoading = false;
    formId = 254;
    //Doc
    FormCnfgId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    constructor(private activatedroute: ActivatedRoute,
        private _formBuilder: FormBuilder, private _router: Router, private module: PagesComponent, private apiService: APICallService) {
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 38]);
        }
        else  {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            if (Common.GetSession("SelectedCarerProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
            }
        } 
        this.objCarerFamilyGuideDTO.CarerParentId = this.CarerParentId;
        this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerFamilyGuideDTO).then(data => 
        {
            this.dynamicformcontrol = data;
        });
        this._Form = _formBuilder.group({});
        //Doc
        this.formId = 254;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.CarerParentId;
    }
    FamilyGuideActive = "active";
    DocumentActive = "";
    fnFamilyGuideDetails() {
        this.FamilyGuideActive = "active";
        this.DocumentActive = "";
    }

    fnDocumentDetail() {
        this.FamilyGuideActive = "";
        this.DocumentActive = "active";
    }
    DocOk = true;
    clicksubmit(mainFormBuilder, dynamicForm, dynamicFormBuliderA, IsUpload, uploadFormBuilder) {
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
        if (mainFormBuilder.valid && dynamicFormBuliderA.valid && this.DocOk) {
            this.isLoading = true;
            let type = "save";
            if (dynamicForm[0].UniqueId != 0)
                type = "update";

            this.objCarerFamilyGuideDTO.DynamicValue = dynamicForm;
            this.objCarerFamilyGuideDTO.CarerParentId = this.CarerParentId;
            this.apiService.save(this.controllerName, this.objCarerFamilyGuideDTO, type).then(data => this.Respone(data, type, IsUpload));
        }
    }

    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {         
                this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerFamilyGuideDTO).then(data => {
                    this.dynamicformcontrol = data;
                    this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                });

            }
            else {
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);    
            }
            if (IsUpload) {
                this.uploadCtrl.fnUploadAll(this.CarerParentId);
            }
        }
    }
}