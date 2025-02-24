import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import {CarerInfoService } from '../services/carerinfo.services'
import { Router } from '@angular/router';
//import { CarerApprovalPreferenceService} from '../services/carerapprovalpreference.service'
//import { ConfigTableValuesService} from '../services/configtablevalues.service'
import { ConfigTableNames } from '../configtablenames';
import { PagesComponent } from '../pages.component';
import { CarerApprovalPreferenceDTO } from '../recruitment/DTO/carerapprovalpreference';
import { CarerInfo } from '../recruitment/DTO/carerinfo';
import { CarerParentDTO } from '../recruitment/DTO/carerparent';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { Common, Compare, CompareStaticValue, deepCopy } from '../common';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'CarerApprove',
    templateUrl: './carerapprove.component.template.html',
    styles: [`[required]  {
        border-left: 5px solid blue;
    }

   .ng-valid[required], .ng-valid.required  {
            border-left: 5px solid #42A948; /* green */
}
   label + .ng-invalid:not(form)  {
        border-left: 5px solid #a94442; /* red */
}
.form-control[disabled], .form-control[readonly] {
    color: rgba(85,85,85,.7);
    cursor: not-allowed;
}`],
})



export class CarerApproveComponet {
    CarerProfileVal: CarerParentDTO = new CarerParentDTO();
    objCarerProfileVal: CarerParentDTO = new CarerParentDTO();

    controllerName = "CarerApprovalPreference";
    dynamicformcontrol = [];
    dynamicformcontrolOG;
    objCarerApproveDTO: CarerApprovalPreferenceDTO = new CarerApprovalPreferenceDTO();
    objCarerApproveDTOOG: CarerApprovalPreferenceDTO = new CarerApprovalPreferenceDTO();
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    submitted = false;
    objCarerInfo: CarerInfo = new CarerInfo();
    objCarerInfoSA: CarerInfo = new CarerInfo();

    objCarerInfoOG: CarerInfo = new CarerInfo();
    objCarerInfoSAOG: CarerInfo = new CarerInfo();

    ApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    objApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    PreviousCarerApprove = [];
    CategoryOfApprovalList = [];
    _Form: FormGroup;
    IsVisibleSC;
    ageCount;
    CarerId;
    CarerStatusId;
    IsAccessble;
    PreviousVisible = false;
    insCarerDetails;
    IsShowVacancyAvailabilityError = false;

    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    dateString;
    CarerParentId: number;
    AgencyProfileId: number;

    ChangeApprovalActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(_formBuilder: FormBuilder, private _router: Router,
        private model: PagesComponent, private apiService: APICallService) {

        if ((Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 26]);
        }
        else {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
            this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.CarerParentId = this.insCarerDetails.CarerParentId;// Common.GetSession("CarerParentId");
            this.CarerId = this.insCarerDetails.CarerId;// Common.GetSession("CarerId");

            this.BindCarerInfo();
        }
        //Doc
        this.formId = 37;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.CarerParentId;

        //bind age range
        let age = [];
        for (let i: any = 1; i <= 20; i++) {
            age.push(i);
        }
        this.ageCount = age;
        this._Form = _formBuilder.group({
            AgeRangeFrom: [],
            AgeRangeTo: [],
            Gender: ['0', Validators.required],
            HasBlingGroupAcceptable: ['0'],
            NoOfVacancy: ['0', Validators.required],
            CarerStatusId: ['0', Validators.required],
            CategoryofApprovalId: ['0', Validators.required],
            ApprovalDate: ['', Validators.required],
            // btnSubmit: []
        });

        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.CategoryOfApproval;
        //  _cnfgTblValueServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.CategoryOfApprovalList = data; });
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.CategoryOfApprovalList = data; });
        //Bind Dynamic Controls
        this.objCarerApproveDTO.CarerParentId = this.CarerParentId;
        this.objCarerApproveDTO.IsEdit = true;
        this.apiService.post(this.controllerName, "GetDynamicControlsByParentId", this.objCarerApproveDTO).then(data => {
            // cApproveService.GetDynamicControlsByParentId(this.objCarerApproveDTO).then(data => {
            this.objCarerApproveDTO = data.CarerApprovalPreference;


            this.setApproveDate(data.CarerApprovalPreference);
            this.dynamicformcontrol = data.AgencyFieldMapping;
            this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
            this.objCarerApproveDTOOG = deepCopy<any>(this.objCarerApproveDTO);
            this.PreviousCarerApprove = data.PreviousCarerApprove;
        });
    }

    setApproveDate(data) {
        this.objCarerApproveDTO.ApprovalDate = this.model.GetDateEditFormat(this.objCarerApproveDTO.ApprovalDate);
    }

    CheckVacancyAvailability(NoOfVacancy) {
        let NoOfPla: number = this.objCarerApproveDTO.NoOfPlacement;
        let val: number = parseInt(NoOfVacancy) - this.objCarerApproveDTO.NoOfPlacement;
        if (parseInt(NoOfVacancy) != this.objCarerApproveDTO.NoOfPlacement) {
            if (val <= 0) {
                this.IsShowVacancyAvailabilityError = true;
            }
            else {
                this.IsShowVacancyAvailabilityError = false;
            }
        }
        else {
            this.IsShowVacancyAvailabilityError = false;
        }
    }

    BindCarerInfo() {
        //Get Carer Info
        this.objCarerInfo.CarerParentId = this.CarerParentId;
        if (this.objCarerInfo.CarerParentId != 0 && this.objCarerInfo.CarerParentId != null) {
            //  this.carerInfoServices.GetByCarerParentId(this.objCarerInfo.CarerParentId).then(data => { this.BindCarerDetails(data); });
            this.apiService.get("CarerInfo", "GetByCarerParentId", this.objCarerInfo.CarerParentId).then(data => { this.BindCarerDetails(data); });
        }
    }

    ShowPreviousApprove() {
        this.PreviousVisible = !this.PreviousVisible;
    }

    BindCarerDetails(data: CarerInfo[]) {
        if (data[0] != null) {
            this.objCarerInfo = data[0];
            this.objCarerInfoOG = deepCopy<any>(this.objCarerInfo);
        }
        if (data[1] != null) {
            this.objCarerInfoSA = data[1];
            this.objCarerInfoSAOG = deepCopy<any>(this.objCarerInfoSA);
            this.IsVisibleSC = true;
        }
    }

    fnChangeApproval() {
        this.ChangeApprovalActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.ChangeApprovalActive = "";
        this.DocumentActive = "active";
    }

    DocOk = true;
    isPCDirty = true;
    isSCDirty = true;
    IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(form, dynamicVal, dynamicForm, UploadDocIds, IsUpload, uploadFormBuilder) {
        this.CarerParentId = this.insCarerDetails.CarerParentId;
        this.submitted = true;
        this.DocOk = true;

        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        if (!form.valid) {
            this.ChangeApprovalActive = "active";
            this.DocumentActive = "";
            this.model.GetErrorFocus(form);
        } else if (!dynamicForm.valid) {
            this.ChangeApprovalActive = "active";
            this.DocumentActive = "";
            this.model.GetErrorFocus(dynamicForm);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.ChangeApprovalActive = "";
            this.DocumentActive = "active";
            this.model.GetErrorFocus(uploadFormBuilder);
        }

        if (form.valid && dynamicForm.valid && dynamicVal != null && this.DocOk && !this.IsShowVacancyAvailabilityError) {
            this.isLoading = true;

            this.isPCDirty = true;
            if (CompareStaticValue(this.objCarerApproveDTO, this.objCarerApproveDTOOG)
                && Compare(dynamicVal, this.dynamicformcontrolOG)
            ) {
                this.isPCDirty = false;
            }
            this.objCarerApproveDTO.ApprovalDate = this.model.GetDateSaveFormat(this.objCarerApproveDTO.ApprovalDate);

            if (this.isPCDirty || (IsUpload && uploadFormBuilder.valid)) {

            this.objCarerApproveDTO.DynamicValue = dynamicVal;
            this.objCarerApproveDTO.CarerParentId = this.CarerParentId;
            // this.objCarerApproveDTO.AgeRangeMin = ageRange.startValue;
            // this.objCarerApproveDTO.AgeRangeMax = ageRange.endValue;
            this.objCarerApproveDTO.CarerId = this.CarerId;
            this.objCarerApproveDTO.IsEdit = true;
            let type = "save";
            if (this.objCarerApproveDTO.IsSiblingGroupAcceptible == 1)
                this.objCarerApproveDTO.IsSiblingGroupAcceptible = 1;
            else if (this.objCarerApproveDTO.IsSiblingGroupAcceptible == 0)
                this.objCarerApproveDTO.IsSiblingGroupAcceptible = 0;
            else if (this.objCarerApproveDTO.IsSiblingGroupAcceptible == 2)
                this.objCarerApproveDTO.IsSiblingGroupAcceptible = 2;

            this.apiService.save(this.controllerName, this.objCarerApproveDTO, type).then(data => this.Respone(data, type, IsUpload));
            }
            else {
            this.submitted=false;
            this.isLoading=false;
            this.objCarerApproveDTO.ApprovalDate = this.model.GetDateEditFormat(this.objCarerApproveDTO.ApprovalDate);
           // this.model.alertWarning(Common.GetNoChangeAlert);

            if (this.IsNewOrSubmited == 1)
                this.model.alertWarning(Common.GetNoChangeAlert);
            else if (this.IsNewOrSubmited == 2)
                this.model.alertSuccess(Common.GetRecordAlreadySavedfullMsg);

            }
        }
    }

    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.model.alertDanger(data.ErrorMessage)
        }
        if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.objCarerApproveDTO.ApprovalDate = this.model.GetDateEditFormat(this.objCarerApproveDTO.ApprovalDate);
            this.objCarerApproveDTOOG = deepCopy<any>(this.objCarerApproveDTO);
            this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
        }

        if (data.IsError == false) {
            if (type == "save") {
                this.model.alertSuccess(Common.GetSaveSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId = 1;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.CarerParentId);
                }
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.CarerParentId);
                }
                this.model.alertSuccess(Common.GetUpdateSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId = 2;

            }
         //   this.objCarerApproveDTO.ApprovalDate = this.model.GetDateEditFormat(this.objCarerApproveDTO.ApprovalDate);

            this.CarerProfileVal.PCFullName = this.insCarerDetails.PCFullName;
            this.CarerProfileVal.SCFullName = this.insCarerDetails.SCFullName;
            this.CarerProfileVal.CarerCode = this.insCarerDetails.CarerCode;
            this.CarerProfileVal.CarerParentId = this.insCarerDetails.CarerParentId;
            this.CarerProfileVal.CarerId = this.insCarerDetails.CarerId;
            this.CarerProfileVal.CarerStatusName = this.insCarerDetails.CarerStatusName;
            this.CarerProfileVal.CarerStatusId = this.insCarerDetails.CarerStatusId;
            this.CarerProfileVal.ContactInfo.City = this.insCarerDetails.ContactInfo.City;
            this.CarerProfileVal.AreaOfficeName = this.insCarerDetails.AreaOfficeName;
            this.CarerProfileVal.ApprovalDate = this.insCarerDetails.ApprovalDate;
            this.CarerProfileVal.PersonalInfo.ImageId = this.insCarerDetails.PersonalInfo.ImageId;
            this.CarerProfileVal.AvailableVacancies = this.insCarerDetails.AvailableVacancies;
            this.CarerProfileVal.SupervisingSocialWorker = this.insCarerDetails.SupervisingSocialWorker;


            let cApproval = this.CategoryOfApprovalList.filter(x => x.CofigTableValuesId == this.objCarerApproveDTO.CategoryofApprovalId);
            if (cApproval.length > 0)
                this.CarerProfileVal.CategoryofApproval = cApproval[0].Value;
            let val: number = this.objCarerApproveDTO.NoOfVacancy- this.objCarerApproveDTO.NoOfPlacement;
            this.CarerProfileVal.AvailableVacancies = val;
            this.CarerProfileVal.ApproveVacancies = this.objCarerApproveDTO.NoOfVacancy;
            this.CarerProfileVal.AgeRange = this.objCarerApproveDTO.AgeRangeMin + " - " + this.objCarerApproveDTO.AgeRangeMax;
            this.CarerProfileVal.ApprovedGender = this.objCarerApproveDTO.Gender == 1 ? "Male" : this.objCarerApproveDTO.Gender == 2 ? "Female" : this.objCarerApproveDTO.Gender == 3 ? "Any" : "";
            this.CarerProfileVal.SiblingGroupAcceptible = this.objCarerApproveDTO.IsSiblingGroupAcceptible == 1 ? "Yes" : this.objCarerApproveDTO.IsSiblingGroupAcceptible == 2 ? "No" : "";

            this.objCarerProfileVal = this.CarerProfileVal;
            Common.SetSession("SelectedCarerProfile", JSON.stringify(this.CarerProfileVal));
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            this.objUserAuditDetailDTO.FormCnfgId = 65;
            this.objUserAuditDetailDTO.RecordNo = 0;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
}
