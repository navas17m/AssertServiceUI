import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
//import { CarerInfoService} from '../services/carerinfo.services'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerParentDTO } from './DTO/carerparent';
import * as moment from 'moment';
import { UserAuditHistoryDetailDTO } from '../common';
@Component({
    selector: 'SwapCarer',
    templateUrl: './swapcarer.component.template.html',
})

export class SwapCarerComponent {
    controllerName = "CarerInfo";
    submitted = false;
    objQeryVal;
    _Form: FormGroup;
    objSwapCarerDTO: SwapCarerDTO = new SwapCarerDTO();
    note = "This functionality is not for the single carer";
    isValid = false;
    CarerParentId: number;
    isLoading: boolean = false;
    @ViewChild('header') headerCtrl;

    ApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    objApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    oldApplicantProfileVal: CarerParentDTO = new CarerParentDTO();

    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=63;
    constructor(private _formBuilder: FormBuilder, private activatedroute: ActivatedRoute,
        private _router: Router, private module: PagesComponent, private apiService: APICallService) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 21]);
        }
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 21]);
        }


        if (this.objQeryVal.mid == 3) {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        } else if (this.objQeryVal.mid == 13) {
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
        }

        this._Form = _formBuilder.group({
            swCarereOptions: ['0', Validators.required],
        });

        // this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
        if (this.CarerParentId) {
            this.apiService.get(this.controllerName, "CheckSecondCarer", this.CarerParentId).then(data => {
                //this.carerServices.CheckSecondCarer(this.CarerParentId).then(data => {
                if (data == true) {
                    this.isValid = true;
                    this.note = "Swapping the carer will move the data between primary and secondary carer ";
                }
                else if (data == false) {
                    this.isValid = false;
                    this.note = "This functionality is not for the single carer";
                }
            });
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    clicksubmit(mainFormBuilder) {
        this.submitted = true;
        if (mainFormBuilder.valid) {
            this.isLoading = true;
            this.objSwapCarerDTO.CarerParentId = this.CarerParentId;
            //  this.carerServices.PostSwapCarer(this.objSwapCarerDTO).then(data => this.Respone(data));
            this.apiService.post(this.controllerName, "SwapCarer", this.objSwapCarerDTO).then(data => this.Respone(data));
        }
    }

    private Respone(data) {
        this.isLoading = false;

        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetSaveSuccessfullMsg);


            if (this.objQeryVal.mid == 13) {

                //Update Header and applicant
                this.oldApplicantProfileVal = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
                if (this.objSwapCarerDTO.SwapId == 1) {
                    this.ApplicantProfileVal.PCFullName = this.oldApplicantProfileVal.SCFullName.replace('/', ' ');
                    this.ApplicantProfileVal.SCFullName = ' / ' + this.oldApplicantProfileVal.PCFullName;
                    this.ApplicantProfileVal.PersonalInfo.ImageId = data.ImageId;
                }
                else if (this.objSwapCarerDTO.SwapId == 2) {
                    this.ApplicantProfileVal.PCFullName = this.oldApplicantProfileVal.PCFullName;
                    this.ApplicantProfileVal.SCFullName = '';
                }
                this.ApplicantProfileVal.AreaOfficeName = this.oldApplicantProfileVal.AreaOfficeName;
                this.ApplicantProfileVal.CarerCode = this.oldApplicantProfileVal.CarerCode;
                this.ApplicantProfileVal.CarerParentId = this.oldApplicantProfileVal.CarerParentId;
                this.ApplicantProfileVal.CarerId = this.oldApplicantProfileVal.CarerId;
                this.ApplicantProfileVal.CarerStatusName = this.oldApplicantProfileVal.CarerStatusName;
                this.ApplicantProfileVal.CarerStatusId = this.oldApplicantProfileVal.CarerStatusId;
                this.ApplicantProfileVal.ContactInfo.City = this.oldApplicantProfileVal.ContactInfo.City;
                this.ApplicantProfileVal.CreatedDate = this.oldApplicantProfileVal.CreatedDate;
                //  this.ApplicantProfileVal.PersonalInfo.ImageId = this.oldApplicantProfileVal.PersonalInfo.ImageId;
                this.ApplicantProfileVal.AvailableVacancies = this.oldApplicantProfileVal.AvailableVacancies;
                this.ApplicantProfileVal.ApproveVacancies = this.oldApplicantProfileVal.ApproveVacancies;
                this.ApplicantProfileVal.SupervisingSocialWorker = this.oldApplicantProfileVal.SupervisingSocialWorker;
                this.objApplicantProfileVal = new CarerParentDTO();
                this.objApplicantProfileVal = this.ApplicantProfileVal;
                Common.SetSession("SelectedApplicantProfile", JSON.stringify(this.ApplicantProfileVal));

                //End
                this._router.navigate(['/pages/recruitment/applicantlist']);
            }
            else {

                //Update Header and Approve Carer
                this.oldApplicantProfileVal = JSON.parse(Common.GetSession("SelectedCarerProfile"));
                if (this.objSwapCarerDTO.SwapId == 1) {
                    this.ApplicantProfileVal.PCFullName = this.oldApplicantProfileVal.SCFullName.replace('/', ' ');
                    this.ApplicantProfileVal.SCFullName = ' / ' + this.oldApplicantProfileVal.PCFullName;
                    this.ApplicantProfileVal.PersonalInfo.ImageId = data.ImageId;
                }
                else if (this.objSwapCarerDTO.SwapId == 2) {
                    this.ApplicantProfileVal.PCFullName = this.oldApplicantProfileVal.PCFullName;
                    this.ApplicantProfileVal.SCFullName = '';
                }

                this.ApplicantProfileVal.AreaOfficeName = this.oldApplicantProfileVal.AreaOfficeName;
                this.ApplicantProfileVal.CarerCode = this.oldApplicantProfileVal.CarerCode;
                this.ApplicantProfileVal.CarerParentId = this.oldApplicantProfileVal.CarerParentId;
                this.ApplicantProfileVal.CarerId = this.oldApplicantProfileVal.CarerId;
                this.ApplicantProfileVal.CarerStatusName = this.oldApplicantProfileVal.CarerStatusName;
                this.ApplicantProfileVal.CarerStatusId = this.oldApplicantProfileVal.CarerStatusId;
                this.ApplicantProfileVal.ContactInfo.City = this.oldApplicantProfileVal.ContactInfo.City;
                this.ApplicantProfileVal.CreatedDate = this.oldApplicantProfileVal.CreatedDate;
                this.ApplicantProfileVal.AvailableVacancies = this.oldApplicantProfileVal.AvailableVacancies;
                this.ApplicantProfileVal.ApproveVacancies = this.oldApplicantProfileVal.ApproveVacancies;
                this.ApplicantProfileVal.SupervisingSocialWorker = this.oldApplicantProfileVal.SupervisingSocialWorker;
                this.ApplicantProfileVal.ContactInfo.AddressLine1 = this.oldApplicantProfileVal.ContactInfo.AddressLine1;
                this.ApplicantProfileVal.ContactInfo.HomePhone = this.oldApplicantProfileVal.ContactInfo.HomePhone;
                this.ApplicantProfileVal.ContactInfo.MobilePhone = this.oldApplicantProfileVal.ContactInfo.MobilePhone;
                this.ApplicantProfileVal.ContactInfo.EmailId = this.oldApplicantProfileVal.ContactInfo.EmailId;
                this.ApplicantProfileVal.ApprovalDate = this.oldApplicantProfileVal.ApprovalDate;
                this.objApplicantProfileVal = new CarerParentDTO();
                this.objApplicantProfileVal = this.ApplicantProfileVal;
                Common.SetSession("SelectedCarerProfile", JSON.stringify(this.ApplicantProfileVal));

                this._router.navigate(['/pages/fostercarer/approvedcarerlist']);
            }
            this.objUserAuditDetailDTO.ActionId =2;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
}


export class SwapCarerDTO {
    CarerParentId: number;
    SwapId: number;
}
