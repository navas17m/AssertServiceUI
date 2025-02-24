import { Component} from '@angular/core'
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildHealthHospitalisationInfo } from './DTO/childhealthhospitalisationinfo'
import { PagesComponent } from '../pages.component'
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'voiceofthechildlist',
    templateUrl: './voiceofthechildlist.component.template.html',
    })

export class voiceofthechildListComponent {
    controllerName = "voiceofthechild";
    lstChildHealthHospitalisationInfo = [];
    ChildID: number;
    objChildHealthHospitalisationInfo: ChildHealthHospitalisationInfo = new ChildHealthHospitalisationInfo();
    returnVal;
    public searchText:string = "";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=383;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildHealthHospitalisationInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/voiceofthechildlist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/19']);
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

    private bindChildHealthHospitalisationInfo() {
        this.apiService.get(this.controllerName, "GetAllByChildId", this.ChildID).then(data => this.lstChildHealthHospitalisationInfo = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/child/voiceofthechilddata/0/19']);
    }

    editChildHealthHospitalisationInfo(ChildHealthHospitalisationInfoId) {
        this._router.navigate(['/pages/child/voiceofthechilddata', ChildHealthHospitalisationInfoId,4]);
    }

    deleteChildHealthHospitalisationInfo(SequenceNo, UniqueID) {
        this.objChildHealthHospitalisationInfo.SequenceNo = SequenceNo;
        this.objChildHealthHospitalisationInfo.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildHealthHospitalisationInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildHealthHospitalisationInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildHealthHospitalisationInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
}
