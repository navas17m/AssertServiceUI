import { Component} from '@angular/core';
import {Router} from '@angular/router'
import {Common } from '../common'
import {Base} from '../services/base.service'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
@Component({
    selector: 'HospitalInfoList',
    templateUrl: './hospitalinfolist.component.template.html',
})

export class HospitalInfoListComponet {
    public searchText: string = "";
    returnVal = [];
    controllerName = "HospitalInfo";
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent) {
        this.BindHospitalInfoList();
    }

    fnAdd() {
        this._router.navigate(['/pages/child/hospitalinfo', 0]);
    }

    edit(id) {
        this._router.navigate(['/pages/child/hospitalinfo', id]);
    }

    BindHospitalInfoList() {
        this.apiService.get(this.controllerName, "getall").then(data => { this.returnVal = data; });
    }

    delete(id) {
        this.apiService.delete(this.controllerName, id).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.BindHospitalInfoList();
        }
    }
}