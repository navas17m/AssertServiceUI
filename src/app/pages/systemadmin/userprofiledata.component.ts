import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable,fromEvent,map } from 'rxjs';
//import 'rxjs/add/observable/fromEvent';
//import 'rxjs/add/operator/map';
import { Common } from '../common';
import { ContactVisible } from '../contact/contact';
import { PagesComponent } from '../pages.component';
import { PersonalInfoVisible } from '../personalinfo/personalinfo';
import { APICallService } from '../services/apicallservice.service';
import { AreaOfficeProfile } from './DTO/areaofficeprofile';
import { UserProfile } from './DTO/userprofile';
import { UserAreaOfficeMapping } from './DTO/userreaofficemapping';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

declare var $: any;
@Component({
    selector: 'userprofile',
    templateUrl: './userprofiledata.component.template.html',
})

export class UserProfileComponet implements AfterViewInit {
    objUserAreaOfficeMapping: UserAreaOfficeMapping = new UserAreaOfficeMapping();
    objUserProfile: UserProfile = new UserProfile();
    ObjAreaoff: AreaOfficeProfile = new AreaOfficeProfile();
    contactVal1;
    personalInfoVal1;
    UserType;
    tempUserTypelst;
    OriginalRoleProfile;
    RoleProfile;
    UserProfileId: any = 0;
    areaofficeList;
    IsVisible = true;
    submitted = false;
    lstAreaOfficeMapping = [];
    MandatoryAlert;
    _userForm: FormGroup;
    agencyId;
    objPersonalInfoVisible: PersonalInfoVisible = new PersonalInfoVisible();
    objContactVisible: ContactVisible = new ContactVisible();
    objQeryVal;
    IsAvailLoginId = false;
    isLoading: boolean = false;
    controllerName = "UserProfile";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=17;
    constructor(private apiService: APICallService, private activatedroute: ActivatedRoute,
        _formBuilder: FormBuilder, private _router: Router,
        private _http: HttpClient, private pComponent: PagesComponent) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.UserProfileId = this.objQeryVal.id;
        this.objUserProfile.UserProfileId = this.UserProfileId;
        this.objUserProfile.CheckTypeId = this.UserProfileId;

        if (this.objQeryVal.id == 0) {
            this._userForm = _formBuilder.group({
                UserTypeId: ['0', Validators.required],
                RoleProfileId: ['0', Validators.required],
                LoginId: ['', Validators.required],
                //  Password: ['', Validators.required],
                CanSeeAllChildren: [''],
                CanSeeAllCarer: [''],
                CanSeeAllEmployee: [''],
                IsShowDashboard: [''],
                //    IsItAreaOffice: ['']
            });
            // this.objUserProfile.CheckTypeId = 0;
        }
        else {
            // this.objUserProfile.CheckTypeId = 1;
            this._userForm = _formBuilder.group({
                UserTypeId: ['0', Validators.required],
                RoleProfileId: ['0', Validators.required],
                LoginId: ['', Validators.required],
                //      Password: [''],
                CanSeeAllChildren: [''],
                CanSeeAllCarer: [''],
                CanSeeAllEmployee: [''],
                IsShowDashboard: [''],
                //  IsItAreaOffice: ['']
            });
        }

        this.agencyId = Common.GetSession("AgencyProfileId");
        this.objUserProfile.AgencyProfile.AgencyProfileId = this.agencyId;

        //Bind User type
        this.apiService.get("UserTypeCnfg", "getall").then(data => {
            this.tempUserTypelst = data;
            this.UserType = data.filter(x => x.UserTypeId != 4);
        });
        //_utServices.getUserType().subscribe(data => {
        //    if (this.objQeryVal.id == 0)
        //        this.UserType = data.filter(x => x.UserTypeId != 4 && x.UserTypeId != 7);
        //    else
        //        this.UserType = data;
        //});

        //Bind Role Profile
        this.apiService.get("RoleProfile", "GetAll", this.agencyId).then(data => {
            this.RoleProfile = data.filter(data => data.RoleName != "Default_FosterCarer");
            this.OriginalRoleProfile = data
        });
        //_rpServices.getRoleProfiles(this.agencyId).subscribe(data => { this.RoleProfile = data; this.OriginalRoleProfile = data });

        this.bindAreOffice();
        this.BindEditData();
        this.SetContactUsVisible();

        if (Common.GetSession("ViweDisable") == '1') {
            this.objUserAuditDetailDTO.ActionId = 4;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
            this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
            this.objUserAuditDetailDTO.RecordNo = this.objQeryVal.id;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    SetContactUsVisible() {
        this.objContactVisible.HomePhoneMandatory = false;
        this.objContactVisible.OfficePhoneMandatory = false;
        this.objContactVisible.AlternativeEmailIdVisible = false;
        this.objContactVisible.AddressLine1Mandatory = false;
        this.objContactVisible.AddressLine2Visible = false;
        this.objContactVisible.EmergencyContactVisible = false;
        this.objContactVisible.PostalCodeMandatory = false;
        this.objContactVisible.CountryIdVisible = false;
        this.objContactVisible.CountyIdMandatory = false;
        this.objContactVisible.FaxMandatory = false;
        this.objContactVisible.MobilePhoneMandatory = false;
        this.objContactVisible.CityMandatory = false;
    }

    bindAreOffice() {
        //Bind Area office
        this.objUserAreaOfficeMapping.UserProfileId = this.UserProfileId;
        this.objUserAreaOfficeMapping.AgencyProfileId = this.agencyId;
        this.areaofficeList = null;
        this.apiService.post("UserAreaOfficeMapping", "GetByAgencyProfileId", this.objUserAreaOfficeMapping).then(data => {
            this.areaofficeList = data;
        });
        //this._aoffService.GetAreaOffByAgencyProfileId(this.objUserAreaOfficeMapping).subscribe(data => {
        //    this.areaofficeList = data;
        //    //  console.log(data);
        //});
    }

    updateAreaoffMappingChecked(value, aroffId) {
        let update = this.areaofficeList.filter(x => x.AreaOfficeProfileId == aroffId);
        if (update.length > 0) {
            this.areaofficeList.find(x => x.AreaOfficeProfileId == aroffId).IsActive = value;
        }
    }

    exists(AreaOfficeProfileId, item) {
        let temp = this.areaofficeList.filter(data => data.AreaOfficeProfileId == AreaOfficeProfileId && data.IsActive == true);
        if (temp != null) {
            item.IsActive = true;
        }
    }

    userTypeChange(val, type) {
        if (type == 1)
            this.objUserProfile.RoleProfile.RoleProfileId = null;
        if (val == 4) {
            this.RoleProfile = this.OriginalRoleProfile.filter(data => data.RoleName == "Default_FosterCarer");
        }
        else if (val == 9) {
            this.RoleProfile = this.OriginalRoleProfile.filter(data => data.RoleName == "Default_Panel");
        }
        else {
            this.RoleProfile = this.OriginalRoleProfile.filter(data => data.RoleName != "Default_Panel" && data.RoleName != "Default_FosterCarer");
        }
    }


    BindEditData() {
        //get edit data from db
        if (this.UserProfileId != 0 && this.UserProfileId != null) {
            this.apiService.get(this.controllerName, "GetById", this.UserProfileId).then(data => {
                this.objUserProfile = data;
                this.contactVal1 = data.ContactInfo
                this.personalInfoVal1 = data.PersonalInfo;
                this.objUserProfile.AgencyProfile = data.AgencyProfile;

                if (this.objUserProfile.UserTypeCnfg.UserTypeId == 4) {
                    this.UserType = [];
                    this.UserType = this.tempUserTypelst.filter(x => x.UserTypeId == this.objUserProfile.UserTypeCnfg.UserTypeId);
                    //if (tempUserType.length > 0) {
                    //    this.UserType = [];
                    //    console.log(tempUserType);
                    //    this.UserType = tempUserType[0];
                    //}

                    var $input = $('#UserTypeId,#IsShowDashboard,#RoleProfileId');
                    $input.attr("disabled", true);
                }
                var $input1 = $('#LoginId');
                $input1.attr("disabled", true);
                this.userTypeChange(this.objUserProfile.UserTypeCnfg.UserTypeId, 0);
            });

            //this._upService.getById(this.UserProfileId).then(data => {
            //    this.objUserProfile = data;
            //    this.contactVal1 = data.ContactInfo
            //    this.personalInfoVal1 = data.PersonalInfo;
            //    this.objUserProfile.AgencyProfile = data.AgencyProfile;

            //    if (this.objUserProfile.UserTypeCnfg.UserTypeId == 7 || this.objUserProfile.UserTypeCnfg.UserTypeId == 4) {
            //        var $input = $('#UserTypeId,#IsShowDashboard');
            //        $input.attr("disabled", true);
            //    }
            //});
            //Hide password when edit the data
            this.IsVisible = false;
        }
    }

    //btn Submit
    userprofileSubmit(_userForm, ContactInfo, PersonalInfo, contactForm, personalInfoForm): void {
        this.submitted = true;
        if (!_userForm.valid) {
            this.pComponent.GetErrorFocus(_userForm);
        } else if (!contactForm.valid) {
            this.pComponent.GetErrorFocus(contactForm);
        } else if (!personalInfoForm.valid) {
            this.pComponent.GetErrorFocus(personalInfoForm);
        }

        if (_userForm.valid && contactForm.valid && personalInfoForm.valid && !this.IsAvailLoginId) {
            this.isLoading = true;
            this.objUserProfile.UserAreaOfficeMapping = this.areaofficeList;
            this.objUserProfile.ContactInfo = ContactInfo;
            this.objUserProfile.PersonalInfo = PersonalInfo
            this.objUserProfile.AgencyProfile.DomainName = Common.GetSession("DomainName");
            this.objUserProfile.PersonalInfo.DateOfBirth = this.pComponent.GetDateSaveFormat(this.objUserProfile.PersonalInfo.DateOfBirth);
            let type = "save";
            if (this.UserProfileId != null && this.UserProfileId != 0)
                type = "update"
            this.objUserProfile.CreatedUserId = parseInt(Common.GetSession("UserProfileId"));
            this.objUserProfile.UpdatedUserId = parseInt(Common.GetSession("UserProfileId"));
            this.apiService.save(this.controllerName, this.objUserProfile, type).then(data => this.Respone(data));
            //this._upService.post(this.objUserProfile, type).then(data => this.Respone(data));
        }
    }

    private Respone(data) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
            this.lstAreaOfficeMapping = null;
        }
        else if (data.IsError == false) {
            if (this.UserProfileId == 0) {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.objQeryVal.id;
                this.pComponent.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
            this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/systemadmin/userprofilelist/1']);
        }
    }

    checknameavailrtnValue;
    @ViewChild('LoginId') cName: ElementRef;
    ngAfterViewInit() {

        // var $input = $('#LoginId');

        // this.checknameavailrtnValue = Observable.fromEvent<KeyboardEvent>($input, 'keyup')
        //     .map(e => { return e.currentTarget["value"]; })
        //     .filter(text => text.length >= 3)
        //     .debounceTime(500)
        //     .distinctUntilChanged()
        //     .flatMap(text => {
        //         this.objUserProfile.LoginId = text;
        //         this.objUserProfile.UserProfileId = this.UserProfileId;
        //         this.objUserProfile.CheckTypeId = this.UserProfileId;

        //         return this.apiService.post(this.controllerName, "CheckLoginIdAvailable", this.objUserProfile).then(data => { data; });
        //         //return this._http.post(Base.GetUrl() + '/api/UserProfile/CheckLoginIdAvailable', JSON.stringify(this.objUserProfile), Base.GetHeader())
        //         //    .map(resp => resp.json());
        //     });

        // this.checknameavailrtnValue.subscribe(data => { this.IsAvailLoginId = data; });
    }
}


