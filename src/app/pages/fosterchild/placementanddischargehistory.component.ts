//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { Component, } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Common }  from  '../common'
import { Location} from '@angular/common';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'placementanddischargehistory',
    templateUrl: './placementanddischargehistory.component.template.html',
})

export class PlacementandDischargehistory {
    lstChildPlacement; lstPlacementStartTypeCnfg;
    lstFilerChildPlacement; lstChildTransfer;
    ChildID; controllerName = "ChildPlacement";
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=94;
    constructor(private apiService: APICallService, private route: ActivatedRoute, private _router: Router, private location: Location) {
            if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null") {
            this.apiService.get(this.controllerName, "GetPlacementByChildId", parseInt( Common.GetSession("ChildId"))).then(data => {

                this.lstChildPlacement = data.filter(item => item.PlacementStartTypeId == 1 
                    || item.PlacementStartTypeId == 4 || item.PlacementStartTypeId == 2);
                this.lstChildTransfer = data.filter(item => item.PlacementStartTypeId == 3);
                this.lstFilerChildPlacement = data;
            });
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childplacementdischargehistory/4");
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

    getRowClass =(row)=>{
        return {
          'rowSelected':row.PlacementStartTypeId==2
        }
      }

    fnChangePlacementStartType(value)
    {
        switch (value) {
            case "1":
                {
                    this.lstChildPlacement = this.lstFilerChildPlacement.filter(item => item.PlacementStartTypeId == 1
                        || item.PlacementStartTypeId == 4);
                    this.lstChildTransfer = null;
                    break;
                }
            case "2":
                {
                    this.lstChildPlacement = this.lstFilerChildPlacement.filter(item =>item.PlacementStartTypeId == 2);
                    this.lstChildTransfer = null;
                    break;
                }
            case "3":
                {
                    this.lstChildTransfer = this.lstFilerChildPlacement.filter(item => item.PlacementStartTypeId == 3);
                    this.lstChildPlacement = null;
                    break;
                }
            case "0":
                {
                    this.lstChildPlacement = this.lstFilerChildPlacement.filter(item => item.PlacementStartTypeId == 1
                        || item.PlacementStartTypeId == 4 || item.PlacementStartTypeId == 2);
                    this.lstChildTransfer = this.lstFilerChildPlacement.filter(item => item.PlacementStartTypeId == 3);
                    break;
                }
        }
    }

    fnEdit(childPlacementId) {
        this._router.navigate(['/pages/child/childplacementdischargehistorydata', childPlacementId]);
    }
}
