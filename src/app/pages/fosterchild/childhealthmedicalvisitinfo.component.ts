import { Component, Pipe, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { Location} from '@angular/common';
import { ChildHealthMedicalVisitInfo} from './DTO/childhealthmedicalvisitinfo'
import { ValChangeDTO } from '../dynamic/ValChangeDTO'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

//.@Pipe({ name: 'groupBy' })
@Component({
        selector: 'childhealthmedicalvisitinfo',
        templateUrl: './childhealthmedicalvisitinfo.component.template.html',
})

export class ChildHealthMedicalVisitInfoComponent{
    objChildHealthMedicalVisitInfo: ChildHealthMedicalVisitInfo = new ChildHealthMedicalVisitInfo();
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
    ChildID: number;
    AgencyProfileId: number;

    MedicalVisitTabActive = "active";
    DocumentActive;
    isLoading: boolean = false; controllerName = "ChildHealthMedicalVisitInfo"; 

    constructor(private apiService: APICallService,private location: Location, private _formBuilder: FormBuilder, 
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {
              
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildHealthMedicalVisitInfo.AgencyProfileId = this.AgencyProfileId;
        this.objChildHealthMedicalVisitInfo.ChildId = this.ChildID ;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildHealthMedicalVisitInfo.SequenceNo = this.SequenceNo;
        } else {
            this.objChildHealthMedicalVisitInfo.SequenceNo = 0;
        }

        apiService.post(this.controllerName,"GetDynamicControls",this.objChildHealthMedicalVisitInfo).then(data => { this.dynamicformcontrol = data; });
        this._Form = _formBuilder.group({});
        //Doc
        this.formId = 116;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;
    }

    fnMedicalVisitTab() {
        this.MedicalVisitTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.MedicalVisitTabActive = "";
        this.DocumentActive = "active";
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.MedicalVisitTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.MedicalVisitTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.MedicalVisitTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.MedicalVisitTabActive = "active";
            this.DocumentActive = "";
        }

        if (IsUpload) {
            this.submittedUpload = true;
            if (mainFormBuilder.valid && subformbuilder.valid && uploadFormBuilder.valid && dynamicForm != '') {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                this.objChildHealthMedicalVisitInfo.DynamicValue = dynamicForm;
                this.objChildHealthMedicalVisitInfo.ChildId = this.ChildID;
                this.apiService.save(this.controllerName,this.objChildHealthMedicalVisitInfo, type).then(data => this.Respone(data, type, IsUpload));
            }
        }
        else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            this.objChildHealthMedicalVisitInfo.DynamicValue = dynamicForm;
            this.objChildHealthMedicalVisitInfo.ChildId = this.ChildID;
            this.apiService.save(this.controllerName,this.objChildHealthMedicalVisitInfo, type).then(data => this.Respone(data, type, IsUpload));
        }
    }
    
    private Respone(data, type, IsUpload) {    
        this.isLoading = false;  
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            this._router.navigate(['/pages/child/childhealthmedicalvisitinfolist/19']);
        }
    }
}