import { Component} from '@angular/core';
import { ChildMissingPlacementDTO } from './DTO/childmissingplacementdto'
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childmissingplacementlist',
    templateUrl: './childmissingplacementlist.component.template.html',
    })

export class ChildMissingPlacementListComponent {
    public searchText: string = "";
    lstChildMissingPlacement = [];
    lstChildMissingPlacementTotal;
    public loading:boolean = false;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Child Missing Date',prop:'ChildMissingFromDate',sortable:true,width:'200',datetime:'Y'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        ];

    ChildID: number;
    objChildMissingPlacement: ChildMissingPlacementDTO = new ChildMissingPlacementDTO();
    returnVal; controllerName = "ChildMissingPlacement"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=92;
    constructor(private apiService: APICallService,  private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildSanctionDetails();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childmissingplacementlist/4");
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
        this.loading = true;;

        this.apiService.get(this.controllerName, "GetList", this.ChildID).then(data => { 
            this.lstChildMissingPlacement = data;
        this.loading = false; });
        this.apiService.get(this.controllerName, "ChildMissingPlacementTotal", this.ChildID).then(data => { this.lstChildMissingPlacementTotal = data });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childmissingplacement/0/4']);
    }

    editChildSanctionDetails(ChildHealthTherapyInfoId) {
        this._router.navigate(['/pages/child/childmissingplacement', ChildHealthTherapyInfoId,4]);
    }
        
    deleteChildSanctionDetails(SequenceNo) {
        this.objChildMissingPlacement.SequenceNo = SequenceNo;
        //this.objChildMissingPlacement.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildMissingPlacement).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildSanctionDetails();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildMissingPlacement.SequenceNo;
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