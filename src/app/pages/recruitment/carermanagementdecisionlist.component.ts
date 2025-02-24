
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerManagementDecisionDTO } from './DTO/carermanagementdecisiondto';

@Component
    ({
        selector: 'CarerManagementDecisionList',
        templateUrl: './carermanagementdecisionlist.component.template.html',

    })

export class CarerManagementDecisionListComponent {
    public searchText: string = "";
    controllerName = "CarerManagementDecision";
    lstcarermanagementdecision = [];
    objQeryVal;
    objCarerManagementDecisionDTO: CarerManagementDecisionDTO = new CarerManagementDecisionDTO();
    returnVal;
    CarerParentId: number;
    FormCnfgId;
    loading = false;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date',prop:'Date',sortable:true,width:'200'},
        {name:'Subject',prop:'Subject',sortable:true,width:'200'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        ];
    constructor(private activatedroute: ActivatedRoute,
        private _router: Router, private module: PagesComponent, private apiService: APICallService) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 40]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 30]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 280;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindCarerCarerManagementDecision();
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 280;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.bindCarerCarerManagementDecision();
        }


    }

    private bindCarerCarerManagementDecision() {
        if (this.CarerParentId != null) {
            this.loading = true;
            this.objCarerManagementDecisionDTO.CarerParentId = this.CarerParentId;
            this.objCarerManagementDecisionDTO.FormCnfgId = 280;
            this.apiService.post(this.controllerName, "GetListByCarerParentId", this.objCarerManagementDecisionDTO).then(data => {
                this.loading = false;
                this.lstcarermanagementdecision = data;
            });
        }
    }

    fnAddData() {
        if (this.objQeryVal.mid == 3)
          this._router.navigate(['/pages/fostercarer/carermanagementdecisiondata/0/3']);
        else
            this._router.navigate(['/pages/recruitment/assessmentappointmentdata/0/37']);
    }

    edit(CarerManagementDecisionId) {
        this._router.navigate(['/pages/fostercarer/carermanagementdecisiondata', CarerManagementDecisionId, this.objQeryVal.mid]);
    }

    delete(SequenceNo) {
        this.objCarerManagementDecisionDTO.SequenceNo = SequenceNo;
        //this.objCarerManagementDecisionDTO.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objCarerManagementDecisionDTO).then(data => this.Respone(data));
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
        this.delete(item.SequenceNo)
    }
}