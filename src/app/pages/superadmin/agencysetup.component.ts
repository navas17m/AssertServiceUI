import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { ContactVisible } from '../contact/contact';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { AgencyProfile } from './DTO/agencyprofile';

@Component({
    selector: 'agencysetup',
    templateUrl: './agencysetup.component.template.html',
    styleUrls: ['../form-elements/inputs/image-uploader/image-uploader.component.scss'],
})

export class AgencySetupComponet {
    objContactVisible: ContactVisible = new ContactVisible();
    objAgencyProfile: AgencyProfile = new AgencyProfile();
    contactVal1
    joinvalue = {};
    AgencyProfileId = null;
    submitted = false;
    _agencyForm: FormGroup;
    MandatoryAlert; objQeryVal; lstCarerPaymentType;
    isLoading: boolean = false;
    controllerName = "AgencyProfile";

    constructor(private apiService: APICallService, _formBuilder: FormBuilder, private pComponent: PagesComponent,
        private activatedroute: ActivatedRoute, private _router: Router
        ) {

        this.activatedroute.params.subscribe(data => {
            this.objQeryVal = data;
        });

        //get edit data from db
        this.AgencyProfileId = this.objQeryVal.id;
        if (this.AgencyProfileId != 0 && this.AgencyProfileId != null) {
            this.apiService.get(this.controllerName, "GetById", this.AgencyProfileId).then(data => {
                this.ResponeVal(data);
                this.fnngAfterViewInit();
            });
            //_agencyService.getAgencyById(this.AgencyProfileId).then(data => {
            //    this.ResponeVal(data);
            //    this.fnngAfterViewInit();
            //});
        }

        this.apiService.get(this.controllerName, "GetAllFinCarerPaymentTypeCnfg", this.AgencyProfileId).then(data => {
            this.lstCarerPaymentType = data;
        });
        //_agencyService.GetAllFinCarerPaymentTypeCnfg(Common.GetSession("AgencyProfileId")).then(data => {
        //    this.lstCarerPaymentType = data;
        //});

        this._agencyForm = _formBuilder.group({
            AgencyName: ['', [Validators.required]],
            DomainName: ['', [Validators.required]],
            URNNumber: ['', [Validators.required]],
            InvoicePrefix: ['', [Validators.required]],
            CarerPaymentType: ['0', [Validators.required]],
            InvoiceAddress: [''],
            FCInvoiceNote: [''],
            LAInvoiceNote: [''],
        });
        this.SetContactUsVisible();
    }

    SetContactUsVisible() {
        this.objContactVisible.HomePhoneMandatory = false;
        this.objContactVisible.OfficePhoneMandatory = false;
        this.objContactVisible.EmailIdMandatory = false;
        this.objContactVisible.AlternativeEmailIdVisible = false;
        this.objContactVisible.AddressLine2Visible = false;
        this.objContactVisible.EmergencyContactVisible = false;
        this.objContactVisible.PostalCodeMandatory = false;
        this.objContactVisible.CountryIdVisible = false;
        this.objContactVisible.CountyIdMandatory = false;
        this.objContactVisible.FaxMandatory = false;
        this.objContactVisible.MobilePhoneMandatory = false;
    }

    private ResponeVal(agency: AgencyProfile) {
        if (agency != null) {
            this.objAgencyProfile = agency;
            this.contactVal1 = agency.ContactInfo;
        }
    }

    agencysetupSubmit(_agencyForm, ContactInfo, contactForm): void {
        this.submitted = true;
        if (!_agencyForm.valid) {
            this.pComponent.GetErrorFocus(_agencyForm);
        } else if (!contactForm.valid) {
            this.pComponent.GetErrorFocus(contactForm);
        }

        if (_agencyForm.valid && contactForm.valid) {
            this.isLoading = true;
            this.objAgencyProfile.ContactInfo = ContactInfo;

            let type = "save";
            if (this.objQeryVal.id != 0)
                type = "update"

            this.apiService.save(this.controllerName, this.objAgencyProfile, type).then(data => this.Respone(data, type));
            //this._agencyService.postAgencyProfile(this.objAgencyProfile, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save")
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
            else if (type == "update")
                this.pComponent.alertSuccess(Common.GetUpdateSuccessfullMsg);
            this._router.navigate(['/pages/superadmin/agencylist/1']);
        }
    }

    //Logo
    public image: any;
    showFileTooLarge = false;
    imageFile;
    reader = new FileReader();
    byteReader = new FileReader();
    fileChange(input) {
        if (input.files.length) {
            const file = input.files[0];
            // this.imageFile = input.files[0];
            if (file.size < 1000000) {
                this.showFileTooLarge = false;
                this.reader.onload = () => {
                    this.image = this.reader.result;
                    this.objAgencyProfile.LogoString = this.image.split(',')[1];
                }
                this.reader.readAsDataURL(file);
            }
            else {
                this.showFileTooLarge = true;
                this.image = '';
            }
        }
    }

    fnngAfterViewInit() {
        if (this.objAgencyProfile.Logold != null) {
            this.apiService.get("UploadDocuments", "GetImageById", this.objAgencyProfile.Logold).then(data => this.Response(data));
            //this.uploadServie.GetImageById(this.objAgencyProfile.Logold).then(data => this.Response(data));
        }
    }

    output; srcPath = "assets/img/app/noimage.png";
    fnUpload() {
    }

    //fnShow() {
    //    this.apiService.get(this.controllerName,"GetImageById",).then(data => this.Response(data));
    //    //this.uploadServie.GetImageById(13).then(data => this.Response(data));
    //}

    Response(data) {
        this.srcPath = "data:image/jpeg;base64," + data;
    }

    removeImage(): void {
        this.image = '';
    }
}
