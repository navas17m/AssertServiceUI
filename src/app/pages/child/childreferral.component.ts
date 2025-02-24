import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SimpleTimer } from 'ng2-simple-timer';
import { environment } from '../../../environments/environment';
import { ChildProfile } from '../child/DTO/childprofile';
import { ChildReferralDT0 } from '../child/DTO/childreferraldto';
import { Common, Compare, CompareSaveasDraft, CompareStaticValue, CompareValue, deepCopy } from '../common';
import { ConfigTableNames } from '../configtablenames';
import { ContactVisible } from '../contact/contact';
import { ValChangeDTO } from '../dynamic/ValChangeDTO';
import { PlacementContactDTO } from '../fosterchild/DTO/placementcontactdto';
import { PagesComponent } from '../pages.component';
import { PersonalInfoVisible } from '../personalinfo/personalinfo';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablenames';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { LocalAuthoritySWInfoIdDTO } from '../systemadmin/DTO/localauthorityswInfodto';
import { ChildFamilyPersonOrgInvolved } from '../fosterchild/DTO/childfamilypersonorginvolved';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

declare var window: any;
declare var $: any;

@Component({
    selector: 'childreferral',
    templateUrl: './childreferral.component.template.html',
   
})

export class ChildReferralComponet {
    submittedContactType=false;
    dynamicformcontrolContact = [];
    objChildFamilyPersonOrgInvolved: ChildFamilyPersonOrgInvolved = new ChildFamilyPersonOrgInvolved();
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnSocialWorker') infoSocialWorker: ElementRef;
    @ViewChild('btnContactType') infoContactType: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('ddHasSibling') ddHasSibling;
    @ViewChild('ddHasParent') ddHasParent;
    @ViewChild('ddLanguageList') ddLanguage; @ViewChild('ddDisability') ddDisability;
    @ViewChild('ddBehavior') ddBehavior;
    @ViewChild('header') headerCtrl;
    insChildProfileDTO: ChildProfile = new ChildProfile();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    _Form: FormGroup; _FormRef: FormGroup; formNFA: FormGroup;
    objChildReferral: ChildReferralDT0 = new ChildReferralDT0();
    objChildReferralOG: ChildReferralDT0 = new ChildReferralDT0();
    objLocalAuthoritySWInfoIdDTO: LocalAuthoritySWInfoIdDTO = new LocalAuthoritySWInfoIdDTO();
    referralNdynamicformcontrol; MandatoryAlert; submitted = false; submittedref = false; submittedNFA = false;
    objChildProfile: ChildProfile = new ChildProfile();
    objChildProfileOG: ChildProfile = new ChildProfile();
    objChildProfileRef2: ChildProfile = new ChildProfile();
    objChildProfileRef2OG: ChildProfile = new ChildProfile();
    ChildProfileProfileId;
    areaOfficeList; localAuthorityList; ethinicityList; childGeography; behavioral;
    OfstedEthnicityList; LanguageList; LegalStatusList; NationalityList; ReligionList;
    ImmigrationStatusList; DisabilityList;
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    yesNoNotKnown; nFAReason; objQeryVal; refTabActive = false; arrayChildList = [];
    arrayDisability = []; arrayBehavior = []; arrayHealthNeeds=[];
    lstChildRefDV = [];
    lstChildRefDVOG = [];
    lstChildListForDD; objLAAddress;
    lstChildReferral = []; arrayParentList = []; childId; arrayLanguageList = [];
    objPersonalInfoVisible: PersonalInfoVisible = new PersonalInfoVisible();
    refVisible = true; AgencyProfileId: number; IsShowNFA = true; DisabilityValue = 1;
    submittedUpload = false;
    Referral1Active = "active";
    DocumentActive = "";
    Referral2Active;
    @ViewChild('uploads') uploadCtrl;
    isLoading: boolean = false;
    isLoading2: boolean = false;
    formId;
    TypeId; isParentNChild = false;
    tblPrimaryKey;
    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraftRef2') btnSaveDraftRef2: ElementRef;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    controllerName = "ChildReferral";
    objPlacementContactDTO: PlacementContactDTO = new PlacementContactDTO();
    lstPlacementContact = [];
    dynamicformcontrolref2 = [];
    dynamicformcontrolref2PC = [];
    insPCAddress; lstLASocialWorker = []; showSaveAsDraftButton: boolean = false;
    insPassHeaderInfo = false;
    //LA Social Worker
    insContactVisible: ContactVisible = new ContactVisible();
    _localauthorityswForm: FormGroup;
    contactVal1;
    isLoadingLASW = false;hasParent: boolean =false;
    submittedLASW = false; accessAutoSave = false; FormCnfgId;
    @ViewChild('LAElement') LAElement:NgSelectComponent;
    selectedLanguages;
    selectedDisabilities;
    selectedBehaviors;
    selectedHealthNeeds;
    selectedSiblings;objChildProfilespiner;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    
    constructor(private spinner: NgxSpinnerService,private apiService: APICallService, private route: ActivatedRoute, private _formBuilder: FormBuilder,
        private _router: Router, private model: PagesComponent, private st: SimpleTimer, private renderer: Renderer2) {
            this.spinner.show();
            this.route.params.subscribe(data => this.objQeryVal = data);

       // this.fnLoadDisability(this.route.snapshot.data['disability']);
        //this.fnLoadBehaviour(this.route.snapshot.data['behaviour']);
        //this.fnLoadLanguage(this.route.snapshot.data['language']);
        
        this.formId = 72;
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildReferral.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.AgencyProfileId=this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Disability;
        this.apiService.post("ConfigTableValues","GetByTableNamesId",this.objConfigTableNamesDTO).then(data=>{
            this.fnLoadDisability(data);
        });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Language;
        this.apiService.post("ConfigTableValues","GetByTableNamesId",this.objConfigTableNamesDTO).then(data=>{
            this.fnLoadLanguage(data);
        });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Behavioral;
        this.apiService.post("ConfigTableValues","GetByTableNamesId",this.objConfigTableNamesDTO).then(data=>{
            this.fnLoadBehaviour(data);
        });

        this.objConfigTableNamesDTO.Name = ConfigTableNames.HealthNeeds;
        this.apiService.post("ConfigTableValues","GetByTableNamesId",this.objConfigTableNamesDTO).then(data=>{
            this.fnLoadHealthNeeds(data);
        });
        //this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        //this.objConfigTableNamesDTO.Name = ConfigTableNames.ChildGeography;
        //this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.childGeography = data; });

        if (this.objQeryVal.mid == 4) {
            this.FormCnfgId = 91;
            this.accessAutoSave = this.model.GetAddBtnAccessPermission(this.FormCnfgId);
            this.ChildProfileProfileId = Common.GetSession("ChildId");
            this.refVisible = false;
            if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null") {
                this.childId = Common.GetSession("ChildId");
                //this.fnLoadChileProfile();
            }
            else {
                Common.SetSession("UrlReferral", "pages/child/childreferral/4");
                this._router.navigate(['/pages/child/childprofilelist/1/4']);
            }
        }
        else {
            this.FormCnfgId = 72;
            this.accessAutoSave = this.model.GetAddBtnAccessPermission(this.FormCnfgId);
            this.ChildProfileProfileId = Common.GetSession("ReferralChildId");
            if (Common.GetSession("ReferralChildId") != null && Common.GetSession("ReferralChildId") != "null") {
                this.childId = Common.GetSession("ReferralChildId");
                //this.fnLoadChileProfile();
            }
            else {
                Common.SetSession("UrlReferral", "pages/referral/childreferral/16");
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);
            }
        }
        this.TypeId = this.childId;
        this.tblPrimaryKey = this.childId;       
        
        this.IsSaveAsDrafrrecord = false;       
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });
        this._Form = this._formBuilder.group({
            AreaOfficeProfileId: ['0', Validators.required],
            ChildIdentifier: [''],
            Ethinicity: ['0', Validators.required],
            OfstedEtnicity: ['0'],
            Language: [''],
            LegalStatus: [''],
            Nationality: [''],
            Religion: [''],
            ImmigrationStatus: [''],
            Synopsis: [''],
            ChildInEducation: ['0', Validators.required],
            HasChildSiblings: [''],
            HasChildParent: [''],
            ddHasChildParent: ['0'],
            HasChildParents: [''],
            DisabilityShow: [''],
            ChildOrParent: [''],
            ParentName: [''],
            ParentDOB: [''],
            ParentName2: [''],
            ParentDOB2: [''],
            ChildMobileNo:[''],
            EthnicityDetails:['']
        });
        //LA Social Worker
        this._localauthorityswForm = _formBuilder.group
            ({
                LocalAuthoritySWName: ['', Validators.required],
            });
        this.insContactVisible.AlternativeEmailIdVisible = false;
        this.insContactVisible.CountryIdVisible = false;
        this.insContactVisible.CountyIdVisible = false;
        this.insContactVisible.EmergencyContactVisible = false;
        this.insContactVisible.FaxVisible = false;
        this.insContactVisible.HomePhoneVisible = false;
        this.insContactVisible.OfficePhoneMandatory = false;
        this.insContactVisible.PostalCodeVisible = false;
        this.insContactVisible.CityVisible = false;
        this.insContactVisible.AddressLine2Visible = false;
        this.insContactVisible.MobilePhoneMandatory = false;
        this.objChildProfile.ChildId= parseInt(Common.GetSession("ChildId"));
        this.objChildProfile.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.apiService.post("ChildProfile","GetAllForSiblingNParent",this.objChildProfile).then(data=>{
            this.fnLoadChild(data);
            this.fnLoadDropDowns();
            this.fnGetChildReferralNDynamicControls();         
           
        });
        //End

            this.objUserAuditDetailDTO.ActionId = 4;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.childId;
            this.objUserAuditDetailDTO.RecordNo = 0;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    LocalAuthoritySWSubmit(_localauthorityswForm, ContactInfo, formbuilder): void {
        this.submittedLASW = true;

        if (_localauthorityswForm.valid && formbuilder.valid) {
            this.isLoadingLASW = true;
            let type = "save";
            this.objLocalAuthoritySWInfoIdDTO.UserId = 3;
            this.objLocalAuthoritySWInfoIdDTO.ContactInfo = ContactInfo;
            this.apiService.save("LocalAuthoritySWInfo", this.objLocalAuthoritySWInfoIdDTO, type).then(data => this.ResponeLASW(data));
        }
    }

    private ResponeLASW(data) {
        this.isLoadingLASW = false;
        if (data.IsError == true) {
            this.model.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.objLocalAuthoritySWInfoIdDTO = new LocalAuthoritySWInfoIdDTO();
            this.submittedLASW = false;
            this.fnBindLASWInfo();
            this.objChildReferral.LASocialWorkerId = data.SequenceNumber;
            this.fnShowLASWInfo();
        }
    }

    fnShowLASWInfo() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoSocialWorker.nativeElement.dispatchEvent(event);
    }

    fnShowChildContact() {
        this.submittedContactType=false;
        this.objChildFamilyPersonOrgInvolved.AgencyProfileId = this.AgencyProfileId;
        this.objChildFamilyPersonOrgInvolved.ChildId = this.childId;
        this.apiService.post("ChildFamilyPersonOrgInvolved", "GetDynamicControls", this.objChildFamilyPersonOrgInvolved).then(data => {


            this.dynamicformcontrolContact = data;
            let temp=this.dynamicformcontrolContact.filter(x=>x.FieldCnfg.FieldName=="ContactTypeId");
            if(temp)
            {
                temp[0].ConfigTableValues=this.lstContactType;
            }
            let event = new MouseEvent('click', { bubbles: true });
            this.infoContactType.nativeElement.dispatchEvent(event);
        });


    }
    DynamicOnValChangeChildContact(InsValChange: ValChangeDTO) {
            if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoSiblingsRecord")
                InsValChange.currnet.IsVisible = false;

            if (InsValChange.currnet.FieldCnfg.FieldName == "AddtoParent/ChildRecord")
                InsValChange.currnet.IsVisible = false;

            if (InsValChange.currnet.FieldCnfg.FieldName == "SiblingParentSno") {
                InsValChange.currnet.IsVisible = false;
            }
    }

    contactTypeChange=false;
    fnSubmitContacType(dynamicForm, subformbuilder)
    {

    let temp1=dynamicForm.filter(x=>x.FieldName=="ContactTypeId")
    let insCheck=this.lstChildContactType.filter(x=>x.ChildContactTypeId==temp1[0].FieldValue);
    if(insCheck.length==0)
    {
        this.submittedContactType=true;
        if (subformbuilder.valid && dynamicForm != '') {
            this.isLoading = true;
            let type = "save";
            this.objChildFamilyPersonOrgInvolved.DynamicValue = dynamicForm;
            this.objChildFamilyPersonOrgInvolved.ChildId = this.childId;
            this.apiService.save("ChildFamilyPersonOrgInvolved", this.objChildFamilyPersonOrgInvolved, type).then(data =>
                {

                    if(data.IsError == false)
                    {
                        let event = new MouseEvent('click', { bubbles: true });
                        this.infoContactType.nativeElement.dispatchEvent(event);
                        let temp=dynamicForm.filter(x=>x.FieldName=="ContactTypeId")
                        if(temp)
                        {
                            this.fnAddContactTypeLoad(parseInt(temp[0].FieldValue));
                        }
                    }
                    else if(data.IsError == true){
                        this.model.alertInfo(data.ErrorMessage);
                    }
                });
            }
     }
     else{
        this.model.alertInfo("Contact Type Already Exist");
    }
    }

    fnBindLASWInfo() {
        this.apiService.get("LocalAuthoritySWInfo", "GetAll", this.AgencyProfileId).then(data => { this.lstLASocialWorker = data });
    }

    DnamicOnValChangePC(eve) {
        let pc = this.lstPlacementContact.filter(x => x.CofigTableValuesId == eve.newValue);
        if (pc.length > 0) {
            this.insPCAddress = pc[0].ParentValue;
        }
    }

    DnamicOnValChange2(InsValChange: ValChangeDTO) {
        let val1 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "LAPlacementPlanDate");
        if (val1.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "IsLAPlacementPlan") {
            if (InsValChange.newValue)
                val1[0].IsVisible = true;
            else
                val1[0].IsVisible = false;
        }

        let val2 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "LARiskAssessmentDate");
        if (val2.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "IsLARiskAssessment") {
            if (InsValChange.newValue)
                val2[0].IsVisible = true;
            else
                val2[0].IsVisible = false;
        }

        let val3 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "CarePlanDate");
        if (val3.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "IsCarePlan") {
            if (InsValChange.newValue)
                val3[0].IsVisible = true;
            else
                val3[0].IsVisible = false;
        }


        let val4 = InsValChange.all.filter(x => x.FieldCnfg.FieldName == "CarePlanDate2");
        if (val4.length > 0 && InsValChange.currnet.FieldCnfg.FieldName == "IsCarePlan2") {
            if (InsValChange.newValue)
                val4[0].IsVisible = true;
            else
                val4[0].IsVisible = false;
        }

    }

    fnLoadChileProfile() {
            this.apiService.get("ChildProfile", "GetReferralValById", this.ChildProfileProfileId).then(data => {
            this.objChildProfilespiner=data;
            this.objChildProfile = data;
           // this.objChildProfileRef2 = deepCopy<any>(this.objChildProfile);
            this.fnLoadHeader(this.objChildProfile);
            if (this.objChildProfile.ChildStatusId != 18)
                this.IsShowNFA = false;
            this.fnLAAddress(this.objChildProfile.LocalAuthority.LocalAuthorityId);
           // this.ddHasSibling.optionsModel = this.objChildProfile.SiblingIds;
            //this.ddHasParent.optionsModel = this.objChildProfile.ParentIds;
          //  this.ddDisability.optionsModel = this.objChildProfile.DisabilityIds;
            //this.ddLanguage.optionsModel = this.objChildProfile.LanguageId;

            // if (this.objChildProfile.DisabilityIds.length > 0) {
            //     this.DisabilityValue = 2;
            //     this.IsShowDisability = true;
            // }
            // this.ddBehavior.optionsModel = this.objChildProfile.BehavioralIds;
            // if (this.objChildProfile.SiblingIds.length > 0) {
            //     this.objChildProfile.HasChildSiblings = true
            // }
            // if (this.objChildProfile.ParentIds.length > 0) {
            //     this.objChildProfile.HasChildParents = true
            // }

            this.objChildProfileOG = deepCopy<any>(this.objChildProfile);
            
            this.objChildProfileRef2.LANotifiedDate = this.model.GetDateEditFormat(this.objChildProfileRef2.LANotifiedDate);
            if (this.objChildProfile.ChildOrParentId == 2) {
                this.isParentNChild = true;
                this.setParentDate();
            }
            this.objChildProfileRef2OG = deepCopy<any>(this.objChildProfileRef2);
            this.fnChangeChildGeography(this.objChildProfileRef2.GeographicalId);
            this.spinner.hide();
            //   this.fnLoadPlacementContactInfo(this.objChildProfile.LocalAuthority.LocalAuthorityId);
        });


        this.apiService.get("ChildProfile", "GetById", this.ChildProfileProfileId).then(data => {
            //debugger;
            this.objChildProfile = data;
            this.objChildProfileRef2 = deepCopy<any>(this.objChildProfile);

            //Load Child Contact Type
            data.ChildContactType.forEach(item=>{
                this.fnAddContactTypeLoad(item.ChildContactTypeId);
            })
          
           
            if (this.objChildProfile.ChildStatusId != 18)
                this.IsShowNFA = false;
            this.fnLAAddress(this.objChildProfile.LocalAuthority.LocalAuthorityId);
          
            //this.ddHasSibling.optionsModel = this.objChildProfile.SiblingIds;
            //this.ddHasParent.optionsModel = this.objChildProfile.ParentIds;
            //this.ddDisability.optionsModel = this.objChildProfile.DisabilityIds;
            //this.ddLanguage.optionsModel = this.objChildProfile.LanguageId;
            this.selectedLanguages = this.objChildProfile.LanguageId;
            this.selectedSiblings = this.objChildProfile.SiblingIds;
            this.selectedDisabilities = this.objChildProfile.DisabilityIds;
            this.selectedHealthNeeds=this.objChildProfile.HealthNeedsIds;
            if (this.objChildProfile.DisabilityIds.length > 0) {
                this.DisabilityValue = 2;
                this.IsShowDisability = true;
            }
          
            //this.ddBehavior.optionsModel = this.objChildProfile.BehavioralIds;
            this.selectedBehaviors = this.objChildProfile.BehavioralIds;
            if (this.objChildProfile.SiblingIds.length > 0) {
                this.objChildProfile.HasChildSiblings = true
            }
            if (this.objChildProfile.ParentIds.length > 0) {
                this.objChildProfile.HasChildParents = true
            }

            this.objChildProfileOG = deepCopy<any>(this.objChildProfile);
            
            this.objChildProfileRef2.LANotifiedDate = this.model.GetDateEditFormat(this.objChildProfileRef2.LANotifiedDate);
            if (this.objChildProfile.ChildOrParentId == 2) {
                this.isParentNChild = true;
                this.setParentDate();
            }
            this.fnChangeChildGeography(this.objChildProfileRef2.GeographicalId);

            //console.log(this.objChildProfileRef2.LANotifiedDate)
            this.objChildProfileRef2OG = deepCopy<any>(this.objChildProfileRef2);
            //console.log(this.objChildProfileRef2OG.LANotifiedDate)


            this.fnLoadHeader(this.objChildProfile);
            //   this.fnLoadPlacementContactInfo(this.objChildProfile.LocalAuthority.LocalAuthorityId);
        });
    }
    fnChangeChildNParent(value) {
        if (value == 2)
            this.isParentNChild = true;
        else
            this.isParentNChild = false;
    }
    fnLoadPlacementContactInfo() {
        this.insPCAddress = "";
        if (this.objChildProfile.LocalAuthority.LocalAuthorityId != null) {
            this.apiService.get("PlacementContact", "GetAllByLAId", this.objChildProfile.LocalAuthority.LocalAuthorityId).then(data => {
                this.lstPlacementContact = data;
                //console.log(this.lstPlacementContact);
                let Subject = this.lstChildRefDV.filter(x => x.ControlLoadFormat == "PlacementContactInfo");
                if (Subject.length > 0) {
                    Subject[0].ConfigTableValues = this.lstPlacementContact;
                    //   console.log(Subject);
                }
            });
        }
    }

    fnLoadChild(data) {
        //Multiselect dropdown array forming code.
        if (data) {
            data.forEach(item => {
                if (this.ChildProfileProfileId != item.ChildId && item.ChildOrParentId == 1) {
                    this.arrayChildList.push({ id: item.ChildId, name: item.PersonalInfo.FullName + " (" + item.ChildCode + ")" });
                }

                if(item.ChildOrParentId == 3)
                    this.hasParent=true;
            });
            if(Common.GetSession("ChildOrParentId")=="3")
            {
                data.forEach(item => {
                    if (this.ChildProfileProfileId != item.ChildId && item.ChildOrParentId == 1) {
                        this.arrayParentList.push({ id: item.ChildId, name: item.PersonalInfo.FullName + " (" + item.ChildCode + ")" });
                    }
                });
            }
            else
            {
                data.forEach(item => {
                    if (this.ChildProfileProfileId != item.ChildId && item.ChildOrParentId == 3) {
                        this.arrayParentList.push({ id: item.ChildId, name: item.PersonalInfo.FullName + " (" + item.ChildCode + ")" });
                    }
                });
            }

        }

    }
    lstContactType=[];
    fnLoadDropDowns() {
        this.objPersonalInfoVisible.TitleVisible = false;
        this.objPersonalInfoVisible.PreviousNameVisible = false;
        this.apiService.get("LocalAuthority", "getall", this.AgencyProfileId).then(data => this.fnReturnLA(data));
        this.apiService.get("AreaOfficeProfile", "getall").then(data => { this.areaOfficeList = data });

        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Ethnicity;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.ethinicityList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.YesNoNotKnown;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.yesNoNotKnown = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.NFAReason;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.nFAReason = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.OfstedEthnicity;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.OfstedEthnicityList = data; });
        //this.objConfigTableNamesDTO.Name = ConfigTableNames.Language;
        //this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.LanguageList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.LegalStatus;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.LegalStatusList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Nationality;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.NationalityList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Religion;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.ReligionList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.ImmigrationStatus;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.ImmigrationStatusList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.ChildGeography;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => {
            this.childGeography = data;
            this.fnLoadChileProfile();
        });

        this.objConfigTableNamesDTO.Name = ConfigTableNames.ContactType;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => {
            this.lstContactType = data;// .filter(x=>x.Value.toLowerCase()=="LA Manager".toLowerCase()||x.Value.toLowerCase()=="LA Team Manager".toLowerCase()||x.Value.toLowerCase()=="IRO".toLowerCase()||x.Value.toLowerCase()=="Other Professionals".toLowerCase()||x.Value.toLowerCase()== "Other Professionals".toLowerCase());
         });

        this.fnBindLASWInfo();

       

        this._FormRef = this._formBuilder.group({
            childGeography: ['0', Validators.required],
            ReferrerName: ['', Validators.required],
            ReferrerDate: ['', Validators.required],
            LASocialWorker: [''],
            LocalAuthorityref2: ['0', Validators.required],
            ChildPlacingAuthorityId: ['0'],
            LANotifiedDate: [''],
            IsOutofHoursPlacement:[],
            ContactTypeId:['0']
        });

        this.formNFA = this._formBuilder.group({
            chkNoFurtherAction: [''],
            NFADate: ['', Validators.required],
            NFAReason: ['0', Validators.required],
        });
    }

    ChildPlacingAuthorityVisi = false;
    fnChangeChildGeography(value) {

        let data = this.childGeography.filter(x => x.CofigTableValuesId == value);
        if (data.length > 0 && data[0].Value == "Out of Area") {
            this.ChildPlacingAuthorityVisi = true
        }
        else {
            this.ChildPlacingAuthorityVisi = false;
        }
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

    fnLoadLanguage(data) {
        //Multiselect dropdown array forming code.
        if (data) {
            data.forEach(item => {
                this.arrayLanguageList.push({ id: item.CofigTableValuesId, name: item.Value });
            }
            );

            //  console.log(this.arrayLanguageList);
        }
    }

    fnLoadHealthNeeds(data) {
        //Multiselect dropdown array forming code.
        if (data) {
            data.forEach(item => {
                this.arrayHealthNeeds.push({ id: item.CofigTableValuesId, name: item.Value });
            }
            );
        }
    }

    fnLoadBehaviour(data) {
        //Multiselect dropdown array forming code.
        if (data) {
            data.forEach(item => {
                this.arrayBehavior.push({ id: item.CofigTableValuesId, name: item.Value });
            }
            );
        }
    }

    fnReferral1() {
        this.Referral1Active = "active";
        this.Referral2Active = "";
        this.DocumentActive = "";
    }
    fnReferral2() {
        this.Referral1Active = "";
        this.Referral2Active = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetailTab() {
        this.Referral1Active = "";
        this.Referral2Active = "";
        this.DocumentActive = "active";
    }

    IsSaveAsDrafrrecord = false;
    fnGetChildReferralNDynamicControls() {
        this.objChildReferral.AgencyProfileId = this.AgencyProfileId;
        this.objChildReferral.ChildId = this.childId;
        this.apiService.post(this.controllerName, "GetChildReferralNDynamicControls", this.objChildReferral).then(data => {
            if (data != null && data[0].ReferralName != null) {
                this.fnGetChildRefDV(data);
                this.setChangeDate();
            }
            else {
                this.showSaveAsDraftButton = true;
                this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
                this.objSaveDraftInfoDTO.TypeId = this.childId;
                this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
                this.objSaveDraftInfoDTO.SequenceNo = this.childId;
                this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(sdata => {
                    if (sdata != null) {
                        this.IsSaveAsDrafrrecord = true;
                        let outputData = JSON.parse(sdata.JsonList);
                        let insChildReferral = outputData;
                        this.lstChildRefDV = outputData[0].lstAgencyFieldMapping;
                        this.lstChildRefDVOG = deepCopy<any>(this.lstChildRefDV);

                        let JsonData = JSON.parse(sdata.JsonData);
                        // this.objChildProfile = JsonData;
                        // this.objChildProfileOG = deepCopy<any>(this.objChildProfile);
                        this.objChildReferral = JsonData.ChildReferral;
                        this.objChildReferralOG = deepCopy<any>(this.objChildReferral);

                        this.objChildProfileRef2 = deepCopy<any>(JsonData);
                        this.objChildProfileRef2OG = deepCopy<any>(this.objChildProfileRef2);

                        //Load Child Contact Type
                        this.objChildProfileRef2.ChildContactType.forEach(item=>{
                            this.fnAddContactTypeLoad(item.ChildContactTypeId);
                        })

                        this.fnChangeChildGeography(this.objChildProfileRef2.GeographicalId);
                        this.fnChangeChildContactId(this.objChildReferral.ContactTypeId);
                        //if (insChildReferral.length == 1) {
                        //    this.objChildReferral = insChildReferral[0];
                        //    this.objChildReferralOG = deepCopy<any>(this.objChildReferral);
                        //}
                        //else {
                        //    insChildReferral.forEach(item => {
                        //        if (item.IsActive == true) {
                        //            this.objChildReferral = item;
                        //            this.objChildReferralOG = deepCopy<any>(this.objChildReferral);
                        //        }
                        //    });
                        //}
                        this.lstChildReferral = deepCopy<any>(outputData);
                        this.setChangeDate()
                    }
                    else {
                        this.fnGetChildRefDV(data);
                        this.setChangeDate();
                    }
                    this.objChildReferral.NFADate = this.model.GetDateEditFormat(this.objChildReferral.NFADate);
                    this.objChildProfileRef2.LANotifiedDate = this.model.GetDateEditFormat(this.objChildProfileRef2.LANotifiedDate);
                });
            }
        });

    }
    DocOk = true;
    IsDirtyReferral2 = true;
    IsDirtyRF2 = true;
    IsNewOrSubmitedReferral2 = 1;//New=1 and Submited=2
    //btn Submit Referral 2
    btnSaveReferral(dynamicValue, dynamicForm, dynamicReferral2PCValue, dynamicReferral2PCForm, UploadDocIds, IsUpload, uploadFormBuilder
        ,AddtionalEmailIds, EmailIds) {

        //add dynamicReferral2PCValue to main dynamic
        dynamicReferral2PCValue.forEach(item => {
            dynamicValue.push(item);
        });


        if (this.objChildProfileRef2.NoFurtherAction) {
            this.submittedNFA = true;

            if (!this.formNFA.valid) {
                this.Referral1Active = "";
                this.Referral2Active = "active";
                this.DocumentActive = "";
                this.model.GetErrorFocus(this.formNFA);
            }
            else if (!dynamicReferral2PCForm.valid) {
                this.Referral1Active = "";
                this.DocumentActive = "";
                this.Referral2Active = "active";
                this.model.GetErrorFocus(dynamicReferral2PCForm);
            }

            if (this.formNFA.valid) {
                this.objChildProfileRef2.ChildStatusId = 17;
                this.fnSaveReferral(dynamicValue, dynamicForm, IsUpload, uploadFormBuilder,AddtionalEmailIds, EmailIds);
            }
        }
        else {
            this.submittedNFA = false;
            this.fnSaveReferral(dynamicValue, dynamicForm, IsUpload, uploadFormBuilder,AddtionalEmailIds, EmailIds);
        }
    }

   refDate:any;
    fnSaveReferral(dynamicValue, dynamicForm, IsUpload, uploadFormBuilder,AddtionalEmailIds, EmailIds) {
        this.submitted = false;
        this.submittedref = true;

        if (!this._FormRef.valid) {
            this.Referral1Active = "";
            this.Referral2Active = "active";
            this.DocumentActive = "";
            if(this.LAElement.hasValue == true)
                this.model.GetErrorFocus(this._FormRef);
            else
                this.model.GetErrorFocus(this._FormRef,this.LAElement);
        } else if (!dynamicForm.valid) {
            this.Referral1Active = "";
            this.Referral2Active = "active";
            this.DocumentActive = "";
            this.model.GetErrorFocus(dynamicForm);
        }
        else if (IsUpload && !uploadFormBuilder.valid) {
            this.Referral1Active = "";
            this.Referral2Active = "active";
            this.DocumentActive = "active";
            this.model.GetErrorFocus(uploadFormBuilder);
        }
        this.DocOk = true;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        this.objChildReferral.CreatedUserId = parseInt(Common.GetSession("UserProfileId"));
        this.objChildReferral.UpdatedUserId = parseInt(Common.GetSession("UserProfileId"));

        // if (IsUpload) {
        this.submittedUpload = true;
        if (this._FormRef.valid && dynamicForm.valid && this.DocOk) {

            this.objChildReferral.ReferralDate = this.model.GetDateSaveFormat(this.objChildReferral.ReferralDate);
            this.objChildReferral.NFADate = this.model.GetDateSaveFormat(this.objChildReferral.NFADate);
            this.objChildProfileRef2.LANotifiedDate = this.model.GetDateSaveFormat(this.objChildProfileRef2.LANotifiedDate);

          //  this.objChildProfileRef2OG.LANotifiedDate = this.model.GetDateEditFormat(this.objChildProfileRef2OG.LANotifiedDate);
            this.objChildProfileRef2OG.LANotifiedDate = this.model.GetDateSaveFormat(this.objChildProfileRef2OG.LANotifiedDate);

            this.objChildProfileRef2.AgencyProfileId = this.AgencyProfileId;
            this.objChildProfileRef2.ChildReferral = this.objChildReferral;

            this.IsDirtyReferral2 = true;
            this.IsDirtyRF2 = true;

            this.objChildReferral.DynamicValue = null;
            this.objChildReferralOG.DynamicValue = null;
            this.objChildReferral.lstAgencyFieldMapping = null;
            this.objChildReferralOG.lstAgencyFieldMapping = null;

            this.objChildProfileRef2.ChildContactType=this.lstChildContactType;        

            if (
                 CompareValue(this.objChildReferral.ReferralName, this.objChildReferralOG.ReferralName)
                 &&
                CompareValue(this.objChildReferral.ReferralDate+'T00:00:00', this.objChildReferralOG.ReferralDate)
                 &&
                CompareValue(this.objChildReferral.LASocialWorkerId, this.objChildReferralOG.LASocialWorkerId)
                &&
                CompareValue(this.objChildReferral.NFADate, this.objChildReferralOG.NFADate)
                &&
                CompareValue(this.objChildReferral.NFAReasonId, this.objChildReferralOG.NFAReasonId)
                &&
                 CompareValue(this.objChildProfileRef2.GeographicalId, this.objChildProfileRef2OG.GeographicalId)
                &&
                 CompareValue(this.objChildProfileRef2.ChildPlacingAuthorityId, this.objChildProfileRef2OG.ChildPlacingAuthorityId)
                 &&
                CompareValue(this.objChildProfileRef2.LANotifiedDate, this.objChildProfileRef2OG.LANotifiedDate)
                &&

                CompareValue(this.objChildProfileRef2.LocalAuthority.LocalAuthorityId, this.objChildProfileRef2OG.LocalAuthority.LocalAuthorityId)
                &&

              //  CompareValue(this.objChildReferral.ContactTypeId, this.objChildReferralOG.ContactTypeId)
                // &&
                Compare(dynamicValue, this.lstChildRefDVOG)
            ) {
                this.IsDirtyReferral2 = false;
            }

            // console.log( CompareValue(this.objChildReferral.ReferralName, this.objChildReferralOG.ReferralName))
            // console.log(CompareValue(this.objChildReferral.ReferralDate+'T00:00:00', this.objChildReferralOG.ReferralDate))
            // console.log(CompareValue(this.objChildReferral.LASocialWorkerId, this.objChildReferralOG.LASocialWorkerId))
            // console.log(CompareValue(this.objChildReferral.NFADate, this.objChildReferralOG.NFADate))
            // console.log(CompareValue(this.objChildReferral.NFAReasonId, this.objChildReferralOG.NFAReasonId))
            // console.log(CompareValue(this.objChildProfileRef2.GeographicalId, this.objChildProfileRef2OG.GeographicalId))
            // console.log( CompareValue(this.objChildProfileRef2.ChildPlacingAuthorityId, this.objChildProfileRef2OG.ChildPlacingAuthorityId))
            // console.log( CompareValue(this.objChildProfileRef2.LANotifiedDate, this.objChildProfileRef2OG.LANotifiedDate))
            // console.log( CompareValue(this.objChildProfileRef2.LocalAuthority.LocalAuthorityId, this.objChildProfileRef2OG.LocalAuthority.LocalAuthorityId))
            // console.log(Compare(dynamicValue, this.lstChildRefDVOG))

            // console.log(this.objChildProfileRef2.LANotifiedDate);
            // console.log(this.objChildProfileRef2OG.LANotifiedDate);
            
            if (this.IsDirtyReferral2 || this.contactTypeChange || (IsUpload && uploadFormBuilder.valid) || this.IsSaveAsDrafrrecord == true) {
                this.isLoading2 = true;
                this.objChildProfileRef2.ChildReferral.DynamicValue = dynamicValue;
                this.objChildProfileRef2.NotificationEmailIds = EmailIds;
                this.objChildProfileRef2.NotificationAddtionalEmailIds = AddtionalEmailIds;

                this.apiService.post(this.controllerName, "Save", this.objChildProfileRef2).then(data => {
                    this.insPassHeaderInfo = true;
                    this.ResponeReferral2(data, IsUpload, this.skipAlert);
                    this.fnGetChildReferralNDynamicControls();
                });
            }
            else {
                this.objChildReferral.ReferralDate = this.model.GetDateEditFormat(this.objChildReferral.ReferralDate);
                this.objChildReferral.NFADate = this.model.GetDateEditFormat(this.objChildReferral.NFADate);
                this.objChildProfileRef2.LANotifiedDate = this.model.GetDateEditFormat(this.objChildProfileRef2.LANotifiedDate);

                this.showAutoSave = false;
                if (this.skipAlert && this.IsNewOrSubmitedReferral2 == 1)
                    this.model.alertWarning(Common.GetNoChangeAlert);
                else if (this.skipAlert && this.IsNewOrSubmitedReferral2 == 2)
                    this.model.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.skipAlert = true;
            }
        }
        // }
        //else if (this._FormRef.valid && dynamicForm.valid) {
        //    this.isLoading2 = true;
        //    this.isLoading = true;
        //    this.objChildReferral.ReferralDate = this.model.GetDateSaveFormat(this.objChildReferral.ReferralDate);
        //    this.objChildReferral.NFADate = this.model.GetDateSaveFormat(this.objChildReferral.NFADate);
        //    this.objChildProfile.LANotifiedDate = this.model.GetDateSaveFormat(this.objChildProfile.LANotifiedDate);

        //    this.objChildProfile.AgencyProfileId = this.AgencyProfileId;
        //    this.objChildProfile.ChildReferral = this.objChildReferral;
        //    this.objChildProfile.ChildReferral.DynamicValue = dynamicValue;
        //    this.apiService.post(this.controllerName, "Save", this.objChildProfile).then(data => {
        //        this.insPassHeaderInfo = true;
        //        this.Respone(data, IsUpload, this.skipAlert);
        //        this.fnGetChildReferralNDynamicControls();
        //    });
        //}
    }

    //Referral 2 save as draft submit
    fnSaveDraftRef2(dynamicValue, dynamicReferral2PCValue, IsUpload, uploadFormBuilder) {
        //add dynamicReferral2PCValue to main dynamic
        dynamicReferral2PCValue.forEach(item => {
            dynamicValue.push(item);
        });

        this.submitted = false;
        let userId: number = parseInt(Common.GetSession("UserProfileId"));
        this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
        this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.childId;
        this.objSaveDraftInfoDTO.CreatedUserId = userId;
        this.objSaveDraftInfoDTO.UpdatedUserId = userId;

        //this.objChildProfile.ChildStatusId = 18;
        // this.objChildProfile.AgencyProfileId = this.AgencyProfileId;

        this.objChildProfileRef2.ChildReferral = this.objChildReferral;
        this.objChildProfileRef2.ChildReferral.DynamicValue = dynamicValue;

        this.objChildReferral.ReferralDate = this.model.GetDateSaveFormat(this.objChildReferral.ReferralDate);
        this.objChildReferral.NFADate = this.model.GetDateSaveFormat(this.objChildReferral.NFADate);
        this.objChildProfileRef2.LANotifiedDate = this.model.GetDateSaveFormat(this.objChildProfileRef2.LANotifiedDate);

        this.objChildProfileRef2.ChildContactType=this.lstChildContactType;

        this.IsDirtyReferral2 = true;
        this.IsDirtyRF2 = true;

        this.objChildReferral.DynamicValue = null;
        this.objChildReferralOG.DynamicValue = null;
        this.objChildReferral.lstAgencyFieldMapping = null;
        this.objChildReferralOG.lstAgencyFieldMapping = null;

        if (
            CompareValue(this.objChildProfileRef2.GeographicalId, this.objChildProfileRef2OG.GeographicalId)
            &&
            CompareValue(this.objChildProfileRef2.ChildPlacingAuthorityId, this.objChildProfileRef2OG.ChildPlacingAuthorityId)
            &&
            CompareValue(this.objChildProfileRef2.LANotifiedDate, this.objChildProfileRef2OG.LANotifiedDate)
            &&
            CompareValue(this.objChildProfileRef2.LocalAuthority.LocalAuthorityId, this.objChildProfileRef2OG.LocalAuthority.LocalAuthorityId)
            &&
            CompareValue(this.objChildProfileRef2.NoFurtherAction, this.objChildProfileRef2OG.NoFurtherAction)
            &&
            CompareStaticValue(this.objChildReferral, this.objChildReferralOG)
            &&
            CompareSaveasDraft(this.lstChildRefDV, this.lstChildRefDVOG)
        ) {
            this.IsDirtyReferral2 = false;
        }

        if (this.IsDirtyReferral2 || (IsUpload && uploadFormBuilder.valid)) {
            if (this.lstChildReferral.length == 1) {
                this.lstChildReferral[0].lstAgencyFieldMapping = this.lstChildRefDV;
                this.lstChildReferral[0].ReferralName = this.objChildReferral.ReferralName;
                this.lstChildReferral[0].ReferralDate = this.model.GetDateSaveFormat(this.objChildReferral.ReferralDate);
            }
            else {
                this.lstChildReferral.forEach(item => {
                    if (item.IsActive == true) {
                        item.lstChildReferral.lstAgencyFieldMapping = this.lstChildRefDV;
                        item.ReferralName = this.objChildReferral.ReferralName;
                        item.ReferralDate = this.model.GetDateSaveFormat(this.objChildReferral.ReferralDate);
                    }
                });
            }
            this.objSaveDraftInfoDTO.JsonList = JSON.stringify(this.lstChildReferral);
            this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.objChildProfileRef2);
            this.objSaveDraftInfoDTO.SequenceNo = this.tblPrimaryKey;
            this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, IsUpload));
        }
        else {
            this.objChildReferral.ReferralDate = this.model.GetDateEditFormat(this.objChildReferral.ReferralDate);
            this.objChildReferral.NFADate = this.model.GetDateEditFormat(this.objChildReferral.NFADate);
            this.objChildProfileRef2.LANotifiedDate = this.model.GetDateEditFormat(this.objChildProfileRef2.LANotifiedDate);

            this.showAutoSave = false;
            if (this.skipAlert && this.IsNewOrSubmitedReferral2 == 1)
                this.model.alertWarning(Common.GetNoChangeAlert);
            else if (this.skipAlert && this.IsNewOrSubmitedReferral2 == 2)
                this.model.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
            this.skipAlert = true;
        }
    }

    //Referral 1 submit
    isValid = true;
    IsDirtyReferral1 = false;
    IsNewOrSubmitedReferral1 = 1;//New=1 and Submited=2
    btnSave(ddHasSibling, ddDisability, ddBehaviour, value, piFormBuilder, ddLanguageList,ddlHealthNeedsList): void {
        this.submitted = true;
        this.submittedref = false;

        if (!this._Form.valid) {
            this.Referral1Active = "active";
            this.Referral2Active = "";
            this.model.GetErrorFocus(this._Form);
        } else if (!piFormBuilder.valid) {
            this.Referral1Active = "active";
            this.Referral2Active = "";
            this.model.GetErrorFocus(piFormBuilder);
        }
        if (this.isParentNChild && (this.objChildProfile.ParentName == null || this.objChildProfile.ParentName == ""))
            this.isValid = false;
        else
            this.isValid = true;
        if (this._Form.valid && piFormBuilder.valid && this.isValid) {

            let type = "update";
            this.objChildProfile.DisabilityIds = ddDisability;
            this.objChildProfile.BehavioralIds = ddBehaviour;
            this.objChildProfile.AgencyProfileId = this.AgencyProfileId;
            this.objChildProfile.SiblingIds = ddHasSibling;
            //this.objChildProfile.ParentIds = ddHasParent;
            this.objChildProfile.LanguageId = ddLanguageList;
            this.objChildProfile.HealthNeedsIds = ddlHealthNeedsList;
            this.objChildProfile.ParentDateOfBirth = this.model.GetDateSaveFormat(this.objChildProfile.ParentDateOfBirth);
            this.objChildProfile.ParentDateOfBirth2 = this.model.GetDateSaveFormat(this.objChildProfile.ParentDateOfBirth2);
            this.objChildProfile.PersonalInfo.DateOfBirth = this.model.GetDateSaveFormat(this.objChildProfile.PersonalInfo.DateOfBirth);

            this.IsDirtyReferral1 = true;


            if (
                //CompareValue(this.objChildProfile.GeographicalId, this.objChildProfileOG.GeographicalId)
                //&&
                //CompareValue(this.objChildProfile.ChildPlacingAuthorityId, this.objChildProfileOG.ChildPlacingAuthorityId)
                //&&
                //CompareValue(this.objChildProfile.LANotifiedDate, this.objChildProfileOG.LANotifiedDate)
                //&&
                //CompareValue(this.objChildProfile.LocalAuthority.LocalAuthorityId, this.objChildProfileOG.LocalAuthority.LocalAuthorityId)
                //&&
                //CompareValue(this.objChildProfile.NoFurtherAction, this.objChildProfileOG.NoFurtherAction)
                //&&
                CompareStaticValue(this.objChildProfile, this.objChildProfileOG)
            ) {
                this.IsDirtyReferral1 = false;
            }

            if (this.IsDirtyReferral1) {
                this.isLoading = true;
                this.apiService.save("ChildProfile", this.objChildProfile, type).then(data => {
                    this.insPassHeaderInfo = true;
                    this.ResponeReferral1(data, false, this.skipAlert);
                });
            }
            else {
                this.objChildProfile.ParentDateOfBirth = this.model.GetDateEditFormat(this.objChildProfile.ParentDateOfBirth);
                this.objChildProfile.ParentDateOfBirth2 = this.model.GetDateEditFormat(this.objChildProfile.ParentDateOfBirth2);
                this.objChildProfile.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objChildProfile.PersonalInfo.DateOfBirth);

                this.showAutoSave = false;
                if (this.IsNewOrSubmitedReferral1 == 1)
                    this.model.alertWarning(Common.GetNoChangeAlert);
                else if (this.IsNewOrSubmitedReferral1 == 2)
                    this.model.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
            }

            if (value == "savengo") {
            }
        }
    }

    fnLoadHeader(objChildProfile) {
        this.insChildProfileDTO.ChildCode = objChildProfile.ChildCode;
        this.insChildProfileDTO.PersonalInfo = objChildProfile.PersonalInfo;
        this.insChildProfileDTO.RecommendedCarers = objChildProfile.RecommendedCarers;
        this.insChildProfileDTO.SupervisingSocialWorker = objChildProfile.SupervisingSocialWorker;
        this.insChildProfileDTO.LocalAuthority = objChildProfile.LocalAuthority;
        this.insChildProfileDTO.AreaOfficeProfile = objChildProfile.AreaOfficeProfile;
        this.insChildProfileDTO.ChildIdentifier = objChildProfile.ChildIdentifier;
        this.insChildProfileDTO.LASocialWorker = objChildProfile.LASocialWorker;
        this.headerCtrl.fnShowImage(objChildProfile.PersonalInfo.ImageId);
        Common.SetSession("SelectedChildProfile", JSON.stringify(this.insChildProfileDTO));
    }

    private ResponeReferral1(data, IsUpload, skipAlert: boolean) {
        this.isLoading = false;
        if (data.IsError == false) {
            this.IsNewOrSubmitedReferral1 = 2;
            this.objChildProfileOG = deepCopy<any>(this.objChildProfile);
        }

        if (data.IsError == true) {
            this.model.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.apiService.get("ChildProfile", "GetById", this.ChildProfileProfileId).then(data => {
                this.fnLoadHeader(data);
            });
            this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
            if (skipAlert)
                this.model.alertSuccess(Common.GetSaveSuccessfullMsg);
            if (skipAlert) {
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.childId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);

                if (this.objChildProfile.NoFurtherAction) {
                    Common.SetSession("ReferralChildId", null);
                    this._router.navigate(['/pages/referral/childprofilelist/0/16']);
                }
            }
            this.objChildProfile.ParentDateOfBirth = this.model.GetDateEditFormat(this.objChildProfile.ParentDateOfBirth);
            this.objChildProfile.ParentDateOfBirth2 = this.model.GetDateEditFormat(this.objChildProfile.ParentDateOfBirth2);
            this.objChildProfile.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objChildProfile.PersonalInfo.DateOfBirth);
            //this.objChildProfile.ParentDateOfBirth = this.model.GetDateEditFormat(this.objChildProfile.ParentDateOfBirth);
            //this.objChildReferral.ReferralDate = this.model.GetDateEditFormat(this.objChildReferral.ReferralDate);
            //this.objChildReferral.NFADate = this.model.GetDateEditFormat(this.objChildReferral.NFADate);
            //this.objChildProfile.LANotifiedDate = this.model.GetDateEditFormat(this.objChildProfile.LANotifiedDate);
            //this.objChildProfile.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objChildProfile.PersonalInfo.DateOfBirth);
        }
        this.refTabActive = true;
    }

    private ResponeReferral2(data, IsUpload, skipAlert: boolean) {
        this.contactTypeChange=false;
        this.isLoading2 = false;
        this.IsSaveAsDrafrrecord = false;
        if (data.IsError == false) {
            this.IsNewOrSubmitedReferral2 = 2;
            this.objChildProfileRef2OG = deepCopy<any>(this.objChildProfileRef2);
            this.lstChildRefDVOG = deepCopy<any>(this.lstChildRefDV);
        }

        if (data.IsError == true) {
            this.model.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
            this.showSaveAsDraftButton = false;
            this.apiService.get("ChildProfile", "GetById", this.ChildProfileProfileId).then(data => {
                this.fnLoadHeader(data);
            });
            if (IsUpload) {
                this.uploadCtrl.fnUploadAll(this.childId);
            }

            if (skipAlert ||this.showSaveAsDraftButton)
                this.model.alertSuccess(Common.GetSaveSuccessfullMsg);
            if (skipAlert) {

                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.childId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);

                if (this.objChildProfileRef2.NoFurtherAction) {
                    Common.SetSession("ReferralChildId", null);
                    this._router.navigate(['/pages/referral/childprofilelist/0/16']);
                }
            }

            this.objChildReferral.ReferralDate = this.model.GetDateEditFormat(this.objChildReferral.ReferralDate);
            this.objChildReferral.NFADate = this.model.GetDateEditFormat(this.objChildReferral.NFADate);
            this.objChildProfileRef2.LANotifiedDate = this.model.GetDateEditFormat(this.objChildProfileRef2.LANotifiedDate);
        }
        this.refTabActive = true;
    }

    private ResponeDraft(data, IsUpload) {
        this.IsSaveAsDrafrrecord = true;
        if (data.IsError == false) {
            this.IsNewOrSubmitedReferral2 = 2;
            this.objChildProfileRef2OG = deepCopy<any>(this.objChildProfileRef2);
            this.objChildReferralOG = deepCopy<any>(this.objChildReferral);
            this.lstChildRefDVOG = deepCopy<any>(this.lstChildRefDV);
        }

        this.objChildReferral.ReferralDate = this.model.GetDateEditFormat(this.objChildReferral.ReferralDate);
        this.objChildReferral.NFADate = this.model.GetDateEditFormat(this.objChildReferral.NFADate);
        this.objChildProfileRef2.LANotifiedDate = this.model.GetDateEditFormat(this.objChildProfileRef2.LANotifiedDate);

        this.isLoading2 = false;
        if (data.IsError == true) {
            this.model.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.apiService.get("ChildProfile", "GetById", this.ChildProfileProfileId).then(data => {
                this.fnLoadHeader(data);
            });
            if (IsUpload) {
                this.uploadCtrl.fnUploadAll(this.childId);
            }
            if (!this.showAutoSave)
                this.model.alertSuccess(Common.GetSaveDraftSuccessfullMsg);
        }
        this.refTabActive = true;
    }
    fnLAAddress(value) {
        if (this.localAuthorityList != null) {
            this.localAuthorityList.forEach(item => {
                if (item.LocalAuthorityId == value) {
                    this.objLAAddress = item.ContactInfo;
                }
            });
        }

        if (value != "") {
            this.objChildProfile.LocalAuthority.LocalAuthorityId = value;
            this.fnLoadPlacementContactInfo();
        }

    }

    objChildContactName;
    objChildContactMobile;
    objChildContactEmailAddress;
    fnChangeChildContactId(value:number) {
        this.objChildReferral.AgencyProfileId=this.AgencyProfileId;
        this.objChildReferral.ChildId=this.childId;
        this.objChildReferral.ContactTypeId=value;
        this.apiService.post("ChildFamilyPersonOrgInvolved","GetAllByChildAndCType",this.objChildReferral).then(data=>{
            if(data.length>0)
            {
                this.objChildReferral.ContactTypeId= parseInt(data.filter(x=>x.FieldName=="ContactTypeId"));
                this.objChildContactName=data.filter(x=>x.FieldName=="Name");
                this.objChildContactMobile=data.filter(x=>x.FieldName=="Phone");
                this.objChildContactEmailAddress=data.filter(x=>x.FieldName=="EmailAddress");
            }
            else
            {
                this.objChildContactName=null;
                this.objChildContactMobile=null;
                this.objChildContactEmailAddress=null;

            }
        });

    }

    fnDeleteContactType(ContactTypeId)
    {
        this.lstChildContactType=this.lstChildContactType.filter(x=>x.ChildContactTypeId!=ContactTypeId);
        this.contactTypeChange=true;
    }

    lstChildContactType=[];
    fnAddContactType(id)
    {
        this.objChildReferral.AgencyProfileId=this.AgencyProfileId;
        this.objChildReferral.ChildId=this.childId;
       // this.objChildReferral.ContactTypeId=this.objChildReferral.ContactTypeId;
       // console.log(id)
        if(this.objChildReferral.ContactTypeId !=0 && this.objChildReferral.ContactTypeId !=NaN && JSON.stringify(this.objChildReferral.ContactTypeId) != 'NaN' )
        {
           // console.log(this.objChildReferral.ContactTypeId);
            this.apiService.post("ChildFamilyPersonOrgInvolved","GetAllByChildAndCType",this.objChildReferral).then(data=>{
                if(data.length>0)
                {
                    this.fnAddContactTypeLoad(this.objChildReferral.ContactTypeId)
                    this.contactTypeChange=true;
                }
                else
                {
                    this.model.alertInfo("Contact Type Does Not Exist");
                }
            });
         }

    }

    fnAddContactTypeLoad(ContactTypeId)
    {

    let insCheck=this.lstChildContactType.filter(x=>x.ChildContactTypeId==ContactTypeId);
    if(insCheck.length==0)
    {
        this.objChildReferral.AgencyProfileId=this.AgencyProfileId;
        this.objChildReferral.ChildId=this.childId;
        this.objChildReferral.ContactTypeId=ContactTypeId;

        this.apiService.post("ChildFamilyPersonOrgInvolved","GetAllByChildAndCType",this.objChildReferral).then(data=>{
            if(data.length>0)
            {
                //console.log(data);
                let obj=new ChildContactTypeDTO();
                obj.ChildContactTypeId=ContactTypeId;
                obj.ChildContactTypeName=data[0].ContactTypeName;
                obj.ChildFamilyPersonOrgInvolvedSno=data[0].SequenceNo;
                let insName=data.filter(x=>x.FieldName=="Name");
                if(insName.length>0)
                    obj.Name=insName[0].FieldValue

                let insEmailAddress=data.filter(x=>x.FieldName=="EmailAddress");
                if(insEmailAddress.length>0)
                    obj.EmailId=insEmailAddress[0].FieldValue;

                let insPhone=data.filter(x=>x.FieldName=="Phone");
                if(insPhone.length>0)
                    obj.PhoneNumber=insPhone[0].FieldValue;

               // obj.PhoneNumber=data.filter(x=>x.FieldName=="Name");
                this.lstChildContactType.push(obj);
                //this.contactTypeChange=true;
                //this.objChildReferral.ContactTypeId= parseInt(data.filter(x=>x.FieldName=="ContactTypeId"));
//                this.objChildContactName=data.filter(x=>x.FieldName=="Name");
  //              this.objChildContactMobile=data.filter(x=>x.FieldName=="Phone");
    //            this.objChildContactEmailAddress=data.filter(x=>x.FieldName=="EmailAddress");
            }
            else
            {
               // this.fnShowChildContact();
                this.objChildContactName=null;
                this.objChildContactMobile=null;
                this.objChildContactEmailAddress=null;

            }
        });
        }
        else{
            this.model.alertInfo("Contact Type Already Exist");
        }
    }


    fnReturnLA(data) {
        this.localAuthorityList = data;
        this.fnLAAddress(this.objChildProfile.LocalAuthority.LocalAuthorityId);

    }

    lstChildReferralHistory = [];
    fnGetChildRefDV(data) {
        if (data != null) {

            this.lstChildRefDV = data[0].lstAgencyFieldMapping;
            this.lstChildRefDVOG = deepCopy<any>(this.lstChildRefDV);
            //this.lstChildReferral = data;
            //data.forEach(item => {
            //    if (item.IsActive == true) {
            //        this.objChildReferral = item;
            //    }
            //    //else {
            //    //    if (item.ChildReferralId > 0)
            //    //        this.lstChildReferral.push(item);
            //    //}
            //});
            let insTemData = data.filter(x => x.IsActive == true);
            if (insTemData.length > 0 && insTemData != null) {
                this.objChildReferral = insTemData[0];
                this.objChildReferralOG = deepCopy<any>(this.objChildReferral);
                this.fnChangeChildContactId(this.objChildReferral.ContactTypeId);
            }
            this.lstChildReferral = deepCopy<any>(data);
            this.fnLoadPlacementContactInfo();
        }
        //this.lstChildReferral = data;
        //if (this.lstChildReferral != null && this.lstChildReferral.length > 0) {
        //    this.objChildReferral = this.lstChildReferral[0];
        //    this.lstChildRefDV = this.objChildReferral.lstAgencyFieldMapping;
        //    if (this.objChildReferral.IsActive) {
        //        this.lstChildReferral.reverse();
        //        this.lstChildReferral.pop();
        //        this.lstChildReferral.reverse();
        //    }
        //}

    }

    fnPlaceChild() {
        Common.SetSession("RefPlacementChildId", this.objChildProfile.ChildId.toString());
        this._router.navigate(['/pages/referral/childplacement/16']);
    }

    IsShowDisability = false;
    fnChangeDisability(value) {
        if (value == 2)
            this.IsShowDisability = true;
        else {
            this.ddDisability.optionsModel = [];
            this.IsShowDisability = false;
        }
    }

    dateString;
    setChangeDate() {
        this.objChildReferral.ReferralDate = this.model.GetDateEditFormat(this.objChildReferral.ReferralDate);
    }
    dateString1;
    setParentDate() {
        this.objChildProfile.ParentDateOfBirth = this.model.GetDateEditFormat(this.objChildProfile.ParentDateOfBirth);
        this.objChildProfile.ParentDateOfBirth2 = this.model.GetDateEditFormat(this.objChildProfile.ParentDateOfBirth2);
    }
    isFirstTime: boolean = false;
    ngOnInit() {
        if (this.objQeryVal.mid == 16) {
            this.st.newTimer('childRef180', environment.autoSaveTime);
            this.subscribeTimer2();
        }
    }
    subscribeTimer2() {
        if (this.timer2Id) {
            // Unsubscribe if timer Id is defined
            this.st.unsubscribe(this.timer2Id);
            this.timer2Id = undefined;
            this.timer2button = 'Subscribe';
        } else {
            // Subscribe if timer Id is undefined
            this.timer2Id = this.st.subscribe('childRef180', () => this.timer2callback());
            this.timer2button = 'Unsubscribe';

        }
    }
    timer2callback() {
        //this.counter2++;
        if (this.accessAutoSave) {
            if (this.isFirstTime) {
                if ((this.Referral2Active == "active" || this.DocumentActive == "active") && this.showSaveAsDraftButton == true) {
                    this.showAutoSave = true;
                    this.skipAlert = false;
                    let event = new MouseEvent('click', { bubbles: true });
                    this.btnSaveDraftRef2.nativeElement.dispatchEvent(event);
                    Common.SetSession("showAutoSave", "1");
                    this.draftSavedTime = Date.now();
                    Common.SetSession("DraftTime", this.draftSavedTime);
                }
            }
            this.isFirstTime = true;
        }
    }
    ngOnDestroy() {
        this.st.delTimer('childRef180');
    }

    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateChildRefferalPDF/" + this.childId + "," + this.childId + "," + this.AgencyProfileId;
        this.objUserAuditDetailDTO.ActionId =7;
        this.objUserAuditDetailDTO.RecordNo = 0;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.childId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnDonloadWord() {
        window.location.href = this.apiURL + "GenerateChildRefferalWord/" + this.childId + "," + this.childId + "," + this.AgencyProfileId;
        this.objUserAuditDetailDTO.ActionId =6;
        this.objUserAuditDetailDTO.RecordNo = 0;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.childId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateChildRefferalPrint", this.childId + "," + this.childId + "," + this.AgencyProfileId).then(data => {
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
        this.objUserAuditDetailDTO.RecordNo = 0;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.childId;
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
            this.objNotificationDTO.Body = this.childId + "," + this.childId + "," + this.AgencyProfileId;
            this.apiService.post("GeneratePDF", "EmailChildRefferal", this.objNotificationDTO).then(data => {
                if (data == true)
                {
                    this.model.alertSuccess("Email Send Successfully..");
                    this.objUserAuditDetailDTO.ActionId =9;
                    this.objUserAuditDetailDTO.RecordNo = 0;
                    this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                    this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                    this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                    this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                    this.objUserAuditDetailDTO.ChildCarerEmpId = this.childId;
                    Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                }                    
                else
                    this.model.alertDanger("Email not Send Successfully..");
                this.fnCancelClick();
                this.isLoading = false;
            });
        }
    }

    fnCancelClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoCancel.nativeElement.dispatchEvent(event);
    }
}

class ChildContactTypeDTO
{
    ChildContactTypeId:number;
    ChildFamilyPersonOrgInvolvedSno:number;
    ChildContactTypeName:number;
    Name:string;
    EmailId:string;
    PhoneNumber:string;
}
