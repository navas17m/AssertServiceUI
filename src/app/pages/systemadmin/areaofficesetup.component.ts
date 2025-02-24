import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { ContactVisible } from '../contact/contact';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { AreaOfficeSetup } from './DTO/areaofficesetup';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'areaofficesetup',
    templateUrl: './areaofficesetup.component.template.html',    
})

export class AreaOfficeSetupComponet {
    MandatoryAlert;
    submitted = false;
    objAreaoffice: AreaOfficeSetup = new AreaOfficeSetup();
    AreaOfficeProfileId
    contactval1;
    _areaoffficeForm: FormGroup;
    objContactVisible: ContactVisible = new ContactVisible();
    objQeryVal;
    AgencyProfileId;
    isLoading: boolean = false;
    controllerName = "AreaOfficeProfile";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=7;
    constructor(private apiService: APICallService, private activatedroute: ActivatedRoute, _formBuilder: FormBuilder,
                private _router: Router, private pComponent: PagesComponent) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.AgencyProfileId = Common.GetSession("AgencyProfileId");
        this._areaoffficeForm = _formBuilder.group({
            AreaOfficeName: ['', Validators.required]
        });

        //get edit data from db
        this.AreaOfficeProfileId = this.objQeryVal.id;
        if (this.AreaOfficeProfileId != 0 && this.AreaOfficeProfileId != null) {
            this.apiService.get(this.controllerName, "GetById", this.AreaOfficeProfileId).then(data => this.ResponeVal(data));
            //_areaofficesetupService.getAreaofficeById(this.AreaOfficeProfileId).then(data => this.ResponeVal(data));
        }

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
        this.objContactVisible.CityMandatory = false;
        this.objContactVisible.OfficePhoneMandatory = false;
        this.objContactVisible.EmailIdMandatory = false;
        this.objContactVisible.PostalCodeMandatory = false;
        this.objContactVisible.AddressLine2Visible = false;
        this.objContactVisible.AlternativeEmailIdVisible = false;
        this.objContactVisible.EmergencyContactVisible = false;
        this.objContactVisible.HomePhoneMandatory = false;
        this.objContactVisible.MobilePhoneMandatory = false;
        this.objContactVisible.FaxMandatory = false;
        this.objContactVisible.CountryIdMandatory = false;
        this.objContactVisible.CountyIdMandatory = false;
    }

    private ResponeVal(aOffice: AreaOfficeSetup) {
        if (aOffice != null) {
            this.objAreaoffice = aOffice;
            this.contactval1 = aOffice.ContactInfo;
        }
    }

    //btn Submit
    areaofficesetupSubmit(_areaoffficeForm, ContactInfo, ContactInfoBulider): void {
        this.submitted = true;

        if (!_areaoffficeForm.valid) {
            this.pComponent.GetErrorFocus(_areaoffficeForm);
        } else if (!ContactInfoBulider.valid) {
            this.pComponent.GetErrorFocus(ContactInfoBulider);
        }
        
        if (_areaoffficeForm.valid && ContactInfoBulider.valid) {            
            this.isLoading = true;
            this.objAreaoffice.ContactInfo = ContactInfo;
            let type = "save";
            if (this.AreaOfficeProfileId != 0)
                type = "update";
            else
                this.objAreaoffice.AgencyProfile.AgencyProfileId = this.AgencyProfileId;
            this.apiService.save(this.controllerName, this.objAreaoffice, type).then(data => this.Respone(data));
            //this._areaofficesetupService.postAreaOfficeSetup(this.objAreaoffice, type).then(data => this.Respone(data));
        }
    }

    private Respone(data) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (this.AreaOfficeProfileId == 0) {
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
            this._router.navigate(['/pages/systemadmin/areaofficesetuplist/1']);
        }
    }
}