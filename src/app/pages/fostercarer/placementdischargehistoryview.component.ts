import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { APICallService } from '../services/apicallservice.service';
//import { ChildPlacementService } from  '../services/childplacement.service';
@Component({
    selector: 'PlacementDischargeHistoryView',
    templateUrl: './placementdischargehistoryview.component.template.html',


})
export class PlacementDischargeHistoryViewComponet {
    controllerName = "ChildPlacement";
    insHistory;
    objQeryVal;
    constructor(private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private _router: Router, private apiService: APICallService) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.GetPlacementDetailsByPlacementId();
    }



    GetPlacementDetailsByPlacementId() {

        if (this.objQeryVal.id) {
            this.apiService.get(this.controllerName, "GetPlacementByPlacementId", this.objQeryVal.id).then(data => {
                //   this._childPlacementService.getPlacementByPlacementId(this.objQeryVal.id).then(data => {
                this.insHistory = data;
            });

        }

    }

}