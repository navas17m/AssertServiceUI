import { Component, Renderer2 } from '@angular/core';
import {Common}  from  '../common'
import { ChildSupervisoryHomeVisitDTO } from '../fostercarer/DTO/childsupervisoryhomevisitdto';
import { Router, ActivatedRoute } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
declare var window: any;
declare var $: any;
@Component({
    selector: 'fostercarerdiaryrecordingFCSignature',
    templateUrl: './fostercarerdiaryrecordingfcsignature.component.html',
})

export class FostercarerdiaryrecordingFCSignatureComponents {
    objChildSupervisoryHomeVisitDTO: ChildSupervisoryHomeVisitDTO = new ChildSupervisoryHomeVisitDTO();
    submitted = false;
    _Form: FormGroup;
    rtnList = [];
    objQeryVal;UserTypeId;
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
    ChildDetailTabActive = "active";
    ChildYPTabActive = "";
    FosterHomeTabActive = "";
    HealthTabActive = "";
    EducationTabActive = "";
    ContactTabActive = "";
    DocumentActive;
     //Tab Visibele
     ChildYPVisible = true;
     FosterVisible = true;
     HealthVisible = true;
     EducationVisible = true;
     ContactVisible = true;
    //Progress bar
    isLoading: boolean = false;
    SequenceNo;
    controllerName = "FosterCarerDiaryRecording";
    carerSHVSqno;
    //Signature
    lstAgencySignatureCnfg=[];
    AgencySignatureHidden=false;

    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private _router: Router, private modal: PagesComponent,
        private renderer: Renderer2) {
        
     

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.SequenceNo = this.objQeryVal.sno;
        //this.ChildID = parseInt(Common.GetSession("ChildId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildSupervisoryHomeVisitDTO.ChildId = this.objQeryVal.cid;
        this.objChildSupervisoryHomeVisitDTO.SequenceNo = this.objQeryVal.sno;

        this.UserTypeId = Common.GetSession("UserTypeId");
        if (this.UserTypeId == 4) {
            this.objChildSupervisoryHomeVisitDTO.AgencySignatureCnfgId = 1;
            this.AgencySignatureCnfgChange(1);
            this.AgencySignatureHidden = true;
        };

        //Bind Signature
        this.apiService.get("AgencySignatureCnfg", "GetMappedSignature", 84).then(data => {this.lstAgencySignatureCnfg=data});

        this.BindChildSHVDetails();
        this._Form = _formBuilder.group({
            AgencySignatureCnfgId:['0',Validators.required]
        });

      
    }
    

    fnChildDetailTab() {
        this.ChildDetailTabActive = "active";
        this.DocumentActive = "";
    }
   
    fnDocumentDetailTab() {
        this.ChildDetailTabActive = "";
        this.DocumentActive = "active";
    }
   

    AgencySignatureCnfgChange(id) {
        this.submitted=false;
        this.objChildSupervisoryHomeVisitDTO.AgencySignatureCnfgId=id;
        this.BindSingnature();
    }

    BindSingnature()
    { 
        this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objChildSupervisoryHomeVisitDTO).then(data => {
           
        this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
       
         });
    }


    lstCarerSecA = [];
    dynamicformcontrol = [];
    BindChildSHVDetails() {

        this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objChildSupervisoryHomeVisitDTO).then(data => {
            this.lstCarerSecA = data.filter(x => x.ControlLoadFormat != 'FCSignature');
        });

    }
    clicksubmit(SectionAdynamicValue, SectionAdynamicForm) {
        this.submitted = true;

        if (SectionAdynamicForm.valid) {
            let type = "save";

            this.objChildSupervisoryHomeVisitDTO.DynamicValue = SectionAdynamicValue;
            this.objChildSupervisoryHomeVisitDTO.CarerSHVSequenceNo = this.carerSHVSqno;
            this.apiService.post(this.controllerName, "SaveFcSignature", this.objChildSupervisoryHomeVisitDTO).then(data => this.Respone(data, type));
        }
        else {
            this.ChildDetailTabActive = "";
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
            this._router.navigate(['/pages/child/fostercarerdiaryrecordinglist/4']);
        }
    }


  
   

}
