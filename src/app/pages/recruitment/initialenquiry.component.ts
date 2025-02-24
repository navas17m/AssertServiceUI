import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleTimer } from 'ng2-simple-timer';
import { environment } from '../../../environments/environment';
import { Common, Compare, CompareStaticValue, deepCopy } from '../common';
import { ConfigTableNames } from '../configtablenames';
import { Contact, ContactVisible } from '../contact/contact';
import { ValChangeDTO } from '../dynamic/ValChangeDTO';
import { PagesComponent } from '../pages.component';
import { PersonalInfo, PersonalInfoVisible } from '../personalinfo/personalinfo';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { CarerInfo, CarerInfoDTOCombo } from './DTO/carerinfo';
import { CarerInitialInterestInfo } from './DTO/carerinterestinfo';
import { CarerParentDTO } from './DTO/carerparent';
import { InitialEnquiryDTO } from './DTO/initialenquiry';
declare var window: any;
declare var $: any;
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'InitialEnquiry',
    templateUrl: './initialenquiry.component.template.html',
})

export class InitialEnquiryComponet {
    objCarerInfoList: CarerInfo[] = [];
    controllerName = "InitialEnquiry";
    objCarerIniterInfo: CarerInitialInterestInfo = new CarerInitialInterestInfo();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    objContactInfo: Contact = new Contact();
    objPersonalInfoDTO: PersonalInfo = new PersonalInfo();
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objCarerInfo: CarerInfo = new CarerInfo();
    objCarerInfoSA: CarerInfo = new CarerInfo();
    objCarerInfoOG;
    objCarerInfoSAOG;
    objCarerInfoDTOCombo: CarerInfoDTOCombo = new CarerInfoDTOCombo();
    objInitialEnquiryDTO: InitialEnquiryDTO = new InitialEnquiryDTO();
    objPersonalInfoSADTO: PersonalInfo = new PersonalInfo();
    dynamicformcontrol = [];
    dynamicformcontrolOG;
    objPersonalInfoVisible: PersonalInfoVisible = new PersonalInfoVisible();
    objContactVisible: ContactVisible = new ContactVisible();
    submitted = false;
    Jointapplicant = false;
    Isdisabled = false;
    CarerParentId;
    //  AgencyId;
    gender = 2;
    _Form: FormGroup;
    _FormSA: FormGroup; objQeryVal;
    LocalAuthorityList;
    areaOfficeList = [];
    sourceOfMediumList = [];
    ethinicityList;
    religionList;
    //Doc
    FormCnfgId;
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    objValChangeDTO: ValChangeDTO = new ValChangeDTO();
    @ViewChild('header') headerCtrl;
    ApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    objApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    oldApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    AgencyProfileId: number;
    ///
    FirstApplicantActive = "active";
    SecondApplicantActive;
    ContactActive;
    OtherDetailActive;
    DocumentActive;
    FamilyActive;
    isLoading: boolean = false;
    accessAutoSave = false;
    draftSequenceNo = 0;
    objDraftListCarerParent: CarerParentDTO = new CarerParentDTO();
    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit1') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true;
    SaveasDraft = false;
    showAlert: boolean = true; isUploadDoc: boolean = false;
    //Print
    cParentId = 0;
    // SequenceNo = 0;
    insCarerDetails;
    CarerCode = 0;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    isLoadingSAD: boolean = false;
    //Disability
    arrayDisability = [];
    selectedDisabilities;
    selectedDisabilitiesSA;SocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(_formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute, private _router: Router, private model: PagesComponent
        , private st: SimpleTimer, private renderer: Renderer2, private apiService: APICallService) {
        //private st: SimpleTimer,
        //Get Session Id
        // this.AgencyId = Common.GetSession("AgencyProfileId");
        this.fnLoadDisability(this.activatedroute.snapshot.data['disability']);
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        // doc
        this.formId = 23;

        if (this.objQeryVal.id == 0) {

            if (Common.GetSession("IEDraftSequenceNo") != null && Common.GetSession("IEDraftSequenceNo") != "0") {
                this.draftSequenceNo = parseInt(Common.GetSession("IEDraftSequenceNo"));

            }
            else
                this.draftSequenceNo = 0;

            if (this.draftSequenceNo == 0 && this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
                this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 5]);
            }
            else if (this.draftSequenceNo == 0 && this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
                this._router.navigate(['/pages/recruitment/applicantlist', 13, 5]);
            }
            else if (this.objQeryVal.mid == 3 && this.draftSequenceNo == 0) {
                this.CarerParentId = Common.GetSession("ACarerParentId");
                this.SocialWorkerId = Common.GetSession("ACarerSSWId");
                this.TypeId = this.CarerParentId;
                this.tblPrimaryKey = this.CarerParentId;

                this.BindCarerInfo();
                if (Common.GetSession("SelectedCarerProfile") != null) {
                    this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
                    this.CarerCode = this.insCarerDetails.CarerCode;
                }
                this.cParentId = this.CarerParentId;
            }
            else if (this.objQeryVal.mid == 13 && this.draftSequenceNo == 0) {
                this.CarerParentId = Common.GetSession("CarerParentId");
                this.SocialWorkerId = Common.GetSession("CarerSSWId");
                this.TypeId = this.CarerParentId;
                this.tblPrimaryKey = this.CarerParentId;

                this.BindCarerInfo();
                if (Common.GetSession("SelectedApplicantProfile") != null) {
                    this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
                    this.CarerCode = this.insCarerDetails.CarerCode;
                }
                this.cParentId = this.CarerParentId;
            }
            else if (this.draftSequenceNo != 0) {
                this.BindCarerInfo();

                this.TypeId = this.draftSequenceNo;
                this.tblPrimaryKey = this.draftSequenceNo;
            }

            //////////////////////////

        }
        else
        {
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objInitialEnquiryDTO).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
            });
        }



        //Get Dynamic Controls
        this.objInitialEnquiryDTO.AgencyProfileId = this.AgencyProfileId;
        this.objInitialEnquiryDTO.CarerParentId = this.CarerParentId;

        if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 43;
            this.accessAutoSave = this.model.GetAddBtnAccessPermission(this.FormCnfgId);
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 23;
            this.accessAutoSave = this.model.GetAddBtnAccessPermission(this.FormCnfgId);
        }

        // this.apiService.post(this.controllerName, "GetDynamicControls", this.objInitialEnquiryDTO).then(data => {
        //     this.dynamicformcontrol = data;
        //     this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
        // });


        //Bind Local Authority List
        this.apiService.get("LocalAuthority", "getall", this.AgencyProfileId).then(data => this.LocalAuthorityList = data);
        this.apiService.get("AreaOfficeProfile", "getall").then(data => { this.areaOfficeList = data; });

        //Doc
        // this.TypeId = this.CarerParentId;
        //this.tblPrimaryKey = this.CarerParentId;

        //Bind DDL
        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Ethnicity;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.ethinicityList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Religion;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.religionList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.SourceOfMedium;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.sourceOfMediumList = data; });


        this.SetVisible();
        this._Form = _formBuilder.group({
            //First Applicant
            DateOfEnquiry: [Validators.required],
            AreaOfficeProfileId: ['0', Validators.required],
            SourceOfMediumId: ['0'],
            EthinicityId: ['0'],
            ReligionId: ['0'],
            faMobileNo: ['', [Validators.minLength(10), Validators.maxLength(20)]],
            faEmail: [''],
            FAPractisingStatus: [''],
            SpareBedRoomCount: ['0'],
            HasPermanentResidencyInUK: [],
            PermanentResidencyDetails: [],
            HaveCriminalOffenseConviction: [''],
            CriminalOffenceConvictionDetail: [''],
            DoYouHaveYourOwnVehicle:[],
            DoesCarerDriveCar:[],
            VehicleRegistrationNumber:[],
            DrivingLicenceNumber:[],
            HasDisability:[],
        });


        this._FormSA = _formBuilder.group({
            FAPractisingStatus: [''],
            saEthnicity: ['0'],
            saReligion: ['0'],
            SAPractisingStatus: [''],
            saMobileNo: ['', [Validators.minLength(10), Validators.maxLength(20)]],
            saEmail: [''],
            saHasPermanentResidencyInUK: [],
            saPermanentResidencyDetails: [],
            saHaveRelationshipAbove2Years: [],
            saRelationshipAbove2YearsDetails: [],
            HaveCriminalOffenseConvictionSA: [''],
            CriminalOffenceConvictionDetailSA: [],
            DoYouHaveYourOwnVehicleSA:[],
            DoesCarerDriveCarSA:[],
            VehicleRegistrationNumberSA:[],
            DrivingLicenceNumberSA:[],
            HasDisabilitySA:[],
        });
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });
        this.objCarerInfo.AreaOfficeid=null;
        this.objUserAuditDetailDTO.ActionId = 4;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        //this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    fnLoadDisability(data) {
        //Multiselect dropdown array forming code.
        if (data) {
            data.forEach(item => {
                this.arrayDisability.push({ id: item.CofigTableValuesId, name: item.Value });
            }
            );
        }
    }

    fnClickJoinApplicant() {
        this.Jointapplicant = !this.Jointapplicant;
    }


    SetVisible() {
        //Set Personal Info Visible
        // this.objPersonalInfoVisible.ImageIdVisible = false;
        this.objPersonalInfoVisible.PreviousNameVisible = false;
        //Set Conact Info Visible
        this.objContactVisible.AddressLine1Mandatory = false;
        this.objContactVisible.CityMandatory = false;
        this.objContactVisible.CountyIdMandatory = false;
        this.objContactVisible.PostalCodeMandatory = false;
        this.objContactVisible.HomePhoneMandatory = false;
        this.objContactVisible.EmergencyContactVisible = false;
        this.objContactVisible.OfficePhoneVisible = false;
        this.objContactVisible.EmailIdVisible = false;
        this.objContactVisible.AlternativeEmailIdVisible = false;
        this.objContactVisible.MobilePhoneVisible = false;
        this.objContactVisible.AddressLine2Mandatory = false;
        // this.objContactVisible.FaxMandatory = false;
        this.objContactVisible.EmergencyContactMandatory = false;
        this.objContactVisible.CountryIdMandatory = false;
        //  this.objContactVisible.EmailIdVisible = false;
    }
    BindCarerInfo() {

        //Get Dynamic Controls
        this.objInitialEnquiryDTO.AgencyProfileId = this.AgencyProfileId;
        this.objInitialEnquiryDTO.CarerParentId = this.CarerParentId;

        //Get Carer Info
        if (this.CarerParentId != null && this.CarerParentId != 0 && this.CarerParentId != 'undefined' && this.objQeryVal.id == 0) {

            this.showbtnSaveDraft = false;
            this.objCarerInfo.CarerParentId = this.CarerParentId;
            this.apiService.get(this.controllerName, "GetCInfoByCarerParentId", this.objCarerInfo.CarerParentId).then(data => {
                this.BindCarerDetails(data);

            });



            this.apiService.post(this.controllerName, "GetDynamicControls", this.objInitialEnquiryDTO).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
            });

        }
        else if (this.draftSequenceNo != 0 && this.objQeryVal.id == 0) {

            //Get Save as Draft
            this.showbtnSaveDraft = true;
            let userId: number = parseInt(Common.GetSession("UserProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.SequenceNo = this.draftSequenceNo;
            this.objSaveDraftInfoDTO.TypeId = this.AgencyProfileId;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;

            this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                this.SaveasDraft = true;

                if (data != null) {
                    let jsonData = JSON.parse(data.JsonData);
                    //   console.log(jsonData);
                    let temData = [];
                    temData.push(jsonData.CarerInfoPC);
                    if (jsonData.Jointapplicant)
                        temData.push(jsonData.CarerInfoSC);
                    this.BindCarerDetails(temData);
                    if (jsonData.DynamicControls.length > 0 && jsonData.DynamicControls != null) {
                        this.dynamicformcontrol = jsonData.DynamicControls;
                        this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
                    }
                }
            });
            //End
        }

    }
    setDate(data) {
        this.objCarerInfo.DateOfEnquiry = this.model.GetDateEditFormat(data.DateOfEnquiry);
    }

    BindCarerDetails(data: CarerInfo[]) {



        if (data[0] != null) {
            this.objCarerInfo = data[0];

            this.selectedDisabilities=this.objCarerInfo.DisabilityIds;
            this.objCarerInfoOG = deepCopy<any>(this.objCarerInfo);
            this.setDate(data[0]);
        }

        if (data[1] != null) {
            this.objCarerInfoSA = data[1];
            this.selectedDisabilitiesSA=this.objCarerInfoSA.DisabilityIds;
            this.objCarerInfoSAOG = deepCopy<any>(this.objCarerInfoSA);
            if (data[1].PersonalInfo.FirstName != null && data[1].PersonalInfo.FirstName != "") {
                this.Jointapplicant = true;
                this.Isdisabled = true;
            }
        }
    }

    rtnVal: boolean;
    SetInputVisible(fieldName, fieldNameValue, condition, conditionValue) {
        this.rtnVal;
        if (fieldName == fieldNameValue && condition == conditionValue) {
            this.rtnVal = true;
        }
        else {
            this.rtnVal = false;
        }
        return this.rtnVal;
    }
    //set hide and visible
    DynamicOnValChange(InsValChange: ValChangeDTO) {

        let val1 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "OthersLivingInHouseholdAgerange");
        let insRelationshipAndAges = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "RelationshipAndAges");
        if (val1.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "IsOthersLivingInHousehold") {
            if (InsValChange.newValue)
                val1[0].IsVisible = true;
            else
                val1[0].IsVisible = false;

            //Progress Agency Chenage
            if (insRelationshipAndAges.length > 0) {
                if (InsValChange.newValue)
                    insRelationshipAndAges[0].IsVisible = true;
                else
                    insRelationshipAndAges[0].IsVisible = false;
            }
        }

        //Progress Agency Chenage
        let insPetsDetails = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "PetsDetails");
        if (insPetsDetails.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "HaveAnyPets") {

            if (InsValChange.newValue)
                insPetsDetails[0].IsVisible = true;
            else
                insPetsDetails[0].IsVisible = false;
        }

        let val2 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "CarerGiveupWorkOtherDetails");
        if (val2.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "CanCarerGiveupWork") {

            let value = InsValChange.currnet.ConfigTableValues.filter(x => x.CofigTableValuesId == InsValChange.newValue);
            if (value.length > 0 && value[0].Value == "Other")
                val2[0].IsVisible = true;
            else
                val2[0].IsVisible = false;
        }

        let val3 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "MedicalConditionDetails");
        if (val3.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "HasMedicalCondition") {
            if (InsValChange.newValue)
                val3[0].IsVisible = true;
            else
                val3[0].IsVisible = false;
        }

        let val4 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "CriteriaMeetForIHVDetails");
        let val5 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "CounseledOutReasonId");
        if (val5.length > 0 && val5[0].FieldValue == null)
            val5[0].IsVisible = false;

        let val6 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "CounseledOutReasonIdOther");
        if (val6.length > 0)
            val6[0].IsVisible = false;

        let val8 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "CounseledOutReasonDetails");

        if (InsValChange.currnet.FieldCnfg.FieldName == "DoesCriteriaMeetForIHV") {
            if (InsValChange.newValue == 1) {
                val4[0].IsVisible = true;
                val5[0].IsVisible = false;
                val8[0].IsVisible = false;

            } if (InsValChange.newValue == 2) {
                val4[0].IsVisible = false;
                val5[0].IsVisible = true;
                val8[0].IsVisible = true;
            }
        }


    }
    fnFirst() {
        this.FirstApplicantActive = "active";
        this.SecondApplicantActive = "";
        this.ContactActive = "";
        this.OtherDetailActive = "";
        this.DocumentActive = "";
        this.FamilyActive="";
    }
    fnSecond() {
        this.FirstApplicantActive = "";
        this.SecondApplicantActive = "active";
        this.ContactActive = "";
        this.OtherDetailActive = "";
        this.DocumentActive = "";
        this.FamilyActive="";
    }
    fnContact() {
        this.FirstApplicantActive = "";
        this.SecondApplicantActive = "";
        this.ContactActive = "active";
        this.OtherDetailActive = "";
        this.DocumentActive = "";
        this.FamilyActive="";
    }
    fnOtherDetail() {
        this.FirstApplicantActive = "";
        this.SecondApplicantActive = "";
        this.ContactActive = "";
        this.OtherDetailActive = "active";
        this.DocumentActive = "";
        this.FamilyActive="";
    }
    fnDocumentDetail() {
        this.FirstApplicantActive = "";
        this.SecondApplicantActive = "";
        this.ContactActive = "";
        this.OtherDetailActive = "";
        this.DocumentActive = "active";
        this.FamilyActive="";
    }

    fnFamily()
    {
        this.FirstApplicantActive = "";
        this.SecondApplicantActive = "";
        this.ContactActive = "";
        this.OtherDetailActive = "";
        this.DocumentActive = "";
        this.FamilyActive="active";
    }

    isOk = false;
    isokSA = true;
    DocOk = true;
    isPCDirty = true;
    isSCDirty = true;
    IsNewOrSubmited = 1;//New=1 and Submited=2
    SubmitInitialEnquiry(mainForm, personalinfoForm, saPersInfoForm, contactForm, pinfoVal,
        sapinfoVal, coninfoVal, dynamicVal, dynamicValForm, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds
        , dynamicValAddSourceInfo, dynamicValFormAddSourceInfo) {

        this.isOk = false;
        this.isokSA = true;
        this.submitted = true;
        if (!mainForm.valid) {
            this.SecondApplicantActive = "";
            this.ContactActive = "";
            this.OtherDetailActive = "";
            this.FirstApplicantActive = "active";
            this.DocumentActive = "";
            this.FamilyActive="";
            this.model.GetErrorFocus(mainForm);
        }
        else if (!personalinfoForm.valid) {
            this.SecondApplicantActive = "";
            this.ContactActive = "";
            this.OtherDetailActive = "";
            this.FirstApplicantActive = "active";
            this.DocumentActive = "";
            this.FamilyActive="";
            this.model.GetErrorFocus(personalinfoForm);
        }
        else if (!dynamicValFormAddSourceInfo.valid) {
            this.SecondApplicantActive = "";
            this.ContactActive = "";
            this.OtherDetailActive = "";
            this.FirstApplicantActive = "active";
            this.DocumentActive = "";
            this.FamilyActive="";
            this.model.GetErrorFocus(dynamicValFormAddSourceInfo);
        }
        else if (this.Jointapplicant && (!saPersInfoForm.valid || !this._FormSA.valid)) {
            this.ContactActive = "";
            this.OtherDetailActive = "";
            this.FirstApplicantActive = "";
            this.SecondApplicantActive = "active";
            this.DocumentActive = "";
            this.FamilyActive="";
            if (!saPersInfoForm.valid)
                this.model.GetErrorFocus(saPersInfoForm);
            else if (!this._FormSA.valid)
                this.model.GetErrorFocus(this._FormSA);
        }
        else if (!contactForm.valid) {
            this.OtherDetailActive = "";
            this.FirstApplicantActive = "";
            this.SecondApplicantActive = "";
            this.ContactActive = "active";
            this.DocumentActive = "";
            this.FamilyActive="";
            this.model.GetErrorFocus(contactForm);
        }
        else if (!dynamicValForm.valid) {
            this.FirstApplicantActive = "";
            this.SecondApplicantActive = "";
            this.ContactActive = "";
            this.OtherDetailActive = "active";
            this.DocumentActive = "";
            this.FamilyActive="";
            this.model.GetErrorFocus(dynamicValForm);
        }
        else if (IsUpload && !uploadFormBuilder.valid) {
            this.FirstApplicantActive = "";
            this.SecondApplicantActive = "";
            this.ContactActive = "";
            this.OtherDetailActive = "";
            this.DocumentActive = "active";
            this.FamilyActive="";
            this.model.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.FirstApplicantActive = "active";
            this.SecondApplicantActive = "";
            this.ContactActive = "";
            this.OtherDetailActive = "";
            this.DocumentActive = "";
            this.FamilyActive="";
        }

        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        if (mainForm.valid && personalinfoForm.valid && contactForm.valid && dynamicValForm.valid && dynamicValFormAddSourceInfo.valid) {
            this.isOk = true;
        }
        else
            this.isOk = false

        if (this.Jointapplicant) {
            if (saPersInfoForm.valid && this._FormSA.valid)
                this.isokSA = true
            else
                this.isokSA = false
        }

        dynamicValAddSourceInfo.forEach(item => {
            dynamicVal.push(item);
        });

        let aoid: number = this.objCarerInfo.AreaOfficeid;
        this.objCarerInfo.AreaOfficeid = aoid;
        this.objInitialEnquiryDTO.AreaOfficeid = aoid;
        this.objInitialEnquiryDTO.NotificationEmailIds = EmailIds;
        this.objInitialEnquiryDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
        if (this.isOk && this.isokSA && this.DocOk) {
            let userId: number = parseInt(Common.GetSession("UserProfileId"));
            this.objCarerInfo.CreatedUserId = userId;
            this.objCarerInfoSA.CreatedUserId = userId;
            this.objCarerInfo.PersonalInfo = pinfoVal;
            this.objCarerInfo.ContactInfo = coninfoVal;
            this.objCarerInfoSA.PersonalInfo = sapinfoVal;

            this.objInitialEnquiryDTO.DisabilityIdsPC = this.selectedDisabilities;
            this.objInitialEnquiryDTO.DisabilityIdsSC = this.selectedDisabilitiesSA;

            this.objCarerInfo.DisabilityIds = this.selectedDisabilities;
            this.objCarerInfoSA.DisabilityIds = this.selectedDisabilitiesSA;
            this.objInitialEnquiryDTO.HasDisabilityPC=this.objCarerInfo.HasDisability;
            this.objInitialEnquiryDTO.HasDisabilitySC=this.objCarerInfoSA.HasDisability;

            this.objCarerInfo.PersonalInfo.DateOfBirth = this.model.GetDateSaveFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
            this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.model.GetDateSaveFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
            this.objInitialEnquiryDTO.PersonalInfo.DateOfBirth = this.model.GetDateSaveFormat(this.objInitialEnquiryDTO.PersonalInfo.DateOfBirth);
            this.objInitialEnquiryDTO.PersonalInfoSA.DateOfBirth = this.model.GetDateSaveFormat(this.objInitialEnquiryDTO.PersonalInfoSA.DateOfBirth);

            this.objInitialEnquiryDTO.CarerInfo = [];
            this.objInitialEnquiryDTO.CarerInfo.push(this.objCarerInfo);
            this.objInitialEnquiryDTO.CarerInfo.push(this.objCarerInfoSA);
            let val2 = dynamicVal.filter(x => x.FieldName == "SocialWorkerId");
            if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == ''))
            {
                val2[0].FieldValue = this.SocialWorkerId;
            }
            this.objInitialEnquiryDTO.DynamicValue = dynamicVal;
            this.objInitialEnquiryDTO.ContactInfo = coninfoVal;
            this.objInitialEnquiryDTO.SpareBedRoomCount = this.objCarerInfo.SpareBedRoomCount;
            this.objInitialEnquiryDTO.SourceOfMediumId = this.objCarerInfo.SourceOfMediumId;
            this.objInitialEnquiryDTO.PersonalInfo = pinfoVal;
            this.objInitialEnquiryDTO.PersonalInfoSA = sapinfoVal;
            this.objInitialEnquiryDTO.ContactInfoSA = this.objCarerInfoSA.ContactInfo;
            this.objInitialEnquiryDTO.EthinicityId = this.objCarerInfo.EthinicityId;
            this.objInitialEnquiryDTO.ReligionId = this.objCarerInfo.ReligionId;
            this.objInitialEnquiryDTO.EthinicityIdSA = this.objCarerInfoSA.EthinicityId;
            this.objInitialEnquiryDTO.ReligionIdSA = this.objCarerInfoSA.ReligionId;
            this.objInitialEnquiryDTO.HasPermanentResidencyInUK = this.objCarerInfo.HasPermanentResidencyInUK;
            this.objInitialEnquiryDTO.PermanentResidencyDetails = this.objCarerInfo.PermanentResidencyDetails;
            this.objInitialEnquiryDTO.saHasPermanentResidencyInUK = this.objCarerInfoSA.HasPermanentResidencyInUK;
            this.objInitialEnquiryDTO.saPermanentResidencyDetails = this.objCarerInfoSA.PermanentResidencyDetails;
            this.objInitialEnquiryDTO.HaveRelationshipAbove2Years = this.objCarerInfoSA.HaveRelationshipAbove2Years;
            this.objInitialEnquiryDTO.RelationshipAbove2YearsDetails = this.objCarerInfoSA.RelationshipAbove2YearsDetails;
            this.objCarerInfo.DateOfEnquiry = this.model.GetDateSaveFormat(this.objCarerInfo.DateOfEnquiry);
            this.objInitialEnquiryDTO.DateOfEnquiry = this.objCarerInfo.DateOfEnquiry;
            this.objInitialEnquiryDTO.DraftSequenceNo = this.draftSequenceNo;

            this.objInitialEnquiryDTO.DoYouHaveYourOwnVehicle = this.objCarerInfo.DoYouHaveYourOwnVehicle;
            this.objInitialEnquiryDTO.DoesCarerDriveCar = this.objCarerInfo.DoesCarerDriveCar
            this.objInitialEnquiryDTO.VehicleRegistrationNumber = this.objCarerInfo.VehicleRegistrationNumber
            this.objInitialEnquiryDTO.DrivingLicenceNumber = this.objCarerInfo.DrivingLicenceNumber

            this.objInitialEnquiryDTO.DoYouHaveYourOwnVehicleSA = this.objCarerInfoSA.DoYouHaveYourOwnVehicle
            this.objInitialEnquiryDTO.DoesCarerDriveCarSA = this.objCarerInfoSA.DoesCarerDriveCar
            this.objInitialEnquiryDTO.VehicleRegistrationNumberSA = this.objCarerInfoSA.VehicleRegistrationNumber
            this.objInitialEnquiryDTO.DrivingLicenceNumberSA = this.objCarerInfoSA.DrivingLicenceNumber
            //this.objInitialEnquiryDTO.

            this.isPCDirty = true;

            if (this.objQeryVal.id == 0
                && CompareStaticValue(this.objCarerInfo, this.objCarerInfoOG)
                && Compare(dynamicVal, this.dynamicformcontrolOG)
            ) {
                this.isPCDirty = false;
            }
            // console.log(CompareStaticValue(this.objCarerInfo, this.objCarerInfoOG));
            this.isSCDirty = true;
            if (this.objQeryVal.id == 0 && this.Jointapplicant
                && this.objCarerInfoSAOG != null
                && CompareStaticValue(this.objCarerInfoSA, this.objCarerInfoSAOG)
            ) {
                this.isSCDirty = false;
            }

            if (this.isPCDirty || (IsUpload && uploadFormBuilder.valid) || (this.Jointapplicant && this.isSCDirty)) {
                this.objInitialEnquiryDTO.CarerParentId = this.CarerParentId;
                this.objCarerInfo.CarerParentId = this.CarerParentId;
                let type = "save"
                if (this.objQeryVal.id == 0 && this.draftSequenceNo == 0)
                    type = "update"
                this.isLoading = true;



                this.apiService.save(this.controllerName, this.objInitialEnquiryDTO, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
            }
            else {
                this.objCarerInfo.DateOfEnquiry = this.model.GetDateEditFormat(this.objCarerInfo.DateOfEnquiry);
                this.objCarerInfo.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
                this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
                //  this.objInitialEnquiryDTO.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objInitialEnquiryDTO.PersonalInfo.DateOfBirth);
                //  this.objInitialEnquiryDTO.PersonalInfoSA.DateOfBirth = this.model.GetDateEditFormat(this.objInitialEnquiryDTO.PersonalInfoSA.DateOfBirth);
                this.submitText=Common.GetSubmitText;
                this.showAutoSave = false;
                if (this.showAlert && this.IsNewOrSubmited == 1)
                    this.model.alertWarning(Common.GetNoChangeAlert);
                else if (this.showAlert && this.IsNewOrSubmited == 2)
                    this.model.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.showAlert = true;
            }

        }
    }
    selectName;
    private Respone(data, type, IsUpload, skipAlert: boolean) {

        if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.objCarerInfoOG = deepCopy<any>(this.objCarerInfo);
            if (this.Jointapplicant)
                this.objCarerInfoSAOG = deepCopy<any>(this.objCarerInfoSA);
            this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
        }

        this.objCarerInfo.DateOfEnquiry = this.model.GetDateEditFormat(this.objCarerInfo.DateOfEnquiry);
        this.objCarerInfo.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
        this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
        // this.objInitialEnquiryDTO.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objInitialEnquiryDTO.PersonalInfo.DateOfBirth);
        //this.objInitialEnquiryDTO.PersonalInfoSA.DateOfBirth = this.model.GetDateEditFormat(this.objInitialEnquiryDTO.PersonalInfoSA.DateOfBirth);

        if (data.IsError == true) {
            this.isLoading = false;
            this.model.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
              this.objUserAuditDetailDTO.ActionId =1;
              if (skipAlert)
                    this.model.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
              this.objUserAuditDetailDTO.ActionId =2;
              if (skipAlert)
                    this.model.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            if (IsUpload) {
                if (this.objQeryVal.id == 1) {
                    this.uploadCtrl.fnSetTypeId(data.SequenceNumber);
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
                else
                    this.uploadCtrl.fnUploadAll(this.CarerParentId);
            }

            this.isLoading = false;
            this.submitText=Common.GetSubmitText;
            if (skipAlert) {
                if (this.objQeryVal.id == 1 || this.draftSequenceNo != 0) {
                    //Add New Applicant
                    // alert(1);
                    this._router.navigate(['/pages/recruitment/applicantlist']);
                }
                else {
                    //Update Header and applicant
                    this.oldApplicantProfileVal = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
                    let AreaOfficeName = this.areaOfficeList.find((item: any) => item.AreaOfficeProfileId == this.objCarerInfo.AreaOfficeid).AreaOfficeName;

                    this.ApplicantProfileVal.PCFullName = this.objCarerInfo.PersonalInfo.FirstName + ' ' + this.objCarerInfo.PersonalInfo.lastName;
                    if (this.Jointapplicant)
                        this.ApplicantProfileVal.SCFullName = ' / ' + this.objCarerInfoSA.PersonalInfo.FirstName + ' ' + this.objCarerInfoSA.PersonalInfo.lastName;

                    this.ApplicantProfileVal.CarerCode = this.oldApplicantProfileVal.CarerCode;
                    this.ApplicantProfileVal.CarerParentId = this.oldApplicantProfileVal.CarerParentId;
                    this.ApplicantProfileVal.CarerId = this.oldApplicantProfileVal.CarerId;
                    this.ApplicantProfileVal.CarerStatusName = this.oldApplicantProfileVal.CarerStatusName;
                    this.ApplicantProfileVal.CarerStatusId = this.oldApplicantProfileVal.CarerStatusId;
                    this.ApplicantProfileVal.ContactInfo.City = this.objCarerInfo.ContactInfo.City;
                    this.ApplicantProfileVal.AreaOfficeName = AreaOfficeName;
                    this.ApplicantProfileVal.CreatedDate = this.objCarerInfo.DateOfEnquiry;
                    this.ApplicantProfileVal.PersonalInfo.ImageId = this.objCarerInfo.PersonalInfo.ImageId;
                    this.ApplicantProfileVal.AvailableVacancies = this.oldApplicantProfileVal.AvailableVacancies;
                    this.ApplicantProfileVal.ApproveVacancies = this.oldApplicantProfileVal.ApproveVacancies;
                    this.ApplicantProfileVal.SupervisingSocialWorker = this.oldApplicantProfileVal.SupervisingSocialWorker;

                    this.objApplicantProfileVal = new CarerParentDTO();
                    this.objApplicantProfileVal = this.ApplicantProfileVal;
                    this.headerCtrl.fnShowImage(this.objCarerInfo.PersonalInfo.ImageId);
                    Common.SetSession("SelectedApplicantProfile", JSON.stringify(this.ApplicantProfileVal));
                    //End
                    this.BindCarerInfo();
                }

                if (this.objQeryVal.mid == 13 && this.objQeryVal.id == 0 && this.draftSequenceNo == 0) {
                    let pcName = this.objCarerInfo.PersonalInfo.FirstName + " " + this.objCarerInfo.PersonalInfo.lastName;
                    let scName = "";
                    if (this.Jointapplicant)
                        scName = this.objCarerInfoSA.PersonalInfo.FirstName + " " + this.objCarerInfoSA.PersonalInfo.lastName;

                    this.selectName = pcName + scName;
                    Common.SetSession("CarerName", this.selectName);
                    this._router.navigate(['/pages/recruitment/redirect/2/', this.objQeryVal.mid]);
                }
                else if (this.objQeryVal.id == 1 || this.draftSequenceNo != 0) {
                    //Add New Applicant
                    //alert(2);
                    this._router.navigate(['/pages/recruitment/applicantlist']);
                }
            }
            this.skipAlert = true;
        }
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }


    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateCarerInitialEnquiryPDF/" + this.CarerCode + "," + this.cParentId + "," + this.draftSequenceNo + "," + this.AgencyProfileId;
        this.objUserAuditDetailDTO.ActionId =7;
        //this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnDonloadWord() {
        window.location.href = this.apiURL + "GenerateCarerInitialEnquiryWord/" + this.CarerCode + "," + this.cParentId + "," + this.draftSequenceNo + "," + this.AgencyProfileId;
        this.objUserAuditDetailDTO.ActionId =6;
        //this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateCarerInitialEnquiryPrint", this.CarerCode + "," + this.cParentId + "," + this.draftSequenceNo + "," + this.AgencyProfileId).then(data => {
            var popupWin;
            // var style = ""; var link = "";
            // var i;
            // for (i = 0; i < $("style").length; i++) {
            //     style = style + $("style")[i].outerHTML;
            // }
            // var j;
            // for (j = 0; j < $("link").length; j++) {
            //     link = link + $("link")[j].outerHTML;
            // }
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
      <html>
        <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Print tab</title>

        <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
    <body onload="window.print();window.close()">${data}</body>
      </html>`);
            popupWin.document.close();
        });
        this.objUserAuditDetailDTO.ActionId =8;
        //this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnShowEmail() {
        this.subject = "";
        this.eAddress = "";
        this.submittedprint = false;
        let event = new MouseEvent('click', { bubbles: true });
        this.infoPrint.nativeElement.dispatchEvent(event);
    }
    fnEmail(form) {
        this.submittedprint = true;
        if (form.valid) {
            this.isLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.CarerCode + "," + this.cParentId + "," + this.draftSequenceNo + "," + this.AgencyProfileId;
            this.apiService.post("GeneratePDF", "EmailCarerInitialEnquiry", this.objNotificationDTO).then(data => {
                if (data == true){
                    this.model.alertSuccess("Email Sent Successfully..");
                    this.objUserAuditDetailDTO.ActionId =9;
                    //this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                    this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                    this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                    this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                    this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
                    this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
                    Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                }
                else
                    this.model.alertDanger("Email not Sent Successfully..");
                this.fnCancelClick();
                this.isLoading = false;
            });

        }
    }
    fnCancelClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoCancel.nativeElement.dispatchEvent(event);
    }


    //save as draft
    fnSaveDraft(mainForm, personalinfoForm, saPersInfoForm, contactForm, pinfoVal,
        sapinfoVal, coninfoVal, dynamicVal, dynamicValForm, UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds
        , dynamicValAddSourceInfo, dynamicValFormAddSourceInfo) {

        if (this.objCarerInfo.AreaOfficeid == undefined)
            this.objCarerInfo.AreaOfficeid = null;

        if (this.objCarerInfo.SpareBedRoomCount == undefined)
            this.objCarerInfo.SpareBedRoomCount = null;

        if (this.objCarerInfo.HaveCriminalOffenseConviction == undefined)
            this.objCarerInfo.HaveCriminalOffenseConviction = null;

        this.objCarerInfo.PersonalInfo = pinfoVal;
        this.objCarerInfo.ContactInfo = coninfoVal;
        this.objCarerInfoSA.PersonalInfo = sapinfoVal;

        this.objCarerInfo.PersonalInfo.DateOfBirth = this.model.GetDateSaveFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
        this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.model.GetDateSaveFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
        this.objCarerInfo.DateOfEnquiry = this.model.GetDateSaveFormat(this.objCarerInfo.DateOfEnquiry);

        this.objCarerInfoDTOCombo.CarerInfoPC = this.objCarerInfo;
        if (this.Jointapplicant)
            this.objCarerInfoDTOCombo.CarerInfoSC = this.objCarerInfoSA;
        else
            this.objCarerInfoDTOCombo.CarerInfoSC = this.objCarerInfo;

        this.objCarerInfoDTOCombo.Jointapplicant = this.Jointapplicant;
        this.objCarerInfoDTOCombo.DynamicControls = [];
        this.objCarerInfoDTOCombo.DynamicControls = this.dynamicformcontrol;
        dynamicValAddSourceInfo.forEach(item => {
            dynamicVal.push(item);
        });


        this.isPCDirty = true;
        if (this.draftSequenceNo > 0
            && CompareStaticValue(this.objCarerInfo, this.objCarerInfoOG)
            && Compare(dynamicVal, this.dynamicformcontrolOG)
        ) {
            this.isPCDirty = false;
        }

        this.isSCDirty = true;
        if (this.draftSequenceNo > 0 && this.Jointapplicant && this.objCarerInfoSAOG != null && CompareStaticValue(this.objCarerInfoSA, this.objCarerInfoSAOG)
        ) {
            this.isSCDirty = false;
        }

        if (this.isPCDirty || (IsUpload && uploadFormBuilder.valid) || (this.Jointapplicant && this.isSCDirty)) {
            //  this.objCarerInfo.CarerParentId = this.CarerParentId;
            this.isLoadingSAD = true;
            this.fnSubSaveDraft(IsUpload);
        }
        else {
            this.objCarerInfo.DateOfEnquiry = this.model.GetDateEditFormat(this.objCarerInfo.DateOfEnquiry);
            this.objCarerInfo.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
            this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
            //  this.objInitialEnquiryDTO.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objInitialEnquiryDTO.PersonalInfo.DateOfBirth);
            //   this.objInitialEnquiryDTO.PersonalInfoSA.DateOfBirth = this.model.GetDateEditFormat(this.objInitialEnquiryDTO.PersonalInfoSA.DateOfBirth);
            this.saveAsDraftText=Common.GetSaveasDraftText;
            this.isLoadingSAD = true;
            this.showAutoSave = false;
            if (this.showAlert && this.IsNewOrSubmited == 1)
                this.model.alertWarning(Common.GetNoChangeAlert);
            else if (this.showAlert && this.IsNewOrSubmited == 2)
                this.model.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
            this.showAlert = true;
            this.isLoadingSAD = false;
        }
    }

    fnSubSaveDraft(IsUpload) {
        //For Carer List
        if (this.objCarerInfo.PersonalInfo.FirstName == null)
            this.objCarerInfo.PersonalInfo.FirstName = "";

        if (this.objCarerInfo.PersonalInfo.lastName == null)
            this.objCarerInfo.PersonalInfo.lastName = "";

        if (this.objCarerInfoSA.PersonalInfo.FirstName == null)
            this.objCarerInfoSA.PersonalInfo.FirstName = "";

        if (this.objCarerInfoSA.PersonalInfo.lastName == null)
            this.objCarerInfoSA.PersonalInfo.lastName = "";

        this.objDraftListCarerParent.PCFullName = this.objCarerInfo.PersonalInfo.FirstName + ' ' + this.objCarerInfo.PersonalInfo.lastName;
        if (this.Jointapplicant)
            this.objDraftListCarerParent.SCFullName = ' / ' + this.objCarerInfoSA.PersonalInfo.FirstName + ' ' + this.objCarerInfoSA.PersonalInfo.lastName;
        this.objDraftListCarerParent.ContactInfo.City = this.objCarerInfo.ContactInfo.City;
        this.objDraftListCarerParent.CarerStatusName = "Interested";
        this.objDraftListCarerParent.CarerStatusId = 1;
        this.objDraftListCarerParent.CarerCode = "Draft";
        this.objDraftListCarerParent.CarerParentId = 0;
        this.objDraftListCarerParent.DateOfEnquiry = this.objCarerInfo.DateOfEnquiry;

        let userId: number = parseInt(Common.GetSession("UserProfileId"));
        this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
        this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.AgencyProfileId;
        this.objSaveDraftInfoDTO.CreatedUserId = userId;
        this.objSaveDraftInfoDTO.UpdatedUserId = userId;
        this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.objCarerInfoDTOCombo);
        this.isLoading = true;
        let type = "save";
        if (this.draftSequenceNo > 0) {
            type = "update";
            this.objSaveDraftInfoDTO.SequenceNo = this.draftSequenceNo;
            this.objDraftListCarerParent.SequenceNo = this.draftSequenceNo;
            this.objSaveDraftInfoDTO.JsonList = JSON.stringify(this.objDraftListCarerParent);
            this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload, this.draftSequenceNo, this.objCarerInfo, this.objCarerInfoSA));
        }
        else {
            this.isLoadingSAD = true;
            this.apiService.get(this.controllerName, "GetNextSequenceNo").then(data => {
                this.draftSequenceNo = data;
                this.tblPrimaryKey = this.draftSequenceNo;
                this.objSaveDraftInfoDTO.SequenceNo = this.draftSequenceNo;
                this.objDraftListCarerParent.SequenceNo = this.draftSequenceNo;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(this.objDraftListCarerParent);

                this.TypeId = this.draftSequenceNo;
                this.tblPrimaryKey = this.draftSequenceNo;
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload, this.draftSequenceNo, this.objCarerInfo, this.objCarerInfoSA));
            });
        }

    }
    private ResponeDraft(data, type, IsUpload, SequenceNo, objCarerInfo, objCarerInfoSA) {
        this.isLoadingSAD = false;
        this.saveAsDraftText=Common.GetSaveasDraftText;
        if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.objCarerInfoOG = deepCopy<any>(objCarerInfo);
            if (this.Jointapplicant)
                this.objCarerInfoSAOG = deepCopy<any>(objCarerInfoSA);
            this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
        }
        this.objCarerInfo.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
        this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
        this.objCarerInfo.DateOfEnquiry = this.model.GetDateEditFormat(this.objCarerInfo.DateOfEnquiry);
        this.isLoading = false;
        if (data.IsError == true) {
            this.model.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(SequenceNo);
                }
                if (this.showAlert)
                    this.model.alertSuccess(Common.GetSaveDraftSuccessfullMsg);
            }
            else {
                if (IsUpload) {

                    this.uploadCtrl.fnUploadAll(SequenceNo);
                }
                if (this.showAlert)
                    this.model.alertSuccess(Common.GetUpdateDraftSuccessfullMsg);
            }
        }
        this.showAlert = true;
    }


    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('InitialEnqAutoSave', environment.autoSaveTime);
        this.subscribeTimer2();
    }
    subscribeTimer2() {
        if (this.timer2Id) {
            // Unsubscribe if timer Id is defined
            this.st.unsubscribe(this.timer2Id);
            this.timer2Id = undefined;
            this.timer2button = 'Subscribe';
        } else {
            // Subscribe if timer Id is undefined
            this.timer2Id = this.st.subscribe('InitialEnqAutoSave', () => this.timer2callback());
            this.timer2button = 'Unsubscribe';

        }
    }

    timer2callback() {
        //this.counter2++;
        if (this.accessAutoSave && (this.isReadOnly == "0" || this.isReadOnly == null)) {
            if (this.isFirstTime) {
                this.showAutoSave = true;
                let event = new MouseEvent('click', { bubbles: true });
                if (!this.showbtnSaveDraft) {
                    this.showAlert = false;
                    this.saveDraftText = "Record auto-saved @";
                    this.skipAlert = false;
                    this.submitText=Common.GetAutoSaveProgressText;
                    this.btnSubmit.fnClick();
                }
                else {
                    this.showAlert = false;
                    this.saveDraftText = "Draft auto-saved @";
                    this.saveAsDraftText=Common.GetSaveasDraftProgressText;
                    this.btnSaveDraft.nativeElement.dispatchEvent(event);
                }
                this.draftSavedTime = Date.now();
            }
            this.isFirstTime = true;
        }
    }
    ngOnDestroy() {
        this.st.delTimer('InitialEnqAutoSave');
    }
}


