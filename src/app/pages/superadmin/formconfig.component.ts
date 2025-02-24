import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { FormConfig } from './DTO/formconfig';

@Component({
    selector: 'formconfig',
    templateUrl: './formconfig.component.template.html',    
})

export class FormConfigComponet {
    objFormCon: FormConfig = new FormConfig();
    isVisibleMandatortMsg;
    formconfigID;
    respoError;
    parentModule = null;
    submitted = false;
    objQeryVal;
    _FormcnfgForm: FormGroup;
    isLoading: boolean = false;
    controllerName = "FormCnfg";

    constructor(private apiService: APICallService, private activatedroute: ActivatedRoute, _formBuilder: FormBuilder,
                private _router: Router, private pcomponent: PagesComponent) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this._FormcnfgForm = _formBuilder.group({
            ParentModuleId: [0, Validators.required],
            FormName: ['', Validators.required],
            Pattern: ['', Validators.required]
        });

        //get parent module
        this.apiService.get("ModuleCnfg", "GetAll").then(data => this.ResponeParent(data));
        //_moduleconfigService.getModelGetAll().then(data => this.ResponeParent(data));
        
        //Get edit data
        this.formconfigID = this.objQeryVal.id
        if (this.formconfigID != 0 && this.formconfigID != null) {
            this.apiService.get(this.controllerName, "GetById", this.formconfigID).then(data => this.ResponeVal(data), error => this.respoError = error);
            //_formConfigService.getFormsById(this.formconfigID).then(data => this.ResponeVal(data), error => this.respoError = error);
        }

        //clear session
        //  Common.SetSession("FormCnfgId", "");
    }

    private ResponeParent(module) {
        if (module != null) {
            this.parentModule = module;
        }
    }

    private ResponeVal(fConfig: FormConfig) {
        if (fConfig != null) {
            this.objFormCon = fConfig;
        }
    }

    //btn Submit
    formconfigSubmit(form) {
        this.submitted = true;

        if (!form.valid) {
            this.pcomponent.GetErrorFocus(form);
        }

        if (form.valid) {
            this.isLoading = true;
            let type = "save";
            if (this.formconfigID != 0)
                type = "update";

            this.apiService.save(this.controllerName, this.objFormCon, type).then(data => this.Respone(data));
            //this._formConfigService.postFormConfig(this.objFormCon, type).then(data => this.Respone(data));
        }
    }

    private Respone(formConfig) {
        this.isLoading = false;
        if (formConfig.IsError == true) {
            this.pcomponent.alertDanger(formConfig.ErrorMessage)
        }
        else {

            if (this.formconfigID == 0)
                this.pcomponent.alertSuccess(Common.GetSaveSuccessfullMsg);
            else
                this.pcomponent.alertSuccess(Common.GetUpdateSuccessfullMsg);

            this._router.navigate(['/pages/superadmin/formconfiglist/1']);
        }
    }
}