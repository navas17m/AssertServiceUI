import { Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildHealthTherapyInfo } from './DTO/childhealththerapyinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
        selector: 'childhealththerapyinfolistnew',
        templateUrl: './childhealththerapyinfonewlist.component.template.html',
    })

export class ChildHealthTherapyInfoNewListComponent {
    public searchText: string = "";
    lstChildHealthTherapyInfo = [];
    lstChildHealthTherapyInfoNew = [];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Name of Worker',prop:'NameofWorker',sortable:true,width:'200'},
        {name:'Date Report Completed',prop:'DateReportCompleted',sortable:true,width:'300'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        ];
    ChildID: number;
    objChildHealthTherapyInfo: ChildHealthTherapyInfo = new ChildHealthTherapyInfo();
    returnVal;
    objQeryVal; controllerName = "ChildHealthTherapyInfo";
    AgencyProfileId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=292;
    constructor(private apiService: APICallService,
        private _router: Router, private modal: PagesComponent,
        private route: ActivatedRoute) {
        this.AgencyProfileId = Common.GetSession("AgencyProfileId");
        this.route.params.subscribe(data => this.objQeryVal = data);
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildHealthTherapyInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childhealththerapyinfonewlist/19");
            this._router.navigate(['/pages/referral/childprofilelist/1/19']);
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

    private bindChildHealthTherapyInfo() {
        //this.apiService.get(this.controllerName, "GetTherapyInfoNewByChildId", this.ChildID).then(data => this.lstChildHealthTherapyInfo = data);
        this.apiService.get(this.controllerName, "GetTherapyInfoNewListByChildId", this.ChildID).then(data => this.lstChildHealthTherapyInfoNew = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childhealththerapyinfonew/0/19']);
    }

    editChildHealthTherapyInfo(ChildHealthTherapyInfoId) {
        this._router.navigate(['/pages/child/childhealththerapyinfonew', ChildHealthTherapyInfoId, this.objQeryVal.mid]);
    }

    deleteChildHealthTherapyInfo(SequenceNo) {
        this.objChildHealthTherapyInfo.SequenceNo = SequenceNo;
        //this.objChildHealthTherapyInfo.UniqueID = UniqueID;
        this.apiService.post(this.controllerName,"DeleteTherapyInfoNew", this.objChildHealthTherapyInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildHealthTherapyInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildHealthTherapyInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildHealthTherapyInfo($event.SequenceNo)
    }
    onDelete($event){
        this.deleteChildHealthTherapyInfo($event.SequenceNo)
    }
}