import { Component, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';
import { ComplianceDTO } from '../superadmin/DTO/compliance';
import { AnnualReviewDTO } from './DTO/annualreview';
import { AnnualReviewApprovalRecomDTO } from './DTO/annualreviewapprovalrecom';
import { AnnualReviewPlacementInfoDTO } from './DTO/annualreviewplacementinfo';

declare var window: any;
declare var $: any;
@Component({
    selector: 'AnnualReviewFcSignature',
    templateUrl: './annualreviewfcsignature.component.template.html',
    styles: [`[required]  {
        border-left: 5px solid blue;
    }

    .ng-valid[required], .ng-valid.required  {
            border-left: 5px solid #42A948; /* green */
}
    .ng-invalid:not(form)  {
        border-left: 5px solid #a94442; /* red */
}`]
})

export class CarerAnnualReviewFCSignatureComponet {
    public returnVal:any[];
    controllerName = "CarerAnnualReview";
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    dynamicformcontrolPlacementInfo = [];
    dynamicformcontrolOG = [];
    objAnnualReviewgetDTO: AnnualReviewDTO = new AnnualReviewDTO();
    objAnnualReviewDTO: AnnualReviewDTO = new AnnualReviewDTO();
    objComplianceDTO: ComplianceDTO = new ComplianceDTO();
    submitted = false;
    _Form: FormGroup;
    objQeryVal;
    CarerInfos;
    insCarerId;
    globalObjCourseAttendedList = [];
    globalObjStatutoryCheckList = [];
    globalObjStatutoryCheckListInsur = [];
    Placements;
    ApprovalRecomVal = [];
    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    //Dynamic Grid
    childList
    childListTemp;
    deletbtnAccess = false;
    globalObjAtteStatusList = [];
    objPlacementInfoList: AnnualReviewPlacementInfoDTO[] = [];
    submittedStatus = false;
    dynamicformcontroldataGrid;
    CarerParentId: number;
    insCarerDetails;

    Page1Active = "active";
    Page2Active = "";
    Page3Active = "";
    Page4Active = "";
    Page5Active = "";
    PlacementPageActive = "";
    DocumentActive = "";
    isLoading: boolean = false;
    SocialWorkerName;
    SocialWorkerId;
    insApprRecomStatusChange = 0;
    //Print
    CarerCode;
    SequenceNo: number;
    AgencyProfileId: number;
    ///SaveDraftInfo
    @ViewChild('ApprovalRecommendation') childApprovalRecommendation;
    Page2Visible = true;
    Page3Visible = true;
    Page4Visible = true;
    PlacementInfoVisible = true;
    //signature
    lstCarerSecA = [];
    dynamicformcontrol = [];
    //Signature
    lstAgencySignatureCnfg=[];
    AgencySignatureHidden=false;
    UserTypeId;
    constructor(private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private _router: Router,
        private module: PagesComponent,
        private apiService: APICallService, private renderer: Renderer2) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3]);
        }
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        this.SequenceNo = this.objQeryVal.sno;
        this.objAnnualReviewDTO.SequenceNo = this.SequenceNo;
        this.objAnnualReviewDTO.CarerParentId = this.CarerParentId;
        this.objAnnualReviewDTO.AgencyProfileId = this.AgencyProfileId;
        this.BindCarerAnnualReviewDetail();
        if (Common.GetSession("SelectedCarerProfile") != null) {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
            this.CarerCode = this.insCarerDetails.CarerCode;
        }

        this.deletbtnAccess = this.module.GetDeletAccessPermission(53);
        this.SocialWorkerName = Common.GetSession("ACarerSSWName");
        this.SocialWorkerId = Common.GetSession("ACarerSSWId");

        if (this.SocialWorkerName == "null")
            this.SocialWorkerName = "Not Assigned";
        //doc
        this.formId = 53;
        Common.SetSession("formcnfgid", this.formId);
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.objQeryVal.id;
        this.objComplianceDTO.CarerParentId = this.CarerParentId;
        this.objComplianceDTO.SequenceNo = this.SequenceNo;
        //Get Dynamic Controls
        //Bind Signature
        this.apiService.get("AgencySignatureCnfg", "GetMappedSignature", 53).then(data => {
          this.lstAgencySignatureCnfg=data;
        });
        //Get Annuai review Statutory Check
        this.BindStatutoryCheck();
        //Get Carer info
        this.GetCarerInfo();

        this._Form = _formBuilder.group({
            ChildId: ['0', Validators.required],
            AgencySignatureCnfgId:['0',Validators.required],
        });

        //Get New Review Agency Config Value
        this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 1;

        this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
            this.objAgencyKeyNameValueCnfgDTO = data;
        });
        this.UserTypeId= Common.GetSession("UserTypeId");
        if(this.UserTypeId==4)
        {
            this.objAnnualReviewDTO.AgencySignatureCnfgId=1;
            this.AgencySignatureHidden=true;
            this.AgencySignatureCnfgChange(1)
        }
    }
    AgencySignatureCnfgChange(id) {
      this.submitted=false;
      this.objAnnualReviewDTO.AgencySignatureCnfgId=id;
      this.BindSingnature();
    }

    BindSingnature()
    {
      this.dynamicformcontrol=[];
      this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objAnnualReviewDTO).then(data => {
        this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
       });
    }

    BindCarerAnnualReviewDetail() {
        if (this.CarerParentId != 0 && this.CarerParentId != null) {
            this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objAnnualReviewDTO).then(data => {
                this.lstCarerSecA = data.filter(x => x.ControlLoadFormat != 'FCSignature');
                this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
                this.setTabVisible();
            });
        }
    }

    clicksubmit(SectionAdynamicValue, SectionAdynamicForm) {
        this.submitted = true;
        if (SectionAdynamicForm.valid) {
            let type = "save";
            this.objAnnualReviewDTO.DynamicValue = SectionAdynamicValue;
            this.objAnnualReviewDTO.CarerParentId = this.CarerParentId;
            this.apiService.post(this.controllerName, "SaveFcSignature", this.objAnnualReviewDTO).then(data => this.Respone(data, type));
        }
        else
        {
            this.Page1Active = "";
            this.Page2Active = "";
            this.Page3Active = "";
            this.Page4Active = "";
            this.Page5Active = "";
            this.PlacementPageActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(SectionAdynamicForm);
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            this._router.navigate(['/pages/fostercarer/annualreviewlist/3']);
        }
    }

    setTabVisible() {
        let insPage2Visible = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Page2');
        if (insPage2Visible.length > 0) {
            this.Page2Visible = false;
        }

        let isnPage3Visible = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Page3');
        if (isnPage3Visible.length > 0)
            this.Page3Visible = false;

        let insPage4Visible = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Page4');
        if (insPage4Visible.length > 0)
            this.Page4Visible = false;

        let insPlacementInfo = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'PlacementInfo');
        if (insPlacementInfo.length > 0)
            this.PlacementInfoVisible = false;
    }
    BindStatutoryCheck() {
        this.apiService.post("StatutoryCheck", "GetAnnualReviwe", this.objComplianceDTO).then(data => {
            this.LoadStatutoryCheck(data);
        })
    }
    fnPage1() {
        this.Page1Active = "active";
        this.Page2Active = "";
        this.Page3Active = "";
        this.Page4Active = "";
        this.Page5Active = "";
        this.PlacementPageActive = "";
        this.DocumentActive = "";
    }
    fnPage2() {
        this.Page1Active = "";
        this.Page2Active = "active";
        this.Page3Active = "";
        this.Page4Active = "";
        this.Page5Active = "";
        this.PlacementPageActive = "";
        this.DocumentActive = "";
    }
    fnPage3() {
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "active";
        this.Page4Active = "";
        this.Page5Active = "";
        this.PlacementPageActive = "";
        this.DocumentActive = "";
    }
    fnPage4() {
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "";
        this.Page4Active = "active";
        this.Page5Active = "";
        this.PlacementPageActive = "";
        this.DocumentActive = "";
    }
    fnPage5() {
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "";
        this.Page4Active = "";
        this.Page5Active = "active";
        this.PlacementPageActive = "";
        this.DocumentActive = "";
    }
    fnPlacementPage() {
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "";
        this.Page4Active = "";
        this.Page5Active = "";
        this.PlacementPageActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "";
        this.Page4Active = "";
        this.Page5Active = "";
        this.PlacementPageActive = "";
        this.DocumentActive = "active";
    }
    //Annual Review Statutory Check List
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
                        this.PrimaryCheckVisi = true;
                    else if (subItem.MemberTypeId == 2)
                        this.SecondCheckVisi = true;
                    else if (subItem.MemberTypeId == 3)
                        this.CarerFamilyCheckVisi = true;
                    else if (subItem.MemberTypeId == 4)
                        this.BackupCarerCheckVisi = true;
                    else if (subItem.MemberTypeId == 5)
                        this.BackupCarerFamilyCheckVisi = true;
                });

                if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 1)
                    this.globalPrimaryCheckList.push(this.objStatutoryCheckList);
                else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 2)
                    this.globalSecondCheckList.push(this.objStatutoryCheckList);
                else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 3)
                    this.globalCarerFamilyCheckList.push(this.objStatutoryCheckList);
                else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 4)
                    this.globalBackupCarerCheckList.push(this.objStatutoryCheckList);
                else if (this.objStatutoryCheckList.length > 0 && this.objStatutoryCheckList[0].MemberTypeId == 5)
                    this.globalBackupCarerFamilyCheckList.push(this.objStatutoryCheckList);
            });
        }
    }
    lstCarerTrainingProfile;
    //Get Carer info//
    GetCarerInfo() {
        this.apiService.post(this.controllerName, "GetByParentId", this.objComplianceDTO).then(data => {
            this.CarerInfos = data;
            this.insCarerId = data.CarerId;
            this.childList = data.ChildPlacement;
            this.childListTemp = data.ChildPlacement;
            Common.SetSession("AnnualRevChildPlacement", JSON.stringify(this.childList));

            this.lstCarerTrainingProfile = data.LstCarerTrainingCourseDate;

            this.Placements = data.Placements;
            this.FillListApprovalRecom(data.ApprovalRecomList);
            this.LoadAlreadyChildPlacementInfo(data.ChildPlacementInfo);
        });
    }
    //Placement Info Dynamic Grd
    childName;
    fnChildChange(values) {
        if (values != null && values != "") {
            let cName = this.childList.find((item: any) => item.ChildId == values).ChildCode;
            let cAge = this.childList.find((item: any) => item.ChildId == values).ChildAge;
            //  alert(cName);
            //  alert(cAge);
            this.childName = cName + " (" + cAge + ")"
        }
        //  alert(this.childName);
    }
    //---Dynamic Grid
    AnnualReviewPlacementInfoDirty = false;
    objAttendedStatusListInsert = [];
    LoadAlreadyChildPlacementInfo(data) {

        //    console.log(data);
        if (data != null) {
            data.forEach(item => {
                this.objPlacementInfoList = [];
                item.forEach(subItem => {
                    let add: AnnualReviewPlacementInfoDTO = new AnnualReviewPlacementInfoDTO();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.StatusId = 4;
                    add.DisplayName = subItem.DisplayName;
                    add.ChildName = subItem.ChildCode + " (" + subItem.ChildAge + ")";
                    add.ChildId = subItem.ChildId;
                    this.objPlacementInfoList.push(add);
                    this.objAttendedStatusListInsert.push(add);

                    //remove already stored child
                    let check = this.childList.filter(x => x.ChildId == subItem.ChildId);
                    if (check.length > 0) {
                        const index: number = this.childListTemp.findIndex(x => x.ChildId == subItem.ChildId);
                        this.childList.splice(index, 1);
                    }
                });
                this.globalObjAtteStatusList.push(this.objPlacementInfoList);
            });
        }
    }
    //---End

    objAnnualReviewApprovalRecomInfoList: AnnualReviewApprovalRecomDTO[] = [];
    FillListApprovalRecom(refinfo: AnnualReviewApprovalRecomDTO[]) {
        this.objAnnualReviewApprovalRecomInfoList = [];
        if (refinfo != null && refinfo[0] != null) {
            refinfo.forEach(item => {
                if (item.StatusId != 3) {
                    let addApprovalRecom: AnnualReviewApprovalRecomDTO = new AnnualReviewApprovalRecomDTO();
                    addApprovalRecom.CarerAnnualReviewApprovalRecomId = item.CarerAnnualReviewApprovalRecomId;
                    addApprovalRecom.NoOfChildren = item.NoOfChildren;
                    addApprovalRecom.Age = item.Age;
                    addApprovalRecom.Gender = item.Gender;
                    addApprovalRecom.Ethnicity = item.Ethnicity;
                    addApprovalRecom.Religion = item.Religion;
                    addApprovalRecom.EthnicityName = item.EthnicityName;
                    addApprovalRecom.ReligionName = item.ReligionName;
                    addApprovalRecom.IsActive = true;
                    this.objAnnualReviewApprovalRecomInfoList.push(addApprovalRecom);
                }
            });
        }
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
