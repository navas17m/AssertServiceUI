/// <reference path="../pages.component.ts" />
import { Component } from '@angular/core';
import { Location } from '@angular/common';
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { AgencyFieldMapping } from './DTO/agencyfieldmapping';

@Component({

    selector: 'agencyfieldmapping',
    templateUrl: './agencyfieldmapping.component.template.html',
    styles: [`.ng-valid[required] {
  border-left: 5px solid #42A948; /* green */
}

.ng-invalid {
  border-left: 5px solid a94442; /* red */
}`]
})


export class AgencyFieldMappingComponent {


    agencyFieldMappingList = null;
    lstAgencyFieldMapping = [];
    lstConfigTableNames = null;
    objQeryVal;
    readOnly = false;
    constructor(private apiService: APICallService, private route: ActivatedRoute,
        private _router: Router,  private pComponent: PagesComponent, private location:Location) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        //console.log(this.objQeryVal.AgencyProfileId);
        Common.SetSession("AgencyProId", this.objQeryVal.AgencyProfileId);
        var _insAFM = new AgencyFieldMapping();
        _insAFM.AgencyProfileId = this.objQeryVal.AgencyProfileId;
        _insAFM.FormCnfgId = this.objQeryVal.FormCnfgId;

        this.apiService.post("AgencyFieldMapping", "GetByAgencyProfileIdNFormCnfgId", _insAFM).then(data => { this.agencyFieldMappingList = data; });
        this.apiService.get("ConfigTableNames", "getall").then(data => { this.lstConfigTableNames = data; });

        //   this._agencyFieldMappingService.GetByAgencyProfileIdNFormCnfgId(_insAFM).then(data => { this.agencyFieldMappingList = data; });
        //   this._configTableNamesService.getConfigTableNames().subscribe(data => { this.lstConfigTableNames = data; });
    }
    returnReadOnly(value) {
        if (value > 7)
            return false;
        else
            return true;
    }

    getDynamicControls(obj) {

        //  return this._http.post(Base.GetUrl() + '/api/AgencyFieldMapping/GetDynamicControls', JSON.stringify(obj), Base.GetHeader()).toPromise()
        //     .then(this.handleResponse)
        //       .catch(this.handleError);
    }

    private handleResponse(data: Response) {
        return data.json();
    }

    private handleError(error: Response) {
        // console.error(error);
        ///   return Observable.throw(error.json().error || 'Server error');
    }

    //btn Submit
    agencyFieldMappingSubmit(): void {
        this.lstAgencyFieldMapping = [];
        for (let insAFM of this.agencyFieldMappingList) {
            if (insAFM.IsActive != insAFM.OriginalIsActive
                || insAFM.ConfigTableName != insAFM.OriginalConfigTableName
                || insAFM.ConfigTableNamesId != insAFM.OriginalConfigTableNamesId
                || insAFM.DisplayName != insAFM.OriginalDisplayName
                || insAFM.FieldOrder != insAFM.OriginalFieldOrder
                || insAFM.IsMandatory != insAFM.OriginalIsMandatory
            ) {
                var _insAFM = new AgencyFieldMapping();
                _insAFM.AgencyProfileId = insAFM.AgencyProfileId == 0 ? this.objQeryVal.AgencyProfileId : insAFM.AgencyProfileId;
                _insAFM.FieldCnfg.FieldCnfgId = insAFM.FieldCnfg.FieldCnfgId;
                _insAFM.FormCnfgId = insAFM.FormCnfgId;
                _insAFM.ConfigTableName = insAFM.ConfigTableName;
                _insAFM.ConfigTableNamesId = insAFM.ConfigTableNamesId;
                _insAFM.DisplayName = insAFM.DisplayName;
                _insAFM.FieldOrder = insAFM.FieldOrder;
                _insAFM.IsMandatory = insAFM.IsMandatory;
                _insAFM.IsActive = insAFM.IsActive;
                this.lstAgencyFieldMapping.push(_insAFM);
            }
        }
        this.apiService.post("AgencyFieldMapping", "Save", this.lstAgencyFieldMapping).then(data => this.Respone(data));
        // this._agencyFieldMappingService.postAgencyFieldMapping(this.lstAgencyFieldMapping).then(data => this.Respone(data));
    }
    checkNuncheckAll = false;
    fncheckNuncheckAll() {
        this.checkNuncheckAll = !this.checkNuncheckAll;

        if (this.checkNuncheckAll) {
            for (let insAFM of this.agencyFieldMappingList) {
                insAFM.IsActive = true;
            }
        }
        else {
            for (let insAFM of this.agencyFieldMappingList) {
                insAFM.IsActive = false;

            }
        }
    }
    private Respone(data) {
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.pComponent.alertSuccess(Common.GetUpdateSuccessfullMsg);
            this.lstAgencyFieldMapping = [];
            this._router.navigate(['/pages/superadmin/agencyformmapping']);
        }
    }

    public goBack(){
        this.location.back();
    }

}