import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerSupervisoryHomeVisitDTO } from './DTO/carersupervisoryhomevisitdto';

@Component({
    selector: 'CarerSupervisoryHomeVisitFCSignature',
    templateUrl: './carersupervisoryhomevisitfcsignature.component.template.html',
})

export class CarerSupervisoryHomeVisitFCSignatureComponet {
    _Form: FormGroup; loading = false;
    controllerName = "CarerSupervisoryHomeVisit";
    CarerParentId;
    objQeryVal; UserTypeId;
    objCarerSupervisoryHomeVisitDTO: CarerSupervisoryHomeVisitDTO = new CarerSupervisoryHomeVisitDTO();
    objCarerSHV: CarerSupervisoryHomeVisitDTO = new CarerSupervisoryHomeVisitDTO();
    lstCarerSecA = [];
    lstCarerSecB = [];
    lstCarerSecC = [];
    lstCarerSecD = [];
    lstChildSHV = [];
    lstCarerTrainingProfile = [];
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
            this.objCarerSupervisoryHomeVisitDTO.AgencySignatureCnfgId=1;
            this.AgencySignatureHidden=true;
        }

        //Bind Signature
         this.apiService.get("AgencySignatureCnfg", "GetMappedSignature", 59).then(data => {this.lstAgencySignatureCnfg=data});
       // this.inssignatureValue = "iVBORw0KGgoAAAANSUhEUgAABDMAAADnCAYAAAAD1x2RAAAVTUlEQVR4Xu3cvU1ceRTG4euAiABsCSHhhNBkdGCXQAnQAZ0gSqADQkJKwBUYGgA7MxGr/0gXDbN4DytjfF7pQbLWH5fh8JyT+Kfxvnt4eHiYfBAgQIAAAQIECBAgQIAAAQIEQgTeiRkhmzImAQIECBAgQIAAAQIECBAgsBAQMxwCAQIECBAgQIAAAQIECBAgECUgZkSty7AECBAgQIAAAQIECBAgQICAmOEGCBAgQIAAAQIECBAgQIAAgSgBMSNqXYYlQIAAAQIECBAgQIAAAQIExAw3QIAAAQIECBAgQIAAAQIECEQJiBlR6zIsAQIECBAgQIAAAQIECBAgIGa4AQIECBAgQIAAAQIECBAgQCBKQMyIWpdhCRAgQIAAAQIECBAgQIAAATHDDRAgQIAAAQIECBAgQIAAAQJRAmJG1LoMS4AAAQIECBAgQIAAAQIECIgZboAAAQIECBAgQIAAAQIECBCIEhAzotZlWAIECBAgQIAAAQIECBAgQEDMcAMECBAgQIAAAQIECBAgQIBAlICYEbUuwxIgQIAAAQIECBAgQIAAAQJihhsgQIAAAQIECBAgQIAAAQIEogTEjKh1GZYAAQIECBAgQIAAAQIECBAQM9wAAQIECBAgQIAAAQIECBAgECUgZkSty7AECBAgQIAAAQIECBAgQICAmOEGCBAgQIAAAQIECBAgQIAAgSgBMSNqXYYlQIAAAQIECBAgQIAAAQIExAw3QIAAAQIECBAgQIAAAQIECEQJiBlR6zIsAQIECBAgQIAAAQIECBAgIGa4AQIECBAgQIAAAQIECBAgQCBKQMyIWpdhCRAgQIAAAQIECBAgQIAAATHDDRAgQIAAAQIECBAgQIAAAQJRAmJG1LoMS4AAAQIECBAgQIAAAQIECIgZboAAAQIECBAgQIAAAQIECBCIEhAzotZlWAIECBAgQIAAAQIECBAgQEDMcAMECBAgQIAAAQIECBAgQIBAlICYEbUuwxIgQIAAAQIECBAgQIAAAQJihhsgQIAAAQIECBAgQIAAAQIEogTEjKh1GZYAAQIECBAgQIAAAQIECBAQM9wAAQIECBAgQIAAAQIECBAgECUgZkSty7AECBAgQIAAAQIECBAgQICAmOEGCBAgQIAAAQIECBAgQIAAgSgBMSNqXYYlQIAAAQIECBAgQIAAAQIExAw3QIAAAQIECBAgQIAAAQIECEQJiBlR6zIsAQIECBAgQIAAAQIECBAgIGa4AQIECBAgQIAAAQIECBAgQCBKQMyIWpdhCRAgQIAAAQIECBAgQIAAATHDDRAgQIAAAQIECBAgQIAAAQJRAmJG1LoMS4AAAQIECBAgQIAAAQIECIgZboAAAQIECBAgQIAAAQIECBCIEhAzotZlWAIECBAgQIAAAQIECBAgQEDMcAMECBAgQIAAAQIECBAgQIBAlICYEbUuwxIgQIAAAQIECBAgQIAAAQJihhsgQIAAAQIECBAgQIAAAQIEogTEjKh1GZYAAQIECBAgQIAAAQIECBAQM9wAAQIECBAgQIAAAQIECBAgECUgZkSty7AECBAgQIAAAQIECBAgQICAmOEGCBAgQIAAAQIECBAgQIAAgSgBMSNqXYYlQIAAAQIECBAgQIAAAQIExAw3QIAAAQIECBAgQIAAAQIECEQJiBlR6zIsAQIECBAgQIAAAQIECBAgIGa4AQIECBAgQIAAAQIECBAgQCBKQMyIWpdhCRAgQIAAAQIECBAgQIAAATHDDRAgQIAAAQIECBAgQIAAAQJRAmJG1LoMS4AAAQIECBAgQIAAAQIECIgZboAAAQIECBAgQIAAAQIECBCIEhAzotZlWAIECBAgQIAAAQIECBAgQEDMcAMECBAgQIAAAQIECBAgQIBAlICYEbUuwxIgQIAAAQIECBAgQIAAAQJihhsgQIAAAQIECBAgQIAAAQIEogTEjKh1GZYAAQIECBAgQIAAAQIECBAQM9wAAQIECBAgQIAAAQIECBAgECUgZkSty7AECBAgQIAAAQIECBAgQICAmOEGCBAgQIAAAQIECBAgQIAAgSgBMSNqXYYlQIAAAQIECBAgQIAAAQIExAw3QIAAAQIECBAgQIAAAQIECEQJiBlR6zIsAQIECBAgQIAAAQIECBAgIGa4AQIECBAgQIAAAQIECBAgQCBKQMyIWpdhCRAgQIAAAQIECBAgQIAAATHDDRAgQIAAAQIECBAgQIAAAQJRAmJG1LoMS4AAAQIECBAgQIAAAQIECIgZboAAAQIECBAgQIAAAQIECBCIEhAzotZlWAIECBAgQIAAAQIECBAgQEDMcAMECBAgQIAAAQIECBAgQIBAlICYEbUuwxIgQIAAAQIECBAgQIAAAQJihhsgQIAAAQIECBAgQIAAAQIEogTEjKh1GZYAAQIECBAgQIAAAQIECBAQM9wAAQIECBAgQIAAAQIECBAgECUgZkSty7AECBAgQIAAAQIECBAgQICAmOEGCBAgQIAAAQIECBAgQIAAgSgBMSNqXYYlQIAAAQIECBAgQIAAAQIExAw3QIAAAQIECBAgQIAAAQIECEQJiBlR6zIsAQIECBAgQIAAAQIECBAgIGa4AQIECBAgQIAAAQIECBAgQCBKQMyIWpdhCRAgQIAAAQIECBAgQIAAATHDDRAgQIAAAQIECBAgQIAAAQJRAmJG1LoMS4AAAQIECBAgQIAAAQIECIgZboAAAQIECBAgQIAAAQIECBCIEhAzotZlWAIECBAgQIAAAQIECBAgQEDMcAMECBAgQIAAAQIECBAgQIBAlICYEbUuwxIgQIAAAQIECBAgQIAAAQJihhsgQIAAAQIECBAgQIAAAQIEogTEjKh1GZYAAQIECBAgQIAAAQIECBAQM9wAAQIECBAgQIAAAQIECBAgECUgZkSty7AECBAgQIAAAQIECBAgQICAmOEGCBAgQIAAAQIECBAgQIAAgSgBMSNqXYYlQIAAAQIECBAgQIAAAQIExAw3QIAAAQIECBAgQIAAAQIECEQJiBlR6zIsAQIECBAgQIAAAQIECBAgIGa4AQIECBAgQIAAAQIECBAgQCBKQMyIWpdhCRAgQIAAAQIECBAgQIAAATHDDRAgQIAAAQIECBAgQIAAAQJRAmJG1LoMS4AAAQIECBAgQIAAAQIECIgZboAAAQIECBAgQIAAAQIECBCIEhAzotZlWAIECBAgQIAAAQIECBAgQEDMcAMECBAgQIAAAQIECBAgQIBAlICYEbUuwxIgQIAAAQIECBAgQIAAAQJihhsgQIAAAQIECBAgQIAAAQIEogTEjKh1GZYAAQIECBAgQIAAAQIECBAQM9wAAQIECBAgQIAAAQIECBAgECUgZkSty7AECBAgQIAAAQIECBAgQICAmOEGCBAgQIAAAQIECBAgQIAAgSgBMSNqXYYlQIAAAQIECBAgQIAAAQIExAw3QIAAAQIECBAgQIAAAQIECEQJiBlR6zIsAQIECBAgQIAAAQIECBAgIGa4AQIECBAgQIAAAQIECBAgQCBKQMyIWpdhCRAgQIAAAQIECBAgQIAAATHDDRAgQIAAAQIECBAgQIAAAQJRAmJG1LoMS4AAAQIECBAgQIAAAQIECIgZboAAAQIECBAgQIAAAQIECBCIEhAzotZlWAIECBAgQIAAAQIECBAgQEDMcAMECBAgQIAAAQIECBAgQIBAlICYEbUuwxIgQIAAAQIECBAgQIAAAQJihhsgQIAAAQIECBAgQIAAAQIEogTEjKh1GZYAAQIECBAgQIAAAQIECBAQM9wAAQIECBAgQIAAAQIECBAgECUgZkSty7AECBAgQIAAAQIECBAgQICAmOEGCBAgQIAAAQIECBAgQIAAgSgBMSNqXYYlQIAAAQIECBAgQIAAAQIExAw3QIAAAQIECBAgQIAAAQIECEQJiBlR6zIsAQIECBAgQIAAAQIECBAgIGa4AQIECBAgQIAAAQIECBAgQCBKQMyIWpdhCRAgQIAAAQIECBAgQIAAATHDDRAgQIAAAQIECBAgQIAAAQJRAmJG1LoMS4AAAQIECBAgQIAAAQIECIgZboAAAQIECBAgQIAAAQIECBCIEhAzotZlWAIECBAgQIAAAQIECBAgQEDMcAMECBAgQIAAAQIECBAgQIBAlICYEbUuwxIgQIAAAQIECBAgQIAAAQJihhsgQIAAAQIECBAgQIAAAQIEogTEjKh1GZYAAQIECBAgQIAAAQIECBAQM9wAAQIECBAgQIAAAQIECBAgECUgZkSty7AECBAgQIAAAQIECBAgQICAmOEGCBAgQIAAAQIECBAgQIAAgSgBMSNqXYYlQIAAAQIECBAgQIAAAQIExAw3QIAAAQIECBAgQIAAAQIECEQJiBlR6zIsAQIECBAgQIAAAQIECBAgIGa4AQIECBAgQIAAAQIECBAgQCBKQMyIWpdhCRAgQIAAAQIECBAgQIAAATHDDRAgQIAAAQIECBAgQIAAAQJRAmJG1LoMS4AAAQIECBAgQIAAAQIECIgZboAAAQIECBAgQIAAAQIECBCIEhAzotZlWAIECBAgQIAAAQIECBAgQEDMcAMECBAgQIAAAQIECBAgQIBAlICYEbUuwxIgQIAAAQIECBAgQIAAAQJihhsgQIAAAQIECBAgQIAAAQIEogTEjKh1GZYAAQIECBAgQIAAAQIECBAQM9wAAQIECBAgQIAAAQIECBAgECUgZkSty7AECBAgQIAAAQIECBAgQICAmOEGCBAgQIAAAQIECBAgQIAAgSgBMSNqXYYlQIAAAQIECBAgQIAAAQIExAw3QIAAAQIECBAgQIAAAQIECEQJiBlR6zIsAQIECBAgQIAAAQIECBAgIGa4AQIECBAgQIAAAQIECBAgQCBKQMyIWpdhCRAgQIAAAQIECBAgQIAAATHDDRAgQIAAAQIECBAgQIAAAQJRAmJG1LoMS4AAAQIECBAgQIAAAQIECIgZboAAAQIECBAgQIAAAQIECBCIEhAzotZlWAIECBAgQIAAAQIECBAgQEDMcAMECBAgQIAAAQIECBAgQIBAlMAfixmXl5fTzc3NdH19/fhjWebnz5/T+LG7uzt9//79Cdrqr8cfbm5uPj4zfj4+b/X3xq+3tram9fX1f73e+LPxuvN/59ecf++lW9vY2Hgyx/yLeZZ59jHf+N5f+jF/3nPzrX7/1Wsuf+3VuZZff36d2WD1z56zWX5mfB0fBAgQIECAAAECBAgQIEDgrQV+K2aMv+xeXV1NX79+XfzF/eLiYvr27dt0f3//1t/HX/96Hz58mG5vb//6HKsDvH//frq7u/sjc52cnEzHx8d/5LW9KAECBAgQIECAAAECBAgQ+JXA/4oZ490Wc7gYPx8ho9vHzs7O4t0ZI64sv3NjzPncOz5+/PgxjXdb/Nc7NubXWX53x/x9z7/38ePHaW1t7fHrzr//3DsuXttsdfblr706168cXjrT8js9Rsg4ODh46ad6jgABAgQIECBAgAABAgQIvIpAGTNGsDg6OvrtcDGCwf7+/iIajP+Oj729vWl7e3vx89XwsBoLxq+X/0nKeP5Xn/MqMl6EAAECBAgQIECAAAECBAgQaClQxozDw8Pp7OysHH7Eik+fPi3+icnnz58X4WE1XpQv4gECBAgQIECAAAECBAgQIECAQCFQxozxTwlOT0+fvMwcK0aw+PLly+KHDwIECBAgQIAAAQIECBAgQIDAWwiUMWP8Px/Oz88Xs8zx4i0G8zUIECBAgAABAgQIECBAgAABAs8JlDEDGwECBAgQIECAAAECBAgQIECgk4CY0WkbZiFAgAABAgQIECBAgAABAgRKATGjJPIAAQIECBAgQIAAAQIECBAg0ElAzOi0DbMQIECAAAECBAgQIECAAAECpYCYURJ5gAABAgQIECBAgAABAgQIEOgkIGZ02oZZCBAgQIAAAQIECBAgQIAAgVJAzCiJPECAAAECBAgQIECAAAECBAh0EhAzOm3DLAQIECBAgAABAgQIECBAgEApIGaURB4gQIAAAQIECBAgQIAAAQIEOgmIGZ22YRYCBAgQIECAAAECBAgQIECgFBAzSiIPECBAgAABAgQIECBAgAABAp0ExIxO2zALAQIECBAgQIAAAQIECBAgUAqIGSWRBwgQIECAAAECBAgQIECAAIFOAmJGp22YhQABAgQIECBAgAABAgQIECgFxIySyAMECBAgQIAAAQIECBAgQIBAJwExo9M2zEKAAAECBAgQIECAAAECBAiUAmJGSeQBAgQIECBAgAABAgQIECBAoJOAmNFpG2YhQIAAAQIECBAgQIAAAQIESgExoyTyAAECBAgQIECAAAECBAgQINBJQMzotA2zECBAgAABAgQIECBAgAABAqWAmFESeYAAAQIECBAgQIAAAQIECBDoJCBmdNqGWQgQIECAAAECBAgQIECAAIFSQMwoiTxAgAABAgQIECBAgAABAgQIdBIQMzptwywECBAgQIAAAQIECBAgQIBAKSBmlEQeIECAAAECBAgQIECAAAECBDoJiBmdtmEWAgQIECBAgAABAgQIECBAoBQQM0oiDxAgQIAAAQIECBAgQIAAAQKdBMSMTtswCwECBAgQIECAAAECBAgQIFAKiBklkQcIECBAgAABAgQIECBAgACBTgJiRqdtmIUAAQIECBAgQIAAAQIECBAoBcSMksgDBAgQIECAAAECBAgQIECAQCcBMaPTNsxCgAABAgQIECBAgAABAgQIlAJiRknkAQIECBAgQIAAAQIECBAgQKCTgJjRaRtmIUCAAAECBAgQIECAAAECBEoBMaMk8gABAgQIECBAgAABAgQIECDQSUDM6LQNsxAgQIAAAQIECBAgQIAAAQKlgJhREnmAAAECBAgQIECAAAECBAgQ6CQgZnTahlkIECBAgAABAgQIECBAgACBUkDMKIk8QIAAAQIECBAgQIAAAQIECHQSEDM6bcMsBAgQIECAAAECBAgQIECAQCkgZpREHiBAgAABAgQIECBAgAABAgQ6CYgZnbZhFgIECBAgQIAAAQIECBAgQKAUEDNKIg8QIECAAAECBAgQIECAAAECnQTEjE7bMAsBAgQIECBAgAABAgQIECBQCogZJZEHCBAgQIAAAQIECBAgQIAAgU4CYkanbZiFAAECBAgQIECAAAECBAgQKAXEjJLIAwQIECBAgAABAgQIECBAgEAnATGj0zbMQoAAAQIECBAgQIAAAQIECJQCYkZJ5AECBAgQIECAAAECBAgQIECgk8A/JOtliEiEkpUAAAAASUVORK5CYII=";
        this._Form = _formBuilder.group({
            AgencySignatureCnfgId:['0',Validators.required]
        });
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.SequenceNo = this.objQeryVal.sno;
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objCarerSupervisoryHomeVisitDTO.AgencyProfileId = this.AgencyProfileId;
        this.objCarerSupervisoryHomeVisitDTO.CarerParentId = this.CarerParentId;
        this.objCarerSupervisoryHomeVisitDTO.SequenceNo = this.SequenceNo;
        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 15]);
        }
        else {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.BindCarerSupervisoryHomeDetail();
            this.BindChildSHV();
        }
       
        // this.apiService.get("UploadDocuments", "GetImageById", 1).then(data => this.Response1(data));
    }
    srcPath = "";

    AgencySignatureCnfgChange(id) {
        this.submitted=false;
        this.objCarerSupervisoryHomeVisitDTO.AgencySignatureCnfgId=id;
        this.BindSingnature();
    }

    BindSingnature()
    { 
        this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objCarerSupervisoryHomeVisitDTO).then(data => {
        this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
         });
    }

    BindCarerSupervisoryHomeDetail() {
        if (this.CarerParentId != 0 && this.CarerParentId != null) {
            this.isLoading = true;
            this.apiService.post(this.controllerName, "GetSignatureBySequenceNo", this.objCarerSupervisoryHomeVisitDTO).then(data => {
                this.lstCarerSecA = data.filter(x => x.ControlLoadFormat == 'Carer Section A');
                this.lstCarerSecB = data.filter(x => x.ControlLoadFormat == 'Carer Section B');
                this.lstCarerSecC = data.filter(x => x.ControlLoadFormat == 'Carer Section C');
                this.lstCarerSecD = data.filter(x => x.ControlLoadFormat == 'Carer Section D');
                this.dynamicformcontrol = data.filter(x => x.ControlLoadFormat == 'FCSignature');
                ///GetCarerTrainingProfile
                let IsTrainingProfileGrid = data.filter(x => x.FieldCnfg.FieldName == "IsTrainingProfileGrid");
                if (IsTrainingProfileGrid.length > 0) {
                    let insCreatedDate = data.filter(x => x.FieldCnfg.FieldName == "CreatedDate");
                    if (insCreatedDate.length > 0) {
                        this.objCarerSHV.CreatedDate = this.module.GetDateSaveFormat(insCreatedDate[0].FieldValue);
                        this.GetCarerTrainingProfile();
                    }
                }
            });

           
        }
    }

    BindChildSHV() {

        this.apiService.get("ChildSupervisoryHomeVisit", "GetChildSHVListForCarerSHVId", this.SequenceNo).then(data => {
            this.lstChildSHV = data.filter(x => x.FieldName != "IsActive" && x.FieldName != "CreatedDate" && x.FieldName != "CreatedUserId" && x.FieldName != "UpdatedDate"
                && x.FieldName != "UpdatedUserId" && x.FieldName != "SaveAsDraftStatus" && x.FieldName != "IsLocked");
            this.isLoading = false;

        });
    }
    //signChange(val) {
    //    console.log('data page');
    //    //    alert(val)
    //    console.log(val);
    //}

    GetCarerTrainingProfile() {
        this.apiService.post(this.controllerName, "GetCarerTrainingProfile", this.objCarerSHV).then(data => {
            this.lstCarerTrainingProfile = data;
        });
    }


    clicksubmit(SectionAdynamicValue, SectionAdynamicForm,AddtionalEmailIds, EmailIds) {
        this.submitted = true;

        if (SectionAdynamicForm.valid) {
            this.isLoading=true;
            let type = "save";
            this.objCarerSupervisoryHomeVisitDTO.DynamicValue = SectionAdynamicValue;
            this.objCarerSupervisoryHomeVisitDTO.CarerParentId = this.CarerParentId;
            this.objCarerSupervisoryHomeVisitDTO.NotificationEmailIds = EmailIds;
            this.objCarerSupervisoryHomeVisitDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.apiService.post(this.controllerName, "SaveFcSignature", this.objCarerSupervisoryHomeVisitDTO).then(data => this.Respone(data, type));
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
            this._router.navigate(['/pages/fostercarer/carersupervisoryhomevisitlist/3']);
        }
    }
}