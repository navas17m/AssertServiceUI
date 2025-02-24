//import { Component, Pipe } from '@angular/core';
//import { Router, ActivatedRoute } from '@angular/router'
//import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
//import {CarerOOHReportService } from '../services/careroohreport.service'
//import {Common}  from  '../common'
//import { Location} from '@angular/common';
//import { CarerOOHReportDTO} from './DTO/careroohreportdto'
//import { PagesComponent } from '../pages.component'

////.@Pipe({ name: 'groupBy' })
//@Component({
//    selector: 'careroohreportdata',
//    templateUrl: './careroohreportdata.component.template.html',
//    providers: [CarerOOHReportService]
//})

//export class CarerOOHReportData {
//    objCarerOOHReportDTO: CarerOOHReportDTO = new CarerOOHReportDTO();
//    submitted = false;
//    dynamicformcontrol;
//    _Form: FormGroup;
//    isVisibleMandatoryMsg;
//    SequenceNo;
//    objQeryVal;
//    CarerParentId: number;
//    AgencyProfileId: number;
//    insCarerDetails;
//    UserName;
//    SupervisingSocialWorker; 
//    isLoading: boolean = false;

//    constructor(private location: Location, private _formBuilder: FormBuilder, private coohServics: CarerOOHReportService, private route: ActivatedRoute, private _router: Router, private module: PagesComponent) {
       
//        this.route.params.subscribe(data => this.objQeryVal = data);
//        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
//        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
//        this.objCarerOOHReportDTO.AgencyProfileId = this.AgencyProfileId;
//        this.objCarerOOHReportDTO.CarerParentId = this.CarerParentId;
//        this.SequenceNo = this.objQeryVal.Id;
//        if (this.SequenceNo != 0 && this.SequenceNo != null) {
//            this.objCarerOOHReportDTO.SequenceNo = this.SequenceNo;
//        } else {
//            this.objCarerOOHReportDTO.SequenceNo = 0;
//        }
//        if (Common.GetSession("SelectedCarerProfile") != null) {
//            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
//        }
//        this.UserName = Common.GetSession("UserName");
//        coohServics.GetSupervisingSocialWorkerByCPId(this.CarerParentId).then(data => this.SupervisingSocialWorker = data);
//        coohServics.getByFormCnfgId(this.objCarerOOHReportDTO).then(data => { this.ResponeDyanmic(data); });
//        this._Form = _formBuilder.group({});
//    }

//    private ResponeDyanmic(data) {
//        if (data != null) {
//            this.dynamicformcontrol = data;
//        }
//    }

//    clicksubmit(dynamicForm, subformbuilder) {
//        this.submitted = true;
//        if (!subformbuilder.valid) {
//            this.module.GetErrorFocus(subformbuilder);
//        } 
//        if (subformbuilder.valid && dynamicForm != '') {
//            this.isLoading = true;
//            let type = "save";
//            if (this.SequenceNo > 0)
//                type = "update";
//            this.objCarerOOHReportDTO.DynamicValue = dynamicForm;
//            this.objCarerOOHReportDTO.CarerParentId = this.CarerParentId;
//            this.coohServics.post(this.objCarerOOHReportDTO, type).then(data => this.Respone(data, type));
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
//            this._router.navigate(['/pages/recruitment/careroohreportlist']);
//        }
//    }
//}