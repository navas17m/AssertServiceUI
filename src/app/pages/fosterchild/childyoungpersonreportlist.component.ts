import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildYoungPersonReportDTO } from './DTO/childyoungpersonreportdto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
        selector: 'ChildYoungPersonReportList',
        templateUrl: './childyoungpersonreportlist.component.template.html',
    })

export class ChildYoungPersonReportListComponent {
    public searchText: string = "";
    lstChildYoungPersonReport = [];
    childYoungPersonReportList = [];
    columns = [
        { name: '', prop: 'IsDocumentExist', sortable: false, width: '30' },
        { name: 'Local Authority', prop: 'LocalAuthority', sortable: true, width: '200' },
        { name: 'Date of Visit', prop: 'DateofVisit', sortable: true, width: '200' },
        { name: 'Placements', prop: 'Placements', sortable: true, width: '200' },
        { name: 'Edit', prop: 'Edit', sortable: false, width: '60' },
        { name: 'View', prop: 'View', sortable: false, width: '60' },
        { name: 'Delete', prop: 'Delete', sortable: false, width: '60' },
    ];
    ChildID: number;
    objChildYoungPersonReportDTO: ChildYoungPersonReportDTO = new ChildYoungPersonReportDTO();
    returnVal; controllerName = "ChildYoungPersonReport";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId = 187;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildYPReport();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childypreportlist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/4']);
        }

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    private bindChildYPReport() {
        this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data => this.childYoungPersonReportList = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childypreport/0/4']);
    }

    edit(YPSequenceNo) {
        this._router.navigate(['/pages/child/childypreport', YPSequenceNo, 4]);
    }

    delete(SequenceNo) {
        this.objChildYoungPersonReportDTO.SequenceNo = SequenceNo;
        //this.objChildYoungPersonReportDTO.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildYoungPersonReportDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildYPReport();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildYoungPersonReportDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event) {
        this.edit($event.SequenceNo)
    }
    onDelete($event) {
        this.delete($event.SequenceNo)
    }
}