
import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { NextDayActionLog} from './DTO/nextdayactionlog'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

@Component
    ({
        selector: 'nextdayactionloglist',
        templateUrl: './nextdayactionloglist.component.template.html',
    })

export class NextDayActionLogListComponent {
    lstNextDayActionLog = [];
    ChildID: number;
    objNextDayActionLog: NextDayActionLog = new NextDayActionLog();
    returnVal;
    controllerName = "NextDayActionLog";
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindNextDayActionLog();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/nextdayactionloglist");
            this._router.navigate(['/pages/referral/childprofilelist/0']);
        }
    }

    editNextDayActionLog(NextDayActionLogId) {
        this._router.navigate(['/pages/child/nextdayactionlog', NextDayActionLogId]);
    }
    
    private bindNextDayActionLog() {
        this.apiService.get(this.controllerName,"GetAllByChildId",this.ChildID).then(data => this.lstNextDayActionLog = data);
    }

    deleteNextDayActionLog(SequenceNo, UniqueID) {
        this.objNextDayActionLog.SequenceNo = SequenceNo;
        this.objNextDayActionLog.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objNextDayActionLog).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);           
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);           
            this.bindNextDayActionLog();
        }
    }
}