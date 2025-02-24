import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

@Component({
    selector: 'fieldconfiglist',
    templateUrl: './fieldconfiglist.component.template.html',
})

export class FieldConfigListComponet {
    public searchText: string = "";
    public data: any;
    public returnVal: any;
    controllerName = "FieldCnfg";
    fieldConfigList=[];
    columns=[{name:'Field Name', prop:'FieldName', sortable:'true',width:'150'},
        {name:'Form Name', prop:'FormCnfg.FormName', sortable:'true',width:'150'},
    {name:'Field Data Type', prop:'FieldDataTypeCnfg.Name', sortable:'true',width:'150'},
    {name:'Edit', prop:'Edit',width:'60'},
    {name:'View', prop:'View',width:'60' },
    {name:'Delete', prop:'Delete',width:'60'}];
   
    constructor(private apiService: APICallService, private _router: Router, private pComponent: PagesComponent) {
        this.BindFieldConfigList();       
    }

    BindFieldConfigList() {
        this.apiService.get(this.controllerName, "getall").then(data => {this.returnVal = data;
        this.fieldConfigList = this.returnVal.map(item => ({...item,SequenceNo:item.FieldCnfgId}))});
        //this._configService.getFieldConfig().subscribe(data => this.returnVal = data);
    }

    fnAdd() {
        this._router.navigate(['/pages/superadmin/fieldcnfgdata', 0]);
    }

    editFieldConfig(FieldCnfgId) {       
        this._router.navigate(['/pages/superadmin/fieldcnfgdata', FieldCnfgId]);
    }

    deleteFieldConfig(FieldCnfgId) {
        this.apiService.delete(this.controllerName, FieldCnfgId).then(data => this.Respone(data));
            //this._configService.postFieldConfig(FieldCnfgId, "delete").then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.BindFieldConfigList();
        }
    }
    onEdit(item){
        this.editFieldConfig(item.FieldCnfgId);
    }
    onDelete(item){
        this.deleteFieldConfig(item.FieldCnfgId);
    }
}