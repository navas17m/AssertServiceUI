import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

@Component({
    selector: 'ComplianceCheckTypecnfgList',
    templateUrl: './compliancechecktypecnfglist.component.template.html',
})

export class ComplianeCheckTypecnfgListComponent {
    public searchText: string = "";
    compliancheckList;
    controllerName = "ComplianceCheckTypeCnfg";
    complianceCheckList=[];
    columns=[{name:'Agency Name', prop:'AgencyName', sortable:'true',width:'150'},
        {name:'Member Type', prop:'MemberTypeName', sortable:'true',width:'150'},
    {name:'Check Name', prop:'CheckName', sortable:'true',width:'150'},
    {name:'Edit', prop:'Edit',width:'60'},
    {name:'View', prop:'View',width:'60' },
    {name:'Delete', prop:'Delete',width:'60'}];
    constructor(private apiService: APICallService, private pComponent: PagesComponent, private _router: Router) {
        this.BindCheckList();
    }

    fnAddData() {
        this._router.navigate(['/pages/superadmin/compliancechecktypecnfg', 0]);
    }

    edit(id) {
        this._router.navigate(['/pages/superadmin/compliancechecktypecnfg', id]);
    }

    BindCheckList() {
        this.apiService.get(this.controllerName, "GetAll").then(data => {this.compliancheckList = data.filter(x => x.AgencyProfileId == Common.GetSession("AgencyProfileId"));
                                                                         this.complianceCheckList = this.compliancheckList.map(item =>({...item,SequenceNo:item.CheckTypeId}));});
        //this.cctcServices.GetAll().then(data => this.compliancheckList = data);
    }


    delete(id) {

        this.apiService.delete(this.controllerName, id).then(data => this.Respone(data));
        //this.cctcServices.post(id, "delete").then(data => this.Respone(data));

    }

    private Respone(data) {
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.BindCheckList();
        }
    }
    onEdit(item){
        this.edit(item.CheckTypeId);
    }
    onDelete(item){
        this.delete(item.CheckTypeId);
    }
}