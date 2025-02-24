import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { APICallService } from '../services/apicallservice.service';

@Component({
    selector: 'fostercarerpolicies',
    templateUrl: './fostercarerpolicies.component.template.html',
})
export class FosterCarerPoliciesComponent {
    isAdmin = true;
    headerText = "Policies & Guidelines";
    objQeryVal;
    formConfigId = 19; _Form: FormGroup;
    AccessFormCnfgId = 19;
    @ViewChild('uploads') uploadCtrl;
    docVisible = true; CategoryId: number;
    lstCategorys = [];
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder) {

        this._Form = _formBuilder.group({
            CategoryId: ['0'],
        });

        this.apiService.get("AgencyFormMapping", "GetAllByModuleCnfgIdId", 35).then(data => {
            this.lstCategorys = data;
        });

        //this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        //if (this.objQeryVal.I134d != null) {
        //    if (this.objQeryVal.Id != 1) {
        //        this.isAdmin = false;               
        //    }
        //}
    }

    ChangeCategory(FormId) {
        if (FormId != "" && FormId != null && FormId != 0) {
            //  this.formConfigId = FormId;
            this.docVisible = false;
            //this.AccessFormCnfgId = FormId;
            // this.AccessFormCnfgId = 19;
            this.uploadCtrl.SetFormcnfgId(FormId);
            let name = this.lstCategorys.filter(x => x.FormCnfg.FormCnfgId == FormId);
            if (name.length > 0) {
                this.headerText = name[0].FormCnfg.FormName;
            }
            this.uploadCtrl.GetByFormcnfId(FormId);
        }
        else {
            this.headerText = "Policies & Guidelines";
            this.docVisible = true;
        }

    }
}