import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { APICallService } from '../services/apicallservice.service';
import { ChildProfile } from './DTO/childprofile';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'originalreferral',
    templateUrl: './originalreferral.component.template.html',
})

export class OriginalReferral {
    ChildId;
    childCode;
    objChildProfile: ChildProfile = new ChildProfile();
    srcChildPath = "assets/img/app/Photonotavail.png";
    insChildDetails; objQeryVal; controllerName = "ChildOriginalReferral";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=73;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private _router: Router, private _location: Location,private route: ActivatedRoute) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        if (this.objQeryVal.mid == 16) {
            if (Common.GetSession("ReferralChildId") != null && Common.GetSession("ReferralChildId") != "null") {
                this.ChildId = parseInt(Common.GetSession("ReferralChildId"));
                this.apiService.get(this.controllerName, "GetById", this.ChildId).then(data => {
                    if (data != null) {
                        //      console.log(data);
                        this.objChildProfile = data;
                        this.fnShowImage(this.objChildProfile.PersonalInfo.ImageId);
                    }
                });
            }
            else {
                Common.SetSession("UrlReferral", "pages/referral/originalreferral/16");
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);
            }
        }
        else {
            if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null") {
                this.ChildId = parseInt(Common.GetSession("ChildId"));
                this.apiService.get(this.controllerName, "GetById", this.ChildId).then(data => {
                    if (data != null) {
                        this.objChildProfile = data;
                        this.fnShowImage(this.objChildProfile.PersonalInfo.ImageId);
                    }
                });
            }
            else {
                Common.SetSession("UrlReferral", "pages/child/originalreferral/4");
                this._router.navigate(['/pages/child/childprofilelist/0/4']);
            }
        }
        if (Common.GetSession("SelectedChildProfile") != null) {
            this.insChildDetails = JSON.parse(Common.GetSession("SelectedChildProfile"));
            this.childCode = this.insChildDetails.ChildCode;
            this.fnShowImage(this.insChildDetails.PersonalInfo.ImageId);
        }

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    
    fnShowImage(ImageId) {
        if (ImageId != null) {
            this.apiService.get("UploadDocuments","GetImageById",ImageId).then(data => {
                if (data != null) {
                  this.srcChildPath = "data:image/jpeg;base64," + data;
                }
            });
        }
    }
}
