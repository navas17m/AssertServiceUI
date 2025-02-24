import { Component } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { SchedulerCategoryDTO } from './DTO/schedulercategorydto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'schedulernotification',
    templateUrl: './schedulernotification.component.template.html',
})

export class SchedulerNotificationComponent {   
    myOptions: IMultiSelectOption[];
    mySettings: IMultiSelectSettings = {
        pullRight: false,
        enableSearch: false,
        checkedStyle: 'checkboxes',
        buttonClasses: 'btn btn-default',
        selectionLimit: 0,
        closeOnSelect: false,
        showCheckAll: true,
        showUncheckAll: true,
        dynamicTitleMaxItems: 0,        
        maxHeight: '300px',
    };

    myTexts: IMultiSelectTexts = {
        checkAll: 'Check all',
        uncheckAll: 'Uncheck all',
        checked: 'checked',
        checkedPlural: 'checked',
        searchPlaceholder: 'Search...',
        defaultTitle: 'Select',
    };
   
   // @ViewChild('ddFormNotification') ddFormNotification;  
    lstSchedulerNotification; arrayUserIds = []; arrSchedulerNotification = []; lstFrequencyCnfg;
    isLoading: boolean = false;
    controllerName = "SchedulerNotification";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=167;
    constructor(private apiService: APICallService, private pComponent: PagesComponent) {    

        this.apiService.get("UserProfile", "GetAllForNotification", parseInt(Common.GetSession("AgencyProfileId"))).then(data => {
            data.forEach(item => {
                this.arrayUserIds.push({ id: item.UserProfileId, name: item.PersonalInfo.FullName + " (" + item.RoleProfile.RoleName + ")" });
            });
            this.apiService.get(this.controllerName, "GetAll", parseInt(Common.GetSession("AgencyProfileId"))).then(data => {
                data.map((x:any)=>{
                    x.OriginalAdditionalEmailIds=x.AdditionalEmailIds;
                }) 
                this.lstSchedulerNotification = data 
                });
            this.apiService.get(this.controllerName, "GetAllFrequencyCnfg").then(data => { this.lstFrequencyCnfg = data });
        });   

        //userService.GetAllForNotification(Common.GetSession("AgencyProfileId")).then(data => {
        //    data.forEach(item => {
        //        this.arrayUserIds.push({ id: item.UserProfileId, name: item.PersonalInfo.FullName +"("+ item.LoginId +")"});
        //    });
        //    schedularService.GetAll(Common.GetSession("AgencyProfileId")).then(data => { this.lstSchedulerNotification = data });
        //    schedularService.GetAllFrequencyCnfg().then(data => { this.lstFrequencyCnfg = data });
        //});   
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
        this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
        this.objUserAuditDetailDTO.RecordNo = parseInt(Common.GetSession("AgencyProfileId"));
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }  

    fnSaveChanges()
    {
        this.isLoading = true;
        for (let item of this.lstSchedulerNotification) {
            if (item.ActiveFlag != item.OriginalActiveFlag || item.FrequencyCnfgId != item.OriginalFrequencyCnfgId
                || item.FrequencyValue != item.OriginalFrequencyValue || item.NotificationFrequencyCnfgId != item.OriginalNotificationFrequencyCnfgId
                || item.NotificationFrequencyValue != item.OriginalNotificationFrequencyValue || item.IsSocialWorkerNotified != item.OriginalIsSocialWorkerNotified
                || item.IsCarerNotified != item.OriginalIsCarerNotified ||  item.arrUserId != item.OriginalarrUserId
                ||item.AdditionalEmailIds != item.OriginalAdditionalEmailIds) {
                var _insSC = new SchedulerCategoryDTO();
                _insSC.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
                _insSC.SchedulerCategoryCnfgId = item.SchedulerCategoryCnfgId;                
                _insSC.FrequencyCnfgId = item.FrequencyCnfgId;
                _insSC.FrequencyValue = item.FrequencyValue;
                _insSC.NotificationFrequencyCnfgId = item.NotificationFrequencyCnfgId;
                _insSC.NotificationFrequencyValue = item.NotificationFrequencyValue;
                _insSC.IsSocialWorkerNotified = item.IsSocialWorkerNotified;
                _insSC.IsCarerNotified = item.IsCarerNotified;
                _insSC.UserIds = item.UserIds;
                _insSC.ActiveFlag = item.ActiveFlag;
                _insSC.AdditionalEmailIds = item.AdditionalEmailIds;
                _insSC.arrUserId = item.arrUserId;
                this.arrSchedulerNotification.push(_insSC);
            }
        }
        this.apiService.post(this.controllerName, "Update", this.arrSchedulerNotification).then(data => this.Respone(data));
        //this.schedularService.Update(this.arrSchedulerNotification).then(data => this.Respone(data));
    }

    checkNuncheckAll = false;
    fncheckNuncheckAll(value, checked) {
        //this.checkNuncheckAll = !this.checkNuncheckAll;
        //if (checked) {
        //    for (let insAFM of this.lstFormNotification) {                
        //            insAFM.IsActive = true;
        //    }
        //}
        //else {
        //    for (let insAFM of this.lstFormNotification) {              
        //            insAFM.IsActive = false;
        //    }
        //}
    }

    private Respone(data) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.objUserAuditDetailDTO.ActionId =2;
            this.objUserAuditDetailDTO.RecordNo = parseInt(Common.GetSession("AgencyProfileId"));
            this.pComponent.alertSuccess(Common.GetUpdateSuccessfullMsg);
            this.arrSchedulerNotification = [];
        }

        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
        this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }   
}