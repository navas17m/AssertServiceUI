import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Common}  from  '../common'
import { Router, ActivatedRoute } from '@angular/router';
import { Location} from '@angular/common';
import { ChildProfile } from './DTO/childprofile'
import {ChildProfileService} from '../services/childprofile.service';
import { PagesComponent } from '../pages.component'
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'MovetoCurrentReferral',
    templateUrl: './childmovetocurrentreferral.component.template.html',
    providers: [ChildProfileService],   
})

export class MoveToCurrentReferralComponent {
    submitted = false;
    objQeryVal;
    formMovetoCurrentReferral: FormGroup;
    objChildProfile: ChildProfile = new ChildProfile();  
    note = "This functionality is not for placed and current referral child";
    isValid = false;
    ChildId: number;
    AgencyProfileId: number;
    submittedref = false;
    showdiv = true;
    notediv = true;
    isLoading: boolean = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=168;
    constructor(private _formBuilder: FormBuilder, private location: Location, private activatedroute: ActivatedRoute,
        private _router: Router, private _childService: ChildProfileService, private module: PagesComponent) {
        this.objChildProfile.StatusChangeDate = null;
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));        
        if (this.objQeryVal.mid == 16) {
            if (Common.GetSession("ReferralChildId") != null && Common.GetSession("ReferralChildId") != "null") {
                this.ChildId = parseInt(Common.GetSession("ReferralChildId"));                
            }
            else {
                Common.SetSession("UrlReferral", "pages/referral/movetocurrentreferral/16");
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);
            }
        }

        this.formMovetoCurrentReferral = _formBuilder.group({
            StatusChangeDate: ['', Validators.required],
        });
                
        if (this.ChildId) {
            if (parseInt(Common.GetSession("ChildStatusId")) == 18 || parseInt(Common.GetSession("ChildStatusId")) == 19) {
                this.note = "This functionality is not for placed and current referral child";
                this.showdiv = false;
            }
            else
                this.notediv = false;
                //this.note = "";
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

    clicksubmit(mainFormBuilder) {
        this.submittedref = true;

        if (!mainFormBuilder.valid) {
            this.module.GetErrorFocus(mainFormBuilder);
        } 

        if (mainFormBuilder.valid) {
            this.isLoading = true;
            this.objChildProfile.ChildId = this.ChildId;
            this.objChildProfile.StatusChangeDate = this.module.GetDateSaveFormat(this.objChildProfile.StatusChangeDate);
            this._childService.movetoCurrentReferral(this.objChildProfile).then(data => this.Respone(data));
        }
    }

    private Respone(data) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.objUserAuditDetailDTO.ActionId =1;
            this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
            this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
            this.objChildProfile.StatusChangeDate = this.module.GetDateEditFormat(this.objChildProfile.StatusChangeDate);

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
            
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            if (this.objQeryVal.mid == 16)
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);          
        }
    }
}
