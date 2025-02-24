import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { FormConfig } from './DTO/formconfig';

@Component({
    selector: 'formconfiglist',
    templateUrl: './formconfiglist.component.template.html',
})

export class FormConfigListComponet {
    objFormConfig: FormConfig = new FormConfig();
    public searchText = "";
    public data: any;
    render: Renderer2;
    controllerName = "FormCnfg";
    formConfigList=[];
    columns=[{name:'Form Name', prop:'FormName', sortable:'true',width:'150'},
    {name:'Module', prop:'ModuleCnfg.ModuleName', sortable:'true',width:'150'},
    {name:'Edit', prop:'Edit',width:'60'},
    {name:'View', prop:'View',width:'60' },
    {name:'Delete', prop:'Delete',width:'60'}];

    constructor(private apiService: APICallService, private _router: Router, private pcomponent: PagesComponent) {
        this.bindFormConfigList();
    }

    fnAlert() {
    }

    bindFormConfigList() {
        this.apiService.get(this.controllerName,"GetAll").then(data => this.ResponeVal(data));
        //this._configService.getForms().then(data => this.ResponeVal(data));
    }

    fnAddData() {
        this._router.navigate(['/pages/superadmin/formconfig/0']);
    }

    private ResponeVal(form) {
        if (form != null) {
            this.data = form;
            this.formConfigList = this.data.map(item => ({...item, SequenceNo:item.FormCnfgId}));
            //console.log(this.formConfigList);
        }
    }

    editFormConfig(formconfigID) {
        this._router.navigate(['/pages/superadmin/formconfig', formconfigID]);
    }

    deleteFormConfig(formconfigID) {
        this.apiService.delete(this.controllerName, formconfigID).then(data => this.Respone(data));
            //this._configService.postFormConfig(formconfigID, "delete").then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.pcomponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.pcomponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindFormConfigList();
        }
    }
    onEdit(item){
        this.editFormConfig(item.FormCnfgId);
    }
    onDelete(item){
        this.deleteFormConfig(item.FormCnfgId);
    }
}
