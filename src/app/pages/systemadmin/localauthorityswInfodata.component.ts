import { Component, Pipe } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { ContactVisible } from '../contact/contact';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { LocalAuthoritySWInfoIdDTO } from './DTO/localauthorityswInfodto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

//.@Pipe({ name: 'groupBy' })
@Component({
        selector: 'localauthorityswInfodata',
        templateUrl: './localauthorityswInfodata.component.template.html',
})

export class LocalAuthoritySWInfoDataComponent{
    objLocalAuthoritySWInfoIdDTO: LocalAuthoritySWInfoIdDTO = new LocalAuthoritySWInfoIdDTO();
    submitted = false;  
    _localauthorityswForm: FormGroup;
    isVisibleMandatortMsg;       
    objQeryVal;
    contactVal1;
    LocalAuthoritySWId;
    insContactVisible: ContactVisible = new ContactVisible();
    AgencyProfileId: number;
    isLoading: boolean = false;
    controllerName = "LocalAuthoritySWInfo";
    lstLocalAuthority = [];
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=13;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objLocalAuthoritySWInfoIdDTO.AgencyProfileId = this.AgencyProfileId;
     
        this.LocalAuthoritySWId = this.objQeryVal.Id;
        if (this.LocalAuthoritySWId != 0 && this.LocalAuthoritySWId != null) {
            this.apiService.get(this.controllerName, "GetById", this.LocalAuthoritySWId).then(data => { this.ResponeVal(data) });
            //cdlServics.getLocalAuthoritySWInfoById(this.LocalAuthoritySWId).then(data => { this.ResponeVal( data) });
        }

        this.apiService.get("LocalAuthority", "GetAll", this.AgencyProfileId).then(data => this.lstLocalAuthority = data);

        this._localauthorityswForm = _formBuilder.group
           ({
            LocalAuthoritySWName: ['', Validators.required],
            EDTNumber: [''],
            LocalAuthorityId:['0'],
            });
       this.insContactVisible.AlternativeEmailIdVisible = false;
       this.insContactVisible.CountryIdVisible = false;
       this.insContactVisible.CountyIdVisible = false;
       this.insContactVisible.EmergencyContactVisible = false;
       this.insContactVisible.FaxVisible = false;
       this.insContactVisible.OfficePhoneVisible = false;
       this.insContactVisible.HomePhoneMandatory = false;
       this.insContactVisible.PostalCodeVisible = false;
       this.insContactVisible.CityVisible = false;
       this.insContactVisible.AddressLine2Visible = false;
       this.insContactVisible.MobilePhoneMandatory = false;

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

    LocalAuthoritySWSubmit(_localauthorityswForm, ContactInfo, formbuilder): void {
        this.submitted = true;

        if (!_localauthorityswForm.valid) {
            this.modal.GetErrorFocus(_localauthorityswForm);
        } else if (!formbuilder.valid) {
            this.modal.GetErrorFocus(formbuilder);
        }

        if (_localauthorityswForm.valid && formbuilder.valid) {
            this.isLoading = true;
            let type = "save";
            if (this.LocalAuthoritySWId>0)
                type = "update"
            this.objLocalAuthoritySWInfoIdDTO.UserId = 3;
            this.objLocalAuthoritySWInfoIdDTO.ContactInfo = ContactInfo;
            this.apiService.save(this.controllerName, this.objLocalAuthoritySWInfoIdDTO, type).then(data => this.Respone(data, type));
            //this.cdlServics.post(this.objLocalAuthoritySWInfoIdDTO, type).then(data => this.Respone(data, type));
        }
    }

    private ResponeVal(LAuthoritySW: LocalAuthoritySWInfoIdDTO) {
        if (LAuthoritySW != null) {
            this.objLocalAuthoritySWInfoIdDTO = LAuthoritySW;
            this.contactVal1 = LAuthoritySW.ContactInfo;
        }
    }

    private Respone(data, type) {      
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);                
            }
            else {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.objQeryVal.id;
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
            this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/systemadmin/localauthorityswlist/1']);
        }
    }
}