import { Component, Pipe, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { Location} from '@angular/common';
import { ChildHealthInfo} from './DTO/childhealthinfo'
import { ValChangeDTO } from '../dynamic/ValChangeDTO'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

//.@Pipe({ name: 'groupBy' })
@Component({
        selector: 'childhealthinfo',
        templateUrl: './childhealthinfo.component.template.html',
})

export class ChildHealthInfoComponent{
    objChildHealthInfo: ChildHealthInfo = new ChildHealthInfo();
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
    isLoading: boolean = false; controllerName = "ChildHealthInfo"; 

    constructor(private apiService: APICallService,private location: Location, private _formBuilder: FormBuilder, 
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {
        
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildHealthInfo.AgencyProfileId = this.AgencyProfileId;
        this.objChildHealthInfo.ChildId = this.ChildID ;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildHealthInfo.SequenceNo = this.SequenceNo;
        } else
        {
            this.objChildHealthInfo.SequenceNo = 0;
        }
        apiService.post(this.controllerName,"GetDynamicControls",this.objChildHealthInfo).then(data => { this.dynamicformcontrol = data; });
        this._Form = _formBuilder.group({});
        //Doc
        this.formId = 113;
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

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {
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

        if (IsUpload) {
            this.submittedUpload = true;
            if (mainFormBuilder.valid && subformbuilder.valid && uploadFormBuilder.valid && dynamicForm != '') {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                this.objChildHealthInfo.DynamicValue = dynamicForm;
                this.objChildHealthInfo.ChildId = this.ChildID;
                this.apiService.save(this.controllerName,this.objChildHealthInfo, type).then(data => this.Respone(data, type, IsUpload));
            }
        }
        else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            this.objChildHealthInfo.DynamicValue = dynamicForm;
            this.objChildHealthInfo.ChildId = this.ChildID;
            this.apiService.save(this.controllerName,this.objChildHealthInfo, type).then(data => this.Respone(data, type, IsUpload));
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
            this._router.navigate(['/pages/child/childhealthinfolist/19']);
        }
    }

    DnamicOnValChange(InsValChange: ValChangeDTO) {        
        let SpecifyOtherDisablity = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "SpecifyOtherDisablity  ");
        if (SpecifyOtherDisablity[0] != null && InsValChange.currnet.FieldCnfg.FieldName == "DisabilityId")
        {
            SpecifyOtherDisablity[0].IsVisible = false;
            if (InsValChange.currnet.FieldCnfg.FieldName == "DisabilityId" && InsValChange.newValue == 955)
            {              
                SpecifyOtherDisablity[0].IsVisible = true;
            }
            else
            {
                SpecifyOtherDisablity[0].IsVisible = false;
            }
        }
        let SpecifyOtherResposiblity = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "SpecifyOtherResposiblity ");

        if (SpecifyOtherResposiblity[0] != null && InsValChange.currnet.FieldCnfg.FieldName == "ParentalResponsibilityId")
        {
            SpecifyOtherResposiblity[0].IsVisible = false;
            if (InsValChange.currnet.FieldCnfg.FieldName == "ParentalResponsibilityId" && InsValChange.newValue == 954)
            {
                SpecifyOtherResposiblity[0].IsVisible = true;
            }
            else
            {
                SpecifyOtherResposiblity[0].IsVisible = false;
            }
        }

        let SpecialCareNeedtext = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "SpecialCareNeedtext");
        if (SpecialCareNeedtext[0] != null && InsValChange.currnet.FieldCnfg.FieldName == "HasSpecialCareNeeded")
        {
            SpecialCareNeedtext[0].IsVisible = false;
            
            if (InsValChange.currnet.FieldCnfg.FieldName == "HasSpecialCareNeeded" && InsValChange.newValue == 1)
            {
                SpecialCareNeedtext[0].IsVisible = true;
            }
            else
            {
                SpecialCareNeedtext[0].IsVisible = false;
            }
        }
    }    
}