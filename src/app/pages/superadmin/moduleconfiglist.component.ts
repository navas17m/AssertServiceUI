import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { APICallService } from '../services/apicallservice.service';


@Component({
    selector: 'moduleconfiglist',
    templateUrl: './moduleconfiglist.component.template.html',
})

export class MouleConfigListComponet {
    public searchText: string = "";
    public returnVal: any[];
    controllerName = "ModuleCnfg";
    columns=[{name:'Module', prop:'ModuleName', sortable:'true'}];

    constructor(private apiService: APICallService, private _router: Router) {
        this.BindModuleConfigList();
    }

    BindModuleConfigList() {
        this.apiService.get(this.controllerName,"GetParentModuleID",0).then(data => this.ResponeVal(data));
        //this._moduleconfigService.getByParentModuleID(0).then(data => this.ResponeVal(data));
    }

    private ResponeVal(module) {
        if (module != null) {
            this.returnVal = module;
        }
    }

    deleteModule(deletemodule) {
        this.apiService.delete(this.controllerName, deletemodule).then(data => this.Respone(data));
            //this._moduleconfigService.postModule(deletemodule, "delete").then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            alert(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            alert(Common.GetDeleteSuccessfullMsg);
            this.BindModuleConfigList();
        }
    }
}
