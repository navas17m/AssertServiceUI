import { Component} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Common } from '../common'
import { Base } from '../services/base.service'
import { PagesComponent } from '../pages.component'
import {  ChildMonthlyProgressReportDTO } from './DTO/childmonthlyprogressreportdto'
import { APICallService } from '../services/apicallservice.service';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
        selector: 'ChildMonthlyProgressReportList',
        templateUrl: './childmonthlyprogressreportlist.component.template.html',
    })

export class ChildMonthlyProgressReportListComponent {
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    public searchText: string = "";
    lstMonthlyProgressReport = [];
    childMonthlyProgressReportList =[];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Visit',prop:'DateOfVisit',sortable:true,width:'100',date:'Y'},
        {name:'Due Date',prop:'DueDate',sortable:true,width:'100',date:'Y'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'150'},
        {name:'Edit',prop:'Edit',sortable:false,width:'100'},
        {name:'View',prop:'View',sortable:false,width:'100'},
        {name:'Delete',prop:'Delete',sortable:false,width:'100'}
       ];
    objQeryVal;
    objChildMonth: ChildMonthlyProgressReportDTO = new ChildMonthlyProgressReportDTO();
    returnVal;
    ChildID: number; controllerName = "ChildMonthlyProgressReport";
    loading = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=171;
    constructor(private apiService: APICallService, private activatedroute: ActivatedRoute,
        private _router: Router, private module: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindMonthlyProgressReport();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childmonthlyprogressreportlist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
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

    fnAddData() {

        this._router.navigate(['/pages/child/childmonthlyprogressreport/0/4']);
    }

    edit(id,hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/child/childmonthlyprogressreport', id, 4]);
    }

    private bindMonthlyProgressReport() {
        if (this.ChildID != null) {
            this.loading = true;
            // this.apiService.get(this.controllerName,"GetAllByChildId",this.ChildID).then(data => {
            //     this.lstMonthlyProgressReport = data;
            //     this.loading = false;
            // });
            this.apiService.get(this.controllerName,"GetListByChildId",this.ChildID).then(data => {
                this.childMonthlyProgressReportList = data;
                                this.loading = false;
                //console.log('Saved as draft records to be added in API and SP');
            });
        }
    }

    delete(SequenceNo,hasDraft) {
        this.objChildMonth.SequenceNo = SequenceNo;
        //this.objChildMonth.UniqueID = UniqueID;
        if (!hasDraft)
          this.apiService.delete(this.controllerName, this.objChildMonth).then(data => this.Respone(data));
        else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 171;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            this.objSaveDraftInfoDTO.TypeId = this.ChildID;
            this.apiService.post("SaveAsDraftInfo", "Delete", this.objSaveDraftInfoDTO).then(data => {
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
            this.bindMonthlyProgressReport();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildMonth.SequenceNo;
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
            this.edit($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
            this.edit($event.SequenceNo,true);
    }
    onDelete($event){
        if($event.SaveAsDraftStatus=='Submitted')
        this.delete($event.SequenceNo,false);
        else if($event.SaveAsDraftStatus=='Saved as Draft')
        this.delete($event.SequenceNo,true);
    }
}
