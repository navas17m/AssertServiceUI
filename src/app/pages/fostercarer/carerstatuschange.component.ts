import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import {CarerInfoService } from '../services/carerinfo.services'
import { Router } from '@angular/router';
import { Common } from '../common';
//import { ConfigTableValuesService} from '../services/configtablevalues.service'
import { ConfigTableNames } from '../configtablenames';
import { PagesComponent } from '../pages.component';
import { CarerInfo } from '../recruitment/DTO/carerinfo';
//import { CarerStatusChangeService} from '../services/carerstatuschange.service'
import { CarerParentDTO } from '../recruitment/DTO/carerparent';
import { CarerStatusChange, CarerstatusCnfg } from '../recruitment/DTO/carerstatuscnfg';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'FCCarerStatusChange',
    templateUrl: './carerstatuschange.component.template.html',
})

export class CarerStatusChangeComponet {
    @ViewChild('btnEditHistory') btnEditHistory: ElementRef;
    controllerName = "CarerStatusChange";
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objCarerStatusChangeEdit: CarerStatusChange = new CarerStatusChange();
    submitted = false;
    CarerStatusId = null;
    objCarerInfo: CarerInfo = new CarerInfo();
    objCarerInfoSA: CarerInfo = new CarerInfo();
    objCarerstatusCnfg: CarerstatusCnfg = new CarerstatusCnfg();
    objCarerStatusChange: CarerStatusChange = new CarerStatusChange();
    objEditCarerStatusChange: CarerStatusChange = new CarerStatusChange();
    CarerProfileVal: CarerParentDTO = new CarerParentDTO();
    objCarerProfileVal: CarerParentDTO = new CarerParentDTO();
    carerstatusList;
    DateOfStatusChange;
    Comments;
    _Form: FormGroup;
    _FormEdit: FormGroup;
    carerId;
    IsVisibleSC = false;
    carerstatusHistory;
    IsVisibleOnHoldReminderDate = true;
    IsVisibleReasonId = true;
    IsValid = true;
    rejectReasonStr: string;
    IsOnHoldVisible: boolean;
    insCarerDetails;
    CarerParentId: number;
    isLoading: boolean = false;
    lstrejectReson = [];
    lstonHoldReson = [];
    IsAccessble = true;
    lstReason = [];
    formId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=64;
    constructor(private _formBuilder: FormBuilder, private renderer: Renderer2,  private _router: Router,
        private module: PagesComponent,
        private apiService: APICallService) {
        this.formId = 36;
        this._Form = _formBuilder.group({
            CarerStatusId: ['0', Validators.required],
            DateOfStatusChange: ['', Validators.required],
            Comments: [''],
            ReasonId: ['0'],
            OnHoldReminderDate: [''],
            ReasonOther: [],
        });
        this._FormEdit = _formBuilder.group({
            DateOfStatusChange: ['', Validators.required],
            Comments: [''],
            StatusEndDate: [],
        });
        this.IsOnHoldVisible = false;

        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 19]);
        }
        else {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));

            this.CarerParentId = this.insCarerDetails.CarerParentId;// Common.GetSession("ACarerParentId");
            this.BindCarerInfo();
            this.BindCarerstatusHistory();
        }

        this.objConfigTableNamesDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objConfigTableNamesDTO.Name = ConfigTableNames.ApprovedCarerRejectReason;
        // cfvServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.lstrejectReson = data; });
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.lstrejectReson = data; });

        this.objConfigTableNamesDTO.Name = ConfigTableNames.ApprovedOnholdReason;
        // cfvServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.lstonHoldReson = data; });
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.lstonHoldReson = data; });
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnGetGender(genderId) {

        if (genderId != null) {
            switch (genderId) {
                case 1:
                    {
                        return "Male";
                    }
                case 2:
                    {
                        return "Female";
                    }
                case 3:
                    {
                        return "Unknown";
                    }
                case 4:
                    {
                        return "Unborn";
                    }
                case 5:
                    {
                        return "Transgender Male";
                    }
                case 6:
                    {
                        return "Transgender Female";
                    }
                case 7:
                    {
                        return "Gender Variant/Non-Conforming";
                    }
            }
        }


    }

    //ReasonOtherVisible = true;
    //ReasonChange(val) {
    //    this.ReasonOtherVisible = true;

    //    if (val == 4) {
    //        this.ReasonOtherVisible = false;
    //    }
    //}
    onHoldIds: number[] = [5, 8, 11, 14]
    RejectIds: number[] = [6, 9, 12, 15]
    IsRejectVisible = false;
    BindCarerstatusHistory() {

        this.carerId = this.insCarerDetails.CarerId;// Common.GetSession("ACarerId");
        let objCarerStatusChange: CarerStatusChange = new CarerStatusChange();
        objCarerStatusChange.CarerId = this.carerId;
        objCarerStatusChange.TypeId = 2;
        objCarerStatusChange.CarerParentId = this.CarerParentId;

        if (this.carerId != 0 && this.carerId != null) {
            this.apiService.post(this.controllerName, "GetByCarerId", objCarerStatusChange).then(data => {
                //  this.cStatusServices.getCarerStatusHistoryByCarerId(objCarerStatusChange).then(data => {
                this.carerstatusHistory = data;
                if (data != null && data.length > 0)
                    this.objEditCarerStatusChange = data[0];

            });
        }
    }

    BindCarerInfo() {

        //Get Carer Info
        this.objCarerInfo.CarerParentId = this.CarerParentId;
        if (this.objCarerInfo.CarerParentId != 0 && this.objCarerInfo.CarerParentId != null) {
            // this.carerInfoServices.GetByCarerParentId(this.objCarerInfo.CarerParentId).then(data => { this.BindCarerDetails(data); });
            this.apiService.get("CarerInfo", "GetByCarerParentId", this.objCarerInfo.CarerParentId).then(data => { this.BindCarerDetails(data); });
        }
    }

    BindCarerDetails(data: CarerInfo[]) {
        if (data[0] != null) {
            this.objCarerInfo = data[0];
           //console.log(this.objCarerInfo.IsChildPlaced);
            if (this.objCarerInfo.IsChildPlaced != 0)
                this.IsAccessble = false;
            //  if (this.objCarerInfo.)
            this.objCarerstatusCnfg.CarerStatusId = this.objCarerInfo.CarerStatusId;
            this.BindCarerStatus();
        }
        if (data[1] != null) {
            this.objCarerInfoSA = data[1];
            this.IsVisibleSC = true;
        }
    }


    BindCarerStatus() {
        if (this.objCarerstatusCnfg.CarerStatusId != 0) {
            // this.cStatusServices.getStatusList(this.objCarerstatusCnfg).then(data => this.carerstatusList = data);
            this.apiService.post("ModuleStausCnfg", "GetByParentId", this.objCarerstatusCnfg).then(data => this.carerstatusList = data);
        }
    }
    statusName;
    statusId;
    statusChange(val) {

        this.statusName = this.carerstatusList.find((item: any) => item.ModuleStatusCnfgId == val).StatusName;
        if (val != 0) {

            //this.ReasonChange(1);
            //   this.objCarerStatusChange.ReasonId = null;
            const value = this.carerstatusList.find((item: any) => item.ModuleStatusCnfgId == val).StatusName;


            if (val != 4) {
                this.IsVisibleReasonId = false;
                this.lstReason = [];
                if (val == 15 || val == 16) {
                    this.lstReason = this.lstrejectReson;
                }
                else if (val == 14) {
                    this.lstReason = this.lstonHoldReson;
                }

            }
            else {
                this.IsVisibleReasonId = true;
            }

            var index = value.indexOf("hold");
            if (index === -1) {

                this.IsVisibleOnHoldReminderDate = true;
            } else {

                this.IsVisibleOnHoldReminderDate = false;
            }
        }
    }

    Isok = false;
    IsValidOnHoldReminderDate = true;
    IsValidReasonId = true;
    clicksubmit(form, AddtionalEmailIds, EmailIds) {
        this.submitted = true;
        this.Isok = false;
        this.IsValidOnHoldReminderDate = true;
        this.IsValidReasonId = true;

        if (!this.IsVisibleOnHoldReminderDate && !this.objCarerStatusChange.OnHoldReminderDate) {
            this.IsValidOnHoldReminderDate = false;
        }
        else {
            this.IsValidOnHoldReminderDate = true;
        }


        if (!this.IsVisibleReasonId && (this.objCarerStatusChange.ReasonId == null || this.objCarerStatusChange.ReasonId == 0)) {
            this.IsValidReasonId = false;
        } else {
            this.IsValidReasonId = true;
        }

        if (!form.valid) {
            this.module.GetErrorFocus(form);
        }

        if (form.valid) {
            this.Isok = true;
        }

        if (this.Isok && this.IsValidOnHoldReminderDate && this.IsValidReasonId) {
            this.isLoading = true;
            let type = "save";
            this.carerId = this.insCarerDetails.CarerId;// Common.GetSession("ACarerId");
            this.objCarerStatusChange.CarerId = this.carerId;
            this.objCarerStatusChange.CarerParentId = this.insCarerDetails.CarerParentId;
            this.objCarerStatusChange.NotificationEmailIds = EmailIds;
            this.objCarerStatusChange.NotificationAddtionalEmailIds = AddtionalEmailIds;

            this.objCarerStatusChange.OnHoldReminderDate = this.module.GetDateSaveFormat(this.objCarerStatusChange.OnHoldReminderDate);
            this.objCarerStatusChange.ChangeDate= this.module.GetDateSaveFormat(this.objCarerStatusChange.ChangeDate);
            this.apiService.save(this.controllerName, this.objCarerStatusChange, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {

            if (type == "save") {
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =1;
            }
            else {
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =2;
            }
            this.statusId = this.objCarerStatusChange.StatusId

            this.CarerProfileVal.PCFullName = this.insCarerDetails.PCFullName;
            this.CarerProfileVal.SCFullName = this.insCarerDetails.SCFullName;
            this.CarerProfileVal.CarerCode = this.insCarerDetails.CarerCode;
            this.CarerProfileVal.CarerParentId = this.insCarerDetails.CarerParentId;
            this.CarerProfileVal.CarerId = this.insCarerDetails.CarerId;
            this.CarerProfileVal.CarerStatusName = this.statusName;
            this.CarerProfileVal.CarerStatusId = this.statusId;
            this.CarerProfileVal.ContactInfo.City = this.insCarerDetails.ContactInfo.City;
            this.CarerProfileVal.AreaOfficeName = this.insCarerDetails.AreaOfficeName;
            this.CarerProfileVal.ApprovalDate = this.insCarerDetails.ApprovalDate;
            this.CarerProfileVal.PersonalInfo.ImageId = this.insCarerDetails.PersonalInfo.ImageId;
            this.CarerProfileVal.AvailableVacancies = this.insCarerDetails.AvailableVacancies;
            this.CarerProfileVal.ApproveVacancies = this.insCarerDetails.ApproveVacancies;
            this.CarerProfileVal.SupervisingSocialWorker = this.insCarerDetails.SupervisingSocialWorker;
            this.objCarerProfileVal = this.CarerProfileVal;
            Common.SetSession("SelectedCarerProfile", JSON.stringify(this.CarerProfileVal));
            this._router.navigate(['/pages/fostercarer/approvedcarerlist/13']);

            this.objCarerStatusChange.StatusId = null;
            this.objCarerStatusChange.ChangeDate = null;
            this.objCarerStatusChange.Comments = null;
            this.IsVisibleOnHoldReminderDate = true;
            this.IsVisibleReasonId = true;
            // this.ReasonOtherVisible = true;

            this.submitted = false;
            this.BindCarerInfo();
            this.BindCarerstatusHistory();
            //   this._router.navigate(['/SafercarePolicyList']);
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    statusEndDataLabelName2 = "";
    fnEditHistory(CarerStatusChangeId) {
        let details = this.carerstatusHistory.filter(x => x.CarerStatusChangeId == CarerStatusChangeId);
        if (details.length > 0) {
            this.CopyProperty(details[0], this.objCarerStatusChangeEdit);
            this.objCarerStatusChangeEdit.StatusEndDate = this.module.GetDateEditFormat(this.objCarerStatusChangeEdit.StatusEndDate);
            this.objCarerStatusChangeEdit.ChangeDate = this.module.GetDateEditFormat(this.objCarerStatusChangeEdit.ChangeDate);

            if (this.objCarerStatusChangeEdit.StatusId == 4) {
                this.statusEndDataLabelName2 = "Stage 2 End Date";
            }
        }
        let event = new MouseEvent('click', { bubbles: true });
        this.btnEditHistory.nativeElement.dispatchEvent(event);
    }

    private CopyProperty(souerce: CarerStatusChange, target: CarerStatusChange) {
        target.StatusEndDate = souerce.StatusEndDate;
        target.ChangeDate = souerce.ChangeDate;
        target.Comments = souerce.Comments;
        target.CarerStatusChangeId = souerce.CarerStatusChangeId;
        target.StatusName = souerce.StatusName;
        target.StatusId = souerce.StatusId;
    }

    fnUpdateHistory() {
        if (this._FormEdit.valid) {
            this.isLoading = true;
            this.objCarerStatusChangeEdit.ChangeDate = this.module.GetDateSaveFormat(this.objCarerStatusChangeEdit.ChangeDate);
            this.objCarerStatusChangeEdit.StatusEndDate = this.module.GetDateSaveFormat(this.objCarerStatusChangeEdit.StatusEndDate);
            this.apiService.save(this.controllerName, this.objCarerStatusChangeEdit, "update").then(data => this.ResponeEdit(data));

        }

    }

    private ResponeEdit(data) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
            let event = new MouseEvent('click', { bubbles: true });
            this.btnEditHistory.nativeElement.dispatchEvent(event);
            this.BindCarerstatusHistory();
            this.objUserAuditDetailDTO.ActionId=2
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

}
