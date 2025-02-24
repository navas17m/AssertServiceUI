import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import {CarerInfoService } from '../services/carerinfo.services'
import { Router } from '@angular/router';
import { Common } from '../common';
//import { ConfigTableValuesService} from '../services/configtablevalues.service'
import { ConfigTableNames } from '../configtablenames';
//import { CarerStatusChangeService} from '../services/carerstatuschange.service'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { CarerInfo } from './DTO/carerinfo';
import { CarerParentDTO } from './DTO/carerparent';
import { CarerCheckList, CarerStatusChange, CarerstatusCnfg } from './DTO/carerstatuscnfg';

@Component({
    selector: 'CarerStatusChange',
    templateUrl: './carerstatuschange.component.template.html',
//     styles: [`[required]  {
//         border-left: 5px solid blue;
//     }

//     .ng-valid[required], .ng-valid.required  {
//             border-left: 5px solid #42A948; /* green */
// }
//     .ng-invalid:not(form)  {
//         border-left: 5px solid #a94442; /* red */
// }`]
})

export class CarerStatusChangeComponet {
    public returnVal:any[];
    @ViewChild('btnEditHistory') btnEditHistory: ElementRef;
    controllerName = "CarerStatusChange";
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    submitted = false;
    CarerStatusId = null;
    objCarerInfo: CarerInfo = new CarerInfo();
    objCarerInfoSA: CarerInfo = new CarerInfo();
    objCarerstatusCnfg: CarerstatusCnfg = new CarerstatusCnfg();
    objCarerStatusChange: CarerStatusChange = new CarerStatusChange();
    objCarerStatusChangeEdit: CarerStatusChange = new CarerStatusChange();
    objEditCarerStatusChange: CarerStatusChange = new CarerStatusChange();
    carerstatusList;
    DateOfStatusChange;
    Comments;
    _Form: FormGroup;
    _FormEdit: FormGroup;
    CarerParentId;
    carerId;
    IsVisibleSC = false;
    carerstatusHistory;
    IsVisibleOnHoldReminderDate = true;
    IsVisibleReasonId = true;
    IsValid = true;
    rejectReasonStr: string;
    IsOnHoldVisible: boolean;
    insCarerDetails;
    IsVisibleAssessor = true;
    ApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    objApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    dynamicformcontrol;
    checkListHidden = true;
    objCarerCheckList: CarerCheckList = new CarerCheckList();
    lstrejectReson = [];
    lstWithDrawnReason = [];
    lstonHoldReson=[];
    lstReason = [];
    StatusEndDateVisible = false;
    statusEndDataLabelName = "";

    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;

    InterestedStageActive = "active";
    Stage1Active;
    DocumentActive;
    isLoading: boolean = false;

    constructor(private _formBuilder: FormBuilder, private renderer: Renderer2, private _router: Router,
        private module: PagesComponent,
        private apiService: APICallService) {
        this._Form = _formBuilder.group({
            CarerStatusId: ['0', Validators.required],
            DateOfStatusChange: ['', Validators.required],
            Comments: [''],
            ReasonId: ['0'],
            OnHoldReminderDate: [''],
            //    ReasonOther: [],
            AssessorName: [],
            AssessorEmail: [''],
            DateofCompletion: [],
            MidPointReviewDate: [],
            AssessorSupervisor: [],
            StatusEndDate: [],
        });

        this._FormEdit = _formBuilder.group({
            DateOfStatusChange: ['', Validators.required],
            Comments: [''],
            StatusEndDate: [],
        });

        this.IsOnHoldVisible = false;
        if (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0") {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 18]);
        }
        else {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
            this.CarerParentId = this.insCarerDetails.CarerParentId;// Common.GetSession("CarerParentId");
            this.carerId = this.insCarerDetails.CarerId;// Common.GetSession("CarerId");
            //Doc
            this.formId = 36;
            this.TypeId = this.CarerParentId;
            this.tblPrimaryKey = this.CarerParentId;
        }

        this.objConfigTableNamesDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objConfigTableNamesDTO.Name = ConfigTableNames.ApplicantRejectReason;
        //cfvServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.lstrejectReson = data; });
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.lstrejectReson = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.ApplicantWithdrawnReason;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.lstWithDrawnReason = data; });

        this.BindCarerInfo();
        this.BindCarerstatusHistory();

        this.objConfigTableNamesDTO.Name = ConfigTableNames.ApprovedOnholdReason;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.lstonHoldReson = data; });
    }

    fnGetGender(genderId) {

        if (genderId != null) {
            switch (genderId) {
                case 1:
                    {
                        return "Male";
                    }
                case 2:
                    {
                        return "Female";
                    }
                case 3:
                    {
                        return "Unknown";
                    }
                case 4:
                    {
                        return "Unborn";
                    }
                case 5:
                    {
                        return "Transgender Male";
                    }
                case 6:
                    {
                        return "Transgender Female";
                    }
                case 7:
                    {
                        return "Gender Variant/Non-Conforming";
                    }
            }
        }


    }

    ReasonOtherVisible = true;
    //ReasonChange(val) {
    //    this.ReasonOtherVisible = true;

    //    if (val == 4) {
    //        this.ReasonOtherVisible = false;
    //    }
    //}

    onHoldIds: number[] = [5, 8, 11, 14]
    RejectIds: number[] = [6, 9, 12, 15]
    IsRejectVisible = false;
    BindCarerstatusHistory() {
        if (this.carerId != 0 && this.carerId != null) {
            let objCarerStatusChange: CarerStatusChange = new CarerStatusChange();
            objCarerStatusChange.CarerId = this.carerId;
            objCarerStatusChange.TypeId = 1;
            //this.cStatusServices.getCarerStatusHistoryByCarerId(objCarerStatusChange).then(data => {
            //    this.carerstatusHistory = data;
            //});

            this.apiService.post(this.controllerName, "GetByCarerId", objCarerStatusChange).then(data => {
                this.carerstatusHistory = data;
                if (data != null && data.length > 0)
                    this.objEditCarerStatusChange = data[0];
            });

        }
    }

    BindCarerInfo() {
        //Get Carer Info
        this.objCarerInfo.CarerParentId = this.CarerParentId;
        if (this.objCarerInfo.CarerParentId != 0 && this.objCarerInfo.CarerParentId != null) {
            // this.carerInfoServices.GetByCarerParentId(this.objCarerInfo.CarerParentId).then(data => { this.BindCarerDetails(data); });
            this.apiService.get("CarerInfo", "GetByCarerParentId", this.objCarerInfo.CarerParentId).then(data => { this.BindCarerDetails(data); });
        }
    }

    BindCarerDetails(data: CarerInfo[]) {
        if (data[0] != null) {
            this.objCarerInfo = data[0];
            this.CarerStatusId = this.objCarerInfo.CarerStatusId;
            this.objCarerstatusCnfg.CarerStatusId = this.objCarerInfo.CarerStatusId;
            this.BindCarerStatus();
        }
        if (data[1] != null) {
            this.objCarerInfoSA = data[1];
            this.IsVisibleSC = true;
        }
    }


    BindCarerStatus() {
        if (this.objCarerstatusCnfg.CarerStatusId != 0) {
            //  this.cStatusServices.getStatusList(this.objCarerstatusCnfg).then(data => this.carerstatusList = data);
            this.apiService.post("ModuleStausCnfg", "GetByParentId", this.objCarerstatusCnfg).then(data => this.carerstatusList = data);
        }
    }

    statusName;
    statusId;
    InterestedCheckList = [];
    Stage1CheckList = [];
    Stage2CheckList = [];
    StatusIdCheckList = 0;

    statusChange(val) {
        if (val != null && val != '') {
            this.StatusEndDateVisible = false;

            this.statusName = this.carerstatusList.find((item: any) => item.ModuleStatusCnfgId == val).StatusName;
            //Id 1 - intial
            //Id 2 - Stage 1
            //Id 3 - Stage 2

            //carer checklist
            //val == 2 && (



            if (this.insCarerDetails.CarerStatusId == 1 || this.insCarerDetails.CarerStatusId == 5 || this.insCarerDetails.CarerStatusId == 6 || this.insCarerDetails.CarerStatusId == 7) {

                if (val == 2) {
                    this.StatusEndDateVisible = true;
                    this.statusEndDataLabelName = "Interested Stage End Date";
                }

                this.StatusIdCheckList = 1;
                this.objCarerCheckList.CarerParentId = this.CarerParentId;
                this.objCarerCheckList.ControlLoadFormat = ['Interested'];
                this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerCheckList).then(data => {
                    // this.cStatusServices.getDynamicControls(this.objCarerCheckList).then(data => {
                    this.InterestedCheckList = data.filter(item => item.ControlLoadFormat.indexOf("Interested") != -1);
                    if (val != 2)
                        this.InterestedCheckList.forEach(x => x.IsMandatory = false);
                    if (this.InterestedCheckList.length > 0)
                        this.checkListHidden = false;
                });

                this.InterestedStageActive = "active";
                this.Stage1Active = "";
                this.DocumentActive = "";
            }//val == 3 && (
            else if (this.insCarerDetails.CarerStatusId == 2 || this.insCarerDetails.CarerStatusId == 8 || this.insCarerDetails.CarerStatusId == 9 || this.insCarerDetails.CarerStatusId == 10) {
                if (val == 3) {
                    this.StatusEndDateVisible = true;
                    this.statusEndDataLabelName = "Stage 1 End Date";
                }

                this.StatusIdCheckList = 2;
                this.objCarerCheckList.CarerParentId = this.CarerParentId;
                this.objCarerCheckList.ControlLoadFormat = ['Interested', 'Stage1'];
                this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerCheckList).then(data => {
                    //  this.cStatusServices.getDynamicControls(this.objCarerCheckList).then(data => {
                    this.InterestedCheckList = data.filter(item => item.ControlLoadFormat.indexOf("Interested") != -1);
                    // this.InterestedCheckList.forEach(d => {
                    //     d.IsDisabled = true;
                    // });
                    let temp = data.filter(item => item.ControlLoadFormat.indexOf("Stage1") != -1);
                    if (val != 3) {
                        temp.forEach(x => x.IsMandatory = false);
                    }
                    this.Stage1CheckList = temp;

                    if (this.Stage1CheckList.length > 0)
                        this.checkListHidden = false;
                });
                this.InterestedStageActive = "";
                this.Stage1Active = "active";
                this.DocumentActive = "";
            }
            else {
                this.dynamicformcontrol = null;
                this.checkListHidden = true;
            }
            //End

            if (val == 3 && this.objCarerstatusCnfg.CarerStatusId == 2) {
                this.IsVisibleAssessor = false;
            }
            else if (this.objCarerstatusCnfg.CarerStatusId == 2) {
                this.IsVisibleAssessor = true;
            }

            if (val != 0) {
                //  this.ReasonChange(1);
                this.objCarerStatusChange.ReasonId = null;
                this.lstReason = [];
                const value = this.carerstatusList.find((item: any) => item.ModuleStatusCnfgId == val).StatusName;
                var indexRejected = value.indexOf("Rejected");
                if (indexRejected == 0) {
                    this.lstReason = this.lstrejectReson;
                }

                const valueWithdrawn = this.carerstatusList.find((item: any) => item.ModuleStatusCnfgId == val).StatusName;
                var indexWithdrawn = valueWithdrawn.indexOf("Withdrawn");
                if (indexWithdrawn == 0) {
                    this.lstReason = this.lstWithDrawnReason;
                }
                else if (val == 5||val == 8||val == 11) {
                    this.lstReason = this.lstonHoldReson;
                }


                if (indexRejected == 0 || indexWithdrawn == 0 ||val == 5||val == 8||val == 11) {
                    this.IsVisibleReasonId = false;
                }
                else {
                    this.IsVisibleReasonId = true;
                }


                var index = value.indexOf("hold");
                if (index === -1) {
                    this.IsVisibleOnHoldReminderDate = true;
                } else {
                    this.IsVisibleOnHoldReminderDate = false;
                }
            }

        }
    }

    fnInterested() {
        this.InterestedStageActive = "active";
        this.Stage1Active = "";
        this.DocumentActive = "";
    }
    fnStage1() {
        this.InterestedStageActive = "";
        this.Stage1Active = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.InterestedStageActive = "";
        this.Stage1Active = "";
        this.DocumentActive = "active";
    }

    Isok = false;
    IsValidOnHoldReminderDate = true;
    IsValidReasonId = true;
    DocOk = true;

    clicksubmit(form, dynamicDataInter, dynamicformbuilderInter
        , dynamicDataS1, dynamicformbuilderS1, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
        this.submitted = true;
        this.Isok = false;
        this.IsValidOnHoldReminderDate = true;
        this.IsValidReasonId = true;
        this.DocOk = true;

        if (!this.IsVisibleOnHoldReminderDate && !this.objCarerStatusChange.OnHoldReminderDate) {
            this.IsValidOnHoldReminderDate = false;
        }
        else {
            this.IsValidOnHoldReminderDate = true;
        }

        if (!this.IsVisibleReasonId && (this.objCarerStatusChange.ReasonId == null || this.objCarerStatusChange.ReasonId == 0)) {
            this.IsValidReasonId = false;
        } else {
            this.IsValidReasonId = true;
        }

        if (!form.valid) {
            this.module.GetErrorFocus(form);
        } else if (!dynamicformbuilderInter.valid) {
            this.InterestedStageActive = "active";
            this.Stage1Active = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicformbuilderInter);
        } else if (!dynamicformbuilderS1.valid) {
            this.InterestedStageActive = "";
            this.Stage1Active = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicformbuilderS1);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.InterestedStageActive = "";
            this.Stage1Active = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }

        if (form.valid) {
            this.Isok = true;
        }

        //Move stage 1 to stage 2 validation
        if (!this.IsVisibleAssessor) {
            if (this.objCarerStatusChange.AssessorName == null || this.objCarerStatusChange.AssessorName == ''
                || this.objCarerStatusChange.AssessorEmail == null || this.objCarerStatusChange.AssessorEmail == ''
                || this.objCarerStatusChange.AssessorSupervisor == null || this.objCarerStatusChange.AssessorSupervisor == ''
            ) {
                this.Isok = false;
            }
        }

        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        if (this.StatusEndDateVisible == true && this.objCarerStatusChange.StatusEndDate == null) {
            this.Isok = false;
        }

        if (this.Isok && this.DocOk && this.IsValidOnHoldReminderDate && this.IsValidReasonId && dynamicformbuilderInter.valid && dynamicformbuilderS1.valid) {
            this.isLoading = true;
            let type = "save";
            // if (this.StatusIdCheckList == 1)
            //     this.objCarerStatusChange.DynamicValue = dynamicDataInter;
            // else if (this.StatusIdCheckList == 2)
            //     this.objCarerStatusChange.DynamicValue = dynamicDataS1;

            this.objCarerStatusChange.DynamicValue = dynamicDataS1;
            this.objCarerStatusChange.DynamicValueInter = dynamicDataInter;

            this.objCarerStatusChange.SId = this.StatusIdCheckList;
            this.objCarerStatusChange.CarerId = this.carerId;
            this.objCarerStatusChange.CarerParentId = this.insCarerDetails.CarerParentId;
            this.objCarerStatusChange.NotificationEmailIds = EmailIds;
            this.objCarerStatusChange.NotificationAddtionalEmailIds = AddtionalEmailIds;

            this.objCarerStatusChange.OnHoldReminderDate = this.module.GetDateSaveFormat(this.objCarerStatusChange.OnHoldReminderDate);
            this.objCarerStatusChange.StatusEndDate = this.module.GetDateSaveFormat(this.objCarerStatusChange.StatusEndDate);
            this.objCarerStatusChange.ChangeDate = this.module.GetDateSaveFormat(this.objCarerStatusChange.ChangeDate);
            this.objCarerStatusChange.DateofCompletion = this.module.GetDateSaveFormat(this.objCarerStatusChange.DateofCompletion);
            this.objCarerStatusChange.MidPointReviewDate = this.module.GetDateSaveFormat(this.objCarerStatusChange.MidPointReviewDate);

            //  this.cStatusServices.post(this.objCarerStatusChange, type).then(data => this.Respone(data, type, IsUpload));
            this.apiService.save(this.controllerName, this.objCarerStatusChange, type).then(data => this.Respone(data, type, IsUpload));
        }
    }

    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (IsUpload) {
                this.uploadCtrl.fnUploadAll(this.CarerParentId);
            }
            if (type == "save") {
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            this.statusId = this.objCarerStatusChange.StatusId
            this.ApplicantProfileVal.PCFullName = this.insCarerDetails.PCFullName;
            this.ApplicantProfileVal.SCFullName = this.insCarerDetails.SCFullName;
            this.ApplicantProfileVal.CarerCode = this.insCarerDetails.CarerCode;
            this.ApplicantProfileVal.CarerParentId = this.insCarerDetails.CarerParentId;
            this.ApplicantProfileVal.CarerId = this.insCarerDetails.CarerId;
            this.ApplicantProfileVal.CarerStatusName = this.statusName;
            this.ApplicantProfileVal.CarerStatusId = this.statusId;
            this.ApplicantProfileVal.ContactInfo.City = this.insCarerDetails.ContactInfo.City;
            this.ApplicantProfileVal.AreaOfficeName = this.insCarerDetails.AreaOfficeName;
            this.ApplicantProfileVal.CreatedDate = this.insCarerDetails.CreatedDate;
            this.ApplicantProfileVal.PersonalInfo.ImageId = this.insCarerDetails.PersonalInfo.ImageId;
            this.ApplicantProfileVal.AvailableVacancies = this.insCarerDetails.AvailableVacancies;
            this.ApplicantProfileVal.ApproveVacancies = this.insCarerDetails.ApproveVacancies;
            this.ApplicantProfileVal.SupervisingSocialWorker = this.insCarerDetails.SupervisingSocialWorker;

            this.objApplicantProfileVal = this.ApplicantProfileVal;
            Common.SetSession("SelectedApplicantProfile", JSON.stringify(this.ApplicantProfileVal));
            this._router.navigate(['/pages/recruitment/applicantlist/13']);
            this.objCarerStatusChange.StatusId = null;
            this.objCarerStatusChange.ChangeDate = null;
            this.objCarerStatusChange.Comments = null;
            this.IsVisibleOnHoldReminderDate = true;
            this.IsVisibleReasonId = true;
            this.ReasonOtherVisible = true;
            this.submitted = false;
            this.BindCarerInfo();
            this.BindCarerstatusHistory();
        }
    }

    statusEndDataLabelName2 = "";
    fnEditHistory(CarerStatusChangeId) {
        let details = this.carerstatusHistory.filter(x => x.CarerStatusChangeId == CarerStatusChangeId);
        if (details.length > 0) {
            this.CopyProperty(details[0], this.objCarerStatusChangeEdit);
            this.objCarerStatusChangeEdit.StatusEndDate = this.module.GetDateEditFormat(this.objCarerStatusChangeEdit.StatusEndDate);
            this.objCarerStatusChangeEdit.ChangeDate = this.module.GetDateEditFormat(this.objCarerStatusChangeEdit.ChangeDate);

            if (this.objCarerStatusChangeEdit.StatusId == 2) {
                this.statusEndDataLabelName2 = "Interested Stage End Date";
            }
            else if (this.objCarerStatusChangeEdit.StatusId == 3)  {
                this.statusEndDataLabelName2 = "Stage 1 End Date";
            }
        }
        let event = new MouseEvent('click', { bubbles: true });
        this.btnEditHistory.nativeElement.dispatchEvent(event);
    }

    private CopyProperty(souerce: CarerStatusChange, target: CarerStatusChange) {
        target.StatusEndDate = souerce.StatusEndDate;
        target.ChangeDate = souerce.ChangeDate;
        target.Comments = souerce.Comments;
        target.CarerStatusChangeId = souerce.CarerStatusChangeId;
        target.StatusName = souerce.StatusName;
        target.StatusId = souerce.StatusId;
    }

    fnUpdateHistory() {
        if (this._FormEdit.valid) {
            this.isLoading = true;
            this.objCarerStatusChangeEdit.ChangeDate = this.module.GetDateSaveFormat(this.objCarerStatusChangeEdit.ChangeDate);
            this.objCarerStatusChangeEdit.StatusEndDate = this.module.GetDateSaveFormat(this.objCarerStatusChangeEdit.StatusEndDate);
            this.apiService.save(this.controllerName, this.objCarerStatusChangeEdit, "update").then(data => this.ResponeEdit(data));

        }

    }

    private ResponeEdit(data) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
            let event = new MouseEvent('click', { bubbles: true });
            this.btnEditHistory.nativeElement.dispatchEvent(event);
            this.BindCarerstatusHistory();
        }
    }

}
