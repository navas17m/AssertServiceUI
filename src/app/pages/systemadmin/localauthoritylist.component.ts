import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { APICallService } from '../services/apicallservice.service';
import { LocalAuthority } from './DTO/localauthority';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'LocalAuthorityList',
    templateUrl: './localauthoritylist.component.template.html',
})

export class LocalAuthorityListComponent {
    public searchText: string = "";
    rtnTableValue = null;
    objlocalauthority: LocalAuthority = new LocalAuthority(); 
    controllerName = "LocalAuthority";
    formConfigId:number=12;
    columns =[
        {name:'Local Authority',prop:'LocalAuthorityName',sortable:true,width:'200'},
        {name:'Account Reference',prop:'AccountRefference',sortable:true,width:'150'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'}
       ];
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=12;
    constructor(private apiService: APICallService, private _router: Router) {
        this.fillLocalAuthorityList();

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
        this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    fillLocalAuthorityList()
    {
        this.apiService.get(this.controllerName, "getall", parseInt(Common.GetSession("AgencyProfileId"))).then(data => { this.rtnTableValue = data });
        //this._localauthorityService.getLocalAuthorityList(Common.GetSession("AgencyProfileId")).then(data => { this.rtnTableValue = data });
    }

    fnAddData() {
        this._router.navigate(['/pages/systemadmin/localauthority/0']);
    }

    editLocalAuthorityList(editData) {
        this._router.navigate(['/pages/systemadmin/localauthority', editData]);
    }
    onEdit(localAuthority){
        this.editLocalAuthorityList(localAuthority.LocalAuthorityId);
    }
}
