import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerHolidayDetailsDTO } from './DTO/holidaydetailsdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
        selector: 'CarerHolidayDetails',
        templateUrl: './holidaydetailslist.component.template.html',
    })

export class CarerHolidayDetailsListComponent {
    public searchText: string = "";
    controllerName = "CarerHolidayDetails";
    lstCarerHolidayDetails = [];
    objCarerHolidayDetailsDTO: CarerHolidayDetailsDTO = new CarerHolidayDetailsDTO();
    returnVal;
    CarerParentId: number;
    loading = false;
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Child',prop:'ChildIds',sortable:true,width:'150'},
      {name:'From Date',prop:'FromDate',sortable:true,width:'150',date:'Y'},
      {name:'To Date',prop:'ToDate',sortable:true,width:'150',date:'Y'},
      {name:'Edit',prop:'Edit',sortable:false,width:'60'},
      {name:'View',prop:'View',sortable:false,width:'60'},
      {name:'Delete',prop:'Delete',sortable:false,width:'60'}
     ];
    FormCnfgId=197;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _router: Router,
        private module: PagesComponent, private apiService: APICallService) {

        if ((Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 30]);
        }
        else {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindCarerHolidayDetails();
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    fnAddData() {
        this._router.navigate(['/pages/fostercarer/holidaydetailsdata/0/3']);
    }

    editCarerHolidayDetails(seqNo) {
        this._router.navigate(['/pages/fostercarer/holidaydetailsdata', seqNo,3]);
    }

    private bindCarerHolidayDetails() {
        this.loading = true;
        this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => {
            this.lstCarerHolidayDetails = data;
            this.loading = false;
        });
    }

    deleteCarerHolidayDetails(SequenceNo) {
        this.objCarerHolidayDetailsDTO.SequenceNo = SequenceNo;
        //this.objCarerHolidayDetailsDTO.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName,this.objCarerHolidayDetailsDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarerHolidayDetails();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objCarerHolidayDetailsDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit(item){
      this.editCarerHolidayDetails(item.SequenceNo);
    }
    onDelete(item){
      this.deleteCarerHolidayDetails(item.SequenceNo);
    }
}
