import { Component, Input, OnInit, Injectable, Directive, Pipe} from '@angular/core';
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Common} from '../common'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ContactVisible, Contact } from '../contact/contact'
import { PagesComponent } from '../pages.component';
import { HospitalInfoDTO } from './DTO/hospitalinfodto'
import { APICallService } from '../services/apicallservice.service';
@Component({
    selector: 'HospitalInfo',
    templateUrl: './hospitalinfodata.component.template.html',
})

export class HospitalInfoDataComponet {
    objContactVisible: ContactVisible = new ContactVisible();
    submitted = false;
    objHospitalInfoDTO: HospitalInfoDTO = new HospitalInfoDTO();
    HospitalInfoId;
    AgencyProfileId: number;
    objQueryVal;
    _Form: FormGroup;
    IsLoading = false;
    controllerName = "HospitalInfo"; 
    constructor(private apiService: APICallService,_formBuilder: FormBuilder, private route: ActivatedRoute, private _router: Router,
         private modal: PagesComponent) {

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objHospitalInfoDTO.AgencyProfileId = this.AgencyProfileId;
        this.route.params.subscribe(data => this.objQueryVal = data);

        if (this.objQueryVal.id > 0)
            this.apiService.get(this.controllerName, "GetById", this.objQueryVal.id).then(data => this.objHospitalInfoDTO = data);


        //hiServices.GetHospitalInfoById(this.objQueryVal.id).then(data => this.objHospitalInfoDTO = data);

        this._Form = _formBuilder.group({
            HospitalName: ['', Validators.required],
        });

        this.SetVisible();
    }


    SetVisible() {
        //Set Conact Info Visible
        this.objContactVisible.AddressLine2Visible = false;
        this.objContactVisible.EmailIdMandatory = false;
        this.objContactVisible.MobilePhoneVisible = false;
        this.objContactVisible.EmergencyContactVisible = false;
        this.objContactVisible.HomePhoneVisible = false;
        this.objContactVisible.AlternativeEmailIdVisible = false;
        this.objContactVisible.EmergencyContactMandatory = false;
        this.objContactVisible.PostalCodeMandatory = false;
        this.objContactVisible.CountyIdMandatory = false;
    }


    //btn Submit
    submit(ContactInfoVal, ContactInfoForm) {
        this.submitted = true;

        if (!this._Form.valid)
            this.modal.GetErrorFocus(this._Form)
        else if (!ContactInfoForm.valid)
            this.modal.GetErrorFocus(ContactInfoForm)

        if (this._Form.valid && ContactInfoForm.valid) {
            this.IsLoading = true;
            let type = "save";
            if (this.objQueryVal.id != 0)
                type = "update";

            this.objHospitalInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objHospitalInfoDTO.HospitalInfoId = this.objQueryVal.id;
            this.objHospitalInfoDTO.ContactInfo = ContactInfoVal;

            this.apiService.save(this.controllerName, this.objHospitalInfoDTO, type).then(data => this.Respone(data));            
        }
    }

    private Respone(data) {
        this.IsLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (this.objQueryVal.Id == 0) {
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else if (this.objQueryVal.Id != 0) {
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            this._router.navigate(['/pages/child/hospitalinfolist/4']);
        }
    }
}

