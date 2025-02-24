import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerTrainingProfileDTO } from './DTO/carertrainingprofiledto';
import { TrainingAttendedStatusDTO } from './DTO/trainingattendedstatus';
@Component({
    selector: 'CarerTrainingProfileFCSignature',
    templateUrl: './carertrainingprofilefcsignature.component.template.html',
})

export class CarerTrainingProfileFCSignatureComponet {
    globalObjAtteStatusList = [];
    objAttendedStatusList: TrainingAttendedStatusDTO[] = [];
    _Form: FormGroup;
    controllerName = "CarerTrainingProfile";
    CarerParentId;
    objQeryVal; UserTypeId;
    objCarerTrainingProfileDTO: CarerTrainingProfileDTO = new CarerTrainingProfileDTO();
    objCarerSHV: CarerTrainingProfileDTO = new CarerTrainingProfileDTO();
    lstCarerSecA = [];
    dynamicformcontrol = [];
    SequenceNo;
    submittedUpload = false;
    AgencyProfileId;
    isLoading: boolean = false;
    submitted = false;
    inssignatureValue;
    expanded = true;

    PageHCAActive = "active";
    DocumentActive;
    //Signature
    lstAgencySignatureCnfg=[];
    AgencySignatureHidden=false;
    constructor(private _formBuilder: FormBuilder, private activatedroute: ActivatedRoute, private _router: Router,
        private apiService: APICallService, private module: PagesComponent) {

        this._Form = _formBuilder.group({
            AgencySignatureCnfgId:['0',Validators.required],
        });
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.SequenceNo = this.objQeryVal.sno;

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objCarerTrainingProfileDTO.AgencyProfileId = this.AgencyProfileId;
        this.objCarerTrainingProfileDTO.SequenceNo = this.SequenceNo;

        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 9]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 9]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.objCarerTrainingProfileDTO.CarerParentId = this.CarerParentId;
            this.BindTrainProfileDetails();
        }
        else if (this.objQeryVal.mid == 13) {
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.objCarerTrainingProfileDTO.CarerParentId = this.CarerParentId;
            this.BindTrainProfileDetails();
        }

        this.UserTypeId = Common.GetSession("UserTypeId");
        if(this.UserTypeId==4)
        {
            this.objCarerTrainingProfileDTO.AgencySignatureCnfgId=1;
            this.AgencySignatureHidden=true;
        }
        //Bind Signature
        this.apiService.get("AgencySignatureCnfg", "GetMappedSignature", 28).then(data => {

            this.lstAgencySignatureCnfg=data;
           // console.log(this.lstAgencySignatureCnfg);
        });
    }

    AgencySignatureCnfgChange(id) {
        this.submitted=false;
        this.objCarerTrainingProfileDTO.AgencySignatureCnfgId=id;
        this.BindSingnature();
    }

    BindSingnature()
    {
        this.dynamicformcontrol=[];
        this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objCarerTrainingProfileDTO).then(data => {
        this.dynamicformcontrol = data.LstCarerTrainingProfile.filter(x => x.ControlLoadFormat == 'FCSignature');
        //console.log(this.dynamicformcontrol);
         });
    }

    objAttendedStatusListInsert = [];
    LoadAlreadyStoreDate(data) {

        if (data != null) {
            data.forEach(item => {
                this.objAttendedStatusList = [];
                item.forEach(subItem => {
                    let add: TrainingAttendedStatusDTO = new TrainingAttendedStatusDTO();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.StatusId = 4;
                    this.objAttendedStatusList.push(add);
                    this.objAttendedStatusListInsert.push(add);
                });
                this.globalObjAtteStatusList.push(this.objAttendedStatusList);
            });
        }
    }

    fnPageHCA() {
        this.PageHCAActive = "active";
        this.DocumentActive = "";
    }

    fnDocumentDetail() {
        this.PageHCAActive = "";
        this.DocumentActive = "active";
    }


    BindTrainProfileDetails() {
        if (this.CarerParentId != 0 && this.CarerParentId != null) {
            this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objCarerTrainingProfileDTO).then(data => {
                this.lstCarerSecA = data.LstCarerTrainingProfile.filter(x => x.ControlLoadFormat != 'FCSignature');


                let temp=this.lstCarerSecA.filter(x=>x.FieldCnfg.FieldName=="PPDPCompleted" && x.FieldValue!="Yes");
                if(temp.length>0)
                {
                    this.LoadAlreadyStoreDate(data.LstCarerTrainingCourseDate);
                }

                this.dynamicformcontrol = data.LstCarerTrainingProfile.filter(x => x.ControlLoadFormat == 'FCSignature');

            });
        }
    }

    clicksubmit(SectionAdynamicValue, SectionAdynamicForm, AddtionalEmailIds, EmailIds) {
        this.submitted = true;

        if (SectionAdynamicForm.valid) {
            this.isLoading=true;
            let type = "save";
            this.objCarerTrainingProfileDTO.DynamicValue = SectionAdynamicValue;
            this.objCarerTrainingProfileDTO.CarerParentId = this.CarerParentId;
            this.objCarerTrainingProfileDTO.NotificationEmailIds = EmailIds;
            this.objCarerTrainingProfileDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.apiService.post(this.controllerName, "SaveFcSignature", this.objCarerTrainingProfileDTO).then(data => this.Respone(data, type));
        }
        else {
            this.PageHCAActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(SectionAdynamicForm);
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

            if (this.objQeryVal.mid == 13)
                this._router.navigate(['/pages/recruitment/carertrainingprofilelist/13']);
            else
                this._router.navigate(['/pages/fostercarer/carertrainingprofilelist/3']);
        }
    }
}
