import { Component, Input, OnInit, Injectable, Directive, Pipe} from '@angular/core';
import { Location} from '@angular/common';
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Common} from '../common'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
//import { ChildPlacementService } from  '../services/childplacement.service';
//import { ConfigTableValuesService} from '../services/configtablevalues.service'
import { ConfigTableNames } from '../configtablenames'
import { ConfigTableNamesDTO} from '../superadmin/DTO/configtablename'
import { ChildPlacementDTO } from '../child/DTO/childplacementdto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'childplacementdischargedata',
    templateUrl: './placementanddischargehistorydata.component.template.html',
//     styles: [`[required]  {
//         border-left: 5px solid blue;
//     }
//     .ng-valid[required], .ng-valid.required  {
//             border-left: 5px solid #42A948; /* green */
// }
//     .ng-invalid:not(form)  {
//         border-left: 5px solid #a94442; /* red */
// }`]
})

export class PlacementandDischargeHistoryDataComponet {
    objConfigTableNames: ConfigTableNames = new ConfigTableNames();
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objChildPlacementDTO: ChildPlacementDTO = new ChildPlacementDTO();
    submitted = false;
    AgencyProfileId: number;
    objQueryVal;
    lstPlacementType = [];
    _ChildPlacementDischargeForm: FormGroup;
    insChildProfileDTO;
    dynamicformcontrolPlacement = [];
    dynamicformcontrolDischarge = [];
    isChildPlacement;
    isLoading: boolean = false;
    insPlacementReason;
    objPlacementAgreement;
    insPlacementAgreement;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=94;
    constructor(private apiService: APICallService, _formBuilder: FormBuilder, private route: ActivatedRoute,
        private _router: Router,
        private modal: PagesComponent) {

        this.route.params.subscribe(data => this.objQueryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.PlacementType;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId",this.objConfigTableNamesDTO).then(data => { this.lstPlacementType = data; });
          
        this.objChildPlacementDTO.AgencyProfileId = this.AgencyProfileId;
        this.objChildPlacementDTO.ChildPlacementId = this.objQueryVal.Id;
        //this.objChildPlacementDTO.ChildId=23;
        if (Common.GetSession("SelectedChildProfile") != null) {
            this.insChildProfileDTO = JSON.parse(Common.GetSession("SelectedChildProfile"));
        }

        if (this.objChildPlacementDTO.ChildPlacementId > 0) {             
            this.apiService.get("ChildPlacement", "GetChildPlacementDischargeDataById", this.objChildPlacementDTO.ChildPlacementId).then(data => {
                //    this.Respone(data);
                //});
                //_childPlacementService.getChildPlacementDischargeDataById(this.objChildPlacementDTO).then(data => {
                //  this.ResponseVal(data);
                this.objChildPlacementDTO = data;
                this.dynamicformcontrolPlacement = data.AgencyFieldMapping.filter(x => x.FormCnfgId == 77);
                this.dynamicformcontrolDischarge = data.AgencyFieldMapping.filter(x => x.FormCnfgId == 78);

                let objPlacementReason = this.dynamicformcontrolPlacement.filter(item => item.FieldCnfg.FieldName == "PlacementReason");
                if (objPlacementReason.length > 0)
                    this.insPlacementReason = objPlacementReason[0].FieldValue;

                let objPlacementAgreement = this.dynamicformcontrolPlacement.filter(item => item.FieldCnfg.FieldName == "PlacementAgreement");
                if (objPlacementAgreement.length > 0)
                    this.insPlacementAgreement = objPlacementAgreement[0].FieldValue;

                if ((data.PlacementStartTypeId == 1 || data.PlacementStartTypeId == 2 || data.PlacementStartTypeId == 3 || data.PlacementStartTypeId == 4) && data.PlacementEndDate == null) {
                    this.isChildPlacement = 1;
                }
                else
                    this.isChildPlacement = 2;
            });
        }

        this._ChildPlacementDischargeForm = _formBuilder.group
            ({
                PlacementType: ['0', Validators.required]
            });

            if(Common.GetSession("ViweDisable")=='1'){
                this.objUserAuditDetailDTO.ActionId = 4;
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.objChildPlacementDTO.ChildId;
                this.objUserAuditDetailDTO.RecordNo = this.objChildPlacementDTO.ChildPlacementId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                }    
    }

    private ResponseVal(PlacementDischargeInfo: ChildPlacementDTO) {
        if (PlacementDischargeInfo != null) {
            this.objChildPlacementDTO = PlacementDischargeInfo;
        }
    }

    isOk = true;
    ChildPlacementDischargeSubmit(_ChildPlacementDischargeForm, dynamicPlacementVal, dynamicPlacementForm, dynamicDischargeVal, dynamicDischargeForm) {
        this.submitted = true;
        this.isOk = true;

        if (this.isChildPlacement == 1 && !dynamicPlacementForm.valid) {
            this.isOk = false;
        }

        if (this.isChildPlacement == 2 && !dynamicDischargeForm.valid) {
            this.isOk = false;
        }

        if (!_ChildPlacementDischargeForm.valid) {
            this.modal.GetErrorFocus(_ChildPlacementDischargeForm);
        }
        else if (!dynamicPlacementForm.valid) {
            this.modal.GetErrorFocus(dynamicPlacementForm);
        }

        if (_ChildPlacementDischargeForm.valid && this.isOk) {
            this.isLoading = true;
            if (this.isChildPlacement == 1)
                this.objChildPlacementDTO.DynamicValue = dynamicPlacementVal;

            if (this.isChildPlacement == 2)
                this.objChildPlacementDTO.DynamicValue = dynamicDischargeVal;

            this.objChildPlacementDTO.ChildPlacementId = this.objQueryVal.Id;
            // this.objChildPlacementDTO.DynamicValue = dynamicPlacementVal;

            // this._childPlacementService.saveChildPlacementDischargeHistoryData(this.objChildPlacementDTO).then(data => this.Respone(data));

            this.apiService.post("ChildPlacement", "ChildPlacementDischargeHistoryData", this.objChildPlacementDTO).then(data => {
                this.Respone(data);
            });
        }

    }

    private Respone(data) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (this.objQueryVal.Id == 0) {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else if (this.objQueryVal.Id != 0) {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.objChildPlacementDTO.ChildPlacementId;
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.objChildPlacementDTO.ChildId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this._router.navigate(['/pages/child/childplacementdischargehistory/4']);
        }
    }
}
