import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { CarerInfoService} from '../services/carerinfo.services'
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Common } from '../common';
//import { ConfigTableValuesService} from '../services/configtablevalues.service'
import { ConfigTableNames } from '../configtablenames';
import { Contact, ContactVisible } from '../contact/contact';
import { PagesComponent } from '../pages.component';
//import { InitialEnquiryService} from '../services/initialenquiry.service'
import { PersonalInfo, PersonalInfoVisible } from '../personalinfo/personalinfo';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { CarerInfo } from './DTO/carerinfo';
import { CarerInitialInterestInfo } from './DTO/carerinterestinfo';
//import { LocalAuthorityService } from '../services/localauthoritysetup.service';
import { CarerParentDTO } from './DTO/carerparent';
import { InitialEnquiryDTO } from './DTO/initialenquiry';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'CarerPersonalDetails',
    templateUrl: './carerpersonaldetails.component.template.html',
//     styles: [`[required]  {
//         border-left: 5px solid blue;
//     }

//    .ng-valid[required], .ng-valid.required  {
//             border-left: 5px solid #42A948; /* green */
// }
//    label + .ng-invalid:not(form)  {
//         border-left: 5px solid #a94442; /* red */
// }`],

})

export class CarerPersonalDetailsComponet {
    controllerName = "InitialEnquiry";
    objCarerIniterInfo: CarerInitialInterestInfo = new CarerInitialInterestInfo();
    objContactInfo: Contact = new Contact();
    objPersonalInfoDTO: PersonalInfo = new PersonalInfo();
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objCarerInfo: CarerInfo = new CarerInfo();
    objCarerInfoSA: CarerInfo = new CarerInfo();
    objInitialEnquiryDTO: InitialEnquiryDTO = new InitialEnquiryDTO();
    objPersonalInfoSADTO: PersonalInfo = new PersonalInfo();
    dynamicformcontrol = [];
    objPersonalInfoVisible: PersonalInfoVisible = new PersonalInfoVisible();
    objContactVisible: ContactVisible = new ContactVisible();
    objContactVisibleSA: ContactVisible = new ContactVisible();
    submitted = false;
    ethinicityList;
    religionList;
    Jointapplicant = false;
    Isdisabled = false;
    gender = 2;
    _Form: FormGroup;
    _FormSA: FormGroup;
    objQeryVal; ExPartnerRelationshipList = [];
    OfstedethinicityList = [];
    languagesSpokenList = [];
    NoofCarer = "One";
    CarerParentId: number;
    AgencyProfileId: number;
    LocalAuthorityList;
    insCarerDetails;
    ApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    objApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    FormCnfgId;

    FirstApplicantActive = "active";
    SecondApplicantActive;
    isLoading: boolean = false;
    @ViewChildren('ngSelect') ngSelectElements:QueryList<NgSelectComponent>;
    elem:NgSelectComponent;
     //Disability
     arrayDisability = [];
     selectedDisabilities;
     selectedDisabilitiesSA;
     objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(_formBuilder: FormBuilder,
        private apiService: APICallService,
        private activatedroute: ActivatedRoute, private _router: Router, private module: PagesComponent) {
            this.fnLoadDisability(this.activatedroute.snapshot.data['disability']);
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 7]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 7]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.BindCarerInfo();
            this.FormCnfgId = 52;
        }
        else if (this.objQeryVal.mid == 13) {
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.BindCarerInfo();
            this.FormCnfgId = 32;
        }

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.SetVisible();
        //Bind Local Authority List
        //  this.locaAuthServices.getLocalAuthorityList(this.AgencyProfileId).then(data => this.LocalAuthorityList = data);
        this.apiService.get("LocalAuthority", "getall", this.AgencyProfileId).then(data => this.LocalAuthorityList = data);

        this._Form = _formBuilder.group({
            //First Applicant
            Jointapplicant: ['0'],
            EthinicityId: ['0'],
            ReligionId: ['0'],
            OfstedEthinicityId: ['0', Validators.required],
            DateOfMarriage: [],
            PlaceOfMarriage: [],
            LivingLocalAuthorityId: ['0', Validators.required],
            PartnershipTypeId: ['0'],
            DateofRegistration: [''],
            PlaceofRegistration: [],
            DateSetUpHomeTogether: [''],
            HasDisability:[],
        });

        this._FormSA = _formBuilder.group({
            //Second Applicant
            saOfstedEthinicityId: ['0', Validators.required],
            saEthnicity: ['0'],
            saReligion: ['0'],
            HasDisabilitySA:[],
        });



        //Bind DDL
        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Ethnicity;
        //_cnfgTblValueServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.ethinicityList = data; });
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.ethinicityList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Religion;
        //_cnfgTblValueServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.religionList = data; });
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.religionList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.OfstedEthnicity;
        //_cnfgTblValueServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.OfstedethinicityList = data; });
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.OfstedethinicityList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Language;
        //  _cnfgTblValueServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.languagesSpokenList = data; });
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.languagesSpokenList = data; });

        this.objConfigTableNamesDTO.Name = ConfigTableNames.ExPartnerRelationship;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => {
            this.ExPartnerRelationshipList = data.filter(x => x.Value == "Marriage" || x.Value == "Civil Partnerships" || x.Value == "lived together");
            this.RelationshipTypeChange(-1);
        });
        //if(Common.GetSession("ViweDisable")=='1'){
          this.objUserAuditDetailDTO.ActionId = 4;
          this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
          this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
          this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
          this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
          this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
          //this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
          Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
          //}
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

    insPartnershipTypeId = 0;
    RelationshipTypeChange(PartnershipTypeId) {

        if (PartnershipTypeId == -1)
            PartnershipTypeId = this.objCarerInfo.CarerOtherInformation.PartnershipTypeId;


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

    fnJointapplicant() {
        this.Jointapplicant = !this.Jointapplicant;
    }

    SetVisible() {
        //Set Personal Info Visible
        this.objPersonalInfoVisible.PreviousNameVisible = false;
        //Set Conact Info Visible
        this.objContactVisible.AddressLine2Mandatory = false;
        //this.objContactVisible.HomePhoneVisible = false;
        this.objContactVisible.OfficePhoneVisible = false;
        this.objContactVisible.AlternativeEmailIdVisible = false;
        this.objContactVisible.EmergencyContactVisible = false;
        //Set Conact Info SA Visible
        this.objContactVisibleSA.AddressLine1Visible = false;
        this.objContactVisibleSA.AddressLine2Visible = false;
        this.objContactVisibleSA.CityVisible = false;
        this.objContactVisibleSA.HomePhoneVisible = false;
        this.objContactVisibleSA.MobilePhoneMandatory = false;
        this.objContactVisibleSA.EmailIdMandatory = false;
        this.objContactVisibleSA.OfficePhoneVisible = false;
        this.objContactVisibleSA.AlternativeEmailIdVisible = false;
        this.objContactVisibleSA.EmergencyContactVisible = false;
        this.objContactVisibleSA.CountryIdVisible = false;
        this.objContactVisibleSA.CountyIdVisible = false;
        this.objContactVisibleSA.PostalCodeVisible = false;

    }

    BindCarerInfo() {
        //Get Carer Info
        if (this.CarerParentId != null) {
            this.objCarerInfo.CarerParentId = this.CarerParentId;
            //  this._carerinfoServices.GetByCarerParentId(this.objCarerInfo.CarerParentId).then(data => { this.BindCarerDetails(data); });
            this.apiService.get("CarerInfo", "GetPersonalDetailsByCarerParentId", this.objCarerInfo.CarerParentId).then(data => { this.BindCarerDetails(data); });
        }
    }

    BindCarerDetails(data: CarerInfo[]) {
        if (data[0] != null) {
            this.objCarerInfo = data[0];
            this.selectedDisabilities=this.objCarerInfo.DisabilityIds;
            this.SetDateOfMarriage();
            if (this.objCarerInfo.CarerOtherInformation.LivingLocalAuthorityId == 0)
                this.objCarerInfo.CarerOtherInformation.LivingLocalAuthorityId = null;
            this.RelationshipTypeChange(-1);
        }
        if (data[1] != null) {
            this.objCarerInfoSA = data[1];
            this.selectedDisabilitiesSA=this.objCarerInfoSA.DisabilityIds;
            this.NoofCarer = "Two";
            if (data[1].PersonalInfo.TitleId != null && data[1].PersonalInfo.TitleId != 0) {
                this.Jointapplicant = true;
                this.Isdisabled = true;
            }
        }
    }
    dateString;
    SetDateOfMarriage() {
        this.objCarerInfo.CarerOtherInformation.DateOfMarriage = this.module.GetDateEditFormat(this.objCarerInfo.CarerOtherInformation.DateOfMarriage);
        this.objCarerInfo.CarerOtherInformation.DateofRegistration = this.module.GetDateEditFormat(this.objCarerInfo.CarerOtherInformation.DateofRegistration);
        this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether = this.module.GetDateEditFormat(this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether);
    }

    fnFirst() {
        this.FirstApplicantActive = "active";
        this.SecondApplicantActive = "";
    }
    fnSecond() {
        this.FirstApplicantActive = "";
        this.SecondApplicantActive = "active";
    }

    isOk = false;
    isokSA = true;
    SubmitInitialEnquiry(mainForm, personalinfoForm, personalinfoVal, saPersInfoForm, saPersInfoVal, contactForm, contactVal,countyElem,countryElem,
        languagesSpoken, SAlanguagesSpoken, contactFormSA, contactValSA) {


        this.isOk = false;
        this.isokSA = true;
        this.submitted = true;
        for(let element of this.ngSelectElements.toArray()){
            if(element.hasValue==false){
                this.elem = element;
                break;
            }
        }
        if (!mainForm.valid) {
            this.FirstApplicantActive = "active";
            this.SecondApplicantActive = "";
            this.module.GetErrorFocus(mainForm, this.elem);

        } else if (!personalinfoForm.valid) {
            this.FirstApplicantActive = "active";
            this.SecondApplicantActive = "";
            this.module.GetErrorFocus(personalinfoForm);
        } else if (!contactForm.valid) {
            //console.log(contactForm);
            this.FirstApplicantActive = "active";
            this.SecondApplicantActive = "";
            this.module.GetContactErrorFocus(contactForm, countyElem, countryElem);
        }

        if (this.Jointapplicant) {
            if (!saPersInfoForm.valid) {
                this.FirstApplicantActive = "";
                this.SecondApplicantActive = "active";
                this.module.GetErrorFocus(saPersInfoForm);
            }
            else if (!contactFormSA.valid) {
                this.FirstApplicantActive = "";
                this.SecondApplicantActive = "active";
                this.module.GetErrorFocus(contactFormSA);
            }
            else if (!this._FormSA.valid) {
                this.FirstApplicantActive = "";
                this.SecondApplicantActive = "active";
                this.module.GetErrorFocus(this._FormSA, this.elem);
            }
        }

        if (mainForm.valid && personalinfoForm.valid && contactForm.valid) {
            this.isOk = true;
        }
        else
            this.isOk = false;

        if (this.Jointapplicant) {
            if (saPersInfoForm.valid && this._FormSA.valid && contactFormSA.valid)
                this.isokSA = true;
            else {
                this.isokSA = false;
            }
        }

        if (this.isOk && this.isokSA) {
            this.isLoading = true;

            this.objCarerInfo.DisabilityIds=this.selectedDisabilities;
            this.objCarerInfoSA.DisabilityIds=this.selectedDisabilitiesSA;

            this.objCarerInfo.PersonalInfo = personalinfoVal;
            this.objCarerInfo.ContactInfo = contactVal;
            this.objCarerInfo.LanguagesSpokenIds = languagesSpoken;
            this.objInitialEnquiryDTO.CarerParentId = this.CarerParentId;
            this.objCarerInfo.CarerParentId = this.CarerParentId;
            this.objCarerInfoSA.PersonalInfo = saPersInfoVal;
            this.objInitialEnquiryDTO.ContactInfoSA = this.objCarerInfoSA.ContactInfo;
            this.objCarerInfoSA.LanguagesSpokenIds = SAlanguagesSpoken;
            this.objInitialEnquiryDTO.PersonalInfo = personalinfoVal;
            this.objInitialEnquiryDTO.PersonalInfoSA = saPersInfoVal;

            this.objCarerInfo.CarerOtherInformation.DateOfMarriage = this.module.GetDateSaveFormat(this.objCarerInfo.CarerOtherInformation.DateOfMarriage);
            this.objCarerInfo.CarerOtherInformation.DateofRegistration = this.module.GetDateSaveFormat(this.objCarerInfo.CarerOtherInformation.DateofRegistration);
            this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether = this.module.GetDateSaveFormat(this.objCarerInfo.CarerOtherInformation.DateSetUpHomeTogether);
            this.objCarerInfo.PersonalInfo.DateOfBirth = this.module.GetDateSaveFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
            this.objInitialEnquiryDTO.PersonalInfo.DateOfBirth = this.module.GetDateSaveFormat(this.objInitialEnquiryDTO.PersonalInfo.DateOfBirth);
            this.objInitialEnquiryDTO.PersonalInfoSA.DateOfBirth = this.module.GetDateSaveFormat(this.objInitialEnquiryDTO.PersonalInfoSA.DateOfBirth);

            //  alert(this.objInitialEnquiryDTO.PersonalInfo.DateOfBirth);
            this.objInitialEnquiryDTO.DisabilityIdsPC = this.selectedDisabilities;
            this.objInitialEnquiryDTO.DisabilityIdsSC = this.selectedDisabilitiesSA;
            this.objInitialEnquiryDTO.HasDisabilityPC=this.objCarerInfo.HasDisability;
            this.objInitialEnquiryDTO.HasDisabilitySC=this.objCarerInfoSA.HasDisability;

            this.objInitialEnquiryDTO.CarerInfo = [];
            this.objInitialEnquiryDTO.CarerInfo.push(this.objCarerInfo);
            this.objInitialEnquiryDTO.CarerInfo.push(this.objCarerInfoSA);
            this.objInitialEnquiryDTO.ContactInfo = contactVal;
            let type = "update"


            // console.log(this.objInitialEnquiryDTO);
            //this.insInitialEnqServices.post(this.objInitialEnquiryDTO, type).then(data => this.Respone(data, type, personalinfoVal, saPersInfoVal));
            this.apiService.save(this.controllerName, this.objInitialEnquiryDTO, type).then(data => this.Respone(data, type, personalinfoVal, saPersInfoVal));
        }
    }

    private Respone(data, type, pcPersInfoVal, saPersInfoVal) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                this.BindCarerInfo();
                this.objUserAuditDetailDTO.ActionId =1;
            }
            else {
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                this.BindCarerInfo();
                this.objUserAuditDetailDTO.ActionId =2;
            }

            if (this.objQeryVal.mid == 3)
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
            else if (this.objQeryVal.mid == 13)
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));

            this.ApplicantProfileVal.PCFullName = pcPersInfoVal.FirstName + ' ' + pcPersInfoVal.lastName;
            if (this.Jointapplicant)
                this.ApplicantProfileVal.SCFullName = ' / ' + saPersInfoVal.FirstName + ' ' + saPersInfoVal.lastName;
            this.ApplicantProfileVal.CarerCode = this.insCarerDetails.CarerCode;
            this.ApplicantProfileVal.CarerParentId = this.insCarerDetails.CarerParentId;
            this.ApplicantProfileVal.CarerId = this.insCarerDetails.CarerId;
            this.ApplicantProfileVal.CarerStatusName = this.insCarerDetails.CarerStatusName;
            this.ApplicantProfileVal.CarerStatusId = this.insCarerDetails.CarerStatusId;
            this.ApplicantProfileVal.ContactInfo.City = this.insCarerDetails.ContactInfo.City;
            this.ApplicantProfileVal.AreaOfficeName = this.insCarerDetails.AreaOfficeName;
            this.ApplicantProfileVal.CreatedDate = this.insCarerDetails.CreatedDate;
            this.ApplicantProfileVal.PersonalInfo.ImageId = this.insCarerDetails.PersonalInfo.ImageId;
            this.ApplicantProfileVal.AvailableVacancies = this.insCarerDetails.AvailableVacancies;
            this.ApplicantProfileVal.ApproveVacancies = this.insCarerDetails.ApproveVacancies;
            this.ApplicantProfileVal.SupervisingSocialWorker = this.insCarerDetails.SupervisingSocialWorker;
            if (this.objQeryVal.mid == 3)
                Common.SetSession("SelectedCarerProfile", JSON.stringify(this.ApplicantProfileVal));
            else if (this.objQeryVal.mid == 13)
                Common.SetSession("SelectedApplicantProfile", JSON.stringify(this.ApplicantProfileVal));

            //this.BindCarerInfo();
            this._router.navigate(['/pages/recruitment/redirect/1/', this.objQeryVal.mid]);
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
}


