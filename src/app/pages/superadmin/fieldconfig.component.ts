import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { FieldConfig } from './DTO/fieldconfig';

@Component({
    selector: 'fieldconfig',
    templateUrl: './fieldconfig.component.template.html',
})

export class FieldConfigComponet {
    objFieldCon: FieldConfig = new FieldConfig();
    submitted = false;
    parentForm = null;
    returnFieldDataType;
    FieldCnfgId = null;
    respoError = null;
    objQeryVal;
    _FieldcnfgForm: FormGroup;
    IsLoading = false;
    controllerName = "FieldCnfg";

    constructor(private apiService: APICallService, _formBuilder: FormBuilder, private activatedroute: ActivatedRoute,
                private pComponent: PagesComponent, private _router: Router) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        //get parent module
        this.apiService.get("FormCnfg", "GetAll").then(data => this.ResponeForm(data));
        //formService.getForms().then(data => this.ResponeForm(data));

        //get field data type
        this.apiService.get("FieldDataType", "getall").then(data => this.ResponeFielDataType(data));
        //_fDataTypeConfigService.getFieldDataTypeConfig().then(data => this.ResponeFielDataType(data));
        
        this._FieldcnfgForm = _formBuilder.group({
            FormCnfgId: ['0', Validators.required],
            FieldName: ['', Validators.required],
            DisplayName: [''],
            FieldDataTypeCnfgId: ['0', Validators.required],
            FieldLength: [''],
            IsMandatory: [''],
        });
        
        this.FieldCnfgId = this.objQeryVal.id;
        if (this.FieldCnfgId != 0 && this.FieldCnfgId != null) {
            this.apiService.get(this.controllerName, "GetById", this.FieldCnfgId).then(data => { this.objFieldCon = data });
            //_fieldConfigService.getFielConfigById(this.FieldCnfgId).subscribe(data => { this.objFieldCon = data });
        }
    }

    private ResponeFielDataType(dataType) {
        if (dataType != null) {
            this.returnFieldDataType = dataType;
        }
    }

    private ResponeForm(form) {
        if (form != null) {
            this.parentForm = form;
        }
    }

    private ResponeVal(config: FieldConfig) {
        if (config != null) {
            this.objFieldCon = config;
        }
    }

    //btn Submit
    fieldconfigSubmit(contros) {
        this.submitted = true
        let type = "save";
        if (this.FieldCnfgId != 0)
            type = "update";
        if (!contros.valid) {
            this.pComponent.GetErrorFocus(contros);
        } 

        if (contros.valid) {
            this.IsLoading = true;
            this.apiService.save(this.controllerName, this.objFieldCon, type).then(data => this.Respone(data));
            //this._fieldConfigService.postFieldConfig(this.objFieldCon, type).then(data => this.Respone(data));
        }
    }

    private Respone(filedConfig) {
        this.IsLoading = false;
        if (filedConfig.IsError == true) {
            this.pComponent.alertDanger(filedConfig.ErrorMessage)
        }
        else if (filedConfig.IsError == false) {
            if (this.FieldCnfgId == 0)
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
            else
                this.pComponent.alertSuccess(Common.GetUpdateSuccessfullMsg);

            this._router.navigate(['/pages/superadmin/fieldcnfglist/1']);
        }
    }
}