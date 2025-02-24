import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablenames';
import { ConfigTableValuesDTO } from '../superadmin/DTO/configtablevalues';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'dropdown',
    templateUrl: './dropdown.component.template.html'
})

export class DropdownComponet {
    objDropdownComponetDTO: DropdownComponetDTO = new DropdownComponetDTO();
    objConfigTableNames: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objConfigTableValues: ConfigTableValuesDTO = new ConfigTableValuesDTO();
    lstModuleCnfg; lstConfigTables; lstParentConfigTables = []; lstParentTablt; lstConfigTableValues;
    submitted = false; configTableSubmit = false; btnSave = "Save";
    dropdownForm: FormGroup;
    configTable: FormGroup; configValues: FormGroup;
    moduleCnfgId; configTableName; configTableId; parentTableName;
    visibleNewTable = false;
    AgencyProfileId: number;
    isLoading: boolean = false;
    isLoading2: boolean = false;
    controllerName = "Dropdown";
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=8;
    constructor(private apiService: APICallService, _formBuilder: FormBuilder, private activatedroute: ActivatedRoute, private _router: Router, private module: PagesComponent) {

        if (Common.GetSession("UserProfileId") == "1")
            this.visibleNewTable = true;

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objConfigTableValues.IsApproved = true;
        this.apiService.get(this.controllerName, "GetAllModuleCnfg").then(data => { this.lstModuleCnfg = data });
        //this.dropdownService.GetAllModuleCnfg().then(data => this.lstModuleCnfg = data);
        this.dropdownForm = _formBuilder.group({
            Module: ['0', Validators.required],
            Form: ['0', [Validators.required]],

        });
        this.configTable = _formBuilder.group({
            ParentForm: [],
            TableName: ['', Validators.required],

        });
        this.configValues = _formBuilder.group({
            TableValue: ['', Validators.required],
            chkDefault: [],
            ParentForm: ['0', [Validators.required]],
            chkApproved: [],
        });

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
        this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    fnLoadTables(value)
    {
        //this._simplertService.setMessage("test");
        this.moduleCnfgId = value;
        this.objConfigTableNames.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNames.ModuleCnfgId = value;
        this.apiService.post(this.controllerName, "GetAllConfigTableNames", this.objConfigTableNames).then(data => this.lstConfigTables = data);
        //this.dropdownService.GetAllConfigTableNames(this.objConfigTableNames).then(data => this.lstConfigTables = data);
        this.lstConfigTableValues = null;
        this.objDropdownComponetDTO.TablesId = null;
    }

    fnLoadParentTables(value) {
        //this.statusName = this.carerstatusList.find((item: any) => item.CarerStatusId == val).Description;
        if (value > 0) {
            this.apiService.get(this.controllerName, "GetAllConfigTableValues", value).then(data => this.lstConfigTableValues = data);
            //this.dropdownService.GetAllConfigTableValues(value).then(data => this.lstConfigTableValues = data);
            this.configTableId = value;
            this.fnLoadParentTable(this.lstConfigTables.find((item: any) => item.ConfigTableNamesId == value).ParentTableId);
            this.configTableName = this.lstConfigTables.find((item: any) => item.ConfigTableNamesId == value).Name;
            this.lstParentConfigTables = [];
            this.lstConfigTables.forEach(item => {
                if (item.ConfigTableNamesId != value) {
                    this.lstParentConfigTables.push(item);
                }
            });
        }
    }

    fnLoadParentTable(value){
        this.lstParentTablt = null;
        this.fnClear();
        if (value) {
            this.parentTableName = this.lstConfigTables.find((item: any) => item.ConfigTableNamesId == value).Name;
            this.apiService.get(this.controllerName, "ConfigTableValuesGetByConfigTableId", value).then(data => this.lstParentTablt = data);
            //this.dropdownService.ConfigTableValuesGetByConfigTableId(value).then(data => this.lstParentTablt = data);
        }
        else
            this.parentTableName = false;
    }

    fnSaveConfigTable(form){
        this.configTableSubmit = true;
        if (form.valid) {
            this.isLoading = true;
            this.objConfigTableNames.ModuleCnfgId = this.moduleCnfgId;
            this.objConfigTableNames.AgencyProfileId = this.AgencyProfileId;
            this.apiService.post(this.controllerName, "SaveConfigTableNames", this.objConfigTableNames).then(data => this.ResponeTable(data));
            //this.dropdownService.SaveConfigTableNames(this.objConfigTableNames).then(data => this.ResponeTable(data));
        }
    }

    fnSaveTableValues(dropdownForm, configValues): void {
        this.submitted = true;
        this.configTableSubmit = false;
        if (dropdownForm.valid && configValues.valid) {
            this.isLoading2 = true;
            this.objConfigTableValues.ConfigTableNamesId = this.configTableId;

            if (this.btnSave == "Save")
            {
                this.apiService.post(this.controllerName, "SaveConfigTableValues", this.objConfigTableValues).then(data => this.Respone(data, "Save"));
                //this.dropdownService.SaveConfigTableValues(this.objConfigTableValues).then(data => this.Respone(data, "Save"));
            }
            else {
                this.submitted = false;
                this.apiService.post(this.controllerName, "UpdateConfigTableValues", this.objConfigTableValues).then(data => this.Respone(data, "Update"));
                //this.dropdownService.UpdateConfigTableValues(this.objConfigTableValues).then(data => this.Respone(data, "Update"));
                this.btnSave = "Save";
                this.objConfigTableValues = new ConfigTableValuesDTO();
            }
        }
    }

    private ResponeTable(data) {
        this.isLoading = false;
        this.fnLoadTables(this.moduleCnfgId);
        this.submitted = false;
        this.module.alertSuccess("Record Saved Successfully");
    }

    private Respone(data, msg) {
        this.isLoading2 = false;

        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.apiService.get(this.controllerName, "GetAllConfigTableValues", this.configTableId).then(data => this.lstConfigTableValues = data);
            //this.dropdownService.GetAllConfigTableValues(this.configTableId).then(data => this.lstConfigTableValues = data);
            this.fnClear();
            if(msg=="Save")
            {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
            }                
            else if (msg == "Update")
            {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.objConfigTableValues.CofigTableValuesId;
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }                
            else
            {
                this.objUserAuditDetailDTO.ActionId =3;
                this.objUserAuditDetailDTO.RecordNo = this.objConfigTableValues.CofigTableValuesId;
                this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            }                
        }
    }
	insSubmitOrUpdate = "Submit";
    insClearOrCancel = "Clear";
    insAddOrEditValue = "Add";
    private fnEditConfigValues(Id, Value, IsDefault, IsApproved){
        this.btnSave = "Update";
		this.insSubmitOrUpdate = "Update";
        this.insClearOrCancel = "Cancel";
        this.insAddOrEditValue = "Edit";
        this.objConfigTableValues.CofigTableValuesId = Id;
        this.objConfigTableValues.Value = Value;
        this.objConfigTableValues.IsDefault = IsDefault;
        this.objConfigTableValues.IsApproved = IsApproved;
        if (this.lstConfigTableValues != null) {
            for (let insCP of this.lstConfigTableValues) {
                if (insCP.CofigTableValuesId == Id) {
                    insCP.IsEdit = true;
                }
                else
                    insCP.IsEdit = false;
            }
        }
    }

    private fnDeleteConfigValues(Id){
        this.apiService.delete(this.controllerName, Id).then(data => this.Respone(data, "Delete"));
            //this.dropdownService.DeleteConfigTableValues(Id).then(data => this.Respone(data, "Delete"));
    }

    private fnClear(){
		this.insSubmitOrUpdate = "Submit";
        this.insClearOrCancel = "Clear";
        this.insAddOrEditValue = "Add";
        this.submitted = false;
        this.objConfigTableValues.Value = "";
        this.objConfigTableValues.IsDefault = false;
        this.objConfigTableValues.IsApproved = true;
        this.btnSave = "Save";

        if (this.lstConfigTableValues != null) {
            let data = this.lstConfigTableValues.filter(x => x.IsEdit == true);
            if (data.length > 0) {
                data[0].IsEdit = false;
            }
        }
    }
    getRowClass=(row)=>{
        return { 'rowSelected' : row.IsEdit == true,
                 'rowNotSelected' : row.IsEdit != true }
        // if(row.HREmployeeLeaveRequestId==this.EditId){
        //     return "rowSelected";
        // }
    }

}

export class DropdownComponetDTO {

    ModuleId: number = null;
    TablesId: number = null;
}
