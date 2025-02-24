import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildSchoolReportsDTO } from './DTO/childschoolreportsdto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
     selector: 'ChildSchoolReportsList',
     templateUrl: './childschoolreportslist.components.template.html',
    })

export class ChildSchoolReportsListComponent {
    public searchText: string = "";
    lstChildSchoolReportsInfo = [];
    childSchoolReportsInfoList = [];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Report',prop:'DateofReport',sortable:true,width:'300',date:'Y'},
        {name:'School the Child Attends',prop:'SchoolName',sortable:true,width:'300'},
        {name:'Edit',prop:'Edit',sortable:false,width:'100'},
        {name:'View',prop:'View',sortable:false,width:'100'},
        {name:'Delete',prop:'Delete',sortable:false,width:'100'}
       ];
    ChildID: number;
    objChildSchoolReportsDTO: ChildSchoolReportsDTO = new ChildSchoolReportsDTO();
    returnVal; controllerName = "ChildSchoolReport";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=288;   
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildSchoolReports();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/schoolreportslist/18");
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

    private bindChildSchoolReports() {
        //this.apiService.get(this.controllerName, "GetAllByChildId", this.ChildID).then(data => this.lstChildSchoolReportsInfo = data);
        this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data => this.childSchoolReportsInfoList = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/child/schoolreportsdata/0/16']);
    }

    editChildSchoolReports(ChildSchoolReportsId) {
        this._router.navigate(['/pages/child/schoolreportsdata', ChildSchoolReportsId, 16]);
    }

    deleteChildSchoolReports(SequenceNo) {
        this.objChildSchoolReportsDTO.SequenceNo = SequenceNo;
        //this.objChildSchoolReportsDTO.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildSchoolReportsDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildSchoolReports();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildSchoolReportsDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildSchoolReports($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildSchoolReports($event.SequenceNo);
    }
}