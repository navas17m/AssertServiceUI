import { Component, Pipe, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Common }  from  '../common'
import { Location} from '@angular/common';
import { ChildChronologyOfEvent} from './DTO/childchronologyofevent'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

//.@Pipe({ name: 'groupBy' })
@Component({
        selector: 'childchronologyofeventdata',
        templateUrl: './childchronologyofeventdata.component.template.html',
})

export class ChildChronologyOfEventDataComponent{
    objChildChronologyOfEvent: ChildChronologyOfEvent = new ChildChronologyOfEvent();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    TypeId;
    formId; tblPrimaryKey;
    @ViewChild('uploads') uploadCtrl;
    ChildID: number; 
    AgencyProfileId: number;

    ChronologyTabActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    controllerName = "ChildChronologyOfEvent"; 

    constructor(private apiService: APICallService, private location: Location, private _formBuilder: FormBuilder, 
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {
                
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.objChildChronologyOfEvent.AgencyProfileId = this.AgencyProfileId;
        this.objChildChronologyOfEvent.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildChronologyOfEvent.SequenceNo = this.SequenceNo;
        } else
        {
            this.objChildChronologyOfEvent.SequenceNo = 0;
        }

        apiService.post(this.controllerName,"GetDynamicControls", this.objChildChronologyOfEvent).then(data => { this.dynamicformcontrol = data; });
        //Doc
        this.formId = 87;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;

        this._Form = _formBuilder.group({});
    }

    fnChronologyTab() {
        this.ChronologyTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.ChronologyTabActive = "";
        this.DocumentActive = "active";
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.ChronologyTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.ChronologyTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.ChronologyTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.ChronologyTabActive = "active";
            this.DocumentActive = "";
        }

        if (IsUpload) {
            this.submittedUpload = true;
            if (mainFormBuilder.valid && subformbuilder.valid && uploadFormBuilder.valid && dynamicForm != '') {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";

                this.objChildChronologyOfEvent.DynamicValue = dynamicForm;
                this.objChildChronologyOfEvent.ChildId = this.ChildID;
                this.apiService.save(this.controllerName, this.objChildChronologyOfEvent, type).then(data => this.Respone(data, type, IsUpload));
            }
        }
        else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0) 
                type = "update";
             
            this.objChildChronologyOfEvent.DynamicValue = dynamicForm;
            this.objChildChronologyOfEvent.ChildId = this.ChildID;
            this.apiService.save(this.controllerName,this.objChildChronologyOfEvent, type).then(data => this.Respone(data, type, IsUpload));
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
            this._router.navigate(['/pages/child/childchronologyofeventlist/4']);
        }
    }
}