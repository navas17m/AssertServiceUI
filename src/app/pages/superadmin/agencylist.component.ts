import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

@Component({
    selector: 'agencylist',
    templateUrl: './agencylist.component.template.html',
})

export class AgencyListComponet {
    public searchText: string = "";
    rtnTableValue = null;
    controllerName = "AgencyProfile";
    agencyList=[];
    columns=[{name:'Agency Name', prop:'AgencyName', sortable:'true',width:'150'},
            {name:'Domain Name', prop:'DomainName',width:'150'},
            {name:'Is It AreaOffice', prop:'isAreaOffice',width:'150'},
            {name:'Edit', prop:'Edit',width:'60'},
            {name:'View', prop:'View',width:'60' },
            {name:'Delete', prop:'Delete',width:'60'}];
    constructor(private apiService: APICallService, private pComponent: PagesComponent, private _router: Router) {
        this.fillAgencyList();
    }

    fillAgencyList() {
        //this._agencyService.getAgencyList().subscribe(data => this.rtnTableValue = data);
        this.apiService.get(this.controllerName, "getall").then(data => {this.rtnTableValue = data;
                                                                         this.agencyList= this.rtnTableValue.map(item => ({...item, isAreaOffice:item.IsItAreaOffice?'Yes':'No',SequenceNo:item.AgencyProfileId}));});
    }

    fnAddData() {
        this._router.navigate(['/pages/superadmin/agencysetup/0']);
    }

    editAgencyList(editData) {      
        this._router.navigate(['/pages/superadmin/agencysetup', editData]);
    }

    deleteAgencyList(delData) {
        this.apiService.delete(this.controllerName, delData).then(data => this.Respone(data));
            //this._agencyService.postAgencyProfile(delData, "delete").then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.fillAgencyList();
        }
    }
    onEdit(item){
        this.editAgencyList(item.AgencyProfileId);
    }
    onDelete(item){
        this.deleteAgencyList(item.AgencyProfileId);
    }
}