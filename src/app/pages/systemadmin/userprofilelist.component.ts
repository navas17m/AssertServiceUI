import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserProfile } from './DTO/userprofile';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'userprofilelist',
    templateUrl: './userprofilelist.component.template.html',
})

export class UserProfileListComponet {
    public searchText:string;
    @ViewChild('btnConfirmLock') btnConfirmLock: ElementRef;
    @ViewChild('btnConfirmUnLock') btnConfirmUnLock: ElementRef;
    @ViewChild('btnConfirmResetSecretQue') btnConfirmResetSecretQue: ElementRef;
    objUserProfile: UserProfile = new UserProfile();
    userprofileListOrginal = null;
    userprofileList = [];
    showActiveUser = true;
    controllerName = "UserProfile";
    loading = false;
    limitPerPage:number=10;
    UserLicenseCount = 0;
    UsedLicenseCount = 0;
    PanleUserLicenseCount = 0;
    PanelUsedLicenseCount = 0;
    insLicenseType = false;

    insLockResetBtnVisible = false;
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=17;
    constructor(private renderer: Renderer2, private apiService: APICallService, private pComponent: PagesComponent, private _router: Router) {
        this.fillUserProfileList();

        this.insLockResetBtnVisible = this.pComponent.GetEditBtnAccessPermission(17);

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
        this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    fillUserProfileList() {
        this.loading = true;
        this.apiService.get(this.controllerName, "getall",this.showActiveUser).then(data => {
            this.userprofileList = data;
            //  console.log(this.userprofileListOrginal);
            this.loading = false;
        });

        this.apiService.get(this.controllerName, "GetUsesrLicenseCount").then(data => {
            this.UserLicenseCount = data.UserLicenseCount;
            this.UsedLicenseCount = data.UsedLicenseCount;
            this.PanleUserLicenseCount = data.PanleUserLicenseCount;
            this.PanelUsedLicenseCount = data.PanelUsedLicenseCount;
            this.insLicenseType = data.LicenseType;
        });
        //this._upService.getall().subscribe(data => {
        //    this.userprofileListOrginal = data;
        //    this.fnUserShow();
        //});
    }

    fnUserShow() {
        //this.userprofileList = this.userprofileListOrginal;
        this.showActiveUser = !this.showActiveUser;
        //this.userprofileList = this.userprofileList.filter(x => x.ActiveFlag == this.showActiveUser);
        this.apiService.get(this.controllerName, "getall",this.showActiveUser).then(data => {
            this.userprofileList = data;
            this.loading = false;
        });
    }

    fnPwdChange(uid) {
        this._router.navigate(['/pages/systemadmin/userpasswordchange', uid]);
    }

    fnActiveDeactiveUser(uid) {
        this._router.navigate(['/pages/systemadmin/useractivedeactive', uid]);
    }

    fnAddData() {
        this._router.navigate(['/pages/systemadmin/userprofiledata/0']);
    }

    editUserProfile(editData) {
        this._router.navigate(['/pages/systemadmin/userprofiledata', editData]);
    }

    deleteId = 0;
    deleteUserProfile(delData) {
        this.deleteId = delData;
        this.apiService.delete(this.controllerName, delData).then(data => this.Respone(data));
        //this._upService.post(delData, "delete").then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.fillUserProfileList();
            this.fnUserShow();

            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.deleteId;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
            this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }


    confirmMsg = "";
    fnLockConfirm(userId) {
        this.objUserProfile.UserProfileId = userId;
        let event = new MouseEvent('click', { bubbles: true });
        this.btnConfirmLock.nativeElement.dispatchEvent(event);
    }

    fnunLockConfirm(userId) {
        this.objUserProfile.UserProfileId = userId;
        let event = new MouseEvent('click', { bubbles: true });
        this.btnConfirmUnLock.nativeElement.dispatchEvent(event);

    }
    fnResetSecretQue(userId) {
        this.objUserProfile.UserProfileId = userId;
        let event = new MouseEvent('click', { bubbles: true });
        this.btnConfirmResetSecretQue.nativeElement.dispatchEvent(event);

    }

    fnSubmitResetSecreQue() {
        if (this.objUserProfile.UserProfileId != 0)
            this.apiService.post(this.controllerName, "ResetUserSecretQue", this.objUserProfile).then(data => this.ResponeLock(data, 'reset'));


    }

    fnCalcel() {
        this.objUserProfile.UserProfileId = 0;
    }

    fnSubmitLockUnlock() {
        if (this.objUserProfile.UserProfileId != 0)
            this.apiService.post(this.controllerName, "UpdateUserLockUnLock", this.objUserProfile).then(data => this.ResponeLock(data, 'lock'));
    }

    ResponeLock(data, type) {
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type != 'reset') {
                let temp = this.userprofileList.filter(x => x.UserProfileId == this.objUserProfile.UserProfileId);
                if (temp.length > 0) {
                    temp[0].IsAccountLocked = !temp[0].IsAccountLocked;

                    if (temp[0].IsAccountLocked == true)
                        this.pComponent.alertSuccess("User account locked successfully");
                    else
                        this.pComponent.alertSuccess("User account unlocked successfully");
                }
            }
            else
                this.pComponent.alertSuccess("User secret question and answer reseted successfully");
            this.objUserProfile.UserProfileId = 0;
        }
    }
    setPageSize(pageSize:string)
    {
      this.limitPerPage = parseInt(pageSize);
    }
}
