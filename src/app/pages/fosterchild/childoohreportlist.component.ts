import { Component} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildOOHReport } from './DTO/childoohreport'
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childoohreportlist',
    templateUrl: './childoohreportlist.component.template.html',
    })

export class ChildOOHReportListComponent {
    public searchText: string = "";
    lstChildOOHReport = [];
    childOOHReport =[];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Reporting Date & Time',prop:'ReportDate',sortable:true,width:'200',datetime:'Y'},
        {name:'Emergency Placement Required',prop:'HasEmergencyPlacementRequired',sortable:true,width:'300'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        ];
    loading = false;
    ChildID: number;
    objChildOOHReport: ChildOOHReport = new ChildOOHReport();
    returnVal; controllerName = "ChildOOHReport"; 
    isDefaultSortOrderVal: string;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    insActivePage:number;objQeryVal;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=85
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent,
        private activatedroute:ActivatedRoute )
    {
        this.insActivePage=1;
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));;
            this.bindChildOOHReport();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childoohreportlist/4");
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

    private bindChildOOHReport() {
        this.loading = true;
        // this.apiService.get(this.controllerName,"GetAllByChildId",this.ChildID).then(data => {
        //     this.lstTemp = data;
        //     this.fnLoadSaveDraft();       
        // });
        this.apiService.get(this.controllerName,"GetListByChildId",this.ChildID).then(data => {
            this.childOOHReport = data;
            this.loading=false;
            //this.fnLoadSaveDraft();       
        });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childoohreportdata/0/4/1']);
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 85;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.ChildID;
        let lstSaveDraft = [];
        this.apiService.post("SaveAsDraftInfo","getall",this.objSaveDraftInfoDTO).then(data => {
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });
            this.loading = false;
            this.lstChildOOHReport = this.lstTemp.concat(lstSaveDraft);
            this.isDefaultSortOrderVal = "desc";
            if(this.objQeryVal.apage!=undefined)
            this.insActivePage= parseInt(this.objQeryVal.apage);

        });
    }
    editChildOOHReport(ChildOOHReportId, hasDraft) {        
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");

        this._router.navigate(['/pages/child/childoohreportdata/'+ ChildOOHReportId + "/" + 4 +"/"+this.insActivePage]);
    }    

    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }

    deleteChildOOHReport(SequenceNo, hasDraft) {
        this.objChildOOHReport.SequenceNo = SequenceNo;
        //this.objChildOOHReport.UniqueID = UniqueID;
        if (!hasDraft)
            this.apiService.delete(this.controllerName, this.objChildOOHReport).then(data => this.Respone(data));
        else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 85;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            this.objSaveDraftInfoDTO.TypeId = this.ChildID;
            this.apiService.post("SaveAsDraftInfo", "Delete", this.objSaveDraftInfoDTO).then(data => {
                this.Respone(data);
            });
        }
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);           
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);           
            this.bindChildOOHReport();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildOOHReport.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.editChildOOHReport($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.editChildOOHReport($event.SequenceNo,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
            this.deleteChildOOHReport($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.deleteChildOOHReport($event.SequenceNo,true);
    }
}