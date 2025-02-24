import { Component } from '@angular/core';

@Component
    ({
        selector: 'FCCarerAddressHistoryData',
        template: `<CarerAddressHistoryData></CarerAddressHistoryData>`,
    })

export class FCCarerAddressHistoryDataComponent {

}
//import { APICallService } from '../services/apicallservice.service';
//import { Component, Pipe } from '@angular/core';
//import { Router, ActivatedRoute } from '@angular/router'
//import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
//import {Common}  from  '../common'
//import { PagesComponent } from '../pages.component'
////import { CarerAddressHistoryService } from '../services/careraddresshistory.service'
//import { CarerAddressHistoryDTO } from './DTO/careraddresshistorydto'
//import { ContactVisible} from '../contact/contact'
//@Component({
//    selector: 'CarerAddressHistoryData',
//    templateUrl: './careraddresshistorydata.component.template.html',
//})

//export class CarerAddressHistoryDataComponent {
//    controllerName = "CarerAddressHistory";
//    objCarerAddressHistoryDTO: CarerAddressHistoryDTO = new CarerAddressHistoryDTO();
//    submitted = false;
//    _Form: FormGroup;
//    objQeryVal;
//    CarerParentId: number;
//    isLoading: boolean = false;
//    LocalAuthorityList = [];
//    AgencyProfileId;
//    objContactVisible: ContactVisible = new ContactVisible();
//    constructor(private _formBuilder: FormBuilder,
//        private route: ActivatedRoute, private _router: Router, private module: PagesComponent, private apiService: APICallService) {

//        this.route.params.subscribe(data => this.objQeryVal = data);
//        if (this.objQeryVal.id != 0)
//            this.apiService.get(this.controllerName, "GetById", this.objQeryVal.id).then(data => {
//                // cahService.GetById(this.objQeryVal.id).then(data => {
//                this.objCarerAddressHistoryDTO = data;
//                this.setDate(data);
//            });

//        this._Form = _formBuilder.group({
//            DateMoved: [Validators.required],
//            IsCurrentAddress: [],
//            DateMovedOut: [],
//            LocalAuthorityId: ['0'],
//            IsPostApprove: [],
//        });
//        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
//        this.apiService.get("LocalAuthority", "GetAll", this.AgencyProfileId).then(data => {
//            this.LocalAuthorityList = data;
//        });
//        this.setVisible();
//    }

//    setDate(data) {
//        if (this.objCarerAddressHistoryDTO.DateMoved) {
//            this.objCarerAddressHistoryDTO.DateMoved = data.DateMoved.split('T')[0];
//        }

//        if (this.objCarerAddressHistoryDTO.DateMovedOut) {
//            this.objCarerAddressHistoryDTO.DateMovedOut = data.DateMovedOut.split('T')[0];
//        }

//    }

//    setVisible() {
//        //Set Conact Info Visible
//        this.objContactVisible.HomePhoneMandatory = false;
//        this.objContactVisible.OfficePhoneMandatory = false;
//        this.objContactVisible.MobilePhoneMandatory = false;
//        this.objContactVisible.EmailIdMandatory = false;
//        this.objContactVisible.AlternativeEmailIdVisible = false;
//        this.objContactVisible.AddressLine2Visible = false;
//        this.objContactVisible.EmergencyContactVisible = false;

//    }

//    clicksubmit(ConatactInfoval, ConatactInfoformbuilder) {
//        this.submitted = true;

//        if (!this._Form.valid) {
//            this.module.GetErrorFocus(this._Form);
//        }

//        if (!ConatactInfoformbuilder.valid) {
//            this.module.GetErrorFocus(ConatactInfoformbuilder);
//        }
//        //  console.log(this._Form);
//        //   console.log(ConatactInfoformbuilder);

//        if (this._Form.valid && ConatactInfoformbuilder.valid) {
//            this.isLoading = true;
//            let type = "save";
//            if (this.objQeryVal.id > 0)
//                type = "update";
//            this.objCarerAddressHistoryDTO.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
//            // this.cahService.post(this.objCarerAddressHistoryDTO, type).then(data => this.Respone(data, type));
//            this.apiService.save(this.controllerName, this.objCarerAddressHistoryDTO, type).then(data => this.Respone(data, type));
//        }
//    }

//    private Respone(data, type) {
//        this.isLoading = false;
//        if (data.IsError == true) {
//            this.module.alertDanger(data.ErrorMessage)
//        }
//        else if (data.IsError == false) {
//            if (type == "save") {
//                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
//            }
//            else {
//                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
//            }
//            this._router.navigate(['/pages/fostercarer/careraddresshistorylist/3']);
//        }
//    }
//}