import { Component, ViewChild } from '@angular/core';
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
    selector: 'annualreviewrainbowfcsignature',
    templateUrl: './annualreviewrainbowfcsignature.component.templte.html',
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

export class CarerAnnualReviewRainbowFCSignatureComponet {
    controllerName = "CarerAnnualReviewRainbow";
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    dynamicformcontrolPlacementInfo = [];
    dynamicformcontrolOG = [];
    objAnnualReviewgetDTO: AnnualReviewDTO = new AnnualReviewDTO();
    objAnnualReviewDTO: AnnualReviewDTO = new AnnualReviewDTO();
    objAnnualReviewDTONew: AnnualReviewDTO = new AnnualReviewDTO();
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
    AgencySignatureHidden;
    PlacementInfoVisible;
    PlacementPageActive;
   // ApprovalRecomVal = [];
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
    Page5Active = "";
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
  //  @ViewChild('ApprovalRecommendation') childApprovalRecommendation;
    Page2Visible = true;
    // Page3Visible = true;
    // Page4Visible = true;
    // PlacementInfoVisible = true;
    //signature
    lstAgencySignatureCnfg=[];
    lstCarerSecA = [];
    dynamicformcontrol = [];
    constructor(private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private _router: Router,
        private module: PagesComponent,
        private apiService: APICallService) {

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

        this.objAnnualReviewDTONew.SequenceNo = this.SequenceNo;
        this.objAnnualReviewDTONew.CarerParentId = this.CarerParentId;
        this.objAnnualReviewDTONew.AgencyProfileId = this.AgencyProfileId;

        this.BindCarerAnnualReviewDetail();
        if (Common.GetSession("SelectedCarerProfile") != null) {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
            this.CarerCode = this.insCarerDetails.CarerCode;
        }

         //Bind Signature
         this.apiService.get("AgencySignatureCnfg", "GetMappedSignature", 338).then(data => {this.lstAgencySignatureCnfg=data});


        this.deletbtnAccess = this.module.GetDeletAccessPermission(53);
        this.SocialWorkerName = Common.GetSession("ACarerSSWName");
        this.SocialWorkerId = Common.GetSession("ACarerSSWId");

        if (this.SocialWorkerName == "null")
            this.SocialWorkerName = "Not Assigned";
        //doc
        this.formId = 338;
        Common.SetSession("formcnfgid", this.formId);
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.objQeryVal.id;
        this.objComplianceDTO.CarerParentId = this.CarerParentId;
        this.objComplianceDTO.SequenceNo = this.SequenceNo;
        //Get Dynamic Controls

        //Get Annuai review Statutory Check
        this.BindStatutoryCheck();
        //Get Carer info
        this.GetCarerInfo();

        this._Form = _formBuilder.group({
            AgencySignatureCnfgId:['0',Validators.required]
        });

        //Get New Review Agency Config Value
        this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 1;

        this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
            this.objAgencyKeyNameValueCnfgDTO = data;
        });
    }

    insAgencySignatureCnfgId:number;
    AgencySignatureCnfgChange(id:string) {
       // this.insAgencySignatureCnfgId=id;
        this.submitted=false;
        this.objAnnualReviewDTO.AgencySignatureCnfgId= parseInt(id);
        this.BindSingnature();
    }

    BindSingnature()
    {
        //console.log(this.objAnnualReviewDTO);
        this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objAnnualReviewDTO).then(data => {
        this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
         });
    }


    BindCarerAnnualReviewDetail() {
        //console.log(this.objAnnualReviewDTO);
        this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objAnnualReviewDTO).then(data => {
            this.lstCarerSecA = data.filter(x => x.ControlLoadFormat != 'FCSignature');
            //this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
        });

    }

    clicksubmit(SectionAdynamicValue, SectionAdynamicForm,AddtionalEmailIds, EmailIds) {
        this.submitted = true;
        if (SectionAdynamicForm.valid) {
            let type = "save";
            this.objAnnualReviewDTO.DynamicValue = SectionAdynamicValue;
            this.objAnnualReviewDTO.CarerParentId = this.CarerParentId;
            this.objAnnualReviewDTO.NotificationEmailIds = EmailIds;
            this.objAnnualReviewDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.apiService.post(this.controllerName, "SaveFcSignature", this.objAnnualReviewDTO).then(data => this.Respone(data, type));
        }
        else
        {
            this.Page1Active = "";
            this.Page2Active = "";
            this.Page5Active = "";
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
            this._router.navigate(['/pages/fostercarer/annualreviewlistrainbow/3']);
        }
    }

    setTabVisible() {
        // let insPage2Visible = this.lstCarerSecA.filter(x => x.ControlLoadFormat == 'Page2');
        // if (insPage2Visible.length > 0) {
        //     this.Page2Visible = false;
        // }
    }
    BindStatutoryCheck() {
        this.apiService.post(this.controllerName, "GetAnnualReviweStatutoryCheck", this.objComplianceDTO).then(data => {
            // console.log(data);
            this.LoadStatutoryCheck(data);
        })
    }
    fnPage1() {
        this.Page1Active = "active";
        this.Page2Active = "";
        // this.Page3Active = "";
        // this.Page4Active = "";
         this.Page5Active = "";
        // this.PlacementPageActive = "";
        this.DocumentActive = "";
    }
    fnPage2() {
        this.Page1Active = "";
        this.Page2Active = "active";
        // this.Page3Active = "";
        // this.Page4Active = "";
         this.Page5Active = "";
        // this.PlacementPageActive = "";
        this.DocumentActive = "";
    }

    fnPage5() {
        this.Page1Active = "";
        this.Page2Active = "";
        // this.Page3Active = "";
        // this.Page4Active = "";
         this.Page5Active = "active";
        // this.PlacementPageActive = "";
        this.DocumentActive = "";
    }

    fnDocumentDetail() {
        this.Page1Active = "";
        this.Page2Active = "";
        // this.Page3Active = "";
        // this.Page4Active = "";
         this.Page5Active = "";
        // this.PlacementPageActive = "";
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

       // console.log(this.globalPrimaryCheckList);
    }
    lstCarerTrainingProfile;
    //Get Carer info//
    GetCarerInfo() {
        this.apiService.post(this.controllerName, "GetByParentId", this.objComplianceDTO).then(data => {
            this.CarerInfos = data;
            this.insCarerId = data.CarerId;
            //this.childList = data.ChildPlacement;
            // this.childListTemp = data.ChildPlacement;
            //Common.SetSession("AnnualRevChildPlacement", JSON.stringify(this.childList));

            //this.lstCarerTrainingProfile = data.LstCarerTrainingCourseDate;

             this.Placements = data.Placements;
            //this.FillListApprovalRecom(data.ApprovalRecomList);
            //this.LoadAlreadyChildPlacementInfo(data.ChildPlacementInfo);
        });
    }
    //Placement Info Dynamic Grd
    childName;
    fnChildChange(values) {
        if (values != null && values != "") {
            let cName = this.childList.find((item: any) => item.ChildId == values).ChildCode;
            let cAge = this.childList.find((item: any) => item.ChildId == values).ChildAge;
            this.childName = cName + " (" + cAge + ")"
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
