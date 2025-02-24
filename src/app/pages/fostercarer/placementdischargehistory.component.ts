import { Component } from '@angular/core';
import { Router } from '@angular/router';
//import { ChildPlacementService } from  '../services/childplacement.service';
import { Common } from '../common';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'placementdischargehistory',
    templateUrl: './placementdischargehistory.component.template.html',
})

export class PlacementDischargehistory {
    lstChildPlacement; lstChildTransfer;
    lstbackupcarerplacement;
    lstPlacementStartTypeCnfg;
    lstFilterChildPlacement;
    CarerParentId: number;
    ControllerName = "ChildPlacement";
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private apiService: APICallService, private _router: Router) {

        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 27]);
        }
        else if (Common.GetSession("ACarerParentId") != null || Common.GetSession("ACarerParentId") != "0") {

            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));

            this.apiService.get(this.ControllerName, "GetPlacementByCarerParentId", this.CarerParentId).then(data => {
                this.lstChildPlacement = data.filter(item => item.PlacementStartTypeId == 2 || item.PlacementEndDate == null
                    || item.PlacementEndReasonId == 4 || item.PlacementEndReasonId == 5);
                this.lstFilterChildPlacement = data;
                this.lstChildTransfer = data.filter(item => item.PlacementEndReasonId == 3);
                this.lstbackupcarerplacement = data.filter(item => item.ChildRespiteDetail != null && item.ChildRespiteDetail.IsBackupCarer == true);
            });

            //this._childPlacementService.getPlacementByCarerParentId(this.CarerParentId).then(data => {
            //    this.lstChildPlacement = data.filter(item => item.PlacementEndDate == null
            //        || item.PlacementEndReasonId == 4 || item.PlacementStartTypeId == 2);
            //    this.lstChildTransfer = data.filter(item => item.PlacementEndReasonId == 3);

            //    this.lstbackupcarerplacement = data.filter(item => item.ChildRespiteDetail.IsBackupCarer == true);
            //    this.lstFilterChildPlacement = data;
            //});
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = 57;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    fnView(ChildPlacementId) {
        this._router.navigate(['/pages/fostercarer/placementdischargehistoryview', ChildPlacementId]);
    }

    PlacementTypeId = 0;
    fnChangePlacementStartType(value) {
        this.PlacementTypeId = value;

        switch (value) {
            case "1":
                {
                    this.lstChildPlacement = this.lstFilterChildPlacement.filter(item => item.PlacementEndDate == null
                        || item.PlacementEndReasonId == 4);
                    this.lstChildTransfer = null;
                    this.lstbackupcarerplacement = null;
                    break;
                }
            case "2":
                {
                    this.lstChildPlacement = this.lstFilterChildPlacement.filter(item => item.PlacementStartTypeId == 2);
                    this.lstbackupcarerplacement = this.lstFilterChildPlacement.filter(item => item.ChildRespiteDetail != null && item.ChildRespiteDetail.IsBackupCarer == true);
                    this.lstChildTransfer = null;

                    break;
                }
            case "3":
                {
                    this.lstChildTransfer = this.lstFilterChildPlacement.filter(item => item.PlacementEndReasonId == 3);
                    this.lstChildPlacement = null;
                    this.lstbackupcarerplacement = null;
                    break;
                }
            case "0":
                {
                    this.lstChildPlacement = this.lstFilterChildPlacement.filter(item => item.PlacementEndDate == null
                        || item.PlacementEndReasonId == 4 || item.PlacementStartTypeId == 2);
                    this.lstChildTransfer = this.lstFilterChildPlacement.filter(item => item.PlacementEndReasonId == 3);
                    this.lstbackupcarerplacement = this.lstFilterChildPlacement.filter(item => item.ChildRespiteDetail != null && item.ChildRespiteDetail.IsBackupCarer == true);
                    break;
                }
        }
    }
    getRowClass = (row) => {
      return {
        'rowRespite': row.PlacementStartTypeId == 2
      };
   }
}
