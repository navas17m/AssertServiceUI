
import { Component, Pipe, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { Location} from '@angular/common';
import { NextDayActionLog} from './DTO/nextdayactionlog'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'nextdayactionlog',
    templateUrl: './nextdayactionlog.component.template.html',
})

export class NextDayActionLogComponent {
    objNextDayActionLog: NextDayActionLog = new NextDayActionLog();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    formId; tblPrimaryKey;
    @ViewChild('uploads') uploadCtrl;
    ChildID: number;
    AgencyProfileId: number;
    controllerName = "NextDayActionLog";
    TypeId;
    constructor(private apiService: APICallService, public location: Location, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {
        this.formId = 58;

        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.objNextDayActionLog.AgencyProfileId = this.AgencyProfileId;
        this.objNextDayActionLog.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objNextDayActionLog.SequenceNo = this.SequenceNo;
        } else {
            this.objNextDayActionLog.SequenceNo = 0;
        }

        apiService.post(this.controllerName,"GetDynamicControls", this.objNextDayActionLog).then(data => { this.dynamicformcontrol = data; });

        this._Form = _formBuilder.group({});
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {
        this.submitted = true;
        if (IsUpload) {
            this.submittedUpload = true;
            if (mainFormBuilder.valid && subformbuilder.valid && uploadFormBuilder.valid && dynamicForm != '') {
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                this.objNextDayActionLog.DynamicValue = dynamicForm;
                this.objNextDayActionLog.ChildId = this.ChildID;
                this.apiService.save(this.controllerName,this.objNextDayActionLog, type).then(data => this.Respone(data, type, IsUpload));
            }
        }
        else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            let type = "save";
            if (this.SequenceNo > 0) {
                type = "update";
            }
            this.objNextDayActionLog.DynamicValue = dynamicForm;
            this.objNextDayActionLog.ChildId = this.ChildID;
            this.apiService.save(this.controllerName,this.objNextDayActionLog, type).then(data => this.Respone(data, type, IsUpload));
        }
    }

    private Respone(data, type, IsUpload) {
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
            this._router.navigate(['/pages/child/nextdayactionloglist']);
        }
    }
}