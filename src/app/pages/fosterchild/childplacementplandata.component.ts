import { Component, Pipe, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { ChildPlacementPlanDTO } from './DTO/childplacementplandto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ValChangeDTO} from '../dynamic/ValChangeDTO';


@Component({
    selector: 'ChildPlacementPlandata',
    templateUrl: './childplacementplandata.component.template.html',
})

export class ChildPlacementPlanDataComponent {
    objChildPlacementPlanDTO: ChildPlacementPlanDTO = new ChildPlacementPlanDTO();
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
    CarerName;
    CarerParentId;
    CLAReviewTabActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    controllerName = "ChildPlacementPlan";
    IsShowGPDetails = false;
    lstChildAssignedPhysician = [];
    SocialWorkerId;
    LASocialWorkerId;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router,
        private modal: PagesComponent, private renderer: Renderer2) {
        this.CarerName = Common.GetSession("CarerName");
        if (this.CarerName == "null") {
            this.CarerName = "Not Placed";
            this.CarerParentId = 0;
        }
        else this.CarerParentId = parseInt(Common.GetSession("CarerId"));
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.SocialWorkerId = Common.GetSession("SSWId");
        this.LASocialWorkerId = Common.GetSession("ChildLASocialWorkerId");
        this.objChildPlacementPlanDTO.AgencyProfileId = this.AgencyProfileId;
        this.objChildPlacementPlanDTO.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildPlacementPlanDTO.SequenceNo = this.SequenceNo;
        } else {
            this.objChildPlacementPlanDTO.SequenceNo = 0;
        }

        apiService.post(this.controllerName, "GetDynamicControls", this.objChildPlacementPlanDTO).then(data => {
            this.dynamicformcontrol = data;
            ///GetCarerTrainingProfile
            let IsShowGPDetailsGrid = data.filter(x => x.FieldCnfg.FieldName == "IsShowGPDetails");
            if (IsShowGPDetailsGrid.length > 0) {
                this.IsShowGPDetails = true;
                this.GetChildGPDetails();
            }
        });
        //Doc
        this.formId = 253;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;

        this._Form = _formBuilder.group({});

    }
    GetChildGPDetails() {
        this.apiService.get("PhysicianInfo", "GetPhysicianMapBycId", this.ChildID).then(data => {
            this.lstChildAssignedPhysician = data.LstPhysicianMapped;
        })
    }

    DynamicOnValChange(InsValChange: ValChangeDTO) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "CarerParentId") {
            InsValChange.currnet.IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "IsShowGPDetails") {
            InsValChange.currnet.IsVisible = false;
        }
        else if (InsValChange.currnet.FieldCnfg.FieldName == "SocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }
        else if (InsValChange.currnet.FieldCnfg.FieldName == "LASocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }

        let val2 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "SchoolAddress");
        if (val2.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "SchoolId" && InsValChange.currnet.FieldValue != null) {
            this.apiService.get("ChildSchoolInfo", "GetById", InsValChange.currnet.FieldValue).then(data => {
                val2[0].FieldValue = data;
            });
        }
    }

    fnCLAReviewTab() {
        this.CLAReviewTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.CLAReviewTabActive = "";
        this.DocumentActive = "active";
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {
        this.submitted = true;

        if (!subformbuilder.valid) {
            this.CLAReviewTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.CLAReviewTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }

        let val1 = dynamicForm.filter(x => x.FieldName == "CarerParentId");
        if (val1.length > 0 && (val1[0].FieldValue == null || val1[0].FieldValue == ''))
            val1[0].FieldValue = this.CarerParentId;
        if(this.SequenceNo == 0){
        let val = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
        if (val.length > 0 && (val[0].FieldValue == null || val[0].FieldValue == ''))
          val[0].FieldValue = this.SocialWorkerId;

        let valLASW = dynamicForm.filter(x => x.FieldName == "LASocialWorkerId");
        if (valLASW.length > 0 && (valLASW[0].FieldValue == null || valLASW[0].FieldValue == ''))
          valLASW[0].FieldValue = this.LASocialWorkerId;
        }

        if (IsUpload) {
            if (mainFormBuilder.valid && subformbuilder.valid && uploadFormBuilder.valid && dynamicForm != '') {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                this.objChildPlacementPlanDTO.DynamicValue = dynamicForm;
                this.objChildPlacementPlanDTO.ChildId = this.ChildID;
                this.apiService.save(this.controllerName, this.objChildPlacementPlanDTO, type).then(data => this.Respone(data, type, IsUpload));
            }
            else
                this.submittedUpload = true;
        } else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            this.objChildPlacementPlanDTO.DynamicValue = dynamicForm;
            this.objChildPlacementPlanDTO.ChildId = this.ChildID;
            this.apiService.save(this.controllerName, this.objChildPlacementPlanDTO, type).then(data => this.Respone(data, type, IsUpload));
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
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);;
                }
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            this._router.navigate(['/pages/child/placementplanlist/4']);
        }
    }
}
