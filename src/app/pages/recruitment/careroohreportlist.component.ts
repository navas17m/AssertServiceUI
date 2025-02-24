//import { Component} from '@angular/core';
//import {CarerOOHReportService } from '../services/careroohreport.service'
//import { Router } from '@angular/router'
//import { Common } from '../common'
//import { Base } from '../services/base.service'
//import { CarerOOHReportDTO} from './DTO/careroohreportdto'
//import { PagesComponent } from '../pages.component'

//@Component
//    ({
//        selector: 'careroohreportlist',
//        templateUrl: './careroohreportlist.component.template.html',
//        providers: [CarerOOHReportService]
//    })

//export class CarerOOHReportListComponent {
//    lstCarerOOHReport = [];
//    objCarerOOHReportDTO: CarerOOHReportDTO = new CarerOOHReportDTO();    
//    returnVal;
//    CarerParentId: number;

//    constructor(private coohServics: CarerOOHReportService, private _router: Router, private module: PagesComponent) {
//        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
//            this._router.navigate(['/pages/fostercarer/approvedcarerlist/13/22']);
//        }

//        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
//        this.bindCarerOOHReport();
//    }

//    fnAddData() {
//        this._router.navigate(['/pages/recruitment/careroohreportdata/0']);
//    }

//    editCarerOOHReport(CarerOOHReportId) {
//        this._router.navigate(['/pages/recruitment/careroohreportdata', CarerOOHReportId]);
//    }
    
//    private bindCarerOOHReport() {
//        if (this.CarerParentId) {
//            this.coohServics.getOOHReportList(this.CarerParentId).subscribe(data => this.lstCarerOOHReport = data);
//        }
//    }

//    deleteCarerOOHReport(SequenceNo, UniqueID) {
//        this.objCarerOOHReportDTO.SequenceNo = SequenceNo;
//        this.objCarerOOHReportDTO.UniqueID = UniqueID;
//        this.coohServics.post(this.objCarerOOHReportDTO, "delete").then(data => this.Respone(data));
//    }

//    private Respone(data) {
//        if (data.IsError == true) {
//            this.module.alertDanger(data.ErrorMessage)
//        }
//        else if (data.IsError == false) {
//            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
//            this.bindCarerOOHReport();
//        }
//    }
//}