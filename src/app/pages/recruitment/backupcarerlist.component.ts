import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { BackupCarerDTO } from './DTO/backupcarer';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'backupcarerlist',
    templateUrl: './backupcarerlist.component.template.html',
})

export class BackupCarerListComponet {
    public searchText: string = "";
    controllerName = "BackupCarer";
    selectName;
    SelectCode;
    objQeryVal
    backupCarerList = [];
    CarerParentId: number;
    insCarerDetails;
    FormCnfgId;
    objBackUpCarerDTO: BackupCarerDTO = new BackupCarerDTO();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    loading = false;
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _router: Router, private activatedroute: ActivatedRoute,
        private modal: PagesComponent, private apiService: APICallService) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 3]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 3]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 62;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.BindBackupCarerList();
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 34;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.BindBackupCarerList();
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


    BindBackupCarerList() {
        this.loading = true;
        if (this.objQeryVal.mid == 3) {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
            this.CarerParentId = this.insCarerDetails.CarerParentId;
            //    Common.SetSession("BCCarerParentId", this.insCarerDetails.CarerParentId);
            //   Common.SetSession("BCCarerCode", this.insCarerDetails.CarerCode);
        }
        else if (this.objQeryVal.mid == 13) {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
            this.CarerParentId = this.insCarerDetails.CarerParentId;
            // Common.SetSession("BCCarerParentId", this.insCarerDetails.CarerParentId);
            // Common.SetSession("BCCarerCode", this.insCarerDetails.CarerCode);
        }

        if (this.CarerParentId != 0 && this.CarerParentId != null) {
            this.objBackUpCarerDTO.CarerParentId = this.CarerParentId;
            this.objBackUpCarerDTO.FormCnfgId = 34;
            this.lstDraftTemp = [];
            this.apiService.post(this.controllerName, "GetByCarerParentId", this.objBackUpCarerDTO).then(data => {
                this.lstDraftTemp = data;
                this.fnLoadSaveDraft();
                this.loading = false;
            });
        }
    }

    lstDraftTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 34;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
        let lstSaveDraft = [];

        this.apiService.post("SaveAsDraftInfo", "getall", this.objSaveDraftInfoDTO).then(data => {
            data.forEach(item => {
                let jsonData = JSON.parse(item.JsonData);
                lstSaveDraft.push(jsonData.BackupCarerInfo);
            });
            this.loading = false;
            this.backupCarerList = [];
            this.backupCarerList = this.lstDraftTemp.concat(lstSaveDraft);
        });
    }

    fnAddData() {
        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/backupcarer/0/0/13/0']);
        else
            this._router.navigate(['/pages/fostercarer/backupcarer/0/0/3/0']);
    }

    editBackupCarer(item) {
        if (item.DraftSequenceNo != 'undefined' && item.DraftSequenceNo != null) {
            if (this.objQeryVal.mid == 13)
                this._router.navigate(['/pages/recruitment/backupcarer', 0, 0, this.objQeryVal.mid, item.DraftSequenceNo]);
            else
                this._router.navigate(['/pages/fostercarer/backupcarer', 0, 0, this.objQeryVal.mid, item.DraftSequenceNo]);

        } else if (item.DraftSequenceNo == null) {

            if (this.objQeryVal.mid == 13)
                this._router.navigate(['/pages/recruitment/backupcarer', item.CarerId, item.SequenceNo, this.objQeryVal.mid, 0]);
            else
                this._router.navigate(['/pages/fostercarer/backupcarer', item.CarerId, item.SequenceNo, this.objQeryVal.mid, 0]);
        }

    }

    deleteBackupCarer(item) {

        if (item.DraftSequenceNo == null)
            this.apiService.delete(this.controllerName, item.CarerId).then(data => this.Respone(data));
        else if (item.DraftSequenceNo != null)
        {
            this.objSaveDraftInfoDTO.SequenceNo = item.DraftSequenceNo;
            this.apiService.delete("SaveAsDraftInfo", this.objSaveDraftInfoDTO).then(data => this.Respone(data));
        }


    }

    familyDetails(carerid) {
        this._router.navigate(['/pages/recruitment/backupcarerfamily', carerid, this.objQeryVal.mid]);
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.BindBackupCarerList();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objBackUpCarerDTO.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
}
