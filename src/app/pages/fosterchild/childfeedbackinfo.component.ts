import { Component, Pipe, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { Location} from '@angular/common';
import { ChildFeedbackInfo} from './DTO/childfeedbackinfodto'
import { ValChangeDTO } from '../dynamic/ValChangeDTO'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

//.@Pipe({ name: 'groupBy' })
@Component({
        selector: 'childfeedbackinfo',
        templateUrl: './childfeedbackinfo.component.template.html',
})

export class ChildFeedbackInfoComponent{
    objChildFeedbackInfo: ChildFeedbackInfo = new ChildFeedbackInfo();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    formId; tblPrimaryKey;    
    @ViewChild('uploads') uploadCtrl;
    TypeId;
    ChildID: number;
    AgencyProfileId: number;

    AssessmentTabActive = "active";
    DocumentActive;
    isLoading: boolean = false; controllerName = "ChildFeedbackInfo"; 

    constructor(private apiService: APICallService,private location: Location, private _formBuilder: FormBuilder, 
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {
        
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildFeedbackInfo.AgencyProfileId = this.AgencyProfileId;
        this.objChildFeedbackInfo.ChildId = this.ChildID ;
        this.SequenceNo = this.objQeryVal.id;
       
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildFeedbackInfo.SequenceNo = this.SequenceNo;
        } else
        {
            this.objChildFeedbackInfo.SequenceNo = 0;
        }
        apiService.post(this.controllerName,"GetDynamicControls",this.objChildFeedbackInfo).then(data => { this.dynamicformcontrol = data; });
        this._Form = _formBuilder.group({});
        //Doc
        this.formId = 394;
        this.TypeId = this.ChildID;
    }

    fnAssessmentTab() {
        this.AssessmentTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.AssessmentTabActive = "";
        this.DocumentActive = "active";
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.AssessmentTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.AssessmentTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.AssessmentTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.AssessmentTabActive = "active";
            this.DocumentActive = "";
        }
        this.objChildFeedbackInfo.NotificationEmailIds = EmailIds;
        this.objChildFeedbackInfo.NotificationAddtionalEmailIds = AddtionalEmailIds;
        if (IsUpload) {
            this.submittedUpload = true;
            if (mainFormBuilder.valid && subformbuilder.valid && uploadFormBuilder.valid && dynamicForm != '') {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                this.objChildFeedbackInfo.DynamicValue = dynamicForm;
                this.objChildFeedbackInfo.ChildId = this.ChildID;               
                this.apiService.save(this.controllerName,this.objChildFeedbackInfo, type).then(data => this.Respone(data, type, IsUpload));
            }
        }
        else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            this.objChildFeedbackInfo.DynamicValue = dynamicForm;
            this.objChildFeedbackInfo.ChildId = this.ChildID;
            this.apiService.save(this.controllerName,this.objChildFeedbackInfo, type).then(data => this.Respone(data, type, IsUpload));
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
            this._router.navigate(['/pages/child/feedbacklist/19']);
        }
    }  
}