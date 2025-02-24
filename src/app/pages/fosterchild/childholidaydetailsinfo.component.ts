import { Component, Pipe, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Common }  from  '../common'
import { Location } from '@angular/common';
import { ChildHolidayDetailsInfo } from './DTO/childholidaydetailsinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import { ValChangeDTO} from '../dynamic/ValChangeDTO';
import * as moment from 'moment';

//.@Pipe({ name: 'groupBy' })
@Component({
        selector: 'childholidaydetailsinfo',
        templateUrl: './childholidaydetailsinfo.component.template.html',
})

export class ChildHolidayDetailsInfoComponent {
    objChildHolidayDetailsInfo: ChildHolidayDetailsInfo = new ChildHolidayDetailsInfo();
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
    HolidayTabActive = "active";
    DocumentActive;
    isLoading: boolean = false; controllerName = "ChildHolidayDetailsInfo"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=93;
    constructor(private apiService: APICallService,private location: Location, private _formBuilder: FormBuilder, 
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {
        
        if (Common.GetSession("ChildId") != null)
            this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildHolidayDetailsInfo.AgencyProfileId = this.AgencyProfileId;
        this.objChildHolidayDetailsInfo.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objChildHolidayDetailsInfo.SequenceNo = this.SequenceNo;
            this.tblPrimaryKey = this.SequenceNo;
        } else {
            this.objChildHolidayDetailsInfo.SequenceNo = 0;
        }

        apiService.post(this.controllerName,"GetDynamicControls",this.objChildHolidayDetailsInfo).then(data => { this.dynamicformcontrol = data; });
        //Doc
        this.formId = 93;
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

    fnHolidayTab() {
        this.HolidayTabActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.HolidayTabActive = "";
        this.DocumentActive = "active";
    }

    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
        this.submitted = true;

        if (!mainFormBuilder.valid) {
            this.HolidayTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(mainFormBuilder);
        } else if (!subformbuilder.valid) {
            this.HolidayTabActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.HolidayTabActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.HolidayTabActive = "active";
            this.DocumentActive = "";
        }
        this.objChildHolidayDetailsInfo.NotificationEmailIds = EmailIds;
        this.objChildHolidayDetailsInfo.NotificationAddtionalEmailIds = AddtionalEmailIds;
        if (IsUpload) {
            this.submittedUpload = true;
            if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0)
                    type = "update";
                this.objChildHolidayDetailsInfo.DynamicValue = dynamicForm;
                this.objChildHolidayDetailsInfo.ChildId = this.ChildID;
                this.apiService.save(this.controllerName,this.objChildHolidayDetailsInfo, type).then(data => this.Respone(data, type, IsUpload));
            }
        }
        else if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
            this.objChildHolidayDetailsInfo.DynamicValue = dynamicForm;
            this.objChildHolidayDetailsInfo.ChildId = this.ChildID;
            this.apiService.save(this.controllerName,this.objChildHolidayDetailsInfo, type).then(data => this.Respone(data, type, IsUpload));
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
            this._router.navigate(['/pages/child/childholidaydetailsinfolist/4']);
        }
    }
    DynamicOnValChange(InsValChange: ValChangeDTO) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "SiblingParentSno") {
            InsValChange.currnet.IsVisible = false;
        }       
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
           if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord") {
               InsValChange.currnet.IsVisible = false;
           }
        }
        if(Common.GetSession("HasChildSiblings")=='false')
        {
            if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord")
                InsValChange.currnet.IsVisible = false;
        }
        

        if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord") {
            if (InsValChange.newValue == "1" || InsValChange.newValue == true)
             {
              InsValChange.all.forEach(item => {
                  if (item.FieldCnfg.FieldName == "SelectSiblings")
                      item.IsVisible = true;
              });
            }
          else {
              InsValChange.all.forEach(item => {
                  if (item.FieldCnfg.FieldName == "SelectSiblings")
                      item.IsVisible = false;
              });
          }
      }

    }
}