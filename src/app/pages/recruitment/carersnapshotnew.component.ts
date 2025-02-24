import { Component, Input } from '@angular/core';
import { APICallService } from '../services/apicallservice.service';
import { CarerParentDTO } from './DTO/carerparent';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Common } from '../common'
//import { ANIMATION_TYPES } from 'ng2-loading-spinner';
//import { INg2LoadingSpinnerConfig } from 'ng2-loading-spinner';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { NgxSpinnerService } from "ngx-spinner";
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'CarerSnapshotNew',
    templateUrl: './carersnapshotnew.component.template.html',
    styleUrls: ['./carersnapshotnew.component.scss'],
    styles:[`circle-progress {
        width: 226px;
        height: 226px;
    }`],

})
export class CarerSnapshotNewComponet {
    controllerName = "CarerInfo";
    objCarerParentDTO: CarerParentDTO = new CarerParentDTO();
    objQeryVal;
    objCarerSnapshot;
    CarerParentId;
    insCarerId;
    isChecked=true;
    objCarerProfile;
    objSCCarerProfile;
    objAnnualReview = [];
    objTrainingAttended = [];
    objHealthandSafety = [];
    objSafeCareStrategies = [];
    objSupervisoryHomeVisit = [];
    objPetQuestionnaire = [];
    objDayLogJournalEntries = [];
    onjPCStatutoryCheck = [];
    objSCStatutoryCheck = [];
    objApprovalDetails;
    insCircleProgressVal:number=0;
    lstPlacedChild=[];
    objChildPlacement = [];
    objPlacementDischargeHistory = [];
    objTransferHistory = [];
    objBackupCarerPlacement = [];
    showSpinner: boolean = true;

    srcPath = "assets/img/app/Photonotavail.png";
    scsrcPath = "assets/img/app/Photonotavail.png";
    AgencyProfileId;

    @Input()
    set CarerId(id: number) {
        this.insCarerId = id;
        this.objCarerProfile=null;
        this.insCircleProgressVal=0;
        this. insPChaveDBSMedicalCheck=0;
        this. insSChaveDBSMedicalCheck=0;
        this.BindSnapshotInfo(id);
    }

    insCarerDetails;
    TPLimit:number = 10;
    footerMessage = {
      'emptyMessage' : '',
      'totalMessage' : 'Records'
    }
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _router: Router,private activatedroute: ActivatedRoute,private apiService: APICallService, private spinner:NgxSpinnerService) {
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.fnBindCourseAttendedStatus();
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 42]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 35]);
        }
        else if (this.objQeryVal.mid == 3) {
            if (Common.GetSession("SelectedCarerProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
                this.insCarerId = this.insCarerDetails.CarerId;
            }
            this.BindSnapshotInfo(this.insCarerId);
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.GetCarerTrainingAndPlacementsInfo();
            this.objUserAuditDetailDTO.FormCnfgId = 305;
        }
        else if (this.objQeryVal.mid == 13) {
            if (Common.GetSession("SelectedApplicantProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
                this.insCarerId = this.insCarerDetails.CarerId;
            }
            this.BindSnapshotInfo(this.insCarerId);
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.GetCarerTrainingAndPlacementsInfo();
            this.objUserAuditDetailDTO.FormCnfgId = 304;
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
       // this.insCircleProgressVal=10;
    }

    lstCourseStatus=[];
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
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
        let temp=this.lstCourseStatus.filter(x=>x.CofigTableValuesId==id);
        if(temp.length>0)
        {
            return temp[0].Value;
        }

    }

    BindSnapshotInfo(id) {
        if (id != null && id != '') {
            this.objCarerParentDTO.CarerId = id;
            this.spinner.show();
            this.apiService.get(this.controllerName, "GetSnapShotInfo", id).then(data => {
                // this.cssServices.GetSnapShotDetails(id).then(data => {
                // console.log(data);
                //console.log("11");

                this.objCarerProfile = data.PrimaryCarer;

                this.lstPlacedChild=data.LstPlacedChild;
                this.objSCCarerProfile = data.SecondCarer;
                this.objAnnualReview = data.CarerAnnualReview;
                this.objTrainingAttended = data.CarerTrainingProfile;
                this.objHealthandSafety = data.CarerHealthAndSafetyInfo.filter(x=>x.FieldName=="DateOfInspection");
                this.objSafeCareStrategies = data.CarerSaferPolicy.filter(x=>x.FieldName=="InspectionDate");
                this.objSupervisoryHomeVisit = data.CarerSupervisoryHomeVisit.filter(x=>x.FieldName=="HomeVisitDate");
               // console.log(this.objSupervisoryHomeVisit);
                this.objPetQuestionnaire = data.CarerPetQuestionnaire.filter(x=>x.FieldName=="PetQuestionnaireDate");
                this.objDayLogJournalEntries = data.CarerDayLogJournal;
                this.LoadStatutoryCheck(data.StatutoryCheck);
                // this.objSCStatutoryCheck = data.SCStatutoryCheck;
                this.objApprovalDetails = data.CarerApprovalPreference;
                this.fnShowImage(this.objCarerProfile.PersonalInfo.ImageId);
                if (data.SecondCarer)
                    this.fnSCShowImage(this.objSCCarerProfile.PersonalInfo.ImageId);


                this.objChildPlacement = data.lstChildPlacement.filter(x => x.PlacementEndDate == null && (x.PlacementStartTypeId == 1 || x.PlacementStartTypeId == 2 || x.PlacementStartTypeId == 3));
                //this.objPlacementDischargeHistory = data.lstChildPlacement.filter(item =>
                //    item.PlacementEndDate == null
                //    || item.PlacementEndReasonId == 4 || item.PlacementStartTypeId == 2 || item.PlacementStartTypeId != 3);

                this.objPlacementDischargeHistory = data.lstChildPlacement.filter(item => (item.PlacementStartTypeId != 3 && item.PlacementEndDate == null) || item.PlacementEndReasonId == 4);
                this.objTransferHistory = data.lstChildPlacement.filter(item => item.PlacementStartTypeId == 3);
                this.objBackupCarerPlacement = data.lstBackupCarerPlacement.filter(x => x.PlacementStartTypeId == 1 && x.PlacementEndDate == null);
                this.fnCalculateCircleProgressVal();
                //this.showSpinner=false;
                this.spinner.hide();
                //  console.log(this.objChildPlacement);

            });
        }
    }

    fnCalculateCircleProgressVal()
    {
        // this.insCircleProgressVal=10;
        let startVal:number=0;
        if(this.objCarerProfile.InitialEnquiryDate)
        {
          // console.log(1);
           this.insCircleProgressVal+=9;
        }
        if(this.objCarerProfile.ApplicationFilledDate)
        {
           // console.log(2);
            this.insCircleProgressVal+=9;
        }
        if(this.objCarerProfile.InitialHomeVisitDate)
        {
           // console.log(3);
            this.insCircleProgressVal+=9;
        }

        if(this.objCarerProfile.StatgeDates.Stage1StartDate !=null && this.objCarerProfile.StatgeDates.Stage1StartDate!='0001-01-01T00:00:00')
        {
          //  console.log(4);
            this.insCircleProgressVal+=9;
        }

        if(this.objCarerProfile.StatgeDates.Stage1EndDate !=null && this.objCarerProfile.StatgeDates.Stage1EndDate!='0001-01-01T00:00:00')
        {
          //  console.log(5);
            this.insCircleProgressVal+=9;
        }

        if(this.objCarerProfile.StatgeDates.Stage2StartDate !=null && this.objCarerProfile.StatgeDates.Stage2StartDate!='0001-01-01T00:00:00')
        {
           // console.log(6);
            this.insCircleProgressVal+=9;
        }

        if(this.objCarerProfile.StatgeDates.Stage2EndDate !=null && this.objCarerProfile.StatgeDates.Stage2EndDate!='0001-01-01T00:00:00')
        {
           // console.log(this.objCarerProfile.StatgeDates.Stage2EndDate);
           // console.log(7);
            this.insCircleProgressVal+=9;
        }

        if(this.objHealthandSafety.length>0)
        {
           // console.log(8);
            this.insCircleProgressVal+=9;
        }

        if(this.objSafeCareStrategies.length>0)
        {
           // console.log(9);
            this.insCircleProgressVal+=9;
        }

        if(this.objApprovalDetails)
        {
           // console.log(10);
            this.insCircleProgressVal+=9;
        }

        this.insCircleProgressVal= Math.round(this.insCircleProgressVal);
    }

    public fnSetImage(image) {
        if (image) {
            return "data:image/jpeg;base64," + image;
        }
        else
            return "assets/img/app/Photonotavail.png";
    }

    IsAgencyHasPPDPField=false;
    lstCarerTrainingProfile=[];
    carerTrainingProfileList = [];
    GetCarerTrainingAndPlacementsInfo() {
        this.apiService.get("CarerFormFAddendum", "GetTrainingProfileByCarerParentId", this.CarerParentId).then(data => {
            this.carerTrainingProfileList = data.carerTrainingCourseDateList;
        });
        // this.apiService.get("CarerFormFAddendum", "GetTrainingProfileByCarerParentId", this.CarerParentId).then(data => {
        //     this.lstCarerTrainingProfile = data.LstCarerTrainingCourseDate;
        //    // this.Placements = data.Placements;
        //    let tem=this.lstCarerTrainingProfile.filter(x=>x.FieldName=="PPDPCompleted");
        //     if(tem.length>0)
        //         this.IsAgencyHasPPDPField=true;
        // });
    }

    public fnShowImage(ImageId) {
        if (ImageId != null) {
            this.apiService.get("UploadDocuments", "GetImageById", ImageId).then(data => {
                //this.uploadServie.GetImageById(ImageId).then(data => {
                this.srcPath = "data:image/jpeg;base64," + data;
            });
        }
        else {
            this.srcPath = "assets/img/app/Photonotavail.png";
        }
    }

    public fnSCShowImage(ImageId) {
        if (ImageId != null) {
            this.apiService.get("UploadDocuments", "GetImageById", ImageId).then(data => {
                // this.uploadServie.GetImageById(ImageId).then(data => {
                this.scsrcPath = "data:image/jpeg;base64," + data;
            });
        }
        else {
            this.scsrcPath = "assets/img/app/Photonotavail.png";
        }
    }
    returnVal=[];
    objStatutoryCheckList = [];
    objStatutoryCheckListInsur = [];
    NonInsurancField = ["ReceivedDate", "RenewDate"];
    InsurancField = ["InsurerName", "PolicyNumber", "ValidtoDate"];
    PrimaryCheckVisi = false;
    SecondCheckVisi = false;
    CarerFamilyCheckVisi = false;
    BackupCarerCheckVisi = false;
    BackupCarerFamilyCheckVisi = false;
    PrimaryInsuCheckVisi = false;
    SecondInsuCheckVisi = false;
    globalPrimaryCheckList = [];
    globalSecondCheckList = [];
    globalCarerFamilyCheckList = [];
    globalBackupCarerCheckList = [];
    globalBackupCarerFamilyCheckList = [];
    globalPrimaryInsuList = [];
    globalSecondInsuCheckList = [];
    globalObjStatutoryCheckList = [];
    globalObjStatutoryCheckListInsur = [];

    insPChaveDBSMedicalCheck=0;
    insSChaveDBSMedicalCheck=0;
    LoadStatutoryCheck(data) {
        this.globalObjStatutoryCheckList = [];
        this.globalObjStatutoryCheckListInsur = [];

        this.globalPrimaryCheckList = [];
        this.globalSecondCheckList = [];
        this.globalCarerFamilyCheckList = [];
        this.globalBackupCarerCheckList = [];
        this.globalBackupCarerFamilyCheckList = [];
        //  console.log(data);
        if (data != null) {
            data.forEach(item => {
                this.objStatutoryCheckList = [];
                this.objStatutoryCheckListInsur = [];
                item.forEach(subItem => {

                    let add: ComplaintInfo = new ComplaintInfo();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.DisplayName = subItem.DisplayName;
                    add.ComplianceCheckId = subItem.ComplianceCheckId;
                    add.UserProfileId = subItem.UserProfileId;
                    add.CheckName = subItem.CheckName;
                    add.MemberTypeId = subItem.MemberTypeId;
                    add.MemberName = subItem.MemberName;
                    add.BackupCarerName = subItem.BackupCarerName;
                    add.DisplayName = subItem.DisplayName;
                    this.objStatutoryCheckList.push(add);

                    //Set Visible
                    if (subItem.MemberTypeId == 1)
                    {
                        this.PrimaryCheckVisi = true;
                    }
                    else if (subItem.MemberTypeId == 2)
                    {
                        this.SecondCheckVisi = true;
                    }
                    else if (subItem.MemberTypeId == 3)
                        this.CarerFamilyCheckVisi = true;
                    else if (subItem.MemberTypeId == 4)
                        this.BackupCarerCheckVisi = true;
                    else if (subItem.MemberTypeId == 5)
                        this.BackupCarerFamilyCheckVisi = true;
                });

                if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 1)
                {
                    //data.filter(t => t.Value.indexOf("Form F") > -1);
                    this.globalPrimaryCheckList.push(this.objStatutoryCheckList);
                    if(this.objStatutoryCheckList[0].CheckName=="DBS Check" || this.objStatutoryCheckList[0].CheckName=="Medical Check AH1" || this.objStatutoryCheckList[0].CheckName=="Medical Check AH2" || this.objStatutoryCheckList[0].CheckName=="Medical Advisor" || this.objStatutoryCheckList[0].CheckName=="Medical")
                    {
                        this.insPChaveDBSMedicalCheck+=1;
                    }
                }
                else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 2)
                {
                    this.globalSecondCheckList.push(this.objStatutoryCheckList);

                    if(this.objStatutoryCheckList[0].CheckName=="DBS Check" || this.objStatutoryCheckList[0].CheckName=="Medical Check AH1" || this.objStatutoryCheckList[0].CheckName=="Medical Check AH2" || this.objStatutoryCheckList[0].CheckName=="Medical Advisor" || this.objStatutoryCheckList[0].CheckName=="Medical")
                    {
                      this.insSChaveDBSMedicalCheck+=1;
                    }
                }
                else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 3)
                    this.globalCarerFamilyCheckList.push(this.objStatutoryCheckList);
                else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 4)
                    this.globalBackupCarerCheckList.push(this.objStatutoryCheckList);
                else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 5)
                    this.globalBackupCarerFamilyCheckList.push(this.objStatutoryCheckList);
            });

            if(this.objSCCarerProfile && this.insPChaveDBSMedicalCheck >= 2 && this.insSChaveDBSMedicalCheck >= 2 )
            {
                this.insCircleProgressVal+=10;
            }
            else if(!this.objSCCarerProfile && this.insPChaveDBSMedicalCheck >= 2)
            {
               // console.log("pc "+this.insPChaveDBSMedicalCheck);
                this.insCircleProgressVal+=10;
            }
        }

    }
    setPageSize(pageSize:string){
      this.TPLimit = parseInt(pageSize);
    }
}

export class ComplaintInfo {
    FieldCnfgId: number;
    FieldName: string;
    FieldValue: string;
    SequenceNo: number;
    FieldDataTypeName: string;
    FieldValueText: string;
    StatusId: number;
    UniqueID: number;
    DisplayName: string;
    ComplianceCheckId: number;
    UserProfileId: number;
    CheckName: string;
    MemberTypeId: string;
    MemberName: string;
    BackupCarerName: string;
}

export class ComplianceCheck {
    ComplianceCheckId: number;
    Name: string;
}
