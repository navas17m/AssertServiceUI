import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
        selector: 'CarerAddressHistoryList',
        templateUrl: './careraddresshistorylist.component.template.html',
    })

export class CarerAddressHistoryListComponent {
    public searchText: string = "";
    controllerName = "CarerAddressHistory";
    carerAddressHistoryList = [];
    carerAddresses = [];
    columns =[
        {name:'City',prop:'ContactInfo.City',sortable:true,width:'100'},
        {name:'Address',prop:'ContactInfo.AddressLine1',sortable:true,width:'150'},
        {name:'Postal Code',prop:'ContactInfo.PostalCode',sortable:true,width:'150'},
        {name:'Current Address',prop:'isCurrentAddress',sortable:true,width:'60'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'}
        ];
    objQeryVal;
    CarerParentId: number;
    FormCnfgId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _router: Router,
        private activatedroute: ActivatedRoute, private pComponent: PagesComponent, private apiService: APICallService) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 28]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 29]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 172;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindAddressHistory();
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 237;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.bindAddressHistory();
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    private bindAddressHistory() {
        if (this.CarerParentId != null && this.CarerParentId != 0)
            this.apiService.get(this.controllerName, "GetAllByCarerParentId", this.CarerParentId).then(data =>
                { this.carerAddressHistoryList = data;
                  this.carerAddresses = this.carerAddressHistoryList.map(item => ({...item, isCurrentAddress:item.IsCurrentAddress==1?'Yes':'No'}));   });
    }

    fnAddData() {
        if (this.objQeryVal.mid == 13)
            this._router.navigate(['/pages/recruitment/careraddresshistory/0/13']);
        else
            this._router.navigate(['/pages/fostercarer/careraddresshistory/0/3']);
    }

    edit(id) {

        if (this.objQeryVal.mid == 3)
            this._router.navigate(['/pages/fostercarer/careraddresshistory', id,3]);
        else
            this._router.navigate(['/pages/recruitment/careraddresshistory', id,13]);
    }

    delete(historyId) {
        this.apiService.delete(this.controllerName, historyId).then(data => this.Respone(data,historyId));

    }

    private Respone(data,historyId) {
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindAddressHistory();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = historyId;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit(item){
        this.edit(item.CarerAddressHistoryId);
    }
}
