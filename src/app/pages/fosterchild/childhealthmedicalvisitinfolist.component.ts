import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildHealthMedicalVisitInfo } from './DTO/childhealthmedicalvisitinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

@Component
    ({
    selector: 'childhealthmedicalvisitinfolist',
    templateUrl: './childhealthmedicalvisitinfolist.component.template.html',
    })

export class ChildHealthMedicalVisitInfoListComponent {
    public searchText: string = "";
    lstChildHealthMedicalVisitInfo = [];
    ChildID: number;
    objChildHealthMedicalVisitInfo: ChildHealthMedicalVisitInfo = new ChildHealthMedicalVisitInfo();
    returnVal; controllerName = "ChildHealthMedicalVisitInfo"; 

    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildHealthMedicalVisitInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childhealthmedicalvisitinfolist/19");
            this._router.navigate(['/pages/referral/childprofilelist/1/19']);
        }
    }

    private bindChildHealthMedicalVisitInfo() {
        this.apiService.get(this.controllerName,"GetAllByChildId",this.ChildID).then(data => this.lstChildHealthMedicalVisitInfo = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childhealthmedicalvisitinfo/0/19']);
    }

    editChildHealthMedicalVisitInfo(ChildHealthMedicalVisitInfoId) { 
        this._router.navigate(['/pages/child/childhealthmedicalvisitinfo', ChildHealthMedicalVisitInfoId,19 ]);
    }

    deleteChildHealthMedicalVisitInfo(SequenceNo, UniqueID) {              
        this.objChildHealthMedicalVisitInfo.SequenceNo = SequenceNo;
        this.objChildHealthMedicalVisitInfo.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildHealthMedicalVisitInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);           
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);           
            this.bindChildHealthMedicalVisitInfo();
        }
    }
}