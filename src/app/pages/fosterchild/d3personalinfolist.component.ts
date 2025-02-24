import { APICallService } from '../services/apicallservice.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component} from '@angular/core';
import { Common } from '../common'
import { Base } from '../services/base.service'
import { PagesComponent } from '../pages.component'

@Component
    ({
        selector: 'ChildD3PersonaalInformationList',
        templateUrl: './d3personalinfolist.component.template.html',
    })

export class ChildD3PersonaalInformationListComponent {
    public searchText: string = "";
    controllerName = "ChildD3PersonalInformation";
    personalInfoList = [];
    ChildId: number;
    FormCnfgId=256;  
    constructor(private _router: Router,
        private activatedroute: ActivatedRoute, private pComponent: PagesComponent, private apiService: APICallService) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildId = parseInt(Common.GetSession("ChildId"));
            this.bindPersonalInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/d3personalinfolist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
        }
    }

    private bindPersonalInfo() {
        if (this.ChildId != null && this.ChildId != 0)
            this.apiService.get(this.controllerName, "GetAllByChildId", this.ChildId).then(data => { this.personalInfoList = data });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/d3personalinfodata/0/4']);
    }

    edit(id) {

        this._router.navigate(['/pages/child/d3personalinfodata', id, 4]);
    }

    delete(historyId) {
        this.apiService.delete(this.controllerName, historyId).then(data => this.Respone(data));

    }

    private Respone(data) {
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindPersonalInfo();
        }
    }
}