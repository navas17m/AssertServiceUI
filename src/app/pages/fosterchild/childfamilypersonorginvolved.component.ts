import { Component, Pipe, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
//import { ChildFamilyPersonOrgInvolvedService } from '../services/childfamilypersonorginvolved.service'
import { Common }  from  '../common'
import { Location } from '@angular/common';
import { ChildFamilyPersonOrgInvolved } from './DTO/childfamilypersonorginvolved'
import { PagesComponent } from '../pages.component';
import { ValChangeDTO} from '../dynamic/ValChangeDTO';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'childfamilypersonorginvolved',
    templateUrl: './childfamilypersonorginvolved.component.template.html',
})

export class ChildFamilyPersonOrgInvolvedComponent {
    objChildFamilyPersonOrgInvolved: ChildFamilyPersonOrgInvolved = new ChildFamilyPersonOrgInvolved();
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
    controllerName = "ChildFamilyPersonOrgInvolved";
    FPOInvolvedTabActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=88;
    constructor(private location: Location, private _formBuilder: FormBuilder, private apiService: APICallService,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {

        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildFamilyPersonOrgInvolved.AgencyProfileId = this.AgencyProfileId;
        this.objChildFamilyPersonOrgInvolved.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objChildFamilyPersonOrgInvolved.SequenceNo = this.SequenceNo;
            this.tblPrimaryKey = this.SequenceNo;
        } else {
            this.objChildFamilyPersonOrgInvolved.SequenceNo = 0;
        }

        //CFPOIService.getByFormCnfgId(this.objChildFamilyPersonOrgInvolved).then(data => { this.dynamicformcontrol = data; });
        apiService.post(this.controllerName, "GetDynamicControls", this.objChildFamilyPersonOrgInvolved).then(data => { this.dynamicformcontrol = data; });
        //Doc
        this.formId = 88;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;

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

    fnFPOInvolvedTab() {
        this.FPOInvolvedTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.FPOInvolvedTabActive = "";
        this.DocumentActive = "active";
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.FPOInvolvedTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.FPOInvolvedTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.FPOInvolvedTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.FPOInvolvedTabActive = "active";
            this.DocumentActive = "";
        }

        if (IsUpload) {
            this.submittedUpload = true;
            if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                this.objChildFamilyPersonOrgInvolved.DynamicValue = dynamicForm;
                this.objChildFamilyPersonOrgInvolved.ChildId = this.ChildID;
                // this.CFPOIService.post(this.objChildFamilyPersonOrgInvolved, type).then(data => this.Respone(data, type, IsUpload));
                this.apiService.save(this.controllerName, this.objChildFamilyPersonOrgInvolved, type).then(data => this.Respone(data, type, IsUpload));
            }
        }
        else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            this.objChildFamilyPersonOrgInvolved.DynamicValue = dynamicForm;
            this.objChildFamilyPersonOrgInvolved.ChildId = this.ChildID;
            this.apiService.save(this.controllerName, this.objChildFamilyPersonOrgInvolved, type).then(data => this.Respone(data, type, IsUpload));
            // this.CFPOIService.post(this.objChildFamilyPersonOrgInvolved, type).then(data => this.Respone(data, type, IsUpload));
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
                    this.uploadCtrl.fnUploadChildSiblingNParent(data.lstChildSiblingNParent);
                    //this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadChildSiblingNParent(data.lstChildSiblingNParent);
                }
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/child/childfamilypersonorginvolvedlist/4']);
        }
    }

    DynamicOnValChange(InsValChange: ValChangeDTO) {
        //if (this.SequenceNo != 0 && this.SequenceNo != null) {
        //    if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord"
        //        || InsValChange.currnet.FieldCnfg.FieldName == "AddtoParent/ChildRecord") {
        //        InsValChange.currnet.IsVisible = false;
        //    }
        //}
        if(Common.GetSession("HasChildSiblings")=='false')
        {
            if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord") 
                InsValChange.currnet.IsVisible = false;
        }
        if(Common.GetSession("HasChildParents")=='false')
        {
            if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoParent/ChildRecord") 
                InsValChange.currnet.IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "SiblingParentSno") {
            InsValChange.currnet.IsVisible = false;
        }
    }
}