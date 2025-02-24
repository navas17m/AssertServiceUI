import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { ValChangeDTO } from '../dynamic/ValChangeDTO';
import { PagesComponent } from '../pages.component';
//import { CarerFormFAddendumService } from '../services/carerformfaddendum.service'
import { CarerFormFAddendumDTO } from '../recruitment/DTO/carerformfaddendumdto';
import { CarerParentDTO } from '../recruitment/DTO/carerparent';
import { TrainingAttendedStatusDTO } from '../recruitment/DTO/trainingattendedstatus';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import * as moment from 'moment';
import { UserAuditHistoryDetailDTO } from '../common';
@Component({
    selector: 'carerformfaddendum',
    templateUrl: './carerformfaddendum.component.template.html'
    //,providers: [CarerFormFAddendumService]
})

export class CarerFormFAddendumComponent {
    public returnVal:any[];
    controllerName = "CarerFormFAddendum";
    objCarerFormFAddendumDTO: CarerFormFAddendumDTO = new CarerFormFAddendumDTO();
    submitted = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    isVisibleMandatortMsg;
    IsVisibleSC = false; objQeryVal;
    //get carer info from session
    insCarerDetails: CarerParentDTO = new CarerParentDTO();
    CarerInfos;
    globalObjCourseAttendedList = [];
    Placements;
    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerParentId: number;
    AgencyProfileId: number;
    FormFAddendumActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    SocialWorkerName;
    SocialWorkerId;
    lstCourseStatus=[];
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private activatedroute: ActivatedRoute,
        private _formBuilder: FormBuilder, private _router: Router, private module: PagesComponent, private apiService: APICallService) {
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.formId = 39;
        if (this.objQeryVal.mid == 36 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 36, 24]);
        }
        else if (this.objQeryVal.mid == 37 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 37, 24]);
        }
        else if (this.objQeryVal.mid == 36) {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
         //   this.formId = 67;
            if (Common.GetSession("SelectedCarerProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
            }
            this.fnBindCourseAttendedStatus();
            this.GetCarerTrainingAndPlacementsInfo();

            this.SocialWorkerName = Common.GetSession("ACarerSSWName");
            this.SocialWorkerId = Common.GetSession("ACarerSSWId");

        } else if (this.objQeryVal.mid == 37) {
            this.formId = 39;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            if (Common.GetSession("SelectedApplicantProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
            }
            this.fnBindCourseAttendedStatus();
            this.GetCarerTrainingAndPlacementsInfo();
            this.SocialWorkerName = Common.GetSession("CarerSSWName");
            this.SocialWorkerId = Common.GetSession("CarerSSWId");
        }
        //doc

        if (this.SocialWorkerName == "null")
            this.SocialWorkerName = "Not Assigned";

        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.CarerParentId;
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objCarerFormFAddendumDTO.AgencyProfileId = this.AgencyProfileId;
        this.objCarerFormFAddendumDTO.CarerParentId = this.CarerParentId;
        this.objCarerFormFAddendumDTO.ControlLoadFormat = ["Addendum To FormF"]
        this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerFormFAddendumDTO).then(data =>
        //  cffaServics.getByFormCnfgId(this.objCarerFormFAddendumDTO).then(data =>
        {
            this.dynamicformcontrol = data;

            let val3 = data.filter(x => x.FieldCnfg.FieldName == "SocialWorkerId");
            if (val3.length > 0 && val3[0].FieldCnfg.DisplayName != null)
                this.SocialWorkerName = val3[0].FieldCnfg.DisplayName;
        });
        this._Form = _formBuilder.group({});
        this.objUserAuditDetailDTO.ActionId = 4;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.formId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    fnBindCourseAttendedStatus()
    {
        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = "Course Attended Status"
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => {
            this.lstCourseStatus = data;
           // console.log(this.lstCourseStatus);
        });

    }

    fnGetCourseStatusValue(id)
    {

      //  return 'online';
        let temp=this.lstCourseStatus.filter(x=>x.CofigTableValuesId==id);
        if(temp.length>0)
        {
            return temp[0].Value;
        }

    }
    lstCarerTrainingProfile;
    GetCarerTrainingAndPlacementsInfo() {
        this.apiService.get(this.controllerName, "GetTrainingProfileByCarerParentId", this.CarerParentId).then(data => {
            //this.cffaServics.getTrainingProfileByParentId(this.CarerParentId).then(data => {
            this.CarerInfos = data;
            this.lstCarerTrainingProfile = data.LstCarerTrainingCourseDate;
            this.Placements = data.Placements;
        });
    }

    objAttendedStatusList = [];
    TrainingCourseAttededDetails(data) {
        if (data != null) {
            data.forEach(item => {
                this.objAttendedStatusList = [];
                item.forEach(subItem => {
                    let add: TrainingAttendedStatusDTO = new TrainingAttendedStatusDTO();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.CoursesAttended = subItem.CoursesAttended;
                    add.CarerName = subItem.CarerName;
                    add.StatusId = 4;
                    this.objAttendedStatusList.push(add);
                });
                this.globalObjCourseAttendedList.push(this.objAttendedStatusList);
            });
        }
    }

    fnFormFAddendum() {
        this.FormFAddendumActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.FormFAddendumActive = "";
        this.DocumentActive = "active";
    }

    DocOk = true;
    clicksubmit(mainFormBuilder, dynamicFormA, dynamicFormBuliderA, UploadDocIds, IsUpload, uploadFormBuilder,
        AddtionalEmailIds, EmailIds) {
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

        if (!mainFormBuilder.valid) {
            this.FormFAddendumActive = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(mainFormBuilder);
        } else if (!dynamicFormBuliderA.valid) {
            this.FormFAddendumActive = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicFormBuliderA);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.FormFAddendumActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }

        if (this.DocOk && mainFormBuilder.valid && dynamicFormBuliderA.valid) {
            this.isLoading = true;
            let type = "save";
            if (dynamicFormA[0].UniqueId != 0)
                type = "update";
            if(type == "save"){
            let val2 = dynamicFormA.filter(x => x.FieldName == "SocialWorkerId");
            if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == ''))
                val2[0].FieldValue = this.SocialWorkerId;
        }
            this.objCarerFormFAddendumDTO.DynamicValue = dynamicFormA;
            this.objCarerFormFAddendumDTO.CarerParentId = this.CarerParentId;
            this.objCarerFormFAddendumDTO.NotificationEmailIds = EmailIds;
            this.objCarerFormFAddendumDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            // this.cffaServics.post(this.objCarerFormFAddendumDTO, type).then(data => this.Respone(data, type, IsUpload));
            this.apiService.save(this.controllerName, this.objCarerFormFAddendumDTO, type).then(data => this.Respone(data, type, IsUpload));
        }
    }

    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.CarerParentId);
                }
                this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerFormFAddendumDTO).then(data =>
                {
                    this.dynamicformcontrol = data;
                    this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                    this.objUserAuditDetailDTO.ActionId =1;
                });

            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.CarerParentId);
                }
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =2;
            }
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }


    DynamicOnValChange(InsValChange: ValChangeDTO) {

        if (InsValChange.currnet.FieldCnfg.FieldName == "SocialWorkerId") {
            InsValChange.currnet.IsVisible = false;
        }
    }
}
