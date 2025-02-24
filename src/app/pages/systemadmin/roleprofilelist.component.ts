import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
        selector: 'roleprofilelist',
        templateUrl: './roleprofilelist.component.template.html',
    })

export class RoleProfileListComponent
{
    public searchText: string = "";
    returnVal=[];
    AgencyProfileId: number;
    controllerName = "RoleProfile";
    loading=false;
    limitPerPage:number=10;
    footerMessage = {
      'emptyMessage' : '',
      'totalMessage' : ' - Role profiles'
    }
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=16;
    constructor(private apiService: APICallService, private module: PagesComponent, private _router: Router)
    {
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.bindRoleProfile();

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
        this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    bindRoleProfile() {
        this.loading = true;
        this.apiService.get(this.controllerName, "GetAll", this.AgencyProfileId).then(data =>
            {
                this.returnVal = data;
                this.loading = false;
            });
        //this._roleprofileService.getRoleProfiles(this.AgencyProfileId).subscribe(data => this.returnVal = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/systemadmin/roleprofiledata/0']);
    }

    editRoleProfile(editRoleProfiles){
        this._router.navigate(['/pages/systemadmin/roleprofiledata', editRoleProfiles]);
    }
    deleteId = 0;
    deleteRoleProfile(roleProfileId){
        this.deleteId = roleProfileId;
        this.apiService.delete(this.controllerName, roleProfileId).then(data => this.Respone(data));
            //this._roleprofileService.postRoleProfile(deleteRoleProfiles, "delete").then(data => this.Respone(data));
    }

    private Respone(data)
    {
        if (data.IsError == true){
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false){
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindRoleProfile();
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
    onEdit(item){
        this.editRoleProfile(item.RoleProfileId);
    }
    onDelete(item){
        this.deleteRoleProfile(item.RoleProfileId);
    }
    setPageSize(pageSize:string)
    {
      this.limitPerPage = parseInt(pageSize);
    }
}
