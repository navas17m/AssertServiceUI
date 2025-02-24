import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { FormNotificationDTO } from './DTO/formnotificationdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'gdprnotification',
    templateUrl: './gdprnotification.component.template.html',
})

export class GDPRNotification {
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
	arrayUserIds = [];arrGDPRNotification = [];
	GDPRNotificationSetupTabActive = "active";
    GDPRNotificationDetailsTabActive; isLoading: boolean = false;
    GDPRNotificationApplicant90Days=[];GDPRNotificationChild15Years=[];
	GDPRNotificationApplicant3Years=[];GDPRNotificationCarer10Years=[];
	lstGDPRNotification; controllerName = "FormNotification";
    columnsGDPRApplicant=[
        {name:'Applicant Name',prop:'Name',sortable:true},
        {name:'No of Days',prop:'NoOfDays',sortable:true}];
    columnsGDPRCarer=[
        {name:'Carer Name',prop:'Name',sortable:true, width:200},
        {name:'No of Days',prop:'NoOfDays',sortable:true, width:100}];
    columnsGDPRChild=[
        {name:'Child Name',prop:'Name',sortable:true, width:200},
        {name:'No of Days',prop:'NoOfDays',sortable:true, width:100}];
        objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
        FormCnfgId=296;
    constructor(private apiService: APICallService, private _router: Router, private pComponent: PagesComponent) {
        this.apiService.get(this.controllerName, "GetGDPRNotifiation").then(data => { 
		if(data!=null)
		{
				this.GDPRNotificationApplicant90Days = data.GDPRNotificationApplicant90Days;
				this.GDPRNotificationApplicant3Years = data.GDPRNotificationApplicant3Years;
				this.GDPRNotificationCarer10Years = data.GDPRNotificationCarer10Years ;
				this.GDPRNotificationChild15Years=data.GDPRNotificationChild15Years;
		}});
		   this.apiService.get("UserProfile", "GetAllForNotification", parseInt(Common.GetSession("AgencyProfileId"))).then(data => {
            data.forEach(item => {
                this.arrayUserIds.push({ id: item.UserProfileId, name: item.PersonalInfo.FullName + " (" + item.RoleProfile.RoleName + ")" });
            });
            this.apiService.get(this.controllerName, "GetAllGDPR", parseInt(Common.GetSession("AgencyProfileId"))).then(data => { this.lstGDPRNotification = data });
        });  

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
        this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
        this.objUserAuditDetailDTO.RecordNo = parseInt(Common.GetSession("AgencyProfileId"));
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }  
	fnSaveGDPRNotification()
    {
        this.isLoading = true;
        for (let item of this.lstGDPRNotification) {
            var _insFN = new FormNotificationDTO();
            _insFN.EmailNotificationInfoId = item.EmailNotificationInfoId;
            _insFN.IsSocialWorkerNotified = item.IsSocialWorkerNotified;
            _insFN.IsCarerNotified = item.IsCarerNotified;
            _insFN.arrUserId = item.arrUserId;
            _insFN.AdditionalEmailIds = item.AdditionalEmailIds;
            _insFN.ActiveFlag = item.ActiveFlag;
            this.arrGDPRNotification.push(_insFN);
        }
        this.apiService.post(this.controllerName, "UpdateGDPR", this.arrGDPRNotification).then(data => this.Respone(data)); 
    }
    fnGDPRNotificationSetup() {
        this.GDPRNotificationSetupTabActive = "active";
        this.GDPRNotificationDetailsTabActive = "";
    }
    fnGDPRNotificationDetails() {
        this.GDPRNotificationSetupTabActive = "";
        this.GDPRNotificationDetailsTabActive = "active";
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
            this.arrGDPRNotification = [];
        }

         this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
         this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
         this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
         this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
         this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
         Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }  
	checkNuncheckGDPRAll = false;
    fncheckNuncheckGDPRAll(value, checked) {
        this.checkNuncheckGDPRAll = !this.checkNuncheckGDPRAll;
        if (checked) {
            for (let insAFM of this.lstGDPRNotification) {                
                insAFM.ActiveFlag = true;
            }
        }
        else {
            for (let insAFM of this.lstGDPRNotification) {              
                insAFM.ActiveFlag = false;
            }
        } 
    }
}
