import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildSchoolDetailInfo } from './DTO/childschooldetailinfo'
import { APICallService } from '../services/apicallservice.service';
import { PagesComponent } from '../pages.component';

@Component
    ({
    selector: 'childschooldetailinfolist',
    templateUrl: './childschooldetailinfolist.component.template.html',
    })

export class ChildSchoolDetailInfoListComponent {
    public searchText: string = "";
    lstChildSchoolDetailInfo = [];
    ChildID: number;
    AgencyProfileId: number;
    objChildSchoolDetailInfo: ChildSchoolDetailInfo = new ChildSchoolDetailInfo();
    returnVal; controllerName = "ChildSchoolInfo"; 

    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));         
        //if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null" ) {
        //    this.ChildID = parseInt(Common.GetSession("ChildId"));
        //    this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        //}
        //else {
        //    Common.SetSession("UrlReferral", "pages/child/childschooldetailinfolist/18");
        //    this._router.navigate(['/pages/referral/childprofilelist/1/18']);
        //}

        this.bindChildSchoolDetailInfo();
    }

    private bindChildSchoolDetailInfo() {
        this.apiService.get(this.controllerName,"GetAllByAgencyId",this.AgencyProfileId).then(data => this.lstChildSchoolDetailInfo = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childschooldetailinfo/0']);
    }

    editChildSchoolDetailInfo(ChildSchoolDetailInfoId) { 
        this._router.navigate(['/pages/child/childschooldetailinfo', ChildSchoolDetailInfoId ]);
    }    

    deleteChildSchoolDetailInfo(SequenceNo, UniqueID) {             
        this.objChildSchoolDetailInfo.SequenceNo = SequenceNo;
        this.objChildSchoolDetailInfo.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildSchoolDetailInfo).then(data => this.Respone(data)); 
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildSchoolDetailInfo();
        }
       
    }
}