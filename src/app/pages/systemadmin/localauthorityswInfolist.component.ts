import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { LocalAuthoritySWInfoIdDTO } from './DTO/localauthorityswInfodto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'localauthorityswInfolist',
    templateUrl: './localauthorityswInfolist.component.template.html',
    })

export class LocalAuthoritySWInfoListComponent {
    public searchText: string = "";
    lstLocalAuthoritySWInfoIdDTO = [];   
    objLocalAuthoritySWInfoIdDTO: LocalAuthoritySWInfoIdDTO = new LocalAuthoritySWInfoIdDTO();
    returnVal;
    controllerName = "LocalAuthoritySWInfo";
    formConfigId=13;
    columns =[
        {name:'LA Socialworker Name',prop:'LocalAuthoritySWInfoName',sortable:true,width:'100'},
        {name:'LocalAuthority',prop:'LocalAuthorityName',sortable:true,width:'100'},
        {name:'Contact No',prop:'ContactInfo.MobilePhone',sortable:true,width:'80'},
        {name:'Email',prop:'ContactInfo.EmailId',sortable:true,width:'200'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'}
       ];
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=13;
    constructor(private apiService: APICallService, private pComponent: PagesComponent, private _router: Router) {
        this.bindLocalAuthoritySWInfo();

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
        this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    bindLocalAuthoritySWInfo()
    {
        this.apiService.get(this.controllerName, "GetAll", parseInt(Common.GetSession("AgencyProfileId"))).then(data => this.fnReturnValue(data));
        //this._serviceLASW.getAll(Common.GetSession("AgencyProfileId")).then(data => this.fnReturnValue(data));
    }

    fnAddData() {
        this._router.navigate(['/pages/systemadmin/localauthoritysw/0']);
    }

    editLocalAuthoritySWInfo(LocalAuthoritySWInfoId) { 
        this._router.navigate(['/pages/systemadmin/localauthoritysw', LocalAuthoritySWInfoId]);
    }
    
    fnReturnValue(data)
    {       
        this.lstLocalAuthoritySWInfoIdDTO = data;
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindLocalAuthoritySWInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = 0;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
            this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit(LASW){
        this.editLocalAuthoritySWInfo(LASW.LocalAuthoritySWInfoId);
    }
}