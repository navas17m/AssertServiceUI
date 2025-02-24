import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ContactValidator } from '../validator/contact.validator';
import { CarerInitialInterestInfo } from './DTO/carerinterestinfo';

@Component({
    selector: 'carerinterestinfo',
    templateUrl: './carerinterestinfo.component.template.html',
    styles: [`.ng-valid[required] {
      border-left: 5px solid #42A948; /* green */
}

 label +.ng-invalid {
  border-left: 5px solid #a94442; /* red */
}`]
})

export class CarerInterestInfoComponet {
    controllerName = "CarerInitialInterestInfo";
    submitted = false;
    objCarerInfo: CarerInitialInterestInfo = new CarerInitialInterestInfo();
    CarerInitialInterestId = null;
    respoError;
    isVisibleMandatortMsg
    _carerinterestForm: FormGroup;
    AgencyProfileId: number;

    constructor(private _router: Router, _formBuilder: FormBuilder,
        private module: PagesComponent, private apiService: APICallService, private location:Location) {

        //Set Agency Profile Id
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objCarerInfo.AgencyProfile.AgencyProfileId = this.AgencyProfileId;

        //validators
        this._carerinterestForm = _formBuilder.group({
            FirstName: ['', [Validators.required]],
            LastName: ['', [Validators.required]],
            PhoneNumber: ['', [ContactValidator.validatePhoneNumber]],
            Email: ['', [Validators.required, ContactValidator.validateEmail]],
            AddressLine1: ['', [Validators.required]],
            AddressLine2: ['', [Validators.required]],
            City: ['', [Validators.required]],
            PostalCode: ['', [ContactValidator.validatePhoneNumber]],
            SpareBedRoomCount: ['0', [Validators.required]],
            RelevantExperience: [''],
            options: [''],
            options1: [''],
            SourceOfMeadiumId: [''],
        })
    }

    carerinfoSubmit(_carerinterestForm) {
        this.submitted = true;
        if (_carerinterestForm.valid) {
            let type = "save";
           // this._Service.postCarerInterestInfo(this.objCarerInfo, type).then(data => this.Respone(data));
            this.apiService.save(this.controllerName, this.objCarerInfo, type).then(data => this.Respone(data));
        }
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
        }
    }

    public goBack(){
        this.location.back();
    }
}
