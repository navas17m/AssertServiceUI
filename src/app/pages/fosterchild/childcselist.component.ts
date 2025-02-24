import { Component} from '@angular/core';
import { ChildCSEDTO } from './DTO/childcsedto'
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'ChildCSEList',
    templateUrl: './childcselist.component.template.html',
    })

export class ChildCSEListComponent {
    public searchText: string = "";
    lstChildCSE = [];
    ChildID: number;
    objChildCSEDTO: ChildCSEDTO = new ChildCSEDTO();
    returnVal; controllerName = "ChildCSE";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=238;
    constructor(private apiService: APICallService, private _router: Router,
        private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildCSEList();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/cselist/4");
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

    private bindChildCSEList() {
        this.apiService.get(this.controllerName, "GetAll", this.ChildID).then(data => { this.lstChildCSE = data });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/csedata/0']);
    }

    edit(id) {
        this._router.navigate(['/pages/child/csedata', id]);
    }

    delete(SequenceNo, UniqueID) {
        this.objChildCSEDTO.SequenceNo = SequenceNo;
        this.objChildCSEDTO.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildCSEDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildCSEList();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildCSEDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
}