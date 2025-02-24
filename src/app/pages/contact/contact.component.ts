
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Common } from '../common';
import { ConfigTableNames } from '../configtablenames';
//import { ConfigTableValuesService } from '../services/configtablevalues.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { ContactValidator } from '../validator/contact.validator';
import { Contact, ContactVisible } from './contact';
import { APICallService } from '../services/apicallservice.service';

@Component({
    selector: 'contact',
    templateUrl: './contact.component.template.html',
//     styles: [`[required]  {
//         border-left: 5px solid blue;
//     }

//    .ng-valid[required], .ng-valid.required  {
//             border-left: 5px solid #42A948; /* green */
// }
//    label + .ng-invalid:not(form)  {
//         border-left: 5px solid #a94442; /* red */
// }`],
    providers: []
})


export class ContactComponet{
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objContactVisible: ContactVisible = new ContactVisible();
    @ViewChild('ngSelectCounty') ngSelectCounty:NgSelectComponent;
    @ViewChild('ngSelectCountry') ngSelectCountry:NgSelectComponent;

    // submitted = false;
    countryList;
    countyList;
    contactval: any;
    _contactForm: FormGroup;
    submitted = false;
    //Contact val
    @Input()
    set contactval1(cv: any) {
        this.contactval = (cv != null) ? cv : new Contact();
    }
    get contactval1(): any {
        return this.contactval;
    }

    //------formbuilder input
    @Input()
    set formbuilder(formbuilder: any) {
        this.submitted = formbuilder;
    }
    get formbuilder(): any { return this._contactForm; }

    @Input()
    set Visible(Visible: ContactVisible) {
        this.objContactVisible = Visible;
        this.getFormGroup(Visible);
    }
    get Visible(): ContactVisible { return this.objContactVisible; }

    @Input()
    get countyElement(): any { return this.ngSelectCounty; }
    @Input()
    get countryElement(): any { return this.ngSelectCountry; }

    //validators
    agencyId;
    constructor(_formBuilder: FormBuilder, private _http: HttpClient, private apiService: APICallService) {
        this.agencyId = Common.GetSession("AgencyProfileId");
        this.objConfigTableNamesDTO.AgencyProfileId = this.agencyId;

        this.objConfigTableNamesDTO.Name = ConfigTableNames.County;
        //ctvServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.countyList = data; })
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.countyList = data; })
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Country;
        //ctvServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.countryList = data; })
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.countryList = data; })

        //   if (this.contactval.CountryId == null || this.contactval.CountryId == 0)
        //       this.contactval.CountryId = 270;

        //this._contactForm = _formBuilder.group({
        //    City: ['', [Validators.required]],
        //    HomePhone: ['', [Validators.required, ContactValidator.validatePhoneNumber]],
        //    OfficePhone: ['', [Validators.required, ContactValidator.validatePhoneNumber]],
        //    MobilePhone: ['', [Validators.required, ContactValidator.validatePhoneNumber]],
        //    Fax: ['', ContactValidator.validatePhoneNumber],
        //    EmailId: ['', [Validators.required, ContactValidator.validateEmail]],
        //    AlternativeEmailId: ['', [Validators.required, ContactValidator.validateEmail]],
        //    CountryId: [0, Validators.required],
        //    CountyId: [0, Validators.required],
        //    PostalCode: ['', [ContactValidator.validatePhoneNumber]],
        //    EmergencyContact: ['', [ContactValidator.validatePhoneNumber]],
        //    AddressLine1: ['', [Validators.required]],
        //    AddressLine2: [''],

        //})



        // this.contactval.CountyId = 0;
        //this.contactval.CountryId = 0;
    }

    getFormGroup(objVisible: ContactVisible) {

        let group: any = {};

        if (this.objContactVisible.AddressLine1Visible) {
            group['AddressLine1'] = this.objContactVisible.AddressLine1Mandatory ? new FormControl('', [Validators.maxLength(300), Validators.required])
                : new FormControl('',[Validators.maxLength(300)]);
        }

        if (this.objContactVisible.AddressLine2Visible) {
            group['AddressLine2'] = this.objContactVisible.AddressLine2Mandatory ? new FormControl('', [Validators.maxLength(200), Validators.required])
                : new FormControl('', [Validators.maxLength(200)]);
        }

        if (this.objContactVisible.CityVisible) {
            group['City'] = this.objContactVisible.CityMandatory ? new FormControl('', Validators.required) :
                new FormControl('');
        }

        if (this.objContactVisible.HomePhoneVisible) {
            group['HomePhone'] = this.objContactVisible.HomePhoneMandatory ? new FormControl('',
                [Validators.required,  Validators.minLength(10), Validators.maxLength(50)])
                : new FormControl('', [Validators.minLength(10), Validators.maxLength(50)]);
        }

        if (this.objContactVisible.OfficePhoneVisible) {
            group['OfficePhone'] = this.objContactVisible.OfficePhoneMandatory ? new FormControl('', [Validators.required,Validators.minLength(10), Validators.maxLength(20)])
                : new FormControl('', [Validators.minLength(10), Validators.maxLength(20)]);
        }


        if (this.objContactVisible.MobilePhoneVisible) {
            group['MobilePhone'] = this.objContactVisible.MobilePhoneMandatory ? new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)])
                : new FormControl('', [Validators.minLength(10), Validators.maxLength(20)]);
        }


        //if (this.objContactVisible.FaxVisible) {
        //    //console.log(this.objContactVisible.FaxVisible);
        //    //console.log(this.objContactVisible.FaxMandatory);
        //    group['Fax'] = this.objContactVisible.FaxMandatory ? new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(14)])
        //        : new FormControl('');
        //}

        if (this.objContactVisible.EmailIdVisible) {
            group['EmailId'] = this.objContactVisible.EmailIdMandatory ? new FormControl('', [Validators.required, ContactValidator.validateEmail])
                : new FormControl('');
        }

        if (this.objContactVisible.AlternativeEmailIdVisible) {
            group['AlternativeEmailId'] = this.objContactVisible.AlternativeEmailIdMandatory ? new FormControl('', [Validators.required, ContactValidator.validateEmail])
                : new FormControl('', [ContactValidator.validateEmail]);
        }

        if (this.objContactVisible.CountyIdVisible) {
            group['CountyId'] = this.objContactVisible.CountyIdMandatory ? new FormControl('0', Validators.required)
                : new FormControl('0');
        }

        if (this.objContactVisible.CountryIdVisible) {
            group['CountryId'] = this.objContactVisible.CountryIdMandatory ? new FormControl('0', Validators.required)
                : new FormControl('0');
        }



        if (this.objContactVisible.PostalCodeVisible) {
            group['PostalCode'] = this.objContactVisible.PostalCodeMandatory ? new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(10)])
                : new FormControl('');
        }

        if (this.objContactVisible.EmergencyContactVisible) {
            group['EmergencyContact'] = this.objContactVisible.EmergencyContactMandatory ? new FormControl('', [ Validators.minLength(10), Validators.maxLength(20)])
                : new FormControl('', [Validators.minLength(10), Validators.maxLength(20)]);
        }



        this._contactForm = new FormGroup(group);

        //  this.changeEve("", "");
    }


    submit(form) {
        this.submitted = true;
    }


    btnsubmit() {

    }

}
