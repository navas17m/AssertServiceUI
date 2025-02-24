
import { Component, Pipe, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { PlacementContactDTO} from './DTO/placementcontactdto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNames } from '../configtablenames'
import { ConfigTableNamesDTO} from '../superadmin/DTO/configtablename'
import { Contact, ContactVisible } from '../contact/contact'

@Component({
    selector: 'PlacementContact',
    templateUrl: './placementcontactdata.component.template.html',
})

export class PlacementContactComponent {
    objContactVisible: ContactVisible = new ContactVisible();
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objPlacementContactDTO: PlacementContactDTO = new PlacementContactDTO();
    lstJobTitle = [];
    submitted = false; SequenceNo;
    _Form: FormGroup;
    objQeryVal;
    LocalAuthorityList = [];
    AgencyProfileId: number;
    controllerName = "PlacementContact";
    isLoading = false;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {

        this.setVisible();
        this.route.params.subscribe(data => this.objQeryVal = data);

        this.SequenceNo = this.objQeryVal.id;
        this.objPlacementContactDTO.PlacementContactInfoId = this.SequenceNo;

        if (this.SequenceNo > 0) {
            apiService.get(this.controllerName, "GetById", this.objQeryVal.id).then(data => {
                this.objPlacementContactDTO = data;
            });
        }
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.JobTitle;
       
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => {
            this.lstJobTitle = data;
        });

        this.apiService.get("LocalAuthority", "getall", this.AgencyProfileId).then(data => { this.LocalAuthorityList = data });

        this._Form = _formBuilder.group({
            LocalAuthorityId: ['0', Validators.required],
            FirstName: ['', Validators.required],
            LastName: [],
            JobTitleId:['0']
        });
    }

    setVisible() {
        //Set Conact Info Visible
        this.objContactVisible.HomePhoneMandatory = false;
        this.objContactVisible.EmailIdMandatory = false;
        this.objContactVisible.AddressLine1Mandatory = false;

        this.objContactVisible.CityVisible = false;
        this.objContactVisible.OfficePhoneVisible = false;
        this.objContactVisible.PostalCodeVisible = false;
        this.objContactVisible.AddressLine2Visible = false;
        this.objContactVisible.AlternativeEmailIdVisible = false;
        this.objContactVisible.EmergencyContactVisible = false;
        this.objContactVisible.MobilePhoneVisible = false;
        this.objContactVisible.FaxVisible = false;
        this.objContactVisible.CountryIdVisible = false;
        this.objContactVisible.CountyIdVisible = false;

    }
    clicksubmit(mainFormBuilder, ConatactInfoformbuilder) {
        this.submitted = true;
        if (!mainFormBuilder.valid) {
            this.modal.GetErrorFocus(mainFormBuilder);
        }
        else if (!ConatactInfoformbuilder.valid) {
            this.modal.GetErrorFocus(ConatactInfoformbuilder);
        }

        if (mainFormBuilder.valid && ConatactInfoformbuilder.valid) {
            this.isLoading = true;

            let type = "save";
            if (this.SequenceNo > 0)
                type = "update";
          //  this.objPlacementContactDTO.DynamicValue = dynamicFormVal;
            this.apiService.save(this.controllerName, this.objPlacementContactDTO, type).then(data => this.Respone(data, type));
        }

    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            this._router.navigate(['/pages/child/placementcontactlist/4']);
        }
    }
}