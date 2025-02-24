import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildHolidayDetailsInfo } from './DTO/childholidaydetailsinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
    selector: 'childholidaydetailsinfolist',
    templateUrl: './childholidaydetailsinfolist.component.template.html',
    })

export class ChildHolidayDetailsInfoListComponent {
    public searchText: string = "";
    lstChildHolidayDetailsInfo = [];
    public loading:boolean = false;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'From Date',prop:'FromDate',sortable:true,width:'300',date:'Y'},
        {name:'To Date',prop:'ToDate',sortable:true,width:'300',date:'Y'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    ChildID: number;
    objChildHolidayDetailsInfo: ChildHolidayDetailsInfo = new ChildHolidayDetailsInfo();
    returnVal; controllerName = "ChildHolidayDetailsInfo"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=93;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildHolidayDetailsInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childholidaydetailsinfolist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/4']);
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

    private bindChildHolidayDetailsInfo() {
        this.loading=true;
        this.apiService.get(this.controllerName,"GetListByChildId",this.ChildID).then(data => 
            {
                this.lstChildHolidayDetailsInfo = data;
                this.loading=false;
            });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childholidaydetailsinfo/0/4']);
    }

    editChildHolidayDetailsInfo(ChildHolidayDetailsInfoId) {
        this._router.navigate(['/pages/child/childholidaydetailsinfo', ChildHolidayDetailsInfoId,4]);
    }    

    deleteChildHolidayDetailsInfo(SequenceNo) {
        this.objChildHolidayDetailsInfo.SequenceNo = SequenceNo;
        //this.objChildHolidayDetailsInfo.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildHolidayDetailsInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildHolidayDetailsInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildHolidayDetailsInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildHolidayDetailsInfo($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildHolidayDetailsInfo($event.SequenceNo);
    }
}