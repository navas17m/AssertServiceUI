import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
        selector: 'LocalAuthoritySWHistoryList',
        templateUrl: './localauthorityswhistorylist.component.template.html',

    })

export class LocalAuthoritySWHistoryListComponent {
    returnVal;
    ChildId: number;
    objQeryVal;
    objSWHistoryList = [];
    FormCnfgId;
    public loading:boolean = false;
    limit=10;
    footerMessage={
      'emptyMessage': '',
      'totalMessage': ' - Records'
    };
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    
    constructor(private apiService: APICallService,
        private route: ActivatedRoute, private _router: Router, private module: PagesComponent) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        if (this.objQeryVal.mid == 16) {
            this.FormCnfgId = 75;
            if (Common.GetSession("ReferralChildId") != null && Common.GetSession("ReferralChildId") != "null") {
                this.ChildId = parseInt(Common.GetSession("ReferralChildId"));
            }
            else {
                Common.SetSession("UrlReferral", "pages/referral/lasocialworkerhistorylist/16");
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);
            }
        }
        else if (this.objQeryVal.mid == 4) {
            this.FormCnfgId = 89;
            if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null") {
                this.ChildId = parseInt(Common.GetSession("ChildId"));
            }
            else {
                Common.SetSession("UrlReferral", "pages/child/lasocialworkerhistorylist/4");
                this._router.navigate(['/pages/child/childprofilelist/1/4']);
            }
        }

        this.bindlAsocialworkerhistoryt();

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    fnAddData() {
        this._router.navigate(['/pages/referral/lasocialworkerhistory', 0, this.ChildId, this.objQeryVal.mid]);
    }

    fnEdit(LocalAuthoritySWHistoryId) {
        this._router.navigate(['/pages/referral/lasocialworkerhistory', LocalAuthoritySWHistoryId, this.ChildId, this.objQeryVal.mid]);
    }

    private bindlAsocialworkerhistoryt() {
        if (this.ChildId) {
            this.loading=true;
            this.apiService.get("LocalAuthoritySWHistory", "GetLASWHistoryList", this.ChildId).then(data =>
                {this.objSWHistoryList = data;
                 this.loading=false;});

        }
    }
}
