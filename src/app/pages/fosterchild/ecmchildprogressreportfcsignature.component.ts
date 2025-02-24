import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import {Common}  from  '../common'
import { Router, ActivatedRoute } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { BaseDTO} from '../basedto'
import {DynamicValue} from '../dynamic/dynamicvalue'
declare var window: any;
declare var $: any;

@Component({
    selector: 'ecmchildprogressreportfcsignature',
    templateUrl: './ecmchildprogressreportfcsignature.component.template.html',
})

export class EcmchildprogressreportfcsignatureComponents {
    objEcmChildProgressReportDTO: EcmChildProgressReportDTO = new EcmChildProgressReportDTO();
    submitted = false;
    _Form: FormGroup;
    rtnList = [];
    objQeryVal;
    childListVisible = true; CarerParentId;
    childIds = [];
    btnSaveText = "Save";
    arrayCarerList = [];
    carerMultiSelectValues = [];

    arrayChildList = []; carerName;
    dropdownvisible = true;
    ChildID: number;
    AgencyProfileId: number;
    CarerParentIdsLst: any = [];
    //Autofocus
    SectionAActive = "active";
    SectionBActive;
    DocumentActive;
    //Progress bar
    isLoading: boolean = false;
    SequenceNo;
    controllerName = "EcmChildProgressReport";
    //Signature
    UserTypeId;
    lstAgencySignatureCnfg=[];
    AgencySignatureHidden=false;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private _router: Router, private modal: PagesComponent,
        private renderer: Renderer2) {
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.SequenceNo = this.objQeryVal.sno;
        this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objEcmChildProgressReportDTO.ChildId = this.ChildID;
        this.objEcmChildProgressReportDTO.SequenceNo = this.SequenceNo;
        this.objEcmChildProgressReportDTO.AgencyProfileId = this.AgencyProfileId;
        this.objEcmChildProgressReportDTO.ControlLoadFormat=['Default'];
        this.BindChildSaferCarerDetail();

        this.UserTypeId= Common.GetSession("UserTypeId");
        if(this.UserTypeId==4)
        {
            this.objEcmChildProgressReportDTO.AgencySignatureCnfgId=1;
            this.AgencySignatureHidden=true;
        }
        //Bind Signature
        this.apiService.get("AgencySignatureCnfg", "GetMappedSignature", 83).then(data => {this.lstAgencySignatureCnfg=data});
        this._Form = _formBuilder.group({
            AgencySignatureCnfgId:['0',Validators.required],
        });

    }
  
    fnLoadCarerList(data) {
        //Multiselect dropdown array forming code.
        if (data) {
            data.forEach(item => {
                this.arrayCarerList.push({ id: item.CarerParentId, name: item.PCFullName + item.SCFullName + " (" + item.CarerCode + ")" });
            });

        }
    }
    AgencySignatureCnfgChange(id) {
        this.submitted=false;
        this.objEcmChildProgressReportDTO.AgencySignatureCnfgId=id;
        this.BindSingnature();
    }

    BindSingnature()
    { 
        this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objEcmChildProgressReportDTO).then(data => {
        this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
         });
    }

    fnSectionA() {
        this.SectionAActive = "active";
        this.SectionBActive = "";
        this.DocumentActive = "";
    }
    fnSectionB() {
        this.SectionAActive = "";
        this.SectionBActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.SectionAActive = "";
        this.SectionBActive = "";
        this.DocumentActive = "active";
    }

    lstCarerSecA = [];
    dynamicformcontrol = [];
    BindChildSaferCarerDetail() {
       
        if (this.ChildID != 0 && this.ChildID != null) {
            this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objEcmChildProgressReportDTO).then(data => {
                this.lstCarerSecA = data.filter(x => x.ControlLoadFormat != 'FCSignature');
                this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
            });
        }
    }
    clicksubmit(SectionAdynamicValue, SectionAdynamicForm,AddtionalEmailIds, EmailIds) {
        this.submitted = true;

        if (SectionAdynamicForm.valid) {
            this.isLoading=true;
            let type = "save";
            this.objEcmChildProgressReportDTO.DynamicValue = SectionAdynamicValue;
           // this.objEcmChildProgressReportDTO.CarerParentId = this.CarerParentId;
           this.objEcmChildProgressReportDTO.NotificationEmailIds = EmailIds;
           this.objEcmChildProgressReportDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.apiService.post(this.controllerName, "SaveFcSignature", this.objEcmChildProgressReportDTO).then(data => this.Respone(data, type));
        }
        else {
            this.SectionAActive = "";
            this.SectionBActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(SectionAdynamicForm);
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            this._router.navigate(['/pages/child/ecmchildprogressreportlist/4']);
        }
    }


}

export class EcmChildProgressReportDTO extends BaseDTO {
    EcmChildProgressReportId: number;
    UniqueID: number;
    ChildId: number;
    FieldId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();
    ControlLoadFormat: string[];
}