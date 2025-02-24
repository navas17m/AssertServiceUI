import { Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ModuleConfig } from './DTO/moduleconfig';

@Component({
    selector: 'moduleconfig',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './moduleconfig.component.template.html',
})


export class ModuleConfigComponet {
    public searchText: string = "";
    public filterQuery = "";
    objModuleCons: ModuleConfig = new ModuleConfig();
    isVisibleMandatortMsg;
    parentModule = null;
    moduleConfigID = null;
    respoError;
    submitResult = null;
    submitted = false;
    _modulecnfgForm: FormGroup;
    objQeryVal;
    controllerName = "ModuleCnfg";

    constructor(private apiService: APICallService, _formBuilder: FormBuilder, private _router: Router,
                private activatedroute: ActivatedRoute, private pComponent: PagesComponent, private location:Location) {
        
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this._modulecnfgForm = _formBuilder.group({
            ParentModuleId: ['0', Validators.required],
            ModuleName: ['', Validators.required]
        });

        //get parent module
        this.apiService.get(this.controllerName,"GetAll").then(data => this.ResponeParent(data));
        //_moduleconfigService.getModelGetAll().then(data => this.ResponeParent(data));
        
        //get edit data from db
        this.moduleConfigID = Common.GetSession("ModuleCnfgId");

        if (this.moduleConfigID != 0 && this.moduleConfigID != null) {
            this.apiService.get(this.controllerName, "GetById", this.moduleConfigID).then(data => this.ResponeVal(data), error => this.respoError = error);
            //_moduleconfigService.getFormsById(this.moduleConfigID).then(data => this.ResponeVal(data), error => this.respoError = error);
        }

        //Clear session
        Common.SetSession("ModuleCnfgId", "");
    }

    private ResponeParent(module) {
        if (module != null) {
            this.parentModule = module;
        }
    }

    private ResponeVal(module: ModuleConfig) {
        if (module != null) {
            this.objModuleCons = module;
        }
    }

    //btn Submit
    moduleconfigSubmit(form) {
        this.submitted = true;
        if (form.valid) {
            let isSave = "save";
            if (this.moduleConfigID != 0)
                isSave = "update";
            this.apiService.save(this.controllerName, this.objModuleCons, isSave).then(data => this.Respone(data));
            //this._moduleconfigService.postModule(this.objModuleCons, isSave).then(data => this.Respone(data));
        }
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (this.moduleConfigID == 0) {
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.pComponent.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }

            this._router.navigate(['/pages/superadmin/modulecnfglist', this.objQeryVal.mid]);
        }
    }
    public goBack(){
        this.location.back();
    }
}