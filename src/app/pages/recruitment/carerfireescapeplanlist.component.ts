
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerFireEscapePlanDTO } from './DTO/carerfireescapeplandto';

@Component
    ({
    selector: 'CarerFireEscapePlanList',
    templateUrl: './carerfireescapeplanlist.component.template.html',

    })

export class CarerFireEscapePlanListComponent {
    public searchText: string = "";
    controllerName = "CarerFireEscapePlan";
    lstCarerFireEscapePlan = [];
    objQeryVal;
    objCarerFireEscapePlanDTO: CarerFireEscapePlanDTO = new CarerFireEscapePlanDTO();
    returnVal;
    CarerParentId: number;
    FormCnfgId;
    loading = false;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Created Date',prop:'CreatedOn',sortable:true,width:'200'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        ];

    constructor(private activatedroute: ActivatedRoute,
        private _router: Router, private module: PagesComponent, private apiService: APICallService) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 41]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 31]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 282;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindCarerCarerManagementDecision();
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 282;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.bindCarerCarerManagementDecision();
        }
    }

    private bindCarerCarerManagementDecision() {
        if (this.CarerParentId != null) {
            this.loading = true;
            this.objCarerFireEscapePlanDTO.CarerParentId = this.CarerParentId;
            this.objCarerFireEscapePlanDTO.FormCnfgId = 282;
            this.apiService.post(this.controllerName, "GetListByCarerParentId", this.objCarerFireEscapePlanDTO).then(data => {
                this.loading = false;
                this.lstCarerFireEscapePlan = data;
            });
        }
    }

    fnAddData() {
        if (this.objQeryVal.mid == 3)
            this._router.navigate(['/pages/fostercarer/fireescapeplandata/0/3']);
        else
            this._router.navigate(['/pages/recruitment/fireescapeplandata/0/37']);
    }

    edit(CarerManagementDecisionId) {
        this._router.navigate(['/pages/fostercarer/fireescapeplandata', CarerManagementDecisionId, this.objQeryVal.mid]);
    }

    delete(SequenceNo) {
        this.objCarerFireEscapePlanDTO.SequenceNo = SequenceNo;
        //this.objCarerFireEscapePlanDTO.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objCarerFireEscapePlanDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarerCarerManagementDecision();
        }
    }
    onEdit(item){
        this.edit(item.SequenceNo);
    }
    onDelete(item){
        this.delete(item.SequenceNo);
    }
}