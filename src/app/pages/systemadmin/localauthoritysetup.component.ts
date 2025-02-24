import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { ContactVisible } from '../contact/contact';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { LocalAuthority } from './DTO/localauthority';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'localauthoritysetup',
    templateUrl: './localauthoritysetup.component.template.html',    
})

export class LocalAuthorityComponent {
    objLocalAuthority: LocalAuthority = new LocalAuthority();
    objContactVisible: ContactVisible = new ContactVisible();
    submitted = false;
    contactVal1;
    joinvalue = {};
    LocalAuthorityId = null;
    _localauthorityForm: FormGroup;
    MandatoryAlert;
    objQeryVal;
    isLoading: boolean = false;
    IsShowLAPayment: boolean = false; lstLAPaymentType;
    controllerName = "LocalAuthority";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=12;
    constructor(private apiService: APICallService, _formBuilder: FormBuilder, private pComponent: PagesComponent,
        private _router: Router, private activatedroute: ActivatedRoute) {

        if (Common.GetSession("UserProfileId") == "1")
            this.IsShowLAPayment = true;
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        this._localauthorityForm = _formBuilder.group
            ({
                LocalAuthorityName: ['', Validators.required],
                AccountRefference: ['', Validators.required],
                LAPaymentType:['0']
            });
        //get edit data from db

        this.LocalAuthorityId = this.objQeryVal.id;
        if (this.LocalAuthorityId != 0 && this.LocalAuthorityId != null) {
            this.apiService.get(this.controllerName, "GetById", this.LocalAuthorityId).then(data => { this.ResponeVal(data); });
            //_localauthorityservice.getLocalAuthorityById(this.LocalAuthorityId).then(data => { this.ResponeVal(data); });
        }
        this.SetContactUsVisible();
        this.fnLoadFinLAPaymentType();

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

    private ResponeVal(LAuthority: LocalAuthority) {
        if (LAuthority != null) {
            this.objLocalAuthority = LAuthority;
            this.contactVal1 = LAuthority.ContactInfo;
        }
    }

    fnLoadFinLAPaymentType()
    {
        this.apiService.get(this.controllerName, "GetAllFinLAPaymentTypeCnfg", Common.GetSession("AgencyProfileId")).then(data => {
            this.lstLAPaymentType = data;
        });
        //this._localauthorityservice.GetAllFinLAPaymentTypeCnfg(Common.GetSession("AgencyProfileId")).then(data => {
        //    this.lstLAPaymentType = data;
        //});        
    }

    SetContactUsVisible() {
        this.objContactVisible.HomePhoneVisible = false;
        this.objContactVisible.OfficePhoneMandatory = false;
        this.objContactVisible.EmailIdMandatory = false;
        this.objContactVisible.AlternativeEmailIdVisible = false;      
        this.objContactVisible.AddressLine2Visible = false;
        this.objContactVisible.EmergencyContactVisible = false;
        this.objContactVisible.PostalCodeVisible = false;
        this.objContactVisible.CountryIdVisible = false;
        this.objContactVisible.CountyIdVisible = false;
        this.objContactVisible.FaxMandatory = false;
        this.objContactVisible.MobilePhoneMandatory = false;
        this.objContactVisible.CityVisible = false;
    }

    //btn Submit
    LocalAuthoritySubmit(_localauthorityForm, ContactInfo, ContactForm): void {
        this.submitted = true;
        if (!_localauthorityForm.valid) {
            this.pComponent.GetErrorFocus(_localauthorityForm);
        } else if (!ContactForm.valid) {
            this.pComponent.GetErrorFocus(ContactForm);
        }

        if (_localauthorityForm.valid && ContactForm.valid) {
            this.isLoading = true;
            let type = "save";
            if (this.LocalAuthorityId != null && this.LocalAuthorityId != 0)
                type = "update"
            this.objLocalAuthority.ContactInfo = ContactInfo;
            this.objLocalAuthority.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.apiService.save(this.controllerName, this.objLocalAuthority, type).then(data => this.Respone(data, type));
            //this._localauthorityservice.postLocalAuthority(this.objLocalAuthority, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save")
            {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
            }                
            else if (type == "update")
            {
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
            this._router.navigate(['/pages/systemadmin/localauthoritylist/1']);
        }
    }
}