import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildEducationOutofSchoolActivityInfo } from './DTO/childeducationoutofschoolactivityinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childeducationoutofschoolactivityinfolist',
    templateUrl: './childeducationoutofschoolactivityinfolist.component.template.html',
    })

export class ChildEducationOutofSchoolActivityInfoListComponent {
    public searchText: string = "";
    loading:boolean=false;
    childEducationOutofSchoolActivityInfoList=[];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'From Date',prop:'ActivityFromDate',sortable:true,width:'200',date:'Y'},
        {name:'To Date',prop:'ActivityToDate',sortable:true,width:'200',date:'Y'},
        {name:'Activity Type',prop:'ActivityType',sortable:true,width:'300'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'view',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    lstChildEducationOutofSchoolActivityInfo = [];
    ChildID: number;
    objChildEducationOutofSchoolActivityInfo: ChildEducationOutofSchoolActivityInfo = new ChildEducationOutofSchoolActivityInfo();
    returnVal; controllerName = "ChildEducationOutofSchoolActivityInfo"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=105;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));;
            this.bindChildEducationOutofSchoolActivityInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childeducationoutofschoolactivityinfolist/18");
            this._router.navigate(['/pages/referral/childprofilelist/1/18']);
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    private bindChildEducationOutofSchoolActivityInfo() {
        this.loading = true;
        this.apiService.get(this.controllerName,"GetList", this.ChildID).then(data =>
            { this.childEducationOutofSchoolActivityInfoList = data;
              this.loading= false;
            });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childeducationoutofschoolactivityinfo/0/16']);
    }

    editChildEducationOutofSchoolActivityInfo(ChildEducationOutofSchoolActivityInfoId) { 
        this._router.navigate(['/pages/child/childeducationoutofschoolactivityinfo', ChildEducationOutofSchoolActivityInfoId,16]);
    }

    deleteChildEducationOutofSchoolActivityInfo(SequenceNo) {            
        this.objChildEducationOutofSchoolActivityInfo.SequenceNo = SequenceNo;
        this.apiService.delete(this.controllerName, this.objChildEducationOutofSchoolActivityInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);           
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);           
            this.bindChildEducationOutofSchoolActivityInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildEducationOutofSchoolActivityInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildEducationOutofSchoolActivityInfo($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildEducationOutofSchoolActivityInfo($event.SequenceNo);
    }
}