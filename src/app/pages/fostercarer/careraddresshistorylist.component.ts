
import { Component } from '@angular/core';

@Component
    ({
        selector: 'FCCarerAddressHistoryList',
        template: `<CarerAddressHistoryList></CarerAddressHistoryList>`,
    })

export class FCCarerAddressHistoryListComponent {

}
//import { APICallService } from '../services/apicallservice.service';
//import { Router, ActivatedRoute, Params } from '@angular/router';
//import { Component} from '@angular/core';
//import { Common } from '../common'
//import { Base } from '../services/base.service'
//import { PagesComponent } from '../pages.component'
////import { CarerAddressHistoryService } from '../services/careraddresshistory.service'

//@Component
//    ({
//        selector: 'CarerAddressHistoryList',
//        templateUrl: './careraddresshistorylist.component.template.html',
//    })

//export class CarerAddressHistoryListComponent {
//    controllerName = "CarerAddressHistory";
//    carerAddressHistoryList = [];
//    objQeryVal;
//    CarerParentId: number;

//    constructor(private _router: Router,
//        private activatedroute: ActivatedRoute, private pComponent: PagesComponent, private apiService: APICallService) {

//        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

//        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
//            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 28]);
//        }
//        else {
//            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
//            this.bindAddressHistory();
//        }


//    }

//    private bindAddressHistory() {
//        if (this.CarerParentId != null && this.CarerParentId != 0)
//            this.apiService.get(this.controllerName, "GetAllByCarerParentId", this.CarerParentId).then(data => { this.carerAddressHistoryList = data });
//        //   this.cahService.GetAllByCarerParentId(this.CarerParentId).then(data => { this.carerAddressHistoryList = data });
//    }

//    fnAddData() {
//        this._router.navigate(['/pages/fostercarer/careraddresshistory/0']);
//    }

//    edit(id) {
//        this._router.navigate(['/pages/fostercarer/careraddresshistory', id]);
//    }

//    delete(historyId) {
//        //  alert("sadham" + historyId);
//        // console.log(historyId);
//        // this.cahService.post(historyId, "delete").then(data => this.Respone(data));
//        this.apiService.delete(this.controllerName, historyId).then(data => this.Respone(data));

//    }

//    private Respone(data) {
//        if (data.IsError == true) {
//            this.pComponent.alertDanger(data.ErrorMessage)
//        }
//        else if (data.IsError == false) {
//            this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
//            this.bindAddressHistory();
//        }
//    }
//}