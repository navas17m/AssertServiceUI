import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerIRMDeterminationDTO } from './DTO/irmdeterminationdto';

@Component
    ({
        selector: 'CarerIRMDeterminationList',
        templateUrl: './irmdeterminationlist.component.template.html',
    })

export class CarerIRMDeterminationListComponent {
    public searchText: string = "";
    lstIRMDetermination = [];
    objCarerIRMDetermination: CarerIRMDeterminationDTO = new CarerIRMDeterminationDTO();
    returnVal;
    CarerParentId: number;
    submitted = false;
    dynamicformcontrol;
    _Form: FormGroup; controllerName = "CarerIRMDetermination";
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Date of Referral',prop:'DateOfApplication',sortable:false,width:'200'},
      {name:'Date of IRM Panel',prop:'DateOfIRMPanel',sortable:true,width:'200'},
      {name:'Edit',prop:'Edit',sortable:false,width:'60'},
      {name:'View',prop:'View',sortable:false,width:'60'},
      {name:'Delete',prop:'Delete',sortable:false,width:'60'}];

    constructor(private apiService: APICallService, private _formBuilder: FormBuilder, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 39]);
        }
        else {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindCarerIRMDetermination();
        }
        this._Form = _formBuilder.group({});
    }

    private bindCarerIRMDetermination() {
        if (this.CarerParentId != null) {
            this.objCarerIRMDetermination.CarerParentId = this.CarerParentId;
            this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => {
                this.lstIRMDetermination = data;
            });
        }
    }

    fnAddData() {
        this._router.navigate(['/pages/fostercarer/irmdeterminationdata/0/3']);
        //this._router.navigate(['/pages/fostercarer/annualreview/0/3/1']);
    }



    edit(Id) {
        this._router.navigate(['/pages/fostercarer/irmdeterminationdata', Id, 3]);
    }

    delete(SequenceNo) {
        this.objCarerIRMDetermination.SequenceNo = SequenceNo;
        //this.objCarerIRMDetermination.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objCarerIRMDetermination).then(data => this.Respone(data));
    }

    private ResponeCourseStatus(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
        }
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarerIRMDetermination();
        }
    }
    onEdit(item){
      this.edit(item.SequenceNo);
    }
    onDelete(item){
      this.delete(item.SequenceNo);
    }
}
