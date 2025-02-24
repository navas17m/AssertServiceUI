import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
//import {CarerPlacementRefusalInfoService } from '../services/carerplacementrefusalinfo.service'
import { CarerPlacementRefusalInfoDTO } from './DTO/carerplacementrefusalinfodto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
        selector: 'carerplacementrefusalinfolist',
        templateUrl: './carerplacementrefusalinfolist.component.template.html',
    })

export class CarerPlacementRefusalInfoListComponent {
    public searchText: string = "";
    controllerName = "CarerPlacementRefusalInfo";
    lstCarerPlacementRefusalInfo = [];
    objCarerPlacementRefusalInfoDTO: CarerPlacementRefusalInfoDTO = new CarerPlacementRefusalInfoDTO();
    returnVal;
    CarerParentId: number;
    columns =[
        {name:'Placement Offered Date',prop:'PlacementOfferedDate',sortable:true,width:'200',date:'Y'},
        {name:'Placement Refusal Date',prop:'PlacementRefusalDate',sortable:true,width:'200',date:'Y'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        ];
    FormCnfgId=56;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _router: Router,
        private module: PagesComponent, private apiService: APICallService) {

        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist/3/23']);
        }
        else
            this.bindCarerPlacementRefusalInfo();
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    private bindCarerPlacementRefusalInfo() {
        this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => this.lstCarerPlacementRefusalInfo = data);
        //  this.cpriServices.getPlacementRefusalInfotList(this.CarerParentId).subscribe(data => this.lstCarerPlacementRefusalInfo = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/fostercarer/carerplacementrefusalinfodata/0']);
    }

    editCarerPlacementRefusalInfo(CarerPlacementRefusalInfoId) {
        this._router.navigate(['/pages/fostercarer/carerplacementrefusalinfodata', CarerPlacementRefusalInfoId]);
    }

    deleteCarerPlacementRefusalInfo(SequenceNo) {

        this.objCarerPlacementRefusalInfoDTO.SequenceNo = SequenceNo;
        //this.objCarerPlacementRefusalInfoDTO.UniqueID = UniqueID;
       // this.cpriServices.post(this.objCarerPlacementRefusalInfoDTO, "delete").then(data => this.Respone(data));
        this.apiService.delete(this.controllerName, this.objCarerPlacementRefusalInfoDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarerPlacementRefusalInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objCarerPlacementRefusalInfoDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit(item){
        this.editCarerPlacementRefusalInfo(item.SequenceNo);
    }
    onDelete(item){
        this.deleteCarerPlacementRefusalInfo(item.SequenceNo);
    }
}
