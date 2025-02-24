import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Common } from '../common';
import { ConfigTableNames } from '../configtablenames';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { CarerApprovalPreferenceDTO } from './DTO/carerapprovalpreference';
import { CarerInfo } from './DTO/carerinfo';
import { CarerParentDTO } from './DTO/carerparent';
import { CarerCheckList } from './DTO/carerstatuscnfg';


@Component({
    selector: 'CarerApprovalPreference',
    templateUrl: './carerapprovalpreference.component.template.html',
    styles: [`[required]  {
        border-left: 5px solid blue;
    }
   .ng-valid[required], .ng-valid.required  {
            border-left: 5px solid #42A948; /* green */
}
   label + .ng-invalid:not(form)  {
        border-left: 5px solid #a94442; /* red */
}`],
})

export class CarerApprovalPreferenceComponet {
    controllerName = "CarerApprovalPreference";
    dynamicformcontrol = [];
    objCarerApproveDTO: CarerApprovalPreferenceDTO = new CarerApprovalPreferenceDTO();
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objCarerInfo: CarerInfo = new CarerInfo();
    objCarerInfoSA: CarerInfo = new CarerInfo();
    ApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    objApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    submitted = false;
    CategoryOfApprovalList = [];
    _Form: FormGroup;
    IsVisibleSC;
    CarerId;
    CarerStatusId = 0;
    IsAccessble;
    ageCount;
    insCarerDetails;
    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerParentId: number;
    AgencyProfileId: number;
    //Doc
    formIdCCl;
    tblPrimaryKeyCCl;
    TypeIdCCl;
    submittedUploadCCl = false;
    @ViewChild('uploadsCCl') uploadCtrlCCl;
    //CheckList
    checkListHidden = true;
    objCarerCheckList: CarerCheckList = new CarerCheckList();
    InterestedCheckList = [];
    Stage1CheckList = [];
    Stage2CheckList = [];
    //Auto focus
    CarerApprovalActive = "active";
    CarerApprovalDocumentActive;
    InterestedActive;
    Stage1Active;
    Stage2Active = "active";
    DocumentActive;
    isLoading: boolean = false;
    insShowApplicationFormFillMandatory=false;
    constructor(_formBuilder: FormBuilder, private _router: Router,
        private modal: PagesComponent,
        private apiService: APICallService) {
        if (Common.GetSession("CarerParentId") == "0" || Common.GetSession("CarerParentId") == null) {
            this._router.navigate(['/pages/recruitment/applicantlist', 0, 2]);
        }
        this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
        if (this.insCarerDetails != null) {
            this.CarerParentId = this.insCarerDetails.CarerParentId;
            this.CarerId = this.insCarerDetails.CarerId;
            this.CarerStatusId = this.insCarerDetails.CarerStatusId;
        }
        //Doc
        this.formIdCCl = 36;
        this.TypeIdCCl = this.CarerParentId;
        this.tblPrimaryKeyCCl = this.CarerParentId;
        if (this.CarerStatusId == 3 || this.CarerStatusId == 11 || this.CarerStatusId == 12 || this.CarerStatusId == 13) {
            this.IsAccessble = true;
            //carer checklist
            this.objCarerCheckList.CarerParentId = this.CarerParentId;
            this.objCarerCheckList.ControlLoadFormat = ['Interested', 'Stage1', 'Stage2'];

            this.apiService.post("CarerStatusChange", "GetDynamicControls", this.objCarerCheckList).then(data => {
                //this.cStatusServices.getDynamicControls(this.objCarerCheckList).then(data => {
                this.InterestedCheckList = data.filter(item => item.ControlLoadFormat.indexOf("Interested") != -1);
                // this.InterestedCheckList.forEach(d => {
                //     d.IsDisabled = true;
                // });

                this.Stage1CheckList = data.filter(item => item.ControlLoadFormat.indexOf("Stage1") != -1);
                // this.Stage1CheckList.forEach(d => {
                //     d.IsDisabled = true;
                // });

                this.Stage2CheckList = data.filter(item => item.ControlLoadFormat.indexOf("Stage2") != -1);
                if (this.Stage2CheckList.length > 0)
                    this.checkListHidden = false;
            });
        } else
            this.IsAccessble = false;
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));

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
            StatusEndDate: [Validators.required],
            //  AgeRange: ['0', Validators.required]
        });
        this.BindCarerInfo();

        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.CategoryOfApproval;
        // _cnfgTblValueServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.CategoryOfApprovalList = data; });
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.CategoryOfApprovalList = data; });
        //Bind Dynamic Controls
        this.objCarerApproveDTO.CarerParentId = this.CarerParentId;
        //cApproveService.GetDynamicControls(this.objCarerApproveDTO).then(data => {
        //    this.dynamicformcontrol = data;
        //});

        this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerApproveDTO).then(data => {
            this.dynamicformcontrol = data;
        });


    }

    BindCarerInfo() {
        //Get Carer Info
        this.objCarerInfo.CarerParentId = this.CarerParentId;
        if (this.objCarerInfo.CarerParentId != 0 && this.objCarerInfo.CarerParentId != null) {
            //  this.carerInfoServices.GetByCarerParentId(this.objCarerInfo.CarerParentId).then(data => { this.BindCarerDetails(data); });
            this.apiService.get("CarerInfo", "GetByCarerParentId", this.objCarerInfo.CarerParentId).then(data =>
            {
                this.BindCarerDetails(data);
             });
        }
    }

    BindCarerDetails(data: CarerInfo[]) {
        if (data[0] != null) {
            this.objCarerInfo = data[0];

            if(!this.objCarerInfo.ApplicationFilledDate)
            {
               this.IsAccessble=false;
               this.insShowApplicationFormFillMandatory=true;
            }
        }
        if (data[1] != null) {
            this.objCarerInfoSA = data[1];
            this.IsVisibleSC = true;
        }
    }

    fnCarerApprovalActive() {
        this.CarerApprovalActive = "active"
        this.CarerApprovalDocumentActive = "";
    }
    fnCarerApprovalDocumentActive() {
        this.CarerApprovalActive = ""
        this.CarerApprovalDocumentActive = "active";
    }
    fnInterested() {
        this.InterestedActive = "active";
        this.Stage1Active = "";
        this.Stage2Active = "";
        this.DocumentActive = "";
    }
    fnStage1() {
        this.InterestedActive = "";
        this.Stage1Active = "active";
        this.Stage2Active = "";
        this.DocumentActive = "";
    }
    fnStage2() {
        this.InterestedActive = "";
        this.Stage1Active = "";
        this.Stage2Active = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.InterestedActive = "";
        this.Stage1Active = "";
        this.Stage2Active = "";
        this.DocumentActive = "active";
    }

    DocOk = true;
    DocOkCCL = true;
    clicksubmit(form, dynamicVal, dynamicForm, UploadDocIds, IsUpload, uploadFormBuilder
        , dynamicS2Val, dynamicS2Form
        , UploadDocIdsCCL, IsUploadCCL, uploadFormBuilderCCL, AddtionalEmailIds, EmailIds
        , dynamicIntVal, dynamicIntForm
        , dynamicS1Val, dynamicS1Form) {
        this.CarerParentId = this.insCarerDetails.CarerParentId;
        this.submitted = true;
        this.DocOk = true;
        this.DocOkCCL = true;

        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }
        if (IsUploadCCL) {
            this.submittedUpload = true;
            if (uploadFormBuilderCCL.valid) {
                this.DocOkCCL = true;
            }
            else
                this.DocOkCCL = false;
        }

        if (!form.valid) {
            this.CarerApprovalActive = "active"
            this.CarerApprovalDocumentActive = "";
            this.modal.GetErrorFocus(form);
        } else if (!dynamicForm.valid) {
            this.CarerApprovalActive = "active"
            this.CarerApprovalDocumentActive = "";
            this.modal.GetErrorFocus(dynamicForm);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.CarerApprovalActive = ""
            this.CarerApprovalDocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        } else if (!dynamicS2Form.valid) {
            this.CarerApprovalActive = "active"
            this.InterestedActive = "";
            this.Stage1Active = "";
            this.Stage2Active = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(dynamicS2Form);
        } else if (IsUploadCCL && !uploadFormBuilderCCL.valid) {
            this.CarerApprovalActive = "active"
            this.InterestedActive = "";
            this.Stage1Active = "";
            this.Stage2Active = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilderCCL);
        }
        this.objCarerApproveDTO.NotificationEmailIds = EmailIds;
        this.objCarerApproveDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
        if (form.valid && dynamicForm.valid && this.DocOk && dynamicS2Form.valid) {

            // dynamicIntVal.forEach(item => {
            //     dynamicS2Val.push(item);
            // });

            // dynamicS1Val.forEach(item => {
            //     dynamicS2Val.push(item);
            // });

            this.isLoading = true;
            this.objCarerApproveDTO.DynamicValue = dynamicVal;
            this.objCarerApproveDTO.CarerParentId = this.CarerParentId;
            this.objCarerApproveDTO.CarerId = this.CarerId;
            this.objCarerApproveDTO.DynamicValueCheckListInt = dynamicIntVal;
            this.objCarerApproveDTO.DynamicValueCheckList1 = dynamicS1Val;
            this.objCarerApproveDTO.DynamicValueCheckList2 = dynamicS2Val;
            let type = "save";

            this.objCarerApproveDTO.StatusEndDate = this.modal.GetDateSaveFormat(this.objCarerApproveDTO.StatusEndDate);
            this.objCarerApproveDTO.ApprovalDate = this.modal.GetDateSaveFormat(this.objCarerApproveDTO.ApprovalDate);
            // this.cApproveService.post(this.objCarerApproveDTO, type).then(data => this.Respone(data, type, IsUpload, IsUploadCCL));
            this.apiService.save(this.controllerName, this.objCarerApproveDTO, type).then(data => this.Respone(data, type, IsUpload, IsUploadCCL));
        }
    }

    private Respone(data, type, IsUpload, IsUploadCCL) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {

            if (IsUpload) {
                this.uploadCtrl.fnUploadAll(this.CarerParentId);
            }

            if (IsUploadCCL) {
                this.uploadCtrlCCl.fnUploadAll(this.CarerParentId);
            }

            if (type == "save") {
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {

                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            Common.SetSession("CarerParentId", "0");
            Common.SetSession("CarerSSWId", "0");
            Common.SetSession("CarerSSWName", "0");
            //sessionStorage.removeItem('CarerParentId');
            //sessionStorage.removeItem('CarerSSWId');
            //sessionStorage.removeItem('CarerSSWName');
            this.ApplicantProfileVal.PCFullName = "";
            this.ApplicantProfileVal.SCFullName = "";
            this.ApplicantProfileVal.CarerCode = "";
            this.ApplicantProfileVal.CarerParentId = 0;
            this.ApplicantProfileVal.CarerId = 0;
            this.ApplicantProfileVal.CarerStatusName = "";
            this.ApplicantProfileVal.CarerStatusId = 0;
            this.ApplicantProfileVal.ContactInfo.City = "";
            this.ApplicantProfileVal.AreaOfficeName = "";
            this.ApplicantProfileVal.CreatedDate = null;
            this.ApplicantProfileVal.PersonalInfo.ImageId = 0;
            this.objApplicantProfileVal = this.ApplicantProfileVal;
            Common.SetSession("SelectedApplicantProfile", JSON.stringify(this.ApplicantProfileVal));

            this._router.navigate(['/pages/recruitment/applicantlist']);
        }
    }
}
