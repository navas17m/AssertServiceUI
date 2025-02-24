import { Component, Pipe, ViewChild, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common, deepCopy, Compare, ConvertDateAndDateTimeSaveFormat}  from  '../common'										  
import { ChildEducationalInfo} from './DTO/childeducationalinfo'
import { ValChangeDTO} from '../dynamic/ValChangeDTO';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'childeducationalinfo',
    templateUrl: './childeducationalinfo.component.template.html',
})

export class ChildEducationalInfoComponent {
    @ViewChild('btnSchollInfo') infobtnSchollInfo: ElementRef;
    objChildEducationalInfo: ChildEducationalInfo = new ChildEducationalInfo();
    submitted = false; submittedUpload = false;
    dynamicformcontrol = []; dynamicformcontrolOrginal = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    SequenceNo;
    objQeryVal;    
    formId;
    TypeId;
    tblPrimaryKey;
    @ViewChild('uploads') uploadCtrl;
    ChildID: number;
    AgencyProfileId: number;

    EducationInfoTabActive = "active";
    DocumentActive;
    isLoading: boolean = false; controllerName = "ChildEducationalInfo"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=102;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
                  private route: ActivatedRoute, private _router: Router, private modal: PagesComponent, private renderer: Renderer2) {        
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildEducationalInfo.AgencyProfileId = this.AgencyProfileId;
        this.objChildEducationalInfo.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildEducationalInfo.SequenceNo = this.SequenceNo;
        } else {
            this.objChildEducationalInfo.SequenceNo = 0;
        }

        apiService.post(this.controllerName, "GetDynamicControls", this.objChildEducationalInfo).then(data => {
            this.dynamicformcontrol = data;
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
        });
        this._Form = _formBuilder.group({});

        //Doc
        this.formId = 102;
        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;

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


    fnShowSchoolInfo() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infobtnSchollInfo.nativeElement.dispatchEvent(event);
    }
    fnSuccessNewSchool(val)
    {     
        let event = new MouseEvent('click', { bubbles: true });
        this.infobtnSchollInfo.nativeElement.dispatchEvent(event);

        let temp=this.dynamicformcontrol.filter(x=>x.FieldCnfg.FieldName=="SchoolId");
        if(temp.length>0)
        {
            temp[0].ConfigTableValues.push(val);
            temp[0].FieldValue=val.CofigTableValuesId;

            let val2 = this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == "SchoolAddress");
            this.apiService.get("ChildSchoolInfo", "GetById", val.CofigTableValuesId).then(data =>
            {
                if(val2.length>0)
                  val2[0].FieldValue = data;
            });            
        }

    }

    fnEducationInfoTab() {
        this.EducationInfoTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.EducationInfoTabActive = "";
        this.DocumentActive = "active";
    }
    isDirty = true;
    DocOk = true;
    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder) {
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
		
        if (!mainFormBuilder.valid) {
            this.EducationInfoTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.EducationInfoTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.EducationInfoTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.EducationInfoTabActive = "active";
            this.DocumentActive = "";
        }

        if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '' && this.DocOk) {
            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(dynamicForm, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                this.objChildEducationalInfo.SequenceNo = this.SequenceNo;
                this.objChildEducationalInfo.DynamicValue = dynamicForm;
                this.objChildEducationalInfo.ChildId = this.ChildID;
                this.apiService.save(this.controllerName, this.objChildEducationalInfo, type).then(data => this.Respone(data, type, IsUpload));
            }
		 
            else {
                this.modal.alertWarning(Common.GetNoChangeAlert);
            }																																												  
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
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/child/childeducationalinfolist/18']);
        }
    }

    ChildSchoolPlacementNoDetails: boolean = false;
    DynamicOnValChange(InsValChange: ValChangeDTO) {       
        this.ChildSchoolPlacementNoDetails = this.SetInputVisible("DoesThisChildSchoolPlacement", InsValChange.currnet.FieldCnfg.FieldName, "0", InsValChange.newValue);
        InsValChange.all.forEach(itemAll => {

            if (InsValChange.currnet.FieldCnfg.FieldName == "DoesThisChildSchoolPlacement" &&
                itemAll.FieldCnfg.FieldName == "ChildSchoolPlacementNoDetails") {
                itemAll.IsVisible = this.ChildSchoolPlacementNoDetails;
            }
        });

        let val2 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "SchoolAddress");
        if (val2.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "SchoolId" && InsValChange.currnet.FieldValue != null) {
            this.apiService.get("ChildSchoolInfo", "GetById", InsValChange.currnet.FieldValue).then(data =>
            {
                val2[0].FieldValue = data;
            });
        }
        
    }
    rtnVal: boolean;
    SetInputVisible(fieldName, fieldNameValue, condition, conditionValue) {        
        if (!conditionValue)
            conditionValue = false;
        this.rtnVal;
        if (fieldName == fieldNameValue && condition == conditionValue) {
            this.rtnVal = true;
        }
        else {
            this.rtnVal = false;
        }
        return this.rtnVal;
    }
}