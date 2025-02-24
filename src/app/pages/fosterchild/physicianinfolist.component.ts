import { Component} from '@angular/core';
import {Router} from '@angular/router'
import {Common } from '../common'
import {Base} from '../services/base.service'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

@Component({
    selector: 'physicianinfolist',
    templateUrl: './physicianinfolist.component.template.html',
})

export class PhysicianInfoListComponet {
    public searchText: string = "";
    returnVal = null; controllerName = "PhysicianInfo";
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent) {
        this.BindPhysicianInfoList();
    }
        
    BindPhysicianInfoList() {
        this.apiService.get(this.controllerName,"getall").then(data => { this.returnVal = data; });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/physicianinfo/0']);
    }

    editPhysicianInfo(PhysicianInfoId) {
        this._router.navigate(['/pages/child/physicianinfo', PhysicianInfoId]);
    }

    deletePhysicianInfo(deletePhysicianInfo) {
        this.apiService.delete(this.controllerName, deletePhysicianInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);           
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);           
            this.BindPhysicianInfoList();
        }
    }
}