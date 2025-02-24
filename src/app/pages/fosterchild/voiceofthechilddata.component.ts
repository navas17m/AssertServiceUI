import { Component, Pipe, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms'
import {ChildHealthHospitalisationInfoService } from '../services/childhealthhospitalisationinfo.service'
import {Common}  from  '../common'
import { Location} from '@angular/common';
import { ChildHealthHospitalisationInfo} from './DTO/childhealthhospitalisationinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
        selector: 'voiceofthechilddata',
        templateUrl: './voiceofthechilddata.component.template.html',
        providers: [ChildHealthHospitalisationInfoService]
})

export class voiceofthechilddataComponent {
    objChildHealthHospitalisationInfo: ChildHealthHospitalisationInfo = new ChildHealthHospitalisationInfo();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;
    formId;
    tblPrimaryKey;
    @ViewChild('uploads',{static:false}) uploadCtrl;
    TypeId;
    ChildID: number;
    AgencyProfileId: number;
    controllerName = "voiceofthechild";
    HospitalisationTabActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=383;
    constructor(private apiService: APICallService, private location: Location, private _formBuilder: FormBuilder,
        private ChildHHService: ChildHealthHospitalisationInfoService,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildHealthHospitalisationInfo.AgencyProfileId = this.AgencyProfileId;
        this.objChildHealthHospitalisationInfo.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildHealthHospitalisationInfo.SequenceNo = this.SequenceNo;
        } else {
            this.objChildHealthHospitalisationInfo.SequenceNo = 0;
        }

        this.objChildHealthHospitalisationInfo.AgencyProfileId = this.AgencyProfileId;
        this.objChildHealthHospitalisationInfo.ChildId = this.ChildID;

        apiService.post(this.controllerName,"GetDynamicControls",this.objChildHealthHospitalisationInfo).then(data => {
            this.dynamicformcontrol = data;
        });


        //ChildHHService.getByFormCnfgId(this.objChildHealthHospitalisationInfo).then(data => { this.dynamicformcontrol = data; });
        this._Form = _formBuilder.group({});
        //Doc
        this.formId = 383;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;

        if (Common.GetSession("ViweDisable") == '1') {
            this.objUserAuditDetailDTO.ActionId = 4;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    fnHospitalisationTab() {
        this.HospitalisationTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.HospitalisationTabActive = "";
        this.DocumentActive = "active";
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.HospitalisationTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.HospitalisationTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.HospitalisationTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.HospitalisationTabActive = "active";
            this.DocumentActive = "";
        }

        if (IsUpload) {
            this.submittedUpload = true;
            if (mainFormBuilder.valid && subformbuilder.valid && uploadFormBuilder.valid && dynamicForm != '') {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                this.objChildHealthHospitalisationInfo.DynamicValue = dynamicForm;
                this.objChildHealthHospitalisationInfo.ChildId = this.ChildID;
                this.apiService.save(this.controllerName,this.objChildHealthHospitalisationInfo, type).then(data => this.Respone(data, type,IsUpload));

               // this.ChildHHService.post(this.objChildHealthHospitalisationInfo, type).then(data => this.Respone(data, type, IsUpload));
            }
        }
        else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            this.objChildHealthHospitalisationInfo.DynamicValue = dynamicForm;
            this.objChildHealthHospitalisationInfo.ChildId = this.ChildID;
            this.apiService.save(this.controllerName,this.objChildHealthHospitalisationInfo, type).then(data => this.Respone(data, type,IsUpload));

           // this.ChildHHService.post(this.objChildHealthHospitalisationInfo, type).then(data => this.Respone(data, type, IsUpload));
        }
    }

    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/child/voiceofthechildlist/4']);
        }
    }
}
