import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'ChildGalleryData',
    templateUrl: './childgallerydata.component.template.html',
})
export class ChildGalleryDataDocuments {  
    @ViewChild('upload') uploadCtrl;  
    formId;
    tblPrimaryKey = 0;
    submittedUpload = false;
    objQeryVal;
    ChildId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=315;
    constructor(private modal: PagesComponent, private _router: Router, private route: ActivatedRoute) {       
        this.route.params.subscribe(data => this.objQeryVal = data);

        if (this.objQeryVal.mid == 16) {
            if (Common.GetSession("ReferralChildId") != null && Common.GetSession("ReferralChildId") != "null") {
                this.ChildId = parseInt(Common.GetSession("ReferralChildId"));  
                this.formId = 315;             
            }
            else {
                Common.SetSession("UrlReferral", "pages/referral/childgallrydata/16");
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);
            }
        }
        else {
            if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null") {
                this.ChildId = parseInt(Common.GetSession("ChildId")); 
                this.formId = 315;              
            }
            else {
                Common.SetSession("UrlReferral", "pages/child/childgallrydata/4");
                this._router.navigate(['/pages/child/childprofilelist/0/4']);
            }
        }  
        
        this.objUserAuditDetailDTO.ActionId = 4;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    fnSuccessUpload( )
    {
        this.objUserAuditDetailDTO.ActionId =1;
        
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.formId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        this._router.navigate(['/pages/child/childgallry/4']);
    }   
}