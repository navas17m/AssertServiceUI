import { Component, Pipe, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Common }  from  '../common'
import { Location } from '@angular/common';
import { ChildPathwayplanInfo } from './DTO/childpathwayplaninfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

//.@Pipe({ name: 'groupBy' })
@Component({
        selector: 'childpathwayplan',
        templateUrl: './childpathwayplan.component.template.html',
})

export class ChildPathwayplanComponent{
    objChildPathwayplan: ChildPathwayplanInfo = new ChildPathwayplanInfo();
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
    PathwayTabActive = "active";
    TransitionPlanActive = "";
    DocumentActive;
    isLoading: boolean = false; controllerName = "ChildPathwayplanInfo"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=96;

    constructor(private apiService: APICallService,private location: Location, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent)
    {        
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildPathwayplan.AgencyProfileId = this.AgencyProfileId;
      
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.objChildPathwayplan.ChildId = this.ChildID ;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.tblPrimaryKey = this.SequenceNo;
            this.objChildPathwayplan.SequenceNo = this.SequenceNo;
        } else
        {
            this.objChildPathwayplan.SequenceNo = 0;
        }

        apiService.post(this.controllerName,"GetDynamicControls",this.objChildPathwayplan).then(data => { this.dynamicformcontrol = data; });
        //Doc
        this.formId = 96;
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

    fnPathwayPlanTab() {
        this.PathwayTabActive = "active";
        this.DocumentActive = "";
        this.TransitionPlanActive="";
    }
    fnDocumentDetailTab() {
        this.PathwayTabActive = "";
        this.DocumentActive = "active";
        this.TransitionPlanActive="";
    }
    fnTransitionPlanTab() {
        this.PathwayTabActive = "";
        this.DocumentActive = "";
        this.TransitionPlanActive="active";
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder,dynamicFormB,
        FormBuilder, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.PathwayTabActive = "active";
            this.DocumentActive = "";
            this.TransitionPlanActive="";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.PathwayTabActive = "active";
            this.DocumentActive = "";
            this.TransitionPlanActive="";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.PathwayTabActive = "";
            this.TransitionPlanActive="";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        // else {
        //     this.PathwayTabActive = "active";
        //     this.DocumentActive = "";
        // }
        this.objChildPathwayplan.NotificationEmailIds = EmailIds;
        this.objChildPathwayplan.NotificationAddtionalEmailIds = AddtionalEmailIds;
        if (IsUpload) {
            this.submittedUpload = true;
            if (mainFormBuilder.valid && subformbuilder.valid && uploadFormBuilder.valid && dynamicForm != '') {
                this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0) 
                type = "update";         
            dynamicFormB.forEach(item => {
                dynamicForm.push(item);
            });   
            this.objChildPathwayplan.DynamicValue = dynamicForm;
            this.objChildPathwayplan.ChildId = this.ChildID;    
            this.objChildPathwayplan.SequenceNo =this.SequenceNo;    
            this.apiService.save(this.controllerName,this.objChildPathwayplan, type).then(data => this.Respone(data, type, IsUpload));
        }
        }
        else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            dynamicFormB.forEach(item => {
                dynamicForm.push(item);
            });
            
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            this.objChildPathwayplan.DynamicValue = dynamicForm;
            this.objChildPathwayplan.ChildId = this.ChildID;
            this.objChildPathwayplan.SequenceNo =this.SequenceNo;    
            this.apiService.save(this.controllerName,this.objChildPathwayplan, type).then(data => this.Respone(data, type, IsUpload));
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
            this._router.navigate(['/pages/child/childpathwayplanlist/4']);
        }
    }
}