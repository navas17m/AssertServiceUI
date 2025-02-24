import { Component, ElementRef, QueryList, ViewChild, ViewChildren, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SimpleTimer } from 'ng2-simple-timer';
import { environment } from '../../../environments/environment';
import { Common, Compare, CompareSaveasDraft, CompareStaticValue, ConvertDateAndDateTimeSaveFormat, deepCopy } from '../common';
import { ConfigTableNames } from '../configtablenames';
import { ContactVisible } from '../contact/contact';
import { ConfigTableValues } from '../dynamic/ValChangeDTO';
import { PagesComponent } from '../pages.component';
import { PersonalInfoVisible } from '../personalinfo/personalinfo';
import { CarerInitialHomeVisitInfo, CarerInitialHomeVisitInfoNewDTO } from '../recruitment/DTO/carerinitialhomevisitinfo';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { CarerInfo } from './DTO/carerinfo';
declare var window: any;
declare var $: any;
import * as moment from 'moment';
import { UserAuditHistoryDetailDTO } from '../common';
@Component({
    selector: 'CarerInitialHomeVisit',
    templateUrl: './carerinitialhomevisiti.component.template.html',
  //   styles: [`[required]  {
  //       border-left: 5px solid blue;
  //   }

  //  .ng-valid[required], .ng-valid.required  {
  //           border-left: 5px solid #42A948; /* green */
  //   }
  //  label + .ng-invalid:not(form)  {
  //       border-left: 5px solid #a94442; /* red */
  //   }`],
})

export class CarerInitialHomeVisitComponent {
    controllerName = "CarerInitialHomeVisitInfo";
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objCarerInitialHomeVisitInfo: CarerInitialHomeVisitInfo = new CarerInitialHomeVisitInfo();
    objCarerInitialHomeVisitInfoNewDTO: CarerInitialHomeVisitInfoNewDTO = new CarerInitialHomeVisitInfoNewDTO();
    objConfigTableValuesList: ConfigTableValues[] = [];
    objCarerInfo: CarerInfo = new CarerInfo();
    objCarerInfoSA: CarerInfo = new CarerInfo();
    objCarerInfoOG;
    objCarerInfoSAOG;
    objCarerInfotemp: CarerInfo = new CarerInfo();
    objCarerInfoSAtemp: CarerInfo = new CarerInfo();
    objCarerInfoList: CarerInfo[] = [];
    objContactVisible: ContactVisible = new ContactVisible();
    objPersonalInfoVisible: PersonalInfoVisible = new PersonalInfoVisible();
    submitted = false;
    dynamicformcontrol = [];
    dynamicformcontrolOG = [];
    _Form: FormGroup;
    _FormSA: FormGroup;
    isVisibleMandatortMsg;
    applicantList: CarerInfo[] = [];
    Jointapplicant = false; objQeryVal;
    //Doc
    FormCnfgId;
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerParentId: number;
    AgencyProfileId: number;

    PrimaryCarerActive = "active";
    SecondCarerActive;
    FamilyActive;
    Page1Active;
    Page2Active;
    Page3Active;
    DocumentActive;
    isLoading: boolean = false;
    ethinicityList = [];
    OfstedethinicityList = [];
    religionList = [];
    //SiblingCountList = [];
    CarerBornCountryList = [];
    maritalStatusList = [];
    countryList = [];
    familyTabHidden = true;
    accessAutoSave = false;
    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true;
    SaveasDraft = false;
    showAlert: boolean = true; isUploadDoc: boolean = false;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();

    //Print
    insCarerId;
    insCarerDetails;
    CarerCode;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    @ViewChildren('ngSelect') ngSelectElements:QueryList<NgSelectComponent>;
    elem:any;
    saveAsDraftText=Common.GetSaveasDraftText;
    submitText=Common.GetSubmitText;
    isLoadingSAD: boolean = false;isSaving: boolean = false;
    //Disability
    arrayDisability = [];
    selectedDisabilities;
    selectedDisabilitiesSA;SocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private activatedroute: ActivatedRoute, private st: SimpleTimer, private renderer: Renderer2,
        private _formBuilder: FormBuilder, private _router: Router,
        private module: PagesComponent, private apiService: APICallService) {
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.fnLoadDisability(this.activatedroute.snapshot.data['disability']);

        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 6]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 6]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 45;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.SocialWorkerId = Common.GetSession("ACarerSSWId");
            this.fnBindDDLValue();
            this.BindCarerInfoAndDetailsPages();
            this.fnBindDynamiccontrols();
            if (Common.GetSession("SelectedCarerProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
                this.insCarerId = this.insCarerDetails.CarerId;
            }
            this.accessAutoSave = this.module.GetAddBtnAccessPermission(this.FormCnfgId);
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 25;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.SocialWorkerId = Common.GetSession("CarerSSWId");
            this.fnBindDDLValue();
            this.BindCarerInfoAndDetailsPages();
            this.fnBindDynamiccontrols();
            if (Common.GetSession("SelectedApplicantProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
                this.insCarerId = this.insCarerDetails.CarerId;
            }
            this.accessAutoSave = this.module.GetAddBtnAccessPermission(this.FormCnfgId);
        }
        //doc
        this.formId = 25;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.CarerParentId;

        this.apiService.get("CarerInfo","CheckSecondCarer",this.CarerParentId).then(data=>{
            this.Jointapplicant=data;
        })

        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });

        this.setVisible();
        this._Form = _formBuilder.group({
            NationalInsurenceNumber: [],
            EthinicityId: ['0', Validators.required],
            OfstedEthinicityId: ['0', Validators.required],
            ReligionId: ['0', Validators.required],
            MaritalStatusId: ['0', Validators.required],
            PractisingStatus: [],
            //SiblingCount: ['0'],
            CarerBornCountry: ['0'],
            HowLongLivedInLocalArea: [],
            PreviousMarriageDetails: [],
            HaveCriminalOffenseConviction: [''],
            CriminalOffenceConvictionDetail: [''],
            DoYouHaveYourOwnVehicle:[],
            DoesCarerDriveCar:[],
            VehicleRegistrationNumber:[],
            DrivingLicenceNumber:[],
            HasDisability:[]
        });
        this._FormSA = _formBuilder.group({
            saNationalInsurenceNumber: [],
            saEthinicityId: ['0', Validators.required],
            saOfstedEthinicityId: ['0', Validators.required],
            saMaritalStatusId: ['0', Validators.required],
            saReligionId: ['0', Validators.required],
            saPractisingStatus: [],
            //saSiblingCount: ['0'],
            saCarerBornCountry: ['0'],
            saHowLongLivedInLocalArea: [],
            saPreviousMarriageDetails: [],
            HaveCriminalOffenseConvictionSA: [''],
            CriminalOffenceConvictionDetailSA: [],
            DoYouHaveYourOwnVehicleSA:[],
            DoesCarerDriveCarSA:[],
            VehicleRegistrationNumberSA:[],
            DrivingLicenceNumberSA:[],
            HasDisabilitySA:[],
        });


        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Country;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.countryList = data; });
        //this.objConfigTableNamesDTO.Name = ConfigTableNames.Count1to10;
        //this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.SiblingCountList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.MaritalStatus;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.maritalStatusList = data; });

        // this.apiService.get("CarerInfo", "GetApplicantFormDDLValues", this.AgencyProfileId).then(data => {
        //     this.ethinicityList = data.Ethnicity;
        //     this.OfstedethinicityList = data.OfstedEthnicity;
        //     this.religionList = data.Religion;
        // });
        this.objUserAuditDetailDTO.ActionId = 4;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.formId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
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

    fnBindDDLValue()
    {

       this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
       this.objConfigTableNamesDTO.Name = ConfigTableNames.Ethnicity;
       this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.ethinicityList = data; });
       this.objConfigTableNamesDTO.Name = ConfigTableNames.Religion;
       this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.religionList = data; });

       this.objConfigTableNamesDTO.Name = ConfigTableNames.OfstedEthnicity;
       this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.OfstedethinicityList = data; });
    }

    fnBindDynamiccontrols()
    {
        //Get Dynamic Control
        this.objCarerInitialHomeVisitInfo.AgencyProfileId = this.AgencyProfileId;
        this.objCarerInitialHomeVisitInfo.CarerParentId = this.CarerParentId;
        this.objCarerInitialHomeVisitInfo.ControlLoadFormat = ["SectionA", "SectionB", "SectionC", "primarycarer", "family"];
        this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerInitialHomeVisitInfo).then(data => {
            this.dynamicformcontrol = data;
            this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
            let familytab = data.filter(x => x.ControlLoadFormat == 'family');
            if (familytab.length > 0) {
                this.familyTabHidden = false;
            }
            //Get Save as Draft
            let val1 = this.dynamicformcontrol.filter(x => x.FieldCnfg.FieldName == "DateOfVisit");
            if (val1.length > 0 && val1[0].FieldValue == null) {
                this.SaveasDraft = true;
                this.showbtnSaveDraft = true;
                this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
                this.objSaveDraftInfoDTO.SequenceNo = this.CarerParentId;
                this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
                this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
                this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                    let tempJsonData = JSON.parse(data.JsonData);
                    if (data != null && data.JsonData != null) {
                        this.ResponeDraftDetails(tempJsonData);
                    }
                });
            }
            else {
                this.showbtnSaveDraft = false;
                this.SaveasDraft = false;
            }
        });

    }

    setVisible() {

        this.objPersonalInfoVisible.ImageIdVisible = false;
        this.objPersonalInfoVisible.PreviousNameVisible = false;
        this.objPersonalInfoVisible.AgeVisible = false;

        //Set Conact Info Visible
        this.objContactVisible.HomePhoneVisible = false;
        this.objContactVisible.OfficePhoneVisible = false;
        this.objContactVisible.AlternativeEmailIdVisible = false;
        this.objContactVisible.EmergencyContactVisible = false;
        this.objContactVisible.AddressLine2Mandatory = false;
    }


    BindCarerInfoAndDetailsPages() {
        //Get Carer Info
        this.objCarerInfo.CarerParentId = this.CarerParentId;
        if (this.objCarerInfo.CarerParentId != 0 && this.objCarerInfo.CarerParentId != null) {
            this.apiService.get("CarerInfo", "GetByCarerParentId", this.objCarerInfo.CarerParentId).then(data => {
                this.ResponseCarerDetails(data);
            });
        }
    }


    ResponseCarerDetails(data: CarerInfo[]) {
        if (data[0] != null) {
            this.objCarerInfo = data[0];
            this.selectedDisabilities=this.objCarerInfo.DisabilityIds;
            this.objCarerInfotemp = data[0];
            this.objCarerInfoOG = deepCopy<any>(this.objCarerInfo);

        }
        if (this.Jointapplicant && data[1] != null) {
            this.objCarerInfoSA = data[1];
            this.selectedDisabilitiesSA=this.objCarerInfoSA.DisabilityIds;
            this.objCarerInfoSAOG = deepCopy<any>(this.objCarerInfoSA);
            this.objCarerInfoSAtemp = data[1];
            // if (this.objCarerInfoSA.PersonalInfo.TitleId != 0) {
            //     this.Jointapplicant = true;
            // }
        }


    }

    ResponeDraftDetails(data: CarerInitialHomeVisitInfo) {
        if (data != null) {
            this.showbtnSaveDraft = true;
            this.SaveasDraft = true;

            if (data.dynamicformcontrol != null) {
                this.dynamicformcontrol = data.dynamicformcontrol;
                this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
            }
            if (data.CarerInfoPC != null) {
                this.objCarerInfo = data.CarerInfoPC;
                this.objCarerInfoOG = deepCopy<any>(this.objCarerInfo);
            }
            if (this.Jointapplicant && data.CarerInfoSC != null && this.objCarerInfo.CarerId != data.CarerInfoSC.CarerId) {
                this.objCarerInfoSA = data.CarerInfoSC;
                this.objCarerInfoSAOG = deepCopy<any>(this.objCarerInfoSA);
                // if (this.objCarerInfoSA.PersonalInfo.TitleId != 0) {
                //     this.Jointapplicant = true;
                // }
            }
        }
    }

    fnPrimaryCarer() {
        this.PrimaryCarerActive = "active";
        this.SecondCarerActive = "";
        this.FamilyActive = "";
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "";
        this.DocumentActive = "";

    }
    fnSecondCarer() {
        this.PrimaryCarerActive = "";
        this.SecondCarerActive = "active";
        this.FamilyActive = "";
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "";
        this.DocumentActive = "";
    }
    fnFamily() {
        this.PrimaryCarerActive = "";
        this.SecondCarerActive = "";
        this.FamilyActive = "active";
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "";
        this.DocumentActive = "";
    }
    fnPage1() {
        this.PrimaryCarerActive = "";
        this.SecondCarerActive = "";
        this.FamilyActive = "";
        this.Page1Active = "active";
        this.Page2Active = "";
        this.Page3Active = "";
        this.DocumentActive = "";

    }
    fnPage2() {
        this.PrimaryCarerActive = "";
        this.SecondCarerActive = "";
        this.FamilyActive = "";
        this.Page1Active = "";
        this.Page2Active = "active";
        this.Page3Active = "";
        this.DocumentActive = "";
    }
    fnPage3() {
        this.PrimaryCarerActive = "";
        this.SecondCarerActive = "";
        this.FamilyActive = "";
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.PrimaryCarerActive = "";
        this.SecondCarerActive = "";
        this.FamilyActive = "";
        this.Page1Active = "";
        this.Page2Active = "";
        this.Page3Active = "";
        this.DocumentActive = "active";
    }

    isPCDirty = false;
    isSCDirty = false;
    IsNewOrSubmited = 1;//New=1 and Submited=2
    DocOk = true;
    JoinOk = true;
    clicksubmit(mainFormBuilder, dynamicFormA, dynamicFormBuliderA, dynamicFormB, dynamicFormBuliderB,
        dynamicFormC, dynamicFormBuliderC,
        dynamicFormCarer, dynamicFormBuliderCarer,
        dynamicFormFamily, dynamicFormBuliderFamily,
        UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {

        //console.log(mainFormBuilder);
        for(let element of this.ngSelectElements.toArray()){
            if(element.hasValue==false){
                this.elem = element;
                break;
            }
        }
        this.JoinOk = true;
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

        if (!this._Form.valid) {
            this.PrimaryCarerActive = "active";
            this.SecondCarerActive = "";
            this.FamilyActive = "";
            this.Page1Active = "";
            this.Page2Active = "";
            this.Page3Active = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(this._Form, this.elem);
        }
        else if (this.Jointapplicant && !this._FormSA.valid) {
            this.PrimaryCarerActive = "";
            this.SecondCarerActive = "active";
            this.FamilyActive = "";
            this.Page1Active = "";
            this.Page2Active = "";
            this.Page3Active = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(this._FormSA, this.elem);
        }
        else if (!mainFormBuilder.valid) {
            this.PrimaryCarerActive = "";
            this.SecondCarerActive = "";
            this.FamilyActive = "";
            this.Page1Active = "active";
            this.Page2Active = "";
            this.Page3Active = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(mainFormBuilder);
        }
        else if (!dynamicFormBuliderA.valid) {
            this.PrimaryCarerActive = "";
            this.SecondCarerActive = "";
            this.FamilyActive = "";
            this.Page1Active = "active";
            this.Page2Active = "";
            this.Page3Active = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicFormBuliderA);
        }
        else if (!dynamicFormBuliderB.valid) {
            this.PrimaryCarerActive = "";
            this.SecondCarerActive = "";
            this.FamilyActive = "";
            this.Page1Active = "";
            this.Page2Active = "active";
            this.Page3Active = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicFormBuliderB);
        }
        else if (!dynamicFormBuliderCarer.valid) {
            this.PrimaryCarerActive = "active";
            this.SecondCarerActive = "";
            this.FamilyActive = "";
            this.Page1Active = "";
            this.Page2Active = "";
            this.Page3Active = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicFormBuliderC);
        }
        else if (!dynamicFormBuliderFamily.valid) {
            this.PrimaryCarerActive = "";
            this.SecondCarerActive = "";
            this.FamilyActive = "active";
            this.Page1Active = "";
            this.Page2Active = "";
            this.Page3Active = "";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicFormBuliderC);
        }
        else if (!dynamicFormBuliderC.valid) {
            this.PrimaryCarerActive = "";
            this.SecondCarerActive = "";
            this.FamilyActive = "";
            this.Page1Active = "";
            this.Page2Active = "";
            this.Page3Active = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(dynamicFormBuliderC);
        }
        else if (IsUpload && !uploadFormBuilder.valid) {
            this.PrimaryCarerActive = "";
            this.SecondCarerActive = "";
            this.FamilyActive = "";
            this.Page1Active = "";
            this.Page2Active = "";
            this.Page3Active = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }

        if (this.Jointapplicant) {
            if (this._FormSA.valid) {
                this.JoinOk = true;
            }
            else {
                this.JoinOk = false;
            }
        }

        if (this._Form.valid && this.JoinOk && this.DocOk && mainFormBuilder.valid && dynamicFormBuliderA.valid && dynamicFormBuliderB.valid
            && dynamicFormBuliderC.valid && dynamicFormBuliderCarer.valid && dynamicFormBuliderFamily.valid) {
            let type = "save";

            if (dynamicFormA[0].UniqueId != 0)
                type = "update";

            dynamicFormB.forEach(item => {
                dynamicFormA.push(item);
            });
            dynamicFormC.forEach(item => {
                dynamicFormA.push(item);
            });
            dynamicFormCarer.forEach(item => {
                dynamicFormA.push(item);
            });
            dynamicFormFamily.forEach(item => {
                dynamicFormA.push(item);
            });

            this.objCarerInfo.DisabilityIds=this.selectedDisabilities;
            this.objCarerInfoSA.DisabilityIds=this.selectedDisabilitiesSA;

            this.objCarerInfo.PersonalInfo.DateOfBirth = this.module.GetDateSaveFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
            this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.module.GetDateSaveFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
            this.isPCDirty = true;
            if (CompareStaticValue(this.objCarerInfo, this.objCarerInfoOG)
                && Compare(dynamicFormA, this.dynamicformcontrolOG)
            ) {
                this.isPCDirty = false;
            }

            this.isSCDirty = true;
            if (this.Jointapplicant && CompareStaticValue(this.objCarerInfoSA, this.objCarerInfoSAOG)
            ) {
                this.isSCDirty = false;
            }

            if (this.isPCDirty || (IsUpload && uploadFormBuilder.valid) || (this.Jointapplicant && this.isSCDirty)) {
                this.isLoading = true;
                this.isSaving=true;
                this.objCarerInfoList = [];
                if(type == "save")
                {
                let val2 = dynamicFormA.filter(x => x.FieldName == "SocialWorkerId");
                if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == ''))
                {
                    val2[0].FieldValue = this.SocialWorkerId;
                }
            }
                this.objCarerInfoList.push(this.objCarerInfo);
                if (this.Jointapplicant)
                    this.objCarerInfoList.push(this.objCarerInfoSA);
                this.objCarerInitialHomeVisitInfo.CarerInfo = this.objCarerInfoList;
                this.objCarerInitialHomeVisitInfo.DynamicValue = dynamicFormA;
                this.objCarerInitialHomeVisitInfo.CarerParentId = this.CarerParentId;
                this.objCarerInitialHomeVisitInfo.NotificationEmailIds = EmailIds;
                this.objCarerInitialHomeVisitInfo.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.apiService.save(this.controllerName, this.objCarerInitialHomeVisitInfo, type).then(data => this.Respone(data, type, IsUpload));
            }
            else {
                this.objCarerInfo.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
                this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
                this.submitText=Common.GetSubmitText;
                this.showAutoSave = false;
                if (this.skipAlert && this.IsNewOrSubmited == 1)
                    this.module.alertWarning(Common.GetNoChangeAlert);
                else if (this.skipAlert && this.IsNewOrSubmited == 2)
                    this.module.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.skipAlert = true;
            }
        }
    }

    private Respone(data, type, IsUpload) {
        this.isSaving=false;
        if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.objCarerInfoOG = deepCopy<any>(this.objCarerInfo);
            if (this.Jointapplicant)
                this.objCarerInfoSAOG = deepCopy<any>(this.objCarerInfoSA);
            this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
            this.dynamicformcontrolOG = ConvertDateAndDateTimeSaveFormat(this.dynamicformcontrolOG);
        }
        if (data.IsError == true) {
            this.isLoading = false;
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.isLoading = false;
                this.showbtnSaveDraft = false;
                this.SaveasDraft = false;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.CarerParentId);
                }
                this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerInitialHomeVisitInfo).then(data => {
                    this.dynamicformcontrol = data;
                    this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                    this.objUserAuditDetailDTO.ActionId =1;
                });

            }
            else {
                this.isLoading = false;
                this.submitText=Common.GetSubmitText;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.CarerParentId);
                }
                if (this.showAlert)
                    this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =2;
            }
            this.showAlert = true;
            this.objCarerInitialHomeVisitInfo.IsSubmitted = true;
            this.objCarerInfo.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
            this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.formId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }


    //save as draft
    fnSaveDraft(mainFormBuilder, dynamicFormA, dynamicFormBuliderA, dynamicFormB, dynamicFormBuliderB,
        dynamicFormC, dynamicFormBuliderC,
        dynamicFormCarer, dynamicFormBuliderCarer,
        dynamicFormFamily, dynamicFormBuliderFamily,
        UploadDocIds, IsUpload, uploadFormBuilder) {

        dynamicFormB.forEach(item => {
            dynamicFormA.push(item);
        });
        dynamicFormC.forEach(item => {
            dynamicFormA.push(item);
        });

        dynamicFormCarer.forEach(item => {
            dynamicFormA.push(item);
        });
        dynamicFormFamily.forEach(item => {
            dynamicFormA.push(item);
        });
        this.objCarerInfo.PersonalInfo.DateOfBirth = this.module.GetDateSaveFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
        this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.module.GetDateSaveFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);

        this.isPCDirty = true;
        if (CompareStaticValue(this.objCarerInfo, this.objCarerInfoOG)
          &&
            CompareSaveasDraft(this.dynamicformcontrol, this.dynamicformcontrolOG)
        ) {
            this.isPCDirty = false;
        }

        this.isSCDirty = true;
        if (this.Jointapplicant && CompareStaticValue(this.objCarerInfoSA, this.objCarerInfoSAOG)
        ) {
            this.isSCDirty = false;
        }

        if (this.isPCDirty || (IsUpload && uploadFormBuilder.valid) || (this.Jointapplicant && this.isSCDirty)) {
            this.isLoadingSAD = true;
            this.isSaving=true;
            this.objCarerInitialHomeVisitInfoNewDTO.CarerInfoPC = this.objCarerInfo;
            if (this.Jointapplicant) {
                this.objCarerInitialHomeVisitInfoNewDTO.IsScCarer = true;
                this.objCarerInitialHomeVisitInfoNewDTO.CarerInfoSC = this.objCarerInfoSA;
            }
            else {
                this.objCarerInitialHomeVisitInfoNewDTO.IsScCarer = false;
                this.objCarerInitialHomeVisitInfoNewDTO.CarerInfoSC = this.objCarerInfo;
            }
            this.objCarerInitialHomeVisitInfoNewDTO.DynamicValue = dynamicFormA;
            this.objCarerInitialHomeVisitInfoNewDTO.CarerParentId = this.CarerParentId;
            this.objCarerInitialHomeVisitInfoNewDTO.dynamicformcontrol = this.dynamicformcontrol;

            this.submitted = false;
            let userId: number = parseInt(Common.GetSession("UserProfileId"));
            this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.CreatedUserId = userId;
            this.objSaveDraftInfoDTO.UpdatedUserId = userId;
            this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.objCarerInitialHomeVisitInfoNewDTO);
            this.objSaveDraftInfoDTO.JsonList = JSON.stringify(this.objCarerInitialHomeVisitInfoNewDTO);
            this.objSaveDraftInfoDTO.SequenceNo = this.CarerParentId;
            this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, "Save", IsUpload));
        }
        else {
            this.objCarerInfo.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
            this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
            this.saveAsDraftText=Common.GetSaveasDraftText;
            this.isLoadingSAD = true;
            this.showAutoSave = false;

            if (this.skipAlert && this.IsNewOrSubmited == 1)
                this.module.alertWarning(Common.GetNoChangeAlert);
            else if (this.skipAlert && this.IsNewOrSubmited == 2)
                this.module.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
            this.skipAlert = true;
            this.isLoadingSAD = false;
        }
    }

    private ResponeDraft(data, type, IsUpload) {
        this.isLoadingSAD = false;
        this.isSaving=false;
        this.saveAsDraftText=Common.GetSaveasDraftText;
        if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.objCarerInfoOG = deepCopy<any>(this.objCarerInfo);
            if (this.Jointapplicant)
                this.objCarerInfoSAOG = deepCopy<any>(this.objCarerInfoSA);
            this.dynamicformcontrolOG = deepCopy<any>(this.dynamicformcontrol);
        }
        this.objCarerInfo.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfo.PersonalInfo.DateOfBirth);
        this.objCarerInfoSA.PersonalInfo.DateOfBirth = this.module.GetDateEditFormat(this.objCarerInfoSA.PersonalInfo.DateOfBirth);
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.CarerParentId);
                }
                if (this.showAlert)
                    this.module.alertSuccess(Common.GetSaveDraftSuccessfullMsg);
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.CarerParentId);
                }
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
        this.st.newTimer('cInitialHomeVisiAutoSave', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('cInitialHomeVisiAutoSave', () => this.timer2callback());
            this.timer2button = 'Unsubscribe';

        }
    }
    SequenceNo;
    timer2callback() {
        //this.counter2++;
        if(!this.isSaving)
        {
        if (this.accessAutoSave && (this.isReadOnly == "0" || this.isReadOnly == null)) {
            if (this.isFirstTime) {
                this.showAutoSave = true;
                let event = new MouseEvent('click', { bubbles: true });
                if (!this.showbtnSaveDraft) {
                    this.showAlert = false;
                    this.saveDraftText = "Record auto-saved @";
                    this.skipAlert = false;
                    this.objCarerInitialHomeVisitInfo.IsSubmitted = false;
                    this.submitText=Common.GetAutoSaveProgressText;
                    this.btnSubmit.fnClick();
                }
                else {
                    this.skipAlert = false;
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
    }
    ngOnDestroy() {
        this.st.delTimer('cInitialHomeVisiAutoSave');
    }

    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateCarerInitialHomeVisitPDF/" + this.CarerCode + "," + this.CarerParentId + "," + this.CarerParentId + "," + this.AgencyProfileId;
    }
    fnDonloadWord() {
        window.location.href = this.apiURL + "GenerateCarerInitialHomeVisitWord/" + this.CarerCode + "," + this.CarerParentId + "," + this.CarerParentId + "," + this.AgencyProfileId;
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateCarerInitialHomeVisitPrint", this.CarerCode + "," + this.CarerParentId + "," + this.CarerParentId + "," + this.AgencyProfileId).then(data => {
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
            this.isLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.CarerCode + "," + this.CarerParentId + "," + this.CarerParentId + "," + this.AgencyProfileId;
            this.apiService.post("GeneratePDF", "EmailCarerInitialHomeVisit", this.objNotificationDTO).then(data => {
                if (data == true)
                    this.module.alertSuccess("Email Send Successfully..");
                else
                    this.module.alertDanger("Email not Send Successfully..");
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
