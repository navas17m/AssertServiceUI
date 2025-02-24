import { CarerRiskAssessmentDTO } from './DTO/CarerRiskAssessmentDTO';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

@Component
    ({
        selector: 'carerriskassessmentlist',
        templateUrl: './carerriskassessmentlist.component.template.html',

    })

export class CarerRiskAssessmentListComponent {
    public searchText: string = "";
    controllerName = "CarerRiskAssessment";
    lstCarerRiskAssessment = [];
    objQeryVal;
    objCarerRiskAssessmentDTO: CarerRiskAssessmentDTO = new CarerRiskAssessmentDTO();
    returnVal;
    CarerParentId: number;
    FormCnfgId;
    loading=false;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Assessment Date',prop:'AssessmentDate',sortable:true,width:'200',date:'Y'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        ];
    constructor( private activatedroute: ActivatedRoute,
        private _router: Router, private module: PagesComponent, private apiService: APICallService) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 50]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 37]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 402;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindCarerRiskAssessment();
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 403;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.bindCarerRiskAssessment();
        }


    }

    private bindCarerRiskAssessment() {
        this.loading=true;
        if (this.CarerParentId != null) {
            this.objCarerRiskAssessmentDTO.CarerParentId = this.CarerParentId;
            this.objCarerRiskAssessmentDTO.FormCnfgId = this.FormCnfgId;
            this.apiService.post(this.controllerName, "GetListByCarerParentId", this.objCarerRiskAssessmentDTO).then(data =>
                {this.lstCarerRiskAssessment = data;
                this.loading=false;});
        }
    }

    fnAddData() {
        if (this.objQeryVal.mid == 3)
            this._router.navigate(['/pages/fostercarer/riskassessmentdata/0/3']);
        else
            this._router.navigate(['/pages/recruitment/riskassessmentdata/0/13']);
    }

    editCarerRiskAssessment(CarerRiskAssessmentId) {
        this._router.navigate(['/pages/recruitment/riskassessmentdata', CarerRiskAssessmentId, this.objQeryVal.mid]);
    }

    deleteCarerRiskAssessment(SequenceNo) {
        this.objCarerRiskAssessmentDTO.SequenceNo = SequenceNo;
        this.apiService.delete(this.controllerName, this.objCarerRiskAssessmentDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarerRiskAssessment();
        }
    }
    onEdit(item){
        this.editCarerRiskAssessment(item.SequenceNo);
    }
    onDelete(item){
        this.deleteCarerRiskAssessment(item.SequenceNo);
    }
}
