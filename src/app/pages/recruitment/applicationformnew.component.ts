import { Component, ElementRef, QueryList, ViewChild, ViewChildren, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SimpleTimer } from 'ng2-simple-timer';
//import {  ContactValidator} from '../validator/contact.validator'
import { environment } from '../../../environments/environment';
import { Common, CompareStaticValue, deepCopy } from '../common';
import { ContactVisible } from '../contact/contact';
import { ListBoxOptions } from '../listbox/listbox';
import { PagesComponent } from '../pages.component';
import { PersonalInfo, PersonalInfoVisible } from '../personalinfo/personalinfo';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { CarerInfo, CarerInfoDTOCombo } from './DTO/carerinfo';
import { CarerParentDTO } from './DTO/carerparent';
import { ConfigTableNames } from '../configtablenames';
import { BackupCarerDTO } from './DTO/backupcarer';
declare var $: any;
//import * as $ from 'jquery';
declare var window: any;
import { CarerAddressHistoryDTO } from '../fostercarer/DTO/careraddresshistorydto';

@Component({
    selector: 'ApplicationFormNew',
    templateUrl: './applicationformnew.component.template.html',
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

export class ApplicationFormNewComponent { //implements AfterViewChecked {

    objCarerAddressHistoryDTO: CarerAddressHistoryDTO = new CarerAddressHistoryDTO();
    carerAddressHistoryList;
    backupCarerInfoList =[];
    backupCarerList = [];
    carerAddresses;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "CarerInfo";
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objCarerInfo: CarerInfo = new CarerInfo();
    objCarerInfoSA: CarerInfo = new CarerInfo();
    objCarerInfoOG;
    objCarerInfoSAOG;
    objCarerInfoList: CarerInfo[] = [];
    objCarerInfoListSaveasDraft = [];
    objCarerInfoDTOCombo: CarerInfoDTOCombo = new CarerInfoDTOCombo();
    objListBoxOptions: ListBoxOptions[] = [];
    objContactVisible: ContactVisible = new ContactVisible();
    objContactVisibleOther: ContactVisible = new ContactVisible();
    objPCContactVisible : ContactVisible = new ContactVisible();
    objSCContactVisible : ContactVisible = new ContactVisible();
    objPersonalInfoVisible: PersonalInfoVisible = new PersonalInfoVisible();
    objOtherPersonalInfoVisible: PersonalInfoVisible = new PersonalInfoVisible();
    objOtherPersonalInfo: PersonalInfo = new PersonalInfo();
    objBackUpCarerDTO: BackupCarerDTO = new BackupCarerDTO();
    familysubmitted = false;
    submitted = false;
    CarerEmployerInfo;
    areaOfficeList;
    jobTitleList = [];
    ethinicityList = [];
    lstPropertyOwnership =[];
    lstHomeType =[];
    OfstedethinicityList = [];
    religionList = [];
    languagesSpokenList = [];
    NationalityList = [];
    ImmigrationStatusList = [];
    DisabilityList = [];
    PlacementTypeList = [];
    ExPartnerRelationshipList = [];
    ageCount = [];
    Jointapplicant = false;
    emptyTab = false;
    loginUser;
    _Form: FormGroup;
    _FormSA: FormGroup; objQeryVal;
    _FormAH: FormGroup;
    _FormFamily: FormGroup;
    LocalAuthorityList;
    //Doc
    FormCnfgId;
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerParentId: number;
    AgencyProfileId: number;
    SelectedApplicantProfile;
    SAValidator = false;
    IsLoading = false;
    insCopyRefToSecondCarerData;
    IsSubmitted = true;
    countryList = [];
    @ViewChild('header') headerCtrl;
    ApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    objApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    oldApplicantProfileVal: CarerParentDTO = new CarerParentDTO();

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
    accessAutoSave = false;
    //Print
    cParentId = 0;
    insCarerDetails;
    CarerCode = 0;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    IsPCFamilyGPCopytoSC = false;
    insExPartEmpRefEmployerChangeStatus = 0;

    insPCReferenceDirty = false;
    insSCReferenceDirty = false;
    insPCEmployerInfoDirty = false;
    insSCEmployerInfoDirty = false;
    insPCExPartnersDirty = false;
    insSCExPartnersDirty = false;
    elem:any;
    elemSA:any;
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    isLoadingSAD: boolean = false;

    //Disability
    arrayDisability = [];
    selectedDisabilities;
    selectedDisabilitiesSA;

    @ViewChild('PCReference') childPCReference;
    @ViewChild('SCReference') childSCReference;
    @ViewChild('PCExPartners') childPCExPartners;
    @ViewChild('SCExPartners') childSCExPartners;
    @ViewChild('PCEmployerInfo') childPCEmployerInfo;
    @ViewChild('SCEmployerInfo') childSCEmployerInfo;
    @ViewChildren('ngSelect') ngSelectElements: QueryList<NgSelectComponent>;
    @ViewChildren('ngSelectSA') ngSelectElementsSA: QueryList<NgSelectComponent>;
    constructor(_formBuilder: FormBuilder, private _router: Router,
        private activatedroute: ActivatedRoute, private st: SimpleTimer, private renderer: Renderer2,
        private module: PagesComponent, private apiService: APICallService) {
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        this.tabActive1 = "active";
        //doc
        this.formId = 24;
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 36]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 36]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.fnBindDDLValue();
            this.FormCnfgId = 44;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.cParentId = this.CarerParentId;
            this.BindCarerInfo(this.CarerParentId);
            //SelectedApplicantProfile
            if (Common.GetSession("SelectedCarerProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
            }
            this.accessAutoSave = this.module.GetAddBtnAccessPermission(this.FormCnfgId);
        }
        else if (this.objQeryVal.mid == 13) {
            this.fnBindDDLValue();
            this.FormCnfgId = 24;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.cParentId = this.CarerParentId;
            this.BindCarerInfo(this.CarerParentId);
            if (Common.GetSession("SelectedApplicantProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
            }
            this.accessAutoSave = this.module.GetAddBtnAccessPermission(this.FormCnfgId);
        }

        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.CarerParentId;
        this.setVisible();
        this.SelectedApplicantProfile = JSON.parse(Common.GetSession("SelectedApplicantProfile"))
        // console.log(this.SelectedApplicantProfile.SCFullName);
        if (this.SelectedApplicantProfile != null && this.SelectedApplicantProfile.SCFullName != null) {
            this.SAValidator = true;
        }
        this.apiService.get("AreaOfficeProfile", "getall").then(data => { this.areaOfficeList = data; });

        this.apiService.get("CarerInfo","CheckSecondCarer",this.CarerParentId).then(data=>{
            this.Jointapplicant=data;
        })

        this.objBackUpCarerDTO.CarerParentId = this.CarerParentId;
        this.objBackUpCarerDTO.AgencyProfileId = this.AgencyProfileId;
        this.objBackUpCarerDTO.FormCnfgId =34;
        this.apiService.post("BackupCarer","GetByCarerParentId",this.objBackUpCarerDTO).then(data =>{
            data.forEach(element => {
            let backupCarer:BackupCarerDTO = new BackupCarerDTO();
            backupCarer.BackupCarerInfo = element;
            this.backupCarerList.push(backupCarer);
          });

        });

        this._FormSA = _formBuilder.group({
            //  JobTitleIdSA: ['0'],
            NationalInsurenceNumberSA: ['0'],
            OfstedEthinicityIdSA: ['0'],//2
            EthinicityIdSA: ['0'],//1
            scMobileNo: ['', [Validators.minLength(10), Validators.maxLength(20)]],
            scEmail: ['',[Validators.email]],
            HasSexualorientationSA: ['0'],
            HaveCriminalOffenseConvictionSA: [''],
            MedicalTreatmentDetailsSA: [],
            ReligionIdSA: ['0'],//3
            CriminalOffenceConvictionDetailSA: [],

            DoYouHaveYourOwnVehicleSA:[],
            DoesCarerDriveCarSA:[],
            VehicleRegistrationNumberSA:[],
            DrivingLicenceNumberSA:[],
            CarerBornCountrySA: ['0'],
            HowLongLivedInLocalAreaSA:[''],
            PassportNationalitySA:['0'],
            DateOfMarriageSA:[''],
            PlaceOfMarriageSA: [''],
            DateOfDivorceSA:[''],
            HasDisabilitySA: [''],
            //DisabilityDetailSA: [''],
            HasSocialServicesInvolvedSA:[''],
            SocialServicesInvolvedDetailSA:[''],

            InGoodHealthSA: [],
            OnAnyMedicationSA: [],
            MedicationDetailSA:[''],
            AnySurgeryIn5YearsSA:[],
            SurgeryDetailSA:[''],
            DoYouSmokeSA:[],
            SmokingHowOftenSA:[''],
            DoYouDrinkSA:[],
            DrinkingHowOftenSA:[''],
            SmokeDrinkTermsSA:[],
            AnyOutstandingCourtOrdersSA:[],
            OutstandingCourtOrderDetailSA:[''],
            AnyChildOutstandingCourtOrdersSA:[],
            ChildOutstandingCourtOrderDetailSA:['']
        });

        // this._FormAH = _formBuilder.group({
        //   IsCurrentAddress:[''],
        //   AddressWhenApplied:[''],
        //   DateMoved:[''],
        //   DateMovedOut:[''],
        //   AddressLine1:['',Validators.required,Validators.maxLength(300)],
        //   PostalCode:['',Validators.required,Validators.minLength(7),Validators.maxLength(10)],
        //   LocalAuthorityId:['']
        // });

        this._Form = _formBuilder.group({
            //Primary Carer tab
            AreaOfficeid: ['0', Validators.required],
            NationalInsurenceNumber: ['0'],
            //   JobTitleId: ['0'],
            EthinicityId: ['0', Validators.required],
            OfstedEthinicityId: ['0', Validators.required],
            ReligionId: ['0', Validators.required],
            pcMobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],
            HomePhone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],
            pcEmail: ['', [Validators.required,Validators.email]],
            CarerBornCountry: ['0'],
            HowLongLivedInLocalArea: [''],
            PassportNationality:['0'],
            DateOfMarriage: [''],
            PlaceOfMarriage: [''],
            DateOfDivorce:[''],
            HasDisability: [''],
            //DisabilityDetail: [''],
            HasSocialServicesInvolved:[''],
            SocialServicesInvolvedDetail:[''],
            HasSexualorientation: ['0'],
            HaveCriminalOffenseConviction: [''],
            CriminalOffenceConvictionDetail: [''],
            MedicalTreatmentDetails: [],
            //Kind of Placement
            AgeRangeFrom: [],
            AgeRangeTo: [],
            Gender: ['0', Validators.required],
            HasBlingGroupAcceptable: ['0'],
            NumberOfChirldren: ['0', Validators.required],
            StateFosteringInterest: [''],
            ChildBehaviourNotAccept: [''],
            HouseholdInfo: [''],
            //EmployersName
            EmployersName: [''],
            EmployersAddressLine: [''],
            EmployementDurationAndPost: [],
            //Other
            HavePresentlyFostering: [],
            HaveAppliedToFosterCarer: [],
            LivingLocalAuthorityId: ['0', Validators.required],
            PresentlyFosteringDetails: [],
            AppliedToFosterCarerDetail: [],
            RelyonSupport: [],
            FosteringIssuesTrainingNeeds: [],
            SupportNeedComments: [],
            ApplicationFilledDate: [Validators.required],
            PartnershipTypeId: ['0'],
            DateofRegistration: [''],
            PlaceofRegistration: [],
            DateSetUpHomeTogether: [''],
            PCFamilyGPCopytoSC: [],

            DoYouHaveYourOwnVehicle:[],
            DoesCarerDriveCar:[],
            VehicleRegistrationNumber:[],
            DrivingLicenceNumber:[],
            HasAnyChildCriminalConviction:[''],
            ChildConvictionDetail:[''],

            InGoodHealth: [],
            OnAnyMedication: [],
            MedicationDetail:[''],
            AnySurgeryIn5Years:[],
            SurgeryDetail:[''],
            DoYouSmoke:[],
            SmokingHowOften:[''],
            DoYouDrink:[],
            DrinkingHowOften:[''],
            SmokeDrinkTerms:[],

            OwnershipOfPropertyId:[],
            HouseTypeId:[],
            TotalBedRoomCount:[],
            SpareBedRoomCount:[],
            PlanToMoveInNearFuture:[],
            HaveAnyPets:[],
            PetsDetails:[],

            DoesApplicantChildCareExprience:[],
            ApplicantChildCareExprienceDetail:[''],
            AreImplecationInReligion:[],
            ImplecationInReligionDetails:[''],
            DoFosterOtherReligionChild:[],
            FosterOtherReligionChildComments:[''],
            DoesApplicantPromotingEO:[],
            EqualOpportunitiesComments:[''],
            DoBackupCarerInMind:[],
            AnyOutstandingCourtOrders:[],
            OutstandingCourtOrderDetail:[''],
            AnyChildOutstandingCourtOrders:[],
            ChildOutstandingCourtOrderDetail:['']
        });
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });

        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Country;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.countryList = data; });

        this.loginUser = Common.LoginUserId;

        this.apiService.get(this.controllerName, "GetApplicantFormDDLValues", this.AgencyProfileId).then(data => {
            this.LocalAuthorityList = data.LocalAuthority;
           // this.ethinicityList = data.Ethnicity;
           // this.OfstedethinicityList = data.OfstedEthnicity;
           // this.religionList = data.Religion;
            this.languagesSpokenList = data.Language;
            this.ExPartnerRelationshipList = data.ExPartnerRelationship;

            this.RelationshipTypeChange(this.objCarerInfo.CarerOtherInformation.PartnershipTypeId);
            this.NationalityList = data.Nationality;
            this.ImmigrationStatusList = data.ImmigrationStatus;
            this.DisabilityList = data.Disability;
            this.PlacementTypeList = data.PlacementType;
        });



        //bind age range
        let age = [];
        for (let i: any = 1; i <= 20; i++) {
            age.push(i);
        }
        this.ageCount = age;
    }
    fnLoadDisability(data) {
      if (data) {
          data.forEach(item => {
              this.arrayDisability.push({ id: item.CofigTableValuesId, name: item.Value });
          }
          );
      }

    }

     fnBindDDLValue()
     {

        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Ethnicity;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.ethinicityList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Religion;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.religionList = data; });

        this.objConfigTableNamesDTO.Name = ConfigTableNames.OfstedEthnicity;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.OfstedethinicityList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.PropertyOwnership;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.lstPropertyOwnership = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.HomeType;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.lstHomeType = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Disability;
          this.apiService.post("ConfigTableValues","GetByTableNamesId",this.objConfigTableNamesDTO).then(data => {
            this.fnLoadDisability(data);
        });
     }

    insPartnershipTypeId = 0;
    RelationshipTypeChange(PartnershipTypeId) {

        let value = this.ExPartnerRelationshipList.filter(x => x.CofigTableValuesId == PartnershipTypeId);
        if (value.length > 0) {
            if (value[0].Value == "Marriage")
                this.insPartnershipTypeId = 1;
            else if (value[0].Value == "Civil Partnerships")
                this.insPartnershipTypeId = 2;
            else if (value[0].Value == "lived together")
                this.insPartnershipTypeId = 3;
        }
        else
            this.insPartnershipTypeId = 0;

    }

    //fnPCFamilyGPCopytoSC() {
    //    this.IsPCFamilyGPCopytoSC = !this.IsPCFamilyGPCopytoSC;
    //    if (this.IsPCFamilyGPCopytoSC) {
    //        console.log("sa");
    //        console.log(this.objCarerInfo.FamilyGPPersonalInfo);
    //        console.log(this.objCarerInfoSA.FamilyGPPersonalInfo);
    //     //   this.objCarerInfoSA.FamilyGPPersonalInfo.TitleId = this.objCarerInfo.FamilyGPPersonalInfo.TitleId;
    //        // this.objCarerInfoSA.FamilyGPPersonalInfo.FirstName = this.objCarerInfo.FamilyGPPersonalInfo.FirstName;
    //        //  this.objCarerInfoSA.FamilyGPPersonalInfo.lastName = this.objCarerInfo.FamilyGPPersonalInfo.lastName;
    //        //   this.objCarerInfoSA.FamilyGPContactInfo.AddressLine1 = this.objCarerInfo.FamilyGPContactInfo.AddressLine1;
    //        //    this.objCarerInfoSA.FamilyGPContactInfo.HomePhone = this.objCarerInfo.FamilyGPContactInfo.HomePhone;
    //        console.log(this.objCarerInfo.FamilyGPPersonalInfo.TitleId);
    //        console.log(this.objCarerInfoSA.FamilyGPPersonalInfo.TitleId);
    //    }

    //}

    isGetSaveAsDraftInfo = true;
    BindCarerInfo(CarerParentId) {
        //Get Carer Info from main table
        this.objCarerInfo.CarerParentId = this.CarerParentId;
        if (CarerParentId != null && CarerParentId != NaN && CarerParentId != 0) {
            this.apiService.get("CarerInfo", "GetByCarerParentId", this.objCarerInfo.CarerParentId).then(data => {
                this.BindCarerDetails(data, "Submit");

                //Get Save as Draft
                if (this.objCarerInfo.ApplicationFilledDate == null && this.isGetSaveAsDraftInfo) {

                    this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
                    this.objSaveDraftInfoDTO.SequenceNo = this.CarerParentId;
                    this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
                    this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
                    this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                        this.SaveasDraft = true;
                        let tempJsonData = [];
                        tempJsonData.push(JSON.parse(data.JsonData));
                        tempJsonData.push(JSON.parse(data.JsonList));
                        // console.log(tempJsonData);  this.objCarerInfoList = [];
                        if (data != null && tempJsonData.length != 0) {
                            this.BindCarerDetails(tempJsonData, "Draft");
                        }
                    });
                }
                //End

            });
        }


    }

    parseDate(dateString: string): Date {
        if (dateString) {
            return new Date(dateString);
        } else {
            return null;
        }
    }

    dateString;
    SetDateOfMarriage() {
        this.objCarerInfo.DateOfMarriage = this.module.GetDateEditFormat(this.objCarerInfo.DateOfMarriage);
        this.objCarerInfoSA.DateOfMarriage = this.module.GetDateEditFormat(this.objCarerInfoSA.DateOfMarriage);
        this.objCarerInfo.DateOfDivorce = this.module.GetDateEditFormat(this.objCarerInfo.DateOfDivorce);
        this.objCarerInfoSA.DateOfDivorce = this.module.GetDateEditFormat(this.objCarerInfoSA.DateOfDivorce);
        this.objCarerInfo.CarerOtherInformation.DateofRegistration = this.module.GetDateEditFormat(this.objCarerInfo.CarerOtherInformation.DateofRegistration);
        this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether = this.module.GetDateEditFormat(this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether);
        this.objCarerInfo.ApplicationFilledDate = this.module.GetDateEditFormat(this.objCarerInfo.ApplicationFilledDate);
    }

    fnAddCopyReftoSecondCarer(event) {
        // console.log("sd");
        /// this.objCarerInfoSA.CarerReferenceInfo = event
        this.insCopyRefToSecondCarerData = event;
    }
    lstCarerReferenceInfoPC;
    lstCarerReferenceInfoSC;
    lstCarerExPartnerInfoPC;
    lstCarerExPartnerInfoSC;
    lstCarerEmployerInfoPC;
    lstCarerEmployerInfoSC;
    lstCarerAddressHistory;
    //backupCarerList;
    BindCarerDetails(data: CarerInfo[], type) {


        if(type=="Submit" && data[0] != null){
          this.apiService.get("CarerAddressHistory", "GetAllByCarerParentId", this.CarerParentId).then(address =>
            {

               this.objCarerInfo = data[0];
               this.objCarerInfo.CarerAddressHistory = address;
               this.carerAddresses = this.objCarerInfo.CarerAddressHistory;
               this.lstCarerReferenceInfoPC = this.objCarerInfo.CarerReferenceInfo;
               this.lstCarerExPartnerInfoPC = this.objCarerInfo.CarerExPartnerInfo;
               this.lstCarerEmployerInfoPC = this.objCarerInfo.CarerEmployerInfo;

               this.selectedDisabilities=this.objCarerInfo.DisabilityIds;
               this.objCarerInfo.UpdatedUserId = this.loginUser;
               this.objCarerInfo.CreatedUserId = this.loginUser;
               this.objOtherPersonalInfo = this.objCarerInfo.CarerOtherInformation.PersonalInfo;

               this.objCarerInfoOG = deepCopy<any>(this.objCarerInfo);
               this.SetDateOfMarriage();
               if (this.objCarerInfo.EthinicityId == null)
                   this.objCarerInfo.EthinicityId = null;

               if (this.objCarerInfo.CarerOtherInformation.LivingLocalAuthorityId == 0)
                   this.objCarerInfo.CarerOtherInformation.LivingLocalAuthorityId = null;

               if (this.objCarerInfo.ApplicationFilledDate && type == "Submit") {
                   if (this.objCarerInfo.ApplicationFilledDate.toString() == "1900-01-01") {
                       this.objCarerInfo.ApplicationFilledDate = null;
                   }
                   this.isGetSaveAsDraftInfo = false;
                   this.showbtnSaveDraft = false;
                   this.SaveasDraft = false;
               }
          });

        }
        if (type == 'Draft' && data[0] != null) {

            this.objCarerInfo = data[0];
            this.carerAddresses = this.objCarerInfo.CarerAddressHistory;
            this.lstCarerReferenceInfoPC = this.objCarerInfo.CarerReferenceInfo;
            this.lstCarerExPartnerInfoPC = this.objCarerInfo.CarerExPartnerInfo;
            this.lstCarerEmployerInfoPC = this.objCarerInfo.CarerEmployerInfo;

            this.selectedDisabilities=this.objCarerInfo.DisabilityIds;
            this.objCarerInfo.UpdatedUserId = this.loginUser;
            this.objCarerInfo.CreatedUserId = this.loginUser;
            this.objOtherPersonalInfo = this.objCarerInfo.CarerOtherInformation.PersonalInfo;

            this.objCarerInfoOG = deepCopy<any>(this.objCarerInfo);
            this.SetDateOfMarriage();
            if (this.objCarerInfo.EthinicityId == null)
                this.objCarerInfo.EthinicityId = null;

            if (this.objCarerInfo.CarerOtherInformation.LivingLocalAuthorityId == 0)
                this.objCarerInfo.CarerOtherInformation.LivingLocalAuthorityId = null;

            if (this.objCarerInfo.ApplicationFilledDate && type == "Submit") {
                if (this.objCarerInfo.ApplicationFilledDate.toString() == "1900-01-01") {
                    this.objCarerInfo.ApplicationFilledDate = null;
                }
                this.isGetSaveAsDraftInfo = false;
                this.showbtnSaveDraft = false;
                this.SaveasDraft = false;
            }
        }
        if (this.Jointapplicant&& data[1] != null && this.objCarerInfo.CarerId != data[1].CarerId) {
            this.objCarerInfoSA = data[1];
            this.selectedDisabilitiesSA=this.objCarerInfoSA.DisabilityIds;
            this.lstCarerReferenceInfoSC = this.objCarerInfoSA.CarerReferenceInfo;
            this.lstCarerExPartnerInfoSC = this.objCarerInfoSA.CarerExPartnerInfo;
            this.lstCarerEmployerInfoSC = this.objCarerInfoSA.CarerEmployerInfo;
            this.objCarerInfoSAOG = deepCopy<any>(this.objCarerInfoSA);
            // if (this.objCarerInfoSA.PersonalInfo.TitleId != 0) {
            //     this.Jointapplicant = true;
            // }
        }
    }
    childConvictionDetailClear(evnt){
      this.objCarerInfo.ChildConvictionDetail='';
    }

    setVisible() {
        //Personal Info
        this.objPersonalInfoVisible.TitleVisible = false;
        this.objPersonalInfoVisible.MiddleNameVisible =false;
        this.objPersonalInfoVisible.genderIdVisible= false;
        this.objPersonalInfoVisible.AgeVisible = false;
        //Other Personal Info
        this.objOtherPersonalInfoVisible.TitleMandatory = false;
        this.objOtherPersonalInfoVisible.TitleVisible = false;
        this.objOtherPersonalInfoVisible.FirstNameMandatory = false;
        this.objOtherPersonalInfoVisible.lastNameMandatory = false;
        this.objOtherPersonalInfoVisible.MiddleNameVisible = false;
        this.objOtherPersonalInfoVisible.ImageIdVisible = false;
        this.objOtherPersonalInfoVisible.DateOfBirthVisible = false;
        this.objOtherPersonalInfoVisible.PreviousNameVisible = false;
        this.objOtherPersonalInfoVisible.AgeVisible = false;
        this.objOtherPersonalInfoVisible.genderIdVisible = false;
        //Set PC Contact Info Visible & Mandatory
        this.objPCContactVisible.CityVisible = false;
        this.objPCContactVisible.OfficePhoneVisible = false;
        this.objPCContactVisible.FaxVisible = false;
        this.objPCContactVisible.AlternativeEmailIdVisible = false;
        this.objPCContactVisible.CountyIdVisible = false;
        this.objPCContactVisible.CountryIdVisible = false;
        this.objPCContactVisible.PostalCodeVisible = false;
        this.objPCContactVisible.EmergencyContactVisible = false;
        this.objPCContactVisible.AddressLine1Visible = false;
        this.objPCContactVisible.AddressLine2Visible = false;


        this.objPCContactVisible.CityMandatory = false;
        this.objPCContactVisible.HomePhoneMandatory = false;
        this.objPCContactVisible.OfficePhoneMandatory = false;
        this.objPCContactVisible.MobilePhoneMandatory = false;
        this.objPCContactVisible.FaxMandatory = false;
        this.objPCContactVisible.EmailIdMandatory = false;
        this.objPCContactVisible.AlternativeEmailIdMandatory = false;
        this.objPCContactVisible.CountyIdMandatory = false;
        this.objPCContactVisible.CountryIdMandatory = false;
        this.objPCContactVisible.PostalCodeMandatory = false;
        this.objPCContactVisible.EmergencyContactMandatory = false;
        this.objPCContactVisible.AddressLine1Mandatory = false;
        this.objPCContactVisible.AddressLine2Mandatory = false;
        //Set SC Contact Info Visible & Mandatory
        this.objSCContactVisible.CityVisible = false;
        this.objSCContactVisible.OfficePhoneVisible = false;
        this.objSCContactVisible.FaxVisible = false;
        this.objSCContactVisible.AlternativeEmailIdVisible = false;
        this.objSCContactVisible.CountyIdVisible = false;
        this.objSCContactVisible.CountryIdVisible = false;
        this.objSCContactVisible.PostalCodeVisible = false;
        this.objSCContactVisible.EmergencyContactVisible = false;
        this.objSCContactVisible.AddressLine1Visible = false;
        this.objSCContactVisible.AddressLine2Visible = false;


        this.objSCContactVisible.CityMandatory = false;
        this.objSCContactVisible.HomePhoneMandatory = false;
        this.objSCContactVisible.OfficePhoneMandatory = false;
        this.objSCContactVisible.MobilePhoneMandatory = false;
        this.objSCContactVisible.FaxMandatory = false;
        this.objSCContactVisible.EmailIdMandatory = false;
        this.objSCContactVisible.AlternativeEmailIdMandatory = false;
        this.objSCContactVisible.CountyIdMandatory = false;
        this.objSCContactVisible.CountryIdMandatory = false;
        this.objSCContactVisible.PostalCodeMandatory = false;
        this.objSCContactVisible.EmergencyContactMandatory = false;
        this.objSCContactVisible.AddressLine1Mandatory = false;
        this.objSCContactVisible.AddressLine2Mandatory = false;
        //objContactVisibleOther
        this.objContactVisibleOther.HomePhoneMandatory = false;
        this.objContactVisibleOther.OfficePhoneVisible = false;
        this.objContactVisibleOther.EmailIdVisible = false;
        this.objContactVisibleOther.AlternativeEmailIdVisible = false;
        this.objContactVisibleOther.AddressLine1Mandatory = false;
        this.objContactVisibleOther.AddressLine2Visible = false;
        this.objContactVisibleOther.EmergencyContactVisible = false;
        this.objContactVisibleOther.PostalCodeVisible = false;
        this.objContactVisibleOther.CountryIdVisible = false;
        this.objContactVisibleOther.CountyIdVisible = false;
        this.objContactVisibleOther.FaxVisible = false;
        this.objContactVisibleOther.MobilePhoneVisible = false;
        this.objContactVisibleOther.CityVisible = false;
    }
    isPCDirty = true;
    isSCDirty = true;
    IsNewOrSubmited = 1;//New=1 and Submited=2
    isOK = false;
    JoinOk = true;
    DocOk = true; //Familyinfo,
    Submit(MainForm, PCPersInfo, PCPersInfoForm, SCPersInfo, SCPersInfoForm,

        AddressHistory, //BackupCarerList,
        KOPPlacementType,
        PCReference, SCReference, PCExPartners, SCExPartners, PCEmployerInfo, SCEmployerInfo,
        OtherPersonalInfo, OtherPerInfoForm, OtherConInfo, OtherConInfoForm,
        languagesSpoken, languagesSpokenSA,
        UploadDocIds, IsUpload, uploadFormBuilder,
        scOtherPersonalInfo, scOtherPerInfoForm, scOtherConInfo, scOtherConInfoForm,
        PCReferenceDirty, SCReferenceDirty,
        PCExPartnersDirty, SCExPartnersDirty,
        PCEmployerInfoDirty, SCEmployerInfoDirty, AddtionalEmailIds, EmailIds) {

        for(let element of this.ngSelectElements.toArray()){
            if(element.hasValue == false){
                this.elem=element;
                break;
            }
        }
        if(this.SAValidator){
            for(let element of this.ngSelectElementsSA.toArray()){
                if(element.hasValue == false){
                    this.elemSA=element;
                    break;
                }

            }
        }

        if (!MainForm.valid || !PCPersInfoForm.valid) {
            this.fnTabActive(1);
            this.module.GetErrorFocus(MainForm,this.elem);

            if (!MainForm.controls.LivingLocalAuthorityId.valid) {
                this.fnTabActive(16);
                this.module.GetErrorFocus(MainForm,this.elem);
            }
        }

        else if (!OtherPerInfoForm.valid) {
            this.fnTabActive(8);
            this.module.GetErrorFocus(OtherPerInfoForm);
        }
        else if (IsUpload && !uploadFormBuilder.valid) {
            this.fnTabActive(9);
            this.module.GetErrorFocus(uploadFormBuilder);
        }
        else if (this.Jointapplicant) {
            if (!this._FormSA.valid) {
                this.fnTabActive(10);
                this.module.GetErrorFocus(this._FormSA, this.elemSA);
            }
            else if (!SCPersInfoForm.valid) {
                this.fnTabActive(10);
                this.module.GetErrorFocus(SCPersInfoForm);
            }
        }

        this.isOK = false;
        this.JoinOk = true;
        this.submitted = true;
        this.DocOk = true;
        if (MainForm.valid && PCPersInfoForm.valid && OtherConInfoForm.valid && OtherPerInfoForm.valid) {
            this.isOK = true;
        }
        if (this.Jointapplicant) {
            if (this._FormSA.valid && SCPersInfoForm.valid) {
                this.JoinOk = true;
            }
            else {
                this.JoinOk = false;
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


        if (this.isOK && this.JoinOk && this.DocOk) {
            this.objCarerInfo.CreatedUserId = parseInt(Common.GetSession("UserProfileId"));
            this.objCarerInfo.UpdatedUserId = parseInt(Common.GetSession("UserProfileId"));
            this.objCarerInfo.PersonalInfo = PCPersInfo;
            //this.objCarerInfo.ContactInfo = PCConatactInfo;


            //this.objCarerInfo.BackupCarerList = BackupCarerList;
            this.objCarerInfo.CarerAddressHistory = AddressHistory;
            this.objCarerInfo.DisabilityIds=this.selectedDisabilities;
            this.objCarerInfo.FamilyGPContactInfo = OtherConInfo;
            this.objCarerInfo.FamilyGPPersonalInfo = OtherPersonalInfo;
            this.objCarerInfoSA.PersonalInfo = SCPersInfo;
            this.objCarerInfoSA.FamilyGPContactInfo = scOtherConInfo;
            this.objCarerInfoSA.FamilyGPPersonalInfo = scOtherPersonalInfo;


            if (this.IsPCFamilyGPCopytoSC) {
                this.objCarerInfoSA.FamilyGPPersonalInfo.TitleId = this.objCarerInfo.FamilyGPPersonalInfo.TitleId;
                this.objCarerInfoSA.FamilyGPPersonalInfo.FirstName = this.objCarerInfo.FamilyGPPersonalInfo.FirstName;
                this.objCarerInfoSA.FamilyGPPersonalInfo.lastName = this.objCarerInfo.FamilyGPPersonalInfo.lastName;
                this.objCarerInfoSA.FamilyGPContactInfo.AddressLine1 = this.objCarerInfo.FamilyGPContactInfo.AddressLine1;
                this.objCarerInfoSA.FamilyGPContactInfo.HomePhone = this.objCarerInfo.FamilyGPContactInfo.HomePhone;
            }
            this.objCarerInfo.PersonalInfo.DateOfBirth = this.module.GetDateSaveFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
            this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.module.GetDateSaveFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
            this.objCarerInfo.DateOfDivorce = this.module.GetDateSaveFormat(this.objCarerInfo.DateOfDivorce);
            this.objCarerInfoSA.DateOfDivorce = this.module.GetDateSaveFormat(this.objCarerInfoSA.DateOfDivorce);
            // this.objCarerInfo.CarerOtherInformation.DateOfMarriage = this.module.GetDateSaveFormat(this.objCarerInfo.CarerOtherInformation.DateOfMarriage);
            this.objCarerInfo.DateOfMarriage = this.module.GetDateSaveFormat(this.objCarerInfo.DateOfMarriage);
            this.objCarerInfoSA.DateOfMarriage = this.module.GetDateSaveFormat(this.objCarerInfoSA.DateOfMarriage);
            this.objCarerInfo.CarerOtherInformation.DateofRegistration = this.module.GetDateSaveFormat(this.objCarerInfo.CarerOtherInformation.DateofRegistration);
            this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether = this.module.GetDateSaveFormat(this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether);
            this.objCarerInfo.ApplicationFilledDate = this.module.GetDateSaveFormat(this.objCarerInfo.ApplicationFilledDate);
            for(const key in this.objCarerInfo.CarerAddressHistory){
              this.objCarerInfo.CarerAddressHistory[key].DateMoved = this.module.GetDateSaveFormat(this.objCarerInfo.CarerAddressHistory[key].DateMoved);
              this.objCarerInfo.CarerAddressHistory[key].DateMovedOut = this.module.GetDateSaveFormat(this.objCarerInfo.CarerAddressHistory[key].DateMovedOut);

            }


            //   List Box
            if (languagesSpoken != undefined)
                this.objCarerInfo.LanguagesSpokenIds = languagesSpoken;
            if (languagesSpokenSA != undefined)
                this.objCarerInfoSA.LanguagesSpokenIds = languagesSpokenSA;
            // if (KOPEthinList != undefined)
            //     this.objCarerInfo.CarerKOP.KOPEthnicityIds = KOPEthinList;
            // if (KOPNationality != undefined)
            //     this.objCarerInfo.CarerKOP.KOPNationalityIds = KOPNationality;
            // if (KOPReligion != undefined)
            //     this.objCarerInfo.CarerKOP.KOPReligionIds = KOPReligion;
            // if (KOPImmigration != undefined)
            //     this.objCarerInfo.CarerKOP.KOPImmigrationStatusIds = KOPImmigration;
            // if (KOPDisability != undefined)
            //     this.objCarerInfo.CarerKOP.KOPDisabilityIds = KOPDisability;
            if (KOPPlacementType != undefined)
                this.objCarerInfo.CarerKOP.KOPPlacementTypeIds = KOPPlacementType;

            this.isPCDirty = true;
            if (CompareStaticValue(this.objCarerInfo, this.objCarerInfoOG)
                && PCReferenceDirty == false
                && PCExPartnersDirty == false
                && PCEmployerInfoDirty == false
            ) {
                this.isPCDirty = false;
            }

            this.isSCDirty = true;
            if (this.Jointapplicant && CompareStaticValue(this.objCarerInfoSA, this.objCarerInfoSAOG)
                && SCReferenceDirty == false
                && SCExPartnersDirty == false
                && SCEmployerInfoDirty == false) {
                this.isSCDirty = false;
            }

            if (this.isPCDirty || (this.Jointapplicant && this.isSCDirty) || (IsUpload && uploadFormBuilder.valid) || this.isGetSaveAsDraftInfo) {

                this.objCarerInfo.CarerReferenceInfo = PCReference;
                this.objCarerInfo.CarerExPartnerInfo = PCExPartners;
                this.objCarerInfo.CarerEmployerInfo = PCEmployerInfo;
                this.objCarerInfo.CarerAddressHistory = AddressHistory;

                this.objCarerInfoSA.CarerReferenceInfo = SCReference;
                this.objCarerInfoSA.CarerExPartnerInfo = SCExPartners;
                this.objCarerInfoSA.CarerEmployerInfo = SCEmployerInfo;

                this.objCarerInfoSA.DisabilityIds=this.selectedDisabilitiesSA;
                this.objCarerInfo.AgencyProfileId = this.AgencyProfileId;
                this.objCarerInfo.AgencyName = 'Rainbow';
                this.objCarerInfo.NotificationEmailIds = EmailIds;
                this.objCarerInfo.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.objCarerInfo.IsSubmitted = this.IsSubmitted;

                this.IsLoading = true;
                this.objCarerInfoList = [];
                this.objCarerInfoList.push(this.objCarerInfo);
                this.objCarerInfoList.push(this.objCarerInfoSA);
                this.apiService.save("CarerInfo", this.objCarerInfoList, "update").then(data => {
                    this.Respone(data, "update", IsUpload, this.objCarerInfo, this.objCarerInfoSA);
                });
            }
            else {
                this.objCarerInfo.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
                this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
                this.objCarerInfo.DateOfMarriage = this.module.GetDateEditFormat(this.objCarerInfo.DateOfMarriage);
                this.objCarerInfoSA.DateOfMarriage = this.module.GetDateEditFormat(this.objCarerInfoSA.DateOfMarriage);
                this.objCarerInfo.DateOfDivorce = this.module.GetDateEditFormat(this.objCarerInfo.DateOfDivorce);
                this.objCarerInfoSA.DateOfDivorce = this.module.GetDateEditFormat(this.objCarerInfoSA.DateOfDivorce);
                this.objCarerInfo.CarerOtherInformation.DateofRegistration = this.module.GetDateEditFormat(this.objCarerInfo.CarerOtherInformation.DateofRegistration);
                this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether = this.module.GetDateEditFormat(this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether);
                this.objCarerInfo.ApplicationFilledDate = this.module.GetDateEditFormat(this.objCarerInfo.ApplicationFilledDate);
                for(const key in this.objCarerInfo.CarerAddressHistory){
                  this.objCarerInfo.CarerAddressHistory[key].DateMoved = this.module.GetDateEditFormat(this.objCarerInfo.CarerAddressHistory[key].DateMoved);
                  this.objCarerInfo.CarerAddressHistory[key].DateMovedOut = this.module.GetDateEditFormat(this.objCarerInfo.CarerAddressHistory[key].DateMovedOut);

                }
                this.submitText=Common.GetSubmitText;
                this.showAutoSave = false;
                if (this.showAlert && this.IsNewOrSubmited == 1)
                    this.module.alertWarning(Common.GetNoChangeAlert);
                else if (this.showAlert && this.IsNewOrSubmited == 2)
                    this.module.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.showAlert = true;
            }
        }
    }

    showAlert2 = false;
    private Respone(data, type, IsUpload, objCarerInfo, objCarerInfoSA) {

      //  this.objCarerInfo.AgencyProfileId = this.AgencyProfileId;
        this.objCarerInfo.NotificationEmailIds = [];
        this.objCarerInfo.NotificationAddtionalEmailIds = null;
        this.objCarerInfo.IsSubmitted = false;
        this.IsSubmitted = true;
        // console.log("this.showAlert " + this.showAlert);
        if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.objCarerInfoOG = deepCopy<any>(this.objCarerInfo);
            if (this.Jointapplicant)
                this.objCarerInfoSAOG = deepCopy<any>(this.objCarerInfoSA);
        }

        //this.SetDateOfMarriage();
        this.objCarerInfo.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
        this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
        this.objCarerInfo.DateOfMarriage = this.module.GetDateEditFormat(this.objCarerInfo.DateOfMarriage);
        this.objCarerInfoSA.DateOfMarriage = this.module.GetDateEditFormat(this.objCarerInfoSA.DateOfMarriage);
        this.objCarerInfo.DateOfDivorce = this.module.GetDateEditFormat(this.objCarerInfo.DateOfDivorce);
        this.objCarerInfoSA.DateOfDivorce = this.module.GetDateEditFormat(this.objCarerInfoSA.DateOfDivorce);
        this.objCarerInfo.CarerOtherInformation.DateofRegistration = this.module.GetDateEditFormat(this.objCarerInfo.CarerOtherInformation.DateofRegistration);
        this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether = this.module.GetDateEditFormat(this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether);
        this.objCarerInfo.ApplicationFilledDate = this.module.GetDateEditFormat(this.objCarerInfo.ApplicationFilledDate);
        for(const key in this.objCarerInfo.CarerAddressHistory){
          this.objCarerInfo.CarerAddressHistory[key].DateMoved = this.module.GetDateEditFormat(this.objCarerInfo.CarerAddressHistory[key].DateMoved);
          this.objCarerInfo.CarerAddressHistory[key].DateMovedOut = this.module.GetDateEditFormat(this.objCarerInfo.CarerAddressHistory[key].DateMovedOut);

        }

        this.IsLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
           // this.objCarerInfo.IsSubmitted = true;
            //      console.log(objCarerInfo);
            //  this.objCarerInfoOG = deepCopy<any>(this.objCarerInfo);
            //  if (this.Jointapplicant)
            //      this.objCarerInfoSAOG = deepCopy<any>(objCarerInfoSA);

            this.insPCReferenceDirty = false;
            this.childPCReference.fnSetDirty(false);
            this.childSCReference.fnSetDirty(false);
            this.childPCEmployerInfo.fnSetDirty(false);
            this.childSCEmployerInfo.fnSetDirty(false);
            this.childPCExPartners.fnSetDirty(false);
            this.childSCExPartners.fnSetDirty(false);
            this.apiService.get("CarerInfo", "GetByCarerParentId", this.objCarerInfo.CarerParentId).then(data => {
                this.ResponseCarerRefExPartnerEmployeer(data);
            });

            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.CarerParentId);
                }
                //SequenceNumber
                if (this.showAlert)
                    this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
              this.submitText=Common.GetSubmitText;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.CarerParentId);
                }
                // console.log("1111 " + this.showAlert);
                // alert(this.showAlert);
                if (this.showAlert)
                    this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            this.showAlert2 = this.showAlert;
            this.showAlert = true;
            this.insExPartEmpRefEmployerChangeStatus = 1;
            //Update Header
            this.oldApplicantProfileVal = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
            let AreaOfficeName = this.areaOfficeList.find((item: any) => item.AreaOfficeProfileId == this.objCarerInfo.AreaOfficeid).AreaOfficeName;

            this.ApplicantProfileVal.PCFullName = this.objCarerInfo.PersonalInfo.FirstName + ' ' + this.objCarerInfo.PersonalInfo.lastName;
            if (this.Jointapplicant)
                this.ApplicantProfileVal.SCFullName = ' / ' + this.objCarerInfoSA.PersonalInfo.FirstName + ' ' + this.objCarerInfoSA.PersonalInfo.lastName;
            //  else
            //   this.ApplicantProfileVal.SCFullName = ' / ' + this.oldApplicantProfileVal.SCFullName;

            this.ApplicantProfileVal.CarerCode = this.oldApplicantProfileVal.CarerCode;
            this.ApplicantProfileVal.CarerParentId = this.oldApplicantProfileVal.CarerParentId;
            this.ApplicantProfileVal.CarerId = this.oldApplicantProfileVal.CarerId;
            this.ApplicantProfileVal.CarerStatusName = this.oldApplicantProfileVal.CarerStatusName;
            this.ApplicantProfileVal.CarerStatusId = this.oldApplicantProfileVal.CarerStatusId;
            this.ApplicantProfileVal.ContactInfo.City = this.oldApplicantProfileVal.ContactInfo.City;
            this.ApplicantProfileVal.AreaOfficeName = AreaOfficeName;
            this.ApplicantProfileVal.CreatedDate = this.oldApplicantProfileVal.CreatedDate;
            this.ApplicantProfileVal.PersonalInfo.ImageId = this.objCarerInfo.PersonalInfo.ImageId;
            this.ApplicantProfileVal.AvailableVacancies = this.oldApplicantProfileVal.AvailableVacancies;
            this.ApplicantProfileVal.ApproveVacancies = this.oldApplicantProfileVal.ApproveVacancies;
            this.ApplicantProfileVal.SupervisingSocialWorker = this.oldApplicantProfileVal.SupervisingSocialWorker;
            this.objApplicantProfileVal = new CarerParentDTO();
            this.objApplicantProfileVal = this.ApplicantProfileVal;
            this.headerCtrl.fnShowImage(this.objCarerInfo.PersonalInfo.ImageId);
            Common.SetSession("SelectedApplicantProfile", JSON.stringify(this.ApplicantProfileVal));
            //End
            //this.showAlert = true;
            if (this.showAlert2)
                this._router.navigate(['/pages/recruitment/redirect/7/', this.objQeryVal.mid]);

        }
    }

    //
    ResponseCarerRefExPartnerEmployeer(data: CarerInfo[]) {

        if (data[0] != null) {
            this.lstCarerReferenceInfoPC = data[0].CarerReferenceInfo;
            this.lstCarerExPartnerInfoPC = data[0].CarerExPartnerInfo;
            this.lstCarerEmployerInfoPC = data[0].CarerEmployerInfo;
        }

        if (data[1] != null && data[0].CarerId != data[1].CarerId) {
            this.lstCarerReferenceInfoSC = data[1].CarerReferenceInfo;
            this.lstCarerExPartnerInfoSC = data[1].CarerExPartnerInfo;
            this.lstCarerEmployerInfoSC = data[1].CarerEmployerInfo;
        }
    }
    //Tab active
    tabActive1 = "";
    tabActive2 = "";
    tabActive3 = "";
    tabActive4 = "";
    tabActive5 = "";
    tabActive6 = "";
    tabActive7 = "";
    tabActive8 = "";
    tabActive9 = "";
    tabActive10 = "";
    tabActive11 = "";
    tabActive12 = "";
    tabActive13 = "";
    tabActive14 = "";
    tabActive15 = "";
    tabActive16 = "";
    tabActive17 = "";
    tabActive18 = "";
    fnTabActive(val: number) {
        this.tabActive1 = "";
        this.tabActive2 = "";
        this.tabActive3 = "";
        this.tabActive4 = "";
        this.tabActive5 = "";
        this.tabActive6 = "";
        this.tabActive7 = "";
        this.tabActive8 = "";
        this.tabActive9 = "";
        this.tabActive10 = "";
        this.tabActive11 = "";
        this.tabActive12 = "";
        this.tabActive13 = "";
        this.tabActive14 = "";
        this.tabActive15 = "";
        this.tabActive16 = "";
        this.tabActive17 = "";
        this.tabActive18 = "";

        switch (val) {
            case 1:
                this.tabActive1 = "active";
                break;
            case 2:
                this.tabActive2 = "active";
                break;
            case 3:
                this.tabActive3 = "active";
                break;
            case 4:
                this.tabActive4 = "active";
                break;
            case 5:
                this.tabActive5 = "active";
                break;
            case 6:
                this.tabActive6 = "active";
                break;
            case 7:
                this.tabActive7 = "active";
                break;
            case 8:
                this.tabActive8 = "active";
                break;
            case 9:
                this.tabActive9 = "active";
                break;
            case 10:
                this.tabActive10 = "active";
                break;
            case 11:
                this.tabActive11 = "active";
                break;
            case 12:
                this.tabActive12 = "active";
                break;
            case 13:
                this.tabActive13 = "active";
                break;
            case 14:
                this.tabActive14 = "active";
                break;
            case 15:
                  this.tabActive15 = "active";
                  break;
            case 16:
                  this.tabActive16 = "active";
                  break;
            case 17:
                  this.tabActive17 = "active";
                  break;
            case 18:
                  this.tabActive18 = "active";
                  break;
            default:
                this.tabActive1 = "active";
        }

    }


    //save as draft
    fnSaveDraft(MainForm, PCPersInfo, PCPersInfoForm, SCPersInfo, SCPersInfoForm,
        AddressHistory,KOPPlacementType,
        PCReference, SCReference, PCExPartners, SCExPartners, PCEmployerInfo, SCEmployerInfo,
        OtherPersonalInfo, OtherPerInfoForm, OtherConInfo, OtherConInfoForm,
        languagesSpoken, languagesSpokenSA,
        UploadDocIds, IsUpload, uploadFormBuilder,
        scOtherPersonalInfo, scOtherPerInfoForm, scOtherConInfo, scOtherConInfoForm,
        PCReferenceDirty, SCReferenceDirty,
        PCExPartnersDirty, SCExPartnersDirty,
        PCEmployerInfoDirty, SCEmployerInfoDirty) {

        this.objCarerInfo.PersonalInfo = PCPersInfo;
        //this.objCarerInfo.ContactInfo = PCConatactInfo;
        this.objCarerInfo.FamilyGPContactInfo = OtherConInfo;
        this.objCarerInfo.FamilyGPPersonalInfo = OtherPersonalInfo;
        this.objCarerInfoSA.PersonalInfo = SCPersInfo;
        this.objCarerInfoSA.FamilyGPContactInfo = scOtherConInfo;
        this.objCarerInfoSA.FamilyGPPersonalInfo = scOtherPersonalInfo;
        this.objCarerInfo.CarerAddressHistory = AddressHistory;
        // if (this.IsPCFamilyGPCopytoSC) {
        //     this.objCarerInfoSA.FamilyGPPersonalInfo.TitleId = this.objCarerInfo.FamilyGPPersonalInfo.TitleId;
        //     this.objCarerInfoSA.FamilyGPPersonalInfo.FirstName = this.objCarerInfo.FamilyGPPersonalInfo.FirstName;
        //     this.objCarerInfoSA.FamilyGPPersonalInfo.lastName = this.objCarerInfo.FamilyGPPersonalInfo.lastName;
        //     this.objCarerInfoSA.FamilyGPContactInfo.AddressLine1 = this.objCarerInfo.FamilyGPContactInfo.AddressLine1;
        //     this.objCarerInfoSA.FamilyGPContactInfo.HomePhone = this.objCarerInfo.FamilyGPContactInfo.HomePhone;
        // }
        this.objCarerInfo.PersonalInfo.DateOfBirth = this.module.GetDateSaveFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
        this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.module.GetDateSaveFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
        this.objCarerInfo.DateOfMarriage = this.module.GetDateSaveFormat(this.objCarerInfo.DateOfMarriage);
        this.objCarerInfoSA.DateOfMarriage = this.module.GetDateSaveFormat(this.objCarerInfoSA.DateOfMarriage);
        this.objCarerInfo.DateOfDivorce = this.module.GetDateSaveFormat(this.objCarerInfo.DateOfDivorce);
        this.objCarerInfoSA.DateOfDivorce = this.module.GetDateSaveFormat(this.objCarerInfoSA.DateOfDivorce);
        this.objCarerInfo.CarerOtherInformation.DateofRegistration = this.module.GetDateSaveFormat(this.objCarerInfo.CarerOtherInformation.DateofRegistration);
        this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether = this.module.GetDateSaveFormat(this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether);
        this.objCarerInfo.ApplicationFilledDate = this.module.GetDateSaveFormat(this.objCarerInfo.ApplicationFilledDate);
        for(const key in this.objCarerInfo.CarerAddressHistory ){
          this.objCarerInfo.CarerAddressHistory[key].DateMoved = this.module.GetDateSaveFormat(this.objCarerInfo.CarerAddressHistory[key].DateMoved);
          this.objCarerInfo.CarerAddressHistory[key].DateMovedOut = this.module.GetDateSaveFormat(this.objCarerInfo.CarerAddressHistory[key].DateMovedOut);

        }

        this.objCarerInfo.DisabilityIds=this.selectedDisabilities;

        //   List Box
        if (languagesSpoken != undefined)
            this.objCarerInfo.LanguagesSpokenIds = languagesSpoken;
        if (languagesSpokenSA != undefined)
            this.objCarerInfoSA.LanguagesSpokenIds = languagesSpokenSA;
        // if (KOPEthinList != undefined)
        //     this.objCarerInfo.CarerKOP.KOPEthnicityIds = KOPEthinList;
        // if (KOPNationality != undefined)
        //     this.objCarerInfo.CarerKOP.KOPNationalityIds = KOPNationality;
        // if (KOPReligion != undefined)
        //     this.objCarerInfo.CarerKOP.KOPReligionIds = KOPReligion;
        // if (KOPImmigration != undefined)
        //     this.objCarerInfo.CarerKOP.KOPImmigrationStatusIds = KOPImmigration;
        // if (KOPDisability != undefined)
        //     this.objCarerInfo.CarerKOP.KOPDisabilityIds = KOPDisability;
        if (KOPPlacementType != undefined)
            this.objCarerInfo.CarerKOP.KOPPlacementTypeIds = KOPPlacementType;

        this.isPCDirty = true;
        if (CompareStaticValue(this.objCarerInfo, this.objCarerInfoOG)
            && PCReferenceDirty == false
            && PCExPartnersDirty == false
            && PCEmployerInfoDirty == false
        ) {
            this.isPCDirty = false;
        }

        this.isSCDirty = true;
        if (this.Jointapplicant && CompareStaticValue(this.objCarerInfoSA, this.objCarerInfoSAOG)
            && SCReferenceDirty == false
            && SCExPartnersDirty == false
            && SCEmployerInfoDirty == false) {
            this.isSCDirty = false;
        }

        if (this.isPCDirty || (this.Jointapplicant && this.isSCDirty) || (IsUpload && uploadFormBuilder.valid)) {
            this.saveAsDraftText=Common.GetSaveasDraftText;
            this.isLoadingSAD = true;
            let userId: number = parseInt(Common.GetSession("UserProfileId"));
            this.objCarerInfo.CarerReferenceInfo = PCReference;
            this.objCarerInfo.CarerExPartnerInfo = PCExPartners;
            this.objCarerInfo.CarerEmployerInfo = PCEmployerInfo;

            this.objCarerInfo.CreatedUserId = userId;
            this.objCarerInfo.UpdatedUserId = userId;

            this.objCarerInfoSA.CarerReferenceInfo = SCReference;
            this.objCarerInfoSA.CarerExPartnerInfo = SCExPartners;
            this.objCarerInfoSA.CarerEmployerInfo = SCEmployerInfo;

            this.objCarerInfoSA.DisabilityIds=this.selectedDisabilitiesSA;

            this.submitted = false;

            this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.CreatedUserId = userId;
            this.objSaveDraftInfoDTO.UpdatedUserId = userId;
            this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.objCarerInfo);
            if (this.Jointapplicant)
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(this.objCarerInfoSA);
            else
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(this.objCarerInfo);
            this.objSaveDraftInfoDTO.SequenceNo = this.CarerParentId;
            this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data =>
                this.ResponeDraft(data, "Save", IsUpload)
            );
        }
        else {
            this.objCarerInfo.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
            this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
            this.objCarerInfo.DateOfMarriage = this.module.GetDateEditFormat(this.objCarerInfo.DateOfMarriage);
            this.objCarerInfoSA.DateOfMarriage = this.module.GetDateEditFormat(this.objCarerInfoSA.DateOfMarriage);
            this.objCarerInfo.DateOfDivorce = this.module.GetDateEditFormat(this.objCarerInfo.DateOfDivorce);
            this.objCarerInfoSA.DateOfDivorce = this.module.GetDateEditFormat(this.objCarerInfoSA.DateOfDivorce);
            this.objCarerInfo.CarerOtherInformation.DateofRegistration = this.module.GetDateEditFormat(this.objCarerInfo.CarerOtherInformation.DateofRegistration);
            this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether = this.module.GetDateEditFormat(this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether);
            this.objCarerInfo.ApplicationFilledDate = this.module.GetDateEditFormat(this.objCarerInfo.ApplicationFilledDate);
            for(const key in this.objCarerInfo.CarerAddressHistory ){
              this.objCarerInfo.CarerAddressHistory[key].DateMoved = this.module.GetDateEditFormat(this.objCarerInfo.CarerAddressHistory[key].DateMoved);
              this.objCarerInfo.CarerAddressHistory[key].DateMovedOut = this.module.GetDateEditFormat(this.objCarerInfo.CarerAddressHistory[key].DateMovedOut);

            }
            this.isLoadingSAD = true;
            this.showAutoSave = false;
            if (this.showAlert && this.IsNewOrSubmited == 1)
                this.module.alertWarning(Common.GetNoChangeAlert);
            else if (this.showAlert && this.IsNewOrSubmited == 2)
                this.module.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
            this.showAlert = true;
            this.isLoadingSAD = false;
        }
    }

    private ResponeDraft(data, type, IsUpload) {
      this.isLoadingSAD = false;
      this.saveAsDraftText=Common.GetSaveasDraftText;
        ///  console.log("this.showAlert " + this.showAlert);
        if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.objCarerInfoOG = deepCopy<any>(this.objCarerInfo);
            if (this.Jointapplicant)
                this.objCarerInfoSAOG = deepCopy<any>(this.objCarerInfoSA);

        }

        //this.SetDateOfMarriage();
        this.objCarerInfo.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
        this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
        this.objCarerInfo.DateOfMarriage = this.module.GetDateEditFormat(this.objCarerInfo.DateOfMarriage);
        this.objCarerInfoSA.DateOfMarriage = this.module.GetDateEditFormat(this.objCarerInfoSA.DateOfMarriage);
        this.objCarerInfo.DateOfDivorce = this.module.GetDateEditFormat(this.objCarerInfo.DateOfDivorce);
        this.objCarerInfoSA.DateOfDivorce = this.module.GetDateEditFormat(this.objCarerInfoSA.DateOfDivorce);
        this.objCarerInfo.CarerOtherInformation.DateofRegistration = this.module.GetDateEditFormat(this.objCarerInfo.CarerOtherInformation.DateofRegistration);
        this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether = this.module.GetDateEditFormat(this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether);
        this.objCarerInfo.ApplicationFilledDate = this.module.GetDateEditFormat(this.objCarerInfo.ApplicationFilledDate);
        for(const key in this.objCarerInfo.CarerAddressHistory ){
          this.objCarerInfo.CarerAddressHistory[key].DateMoved = this.module.GetDateEditFormat(this.objCarerInfo.CarerAddressHistory[key].DateMoved);
          this.objCarerInfo.CarerAddressHistory[key].DateMovedOut = this.module.GetDateEditFormat(this.objCarerInfo.CarerAddressHistory[key].DateMovedOut);

        }

        this.insPCReferenceDirty = false;
        this.childPCReference.fnSetDirty(false);
        this.childSCReference.fnSetDirty(false);
        this.childPCEmployerInfo.fnSetDirty(false);
        this.childSCEmployerInfo.fnSetDirty(false);
        this.childPCExPartners.fnSetDirty(false);
        this.childSCExPartners.fnSetDirty(false);

        this.IsLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.CarerParentId);
                }
                // console.log("11112222 " + this.showAlert);
                if (this.showAlert)
                    this.module.alertSuccess(Common.GetSaveDraftSuccessfullMsg);
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.CarerParentId);
                }
                //  console.log("11112222 " + this.showAlert);
                if (this.showAlert)
                    this.module.alertSuccess(Common.GetUpdateDraftSuccessfullMsg);
            }
        }

        this.showAlert = true;
    }

    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('carerAppliAutoSave', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('carerAppliAutoSave', () => this.timer2callback());
            this.timer2button = 'Unsubscribe';

        }
    }
    SequenceNo;
    timer2callback() {
        //this.counter2++;

        if (this.accessAutoSave && (this.isReadOnly == "0" || this.isReadOnly == null)) {
            if (this.isFirstTime) {
                this.showAutoSave = true;
                let event = new MouseEvent('click', { bubbles: true });
                if (!this.showbtnSaveDraft) {
                    this.IsSubmitted = false;
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
                //   console.log("2222 " + this.showAlert);
            }
            this.isFirstTime = true;
        }
    }
    ngOnDestroy() {
        this.st.delTimer('carerAppliAutoSave');
    }

    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateCarerApplicationFormNewPDF/" + this.CarerCode + "," + this.cParentId + "," + this.cParentId + "," + this.AgencyProfileId;
    }
    fnDonloadWord() {
        window.location.href = this.apiURL + "GenerateCarerApplicationFormNewWord/" + this.CarerCode + "," + this.cParentId + "," + this.cParentId + "," + this.AgencyProfileId;
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateCarerApplicationFormNewPrint", this.CarerCode + "," + this.cParentId + "," + this.cParentId + "," + this.AgencyProfileId).then(data => {
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
            this.IsLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.CarerCode + "," + this.cParentId + "," + this.cParentId + "," + this.AgencyProfileId;
            this.apiService.post("GeneratePDF", "EmailCarerApplicationFormNew", this.objNotificationDTO).then(data => {
                if (data == true)
                    this.module.alertSuccess("Email Sent Successfully..");
                else
                    this.module.alertDanger("Email not Sent Successfully..");
                this.fnCancelClick();
                this.IsLoading = false;
            });

        }
    }
    fnCancelClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoCancel.nativeElement.dispatchEvent(event);
    }
}


