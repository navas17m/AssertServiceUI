import { Component } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { FormNotificationDTO } from './DTO/formnotificationdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
        selector: 'formnotification',
        templateUrl: './formnotification.component.template.html',
})

export class FormNotificationComponent {   
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
    lstFormNotification; arrayUserIds = []; arrFormNotification = [];
    isLoading: boolean = false;
    controllerName = "FormNotification";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=166;
    constructor(private apiService: APICallService, private pComponent: PagesComponent) { 

        this.apiService.get("UserProfile", "GetAllForNotification", parseInt(Common.GetSession("AgencyProfileId"))).then(data => {
            data.forEach(item => {
                this.arrayUserIds.push({ id: item.UserProfileId, name: item.PersonalInfo.FullName + " (" + item.RoleProfile.RoleName + ")" });
            });
            this.apiService.get(this.controllerName, "GetFormNotificationById", parseInt(Common.GetSession("AgencyProfileId"))).then(data => { this.lstFormNotification = data });
        });   

        //userService.GetAllForNotification(Common.GetSession("AgencyProfileId")).then(data => {
        //    data.forEach(item => {
        //        this.arrayUserIds.push({ id: item.UserProfileId, name: item.PersonalInfo.FullName +"("+ item.LoginId +")"});
        //    });
        //    formNotService.GetFormNotificationById(Common.GetSession("AgencyProfileId")).then(data => { this.lstFormNotification = data });
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
        for (let item of this.lstFormNotification) {
            var _insFN = new FormNotificationDTO();
            _insFN.EmailNotificationInfoId = item.EmailNotificationInfoId;
            _insFN.IsSocialWorkerNotified = item.IsSocialWorkerNotified;
            _insFN.IsCarerNotified = item.IsCarerNotified;
            _insFN.arrUserId = item.arrUserId;
            _insFN.AdditionalEmailIds = item.AdditionalEmailIds;
            _insFN.ActiveFlag = item.ActiveFlag;
            this.arrFormNotification.push(_insFN);
        }
        this.apiService.post(this.controllerName, "Update", this.arrFormNotification).then(data => this.Respone(data)); 
        //this.formNotService.Update(this.arrFormNotification).then(data => this.Respone(data)); 
    }

    checkNuncheckAll = false;
    fncheckNuncheckAll(value, checked) {
        this.checkNuncheckAll = !this.checkNuncheckAll;
        if (checked) {
            for (let insAFM of this.lstFormNotification) {                
                insAFM.ActiveFlag = true;
            }
        }
        else {
            for (let insAFM of this.lstFormNotification) {              
                insAFM.ActiveFlag = false;
            }
        } 
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
            this.arrFormNotification = [];
        }

        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
        this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }   
}