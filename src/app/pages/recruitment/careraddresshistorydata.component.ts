import { id } from '@swimlane/ngx-datatable';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common, deepCopy } from '../common';
import { ContactVisible } from '../contact/contact';
import { CarerAddressHistoryDTO } from '../fostercarer/DTO/careraddresshistorydto';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'CarerAddressHistoryData',
    templateUrl: './careraddresshistorydata.component.template.html',
})

export class CarerAddressHistoryDataComponent {
    controllerName = "CarerAddressHistory";
    objCarerAddressHistoryDTO: CarerAddressHistoryDTO = new CarerAddressHistoryDTO();
    objCarerAddressHistoryDTOOrginal;
    submitted = false;
    _Form: FormGroup;
    objQeryVal;
    CarerParentId: number;
    isLoading: boolean = false;
    LocalAuthorityList = [];
    AgencyProfileId;
    objContactVisible: ContactVisible = new ContactVisible();
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=172;
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private module: PagesComponent, private apiService: APICallService) {
        this.objCarerAddressHistoryDTO.DateMoved = null;
        this.objCarerAddressHistoryDTO.DateMovedOut = null;
        this.route.params.subscribe(data => this.objQeryVal = data);
        if (this.objQeryVal.id != 0)
            this.apiService.get(this.controllerName, "GetById", this.objQeryVal.id).then(data => {
                this.objCarerAddressHistoryDTO = data;
                this.objCarerAddressHistoryDTOOrginal = deepCopy<any>(this.objCarerAddressHistoryDTO);
                this.setDate(data);
            });

        this._Form = _formBuilder.group({
            DateMoved: [Validators.required],
            IsCurrentAddress: [],
            DateMovedOut: [],
            LocalAuthorityId: ['0'],
            IsPostApprove: [],
        });
        if (this.objQeryVal.mid == 13)
            this.objCarerAddressHistoryDTO.IsPostApprove = 1;
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.apiService.get("LocalAuthority", "GetAll", this.AgencyProfileId).then(data => {
            this.LocalAuthorityList = data;
        });
        this.setVisible();

        if (this.objQeryVal.mid == 3) {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        }
        else if (this.objQeryVal.mid == 13) {
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
        }
        if(Common.GetSession("ViweDisable")=='1'){
          this.objUserAuditDetailDTO.ActionId = 4;
          this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
          this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
          this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
          this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
          this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
          this.objUserAuditDetailDTO.RecordNo = this.objQeryVal.id;
          Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
          }
    }

    setDate(data) {
        this.objCarerAddressHistoryDTO.DateMoved = this.module.GetDateEditFormat(data.DateMoved);
        this.objCarerAddressHistoryDTO.DateMovedOut = this.module.GetDateEditFormat(data.DateMovedOut);
    }

    setVisible() {
        //Set Conact Info Visible
        this.objContactVisible.HomePhoneMandatory = false;
        this.objContactVisible.OfficePhoneMandatory = false;
        this.objContactVisible.MobilePhoneMandatory = false;
        this.objContactVisible.EmailIdMandatory = false;
        this.objContactVisible.AlternativeEmailIdVisible = false;
        this.objContactVisible.AddressLine2Mandatory = false;
        this.objContactVisible.EmergencyContactVisible = false;

    }
    isDirty = true;
    clicksubmit(ConatactInfoval, ConatactInfoformbuilder, countyElem, countryElem) {
        this.submitted = true;

        if (!this._Form.valid) {
            this.module.GetErrorFocus(this._Form);
        }

        if (!ConatactInfoformbuilder.valid) {
            this.module.GetContactErrorFocus(ConatactInfoformbuilder, countyElem, countryElem);
        }

        if (this._Form.valid && ConatactInfoformbuilder.valid) {
            this.objCarerAddressHistoryDTO.DateMoved = this.module.GetDateSaveFormat(this.objCarerAddressHistoryDTO.DateMoved);
            this.objCarerAddressHistoryDTO.DateMovedOut = this.module.GetDateSaveFormat(this.objCarerAddressHistoryDTO.DateMovedOut);
            this.objCarerAddressHistoryDTO.CarerParentId = this.CarerParentId;

            //this.isDirty = true;
            //if (this.objQeryVal.id != 0 && CompareStaticValue(this.objCarerAddressHistoryDTO, this.objCarerAddressHistoryDTOOrginal)) {
            //    this.isDirty = false;
            //}
            //if (this.isDirty) {
            this.isLoading = true;
            let type = "save";
            if (this.objQeryVal.id > 0)
                type = "update";

            this.apiService.save(this.controllerName, this.objCarerAddressHistoryDTO, type).then(data => this.Respone(data, type));
            //}
            //else {
            //    this.module.alertWarning(Common.GetNoChangeAlert);
            //}
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
              this.objUserAuditDetailDTO.ActionId =1;
              //this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
              this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.objQeryVal.id;
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            if (this.objQeryVal.mid == 13)
                this._router.navigate(['/pages/recruitment/careraddresshistorylist/13']);
            else
                this._router.navigate(['/pages/fostercarer/careraddresshistorylist/3']);
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
}
