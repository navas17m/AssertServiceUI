import { Component, Input, ViewChild,ElementRef,Renderer2, OnInit, Injectable, Directive, Pipe, EventEmitter, Output} from '@angular/core';
import { Location} from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ContactComponet } from '../contact/contact.component';
import {  PhysicianInfo } from './DTO/physicianinfo';
import { Common} from '../common'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ConfigTableNames } from '../configtablenames'
import { ConfigTableNamesDTO} from '../superadmin/DTO/configtablename'
import { ContactVisible } from '../contact/contact'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

@Component({
    selector: 'physicianinfo',
    templateUrl: './physicianinfo.component.template.html',
})

export class PhysicianInfoComponet {
    @ViewChild('btnValidation') DuplicateValidation: ElementRef;
    @Output() Click: EventEmitter<any> = new EventEmitter();
    objContactVisible: ContactVisible = new ContactVisible();
    objConfigTableNames: ConfigTableNames = new ConfigTableNames();
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    submitted = false;
    objPhysicianInfo: PhysicianInfo = new PhysicianInfo();
    PhysicianInfoId;
    contactval1;
    AgencyProfileId: number;
    objQueryVal;
    PhysicianTypeList = [];
    _PhysicianInfoForm: FormGroup;
    isLoading: boolean = false;
    controllerName = "PhysicianInfo";
    @Input() showWidgetControls:boolean = true;

    insTypeId = 0;
    @Input()
    set TypeId(value) {
        if (value != null && value != '') {
            this.objPhysicianInfo = new PhysicianInfo();
            this.insTypeId = value;
        }
    }

    constructor(private apiService: APICallService, _formBuilder: FormBuilder, private route: ActivatedRoute, private _router: Router,
        private location: Location, private modal: PagesComponent, private renderer:Renderer2) {

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.PhysicianSpecialisation;
        apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.PhysicianTypeList = data; });
        this.route.params.subscribe(data => this.objQueryVal = data);
        this.objPhysicianInfo.AgencyProfileId = this.AgencyProfileId;;
        this.objPhysicianInfo.PhysicianInfoId = this.objQueryVal.Id;

        if (this.objPhysicianInfo.PhysicianInfoId > 0) {
            apiService.get(this.controllerName, "GetById", this.objPhysicianInfo.PhysicianInfoId).then(data => this.ResponeVal(data));
        }

        this._PhysicianInfoForm = _formBuilder.group
            ({
                PhysicianName: ['', Validators.required],
                PhysicianTypeId: ['0', Validators.required],
                //// AddtoSiblingsRecord: [],
                ///  AddtoParentorChildRecord: []
            });
        this.SetVisible();
    }

    SetVisible() {
        //Set Conact Info Visible
        this.objContactVisible.AddressLine2Visible = false;
        this.objContactVisible.EmailIdMandatory = false;
        this.objContactVisible.MobilePhoneMandatory = false;
        this.objContactVisible.EmergencyContactVisible = false;
        this.objContactVisible.OfficePhoneVisible = false;
        this.objContactVisible.AlternativeEmailIdVisible = false;
        this.objContactVisible.EmergencyContactMandatory = false;
        // this.objContactVisible.PostalCodeVisible = false;
        this.objContactVisible.HomePhoneMandatory = false;
    }

    private ResponeVal(PInfo: PhysicianInfo) {
        if (PInfo != null) {
            this.objPhysicianInfo = PInfo;
            this.contactval1 = PInfo.ContactInfo;
        }
    }

    //btn Submit
    PhysicianInfoSubmit(_PhysicianInfoForm, ContactInfo, formbuilder) {
        this.submitted = true;

        if (!_PhysicianInfoForm.valid) {
            this.modal.GetErrorFocus(_PhysicianInfoForm);
        }
        else if (!formbuilder.valid) {
            this.modal.GetErrorFocus(formbuilder);
        }

        if (_PhysicianInfoForm.valid && formbuilder.valid) {
            this.isLoading = true;
            let type = "save";
            if (this.objQueryVal.Id != 0 && this.insTypeId != 1)
             {
                type = "update";
                this.objPhysicianInfo.PhysicianInfoId = this.objQueryVal.Id;
                this.objPhysicianInfo.ContactInfo = ContactInfo;
                this.apiService.save(this.controllerName, this.objPhysicianInfo, type).then(data => this.Respone(data));
             }
             else
             {
                this.objPhysicianInfo.PhysicianInfoId = this.objQueryVal.Id;
                this.objPhysicianInfo.ContactInfo = ContactInfo;
                this.apiService.post(this.controllerName,"IsValidSave", this.objPhysicianInfo).then(data =>{
                    //console.log(data);
                    if(data.IsError)
                    {
                        let event = new MouseEvent('click', { bubbles: true });
                        this.DuplicateValidation.nativeElement.dispatchEvent(event);
                    }
                    else
                    {
                        this.apiService.save(this.controllerName, this.objPhysicianInfo, type).then(data => this.Respone(data));
                    }
                });

             }
        }
    }

    private Respone(data) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (this.objQueryVal.Id == 0 || this.insTypeId == 1) {
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else if (this.objQueryVal.Id != 0) {
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            if (this.insTypeId == 1) {
                this.submitted = false;
                this.objPhysicianInfo = new PhysicianInfo();
                this.Click.emit(null);
            }
            else  {
                this._router.navigate(['/pages/child/physicianinfolist/4']);
            }
        }
    }


    clickContinue()
    {
        this.apiService.save(this.controllerName, this.objPhysicianInfo, "save").then(data => this.Respone(data));
    }

    clickClose()
    {
        this.submitted=false;
        this.isLoading=false;
    }
}

