import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
//import {CarerTransferClosingSummaryService } from '../services/carertransferclosingsummary.service'
import { CarerTransferClosingSummaryDTO } from './DTO/carertransferclosingsummarydto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
        selector: 'carertransferclosingsummarylist',
        templateUrl: './carertransferclosingsummarylist.component.template.html',

    })

export class CarerTransferClosingSummaryListComponent {
    public searchText: string = "";
    controllerName = "CarerTransferClosingSummary";
    lstCarerTransferClosingSummary = [];
    objCarerTransferClosingSummaryDTO: CarerTransferClosingSummaryDTO = new CarerTransferClosingSummaryDTO();
    returnVal;
    CarerParentId: number;
    columns =[
        {name:'Transfer Date',prop:'TransferDate',sortable:true,width:'200',date:'Y'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=61;
    constructor(private _router: Router,
        private module: PagesComponent
        , private apiService: APICallService) {
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 17]);
        }
        else
            this.bindCarerTransferClosingSummary();
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    private bindCarerTransferClosingSummary() {
        // this.ctcsServices.getTransferClosingSummarytList(this.CarerParentId).subscribe(data => this.lstCarerTransferClosingSummary = data);
        this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => this.lstCarerTransferClosingSummary = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/fostercarer/carertransferclosingsummarydata/0']);
    }

    editCarerTransferClosingSummary(CarerTransferClosingSummaryId) {
        this._router.navigate(['/pages/fostercarer/carertransferclosingsummarydata', CarerTransferClosingSummaryId]);
    }

    deleteCarerTransferClosingSummary(SequenceNo) {

        this.objCarerTransferClosingSummaryDTO.SequenceNo = SequenceNo;
        //this.objCarerTransferClosingSummaryDTO.UniqueID = UniqueID;
        //  console.log(this.objCarerTransferClosingSummaryDTO);
        //this.ctcsServices.post(this.objCarerTransferClosingSummaryDTO, "delete").then(data => this.Respone(data));
        this.apiService.delete(this.controllerName, this.objCarerTransferClosingSummaryDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarerTransferClosingSummary();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objCarerTransferClosingSummaryDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit(item){
        this.editCarerTransferClosingSummary(item.SequenceNo);
    }
    onDelete(item){
        this.deleteCarerTransferClosingSummary(item.SequenceNo);
    }
}
