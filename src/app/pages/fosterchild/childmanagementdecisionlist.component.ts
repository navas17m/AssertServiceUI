import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildManagementDecisionDTO } from './DTO/childmanagementdecisiondto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'ChildManagementDecisionList',
    templateUrl: './childmanagementdecisionlist.component.template.html'
    })

export class ChildManagementDecisionListComponent {
    public searchText: string = "";
    lstManagementDecision = [];
    childManagementDecisionList = [];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date',prop:'Date',sortable:true,width:'100'},
        {name:'Subject',prop:'Subject',sortable:true,width:'100'},
        {name:'Edit',prop:'Edit',sortable:false,width:'100'},
        {name:'View',prop:'View',sortable:false,width:'100'},
        {name:'Delete',prop:'Delete',sortable:false,width:'100'}
       ];
    ChildID: number;
    objChildManagementDecisionDTO: ChildManagementDecisionDTO = new ChildManagementDecisionDTO();
    returnVal; controllerName = "ChildManagementDecision";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=281;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId") );
            this.bindChildManagementDecision();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childmanagementdecisionlist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    private bindChildManagementDecision() {
        this.objChildManagementDecisionDTO.ChildId = this.ChildID;
        //this.apiService.post(this.controllerName, "GetAllByChildId", this.objChildManagementDecisionDTO).then(data => { this.lstManagementDecision = data; });
        this.apiService.post(this.controllerName, "GetListByChildId", this.objChildManagementDecisionDTO).then(data => { this.childManagementDecisionList = data; });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childmanagementdecisiondata/0/4']);
    }

    edit(ChildManagementDecisionId) {
        this._router.navigate(['./pages/child/childmanagementdecisiondata', ChildManagementDecisionId, 4]);
    }

    delete(SequenceNo) {
        this.objChildManagementDecisionDTO.SequenceNo = SequenceNo;
        //this.objChildManagementDecisionDTO.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildManagementDecisionDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildManagementDecision();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildManagementDecisionDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.edit($event.SequenceNo);
    }
    onDelete($event){
        this.delete($event.SequenceNo);
    }
}