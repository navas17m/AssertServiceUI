import { Component} from '@angular/core';
import { ChildSanctionDetailsDTO } from './DTO/childsanctiondetailsdto'
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childsanctiondetailslist',
    templateUrl: './childsanctiondetailslist.component.template.html',
    })

export class ChildSanctionDetailsListComponent {
    public searchText: string = "";
    public loading:boolean = false;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Sanction Date',prop:'DateofSanction',sortable:true,width:'300'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    lstChildSanctionDetails = [];
    ChildID: number;
    objChildSanctionDetails: ChildSanctionDetailsDTO = new ChildSanctionDetailsDTO();
    returnVal; controllerName = "ChildSanctionDetails"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=99;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildSanctionDetails();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childsanctiondetailslist/4");
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

    private bindChildSanctionDetails() {
        this.loading=true;
        this.apiService.get(this.controllerName,"GetList",this.ChildID).then(data => 
            { this.lstChildSanctionDetails = data;
            this.loading=false; });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childsanctiondetails/0/4']);
    }

    editChildSanctionDetails(ChildSanctionId) {
        this._router.navigate(['/pages/child/childsanctiondetails', ChildSanctionId,4]);
    }

    deleteChildSanctionDetails(SequenceNo) {
        this.objChildSanctionDetails.SequenceNo = SequenceNo;
        //this.objChildSanctionDetails.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildSanctionDetails).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildSanctionDetails();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildSanctionDetails.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildSanctionDetails($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildSanctionDetails($event.SequenceNo);
    }
}