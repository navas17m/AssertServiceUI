import { Component } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { CarerOOHReportDTO } from './DTO/careroohreportdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
        selector: 'careroohreportlist',
        templateUrl: './careroohreportlist.component.template.html',
    })

export class CarerOOHReportListComponent {
    public searchText: string = "";
    controllerName = "CarerOOHReport";
    lstCarerOOHReport = [];
    carerOOHReportList =[];
    objCarerOOHReportDTO: CarerOOHReportDTO = new CarerOOHReportDTO();
    returnVal;
    CarerParentId: number;
    isDefaultSortOrderVal: string;
    loading = false;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    insActivePage:number;objQeryVal;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Reporting Date/Time',prop:'ReportDate',sortable:true,width:'200',datetime:'Y'},
        {name:'Emergency Placement Required?',prop:'HasEmergencyPlacementRequired',sortable:false,width:'150'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:false,width:'150'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
       objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
       FormCnfgId=55;
    constructor(private _router: Router,private activatedroute: ActivatedRoute,
        private module: PagesComponent, private apiService: APICallService) {
            this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.insActivePage=1;
        if ((Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 22]);
        }

        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        this.bindCarerOOHReport();
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 55;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
        let lstSaveDraft = [];
        this.apiService.post("SaveAsDraftInfo", "getall", this.objSaveDraftInfoDTO).then(data => {
            // this.sdService.getList(this.objSaveDraftInfoDTO).then(data => {
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });
            this.loading = false;
            this.lstCarerOOHReport = this.lstTemp.concat(lstSaveDraft);
            this.isDefaultSortOrderVal = "desc";
            if(this.objQeryVal.apage!=undefined)
            this.insActivePage= parseInt(this.objQeryVal.apage);

        });
    }
    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }

    fnAddData() {
        this._router.navigate(['/pages/fostercarer/careroohreportdata/0/3/1']);
    }

    editCarerOOHReport(CarerOOHReportId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/fostercarer/careroohreportdata', CarerOOHReportId,3,this.insActivePage]);
    }

    private bindCarerOOHReport() {
        this.loading = true;
        this.apiService.get(this.controllerName, "GetAllByCarerParentId", this.CarerParentId).then(data => {
            //this.coohServics.getOOHReportList(this.CarerParentId).subscribe(data => {
            this.lstTemp = data;
            this.fnLoadSaveDraft();
        });
        this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => {
            this.carerOOHReportList = data;
        });
    }

    deleteCarerOOHReport(SequenceNo, hasDraft) {

        this.objCarerOOHReportDTO.SequenceNo = SequenceNo;
        //this.objCarerOOHReportDTO.UniqueID = UniqueID;
        if (!hasDraft) {
            this.apiService.delete("CarerOOHReport", this.objCarerOOHReportDTO).then(data => this.Respone(data));
            // this.coohServics.post(this.objCarerOOHReportDTO, "delete").then(data => this.Respone(data));
        } else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 55;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.apiService.delete("SaveAsDraftInfo", this.objSaveDraftInfoDTO).then(data => {
                this.Respone(data);
            });
        }

    }

    private Respone(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarerOOHReport();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objCarerOOHReportDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.editCarerOOHReport($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.editCarerOOHReport($event.SequenceNo,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.deleteCarerOOHReport($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.deleteCarerOOHReport($event.SequenceNo,true);
    }
}
