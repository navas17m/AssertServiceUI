import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerDisclosureDTO } from './DTO/carerdisclosuredto';

@Component({
    selector: 'carerdisclosureFCSignature',
    templateUrl: './carerdisclosurefcsignature.component.template.html',
})

export class carerdisclosureFCSignatureComponet {
    _Form: FormGroup; loading = false;
    controllerName = "carerdisclosure";
    CarerParentId;
    objQeryVal; UserTypeId;
    objCarerDisclosureDTO: CarerDisclosureDTO = new CarerDisclosureDTO();
    objCarerSHV: CarerDisclosureDTO = new CarerDisclosureDTO();
    lstCarerSecA = [];

    dynamicformcontrol = [];
    SequenceNo;
    submittedUpload = false;
    AgencyProfileId;
    isLoading: boolean = false;
    submitted = false;
    inssignatureValue;
    expanded = true;
    //Signature
    lstAgencySignatureCnfg=[];
    AgencySignatureHidden=false;
    constructor(private _formBuilder: FormBuilder, private activatedroute: ActivatedRoute, private _router: Router,
        private apiService: APICallService, private module: PagesComponent) {

        this.UserTypeId= Common.GetSession("UserTypeId");
        if(this.UserTypeId==4)
        {
            this.objCarerDisclosureDTO.AgencySignatureCnfgId=1;
            this.AgencySignatureHidden=true;
        }

        //Bind Signature
        this.apiService.get("AgencySignatureCnfg", "GetMappedSignature", 330).then(data => {this.lstAgencySignatureCnfg=data});
        this._Form = _formBuilder.group({
            AgencySignatureCnfgId:['0',Validators.required]
        });
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.SequenceNo = this.objQeryVal.sno;
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objCarerDisclosureDTO.AgencyProfileId = this.AgencyProfileId;
        this.objCarerDisclosureDTO.CarerParentId = this.CarerParentId;
        this.objCarerDisclosureDTO.SequenceNo = this.SequenceNo;
        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 46]);
        }
        else {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.BindDisClosurDetail();
        }
       
        // this.apiService.get("UploadDocuments", "GetImageById", 1).then(data => this.Response1(data));
    }
    srcPath = "";

    AgencySignatureCnfgChange(id) {
        this.submitted=false;
        this.objCarerDisclosureDTO.AgencySignatureCnfgId=id;
        this.BindSingnature();
    }

    BindSingnature()
    { 
        this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objCarerDisclosureDTO).then(data => {
        this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
         });
    }

    BindDisClosurDetail() {
        if (this.CarerParentId != 0 && this.CarerParentId != null) {
            this.isLoading = true;
            this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objCarerDisclosureDTO).then(data => {
                this.lstCarerSecA = data.filter(x => x.ControlLoadFormat == 'Default');
                this.isLoading=false;
            });

           
        }
    }


    clicksubmit(SectionAdynamicValue, SectionAdynamicForm,AddtionalEmailIds, EmailIds) {
        this.submitted = true;

        if (SectionAdynamicForm.valid) {
            this.isLoading=true;
            let type = "save";
            this.objCarerDisclosureDTO.DynamicValue = SectionAdynamicValue;
            this.objCarerDisclosureDTO.CarerParentId = this.CarerParentId;
            this.objCarerDisclosureDTO.NotificationEmailIds = EmailIds;
            this.objCarerDisclosureDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.apiService.post(this.controllerName, "SaveFcSignature", this.objCarerDisclosureDTO).then(data => this.Respone(data, type));
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            this._router.navigate(['/pages/fostercarer/disclosurelist/3']);
        }
    }
}