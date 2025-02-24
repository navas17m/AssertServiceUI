
import { Component,ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CarerInitialCheckDTO } from './DTO/carerinitialcheckdto'
import { Common} from '../common'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { APICallService } from '../services/apicallservice.service';
import { PagesComponent } from '../pages.component';

@Component({
    selector: 'CarerInitialCheck',
    templateUrl: './carerinitialcheck.component.template.html',
})

export class CarerinitialcheckComponent {
    isLoading = false;
    _Form: FormGroup;
    CarerParentId;
    AgencyProfileId;
    objCarerInitialCheckDTO: CarerInitialCheckDTO = new CarerInitialCheckDTO();
    insChildDetails; 
    objQeryVal;
    controllerName = "CarerInitialCheck";
    listddlYesNoNotApplicable = [];
    //Doc
    FormCnfgId;
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private _router: Router,  private route: ActivatedRoute,
         private modal: PagesComponent) {
        this.formId=301;     
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));

        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 13]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 32]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 46;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.LoadCarerInitialCheck();
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 26;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.LoadCarerInitialCheck();
        }

        this._Form = _formBuilder.group({
            InitialHomeVisitCompleted: [],
            InitialHomeVisitAuthorised: [],
            HealthSafetyCheckUploaded: [],
            HealthSafetyCheckDate: [],
            HealthSafetyCheckAuthorised: [],
            PetQuestionaireCompleted: [],
            PetQuestionaireDate: [],
            ConsentFormSigned: [],
            ConsentDate: [],
            AgreementSigned: [],
            AgreementReceivedDate: [],
            ApprovedByManager: [],       
        });
       
        //Doc
        this.formId = 301;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.CarerParentId;
    }
    insd3InfoActive = "active";
    insDocumentActive = "";
    fnD3InfoActive() {
        this.insd3InfoActive = "active";
        this.insDocumentActive = "";

    }
    fnDocumentActive() {
        this.insd3InfoActive = "";
        this.insDocumentActive = "active";

    }

    LoadCarerInitialCheck() {
        this.apiService.get(this.controllerName, "GetById", this.CarerParentId).then(data => {
           this.responseData(data);
        });
    }

    dateString;
    responseData(data) {
        if (data) {
            this.objCarerInitialCheckDTO = data;
            this.objCarerInitialCheckDTO.HealthSafetyCheckDate = this.modal.GetDateEditFormat(this.objCarerInitialCheckDTO.HealthSafetyCheckDate);
            this.objCarerInitialCheckDTO.PetQuestionaireDate = this.modal.GetDateEditFormat(this.objCarerInitialCheckDTO.PetQuestionaireDate);
            this.objCarerInitialCheckDTO.ConsentDate = this.modal.GetDateEditFormat(this.objCarerInitialCheckDTO.ConsentDate);
            this.objCarerInitialCheckDTO.AgreementReceivedDate = this.modal.GetDateEditFormat(this.objCarerInitialCheckDTO.AgreementReceivedDate);
        }
        else{
            this.objCarerInitialCheckDTO.HealthSafetyCheckDate =null;
            this.objCarerInitialCheckDTO.PetQuestionaireDate =null;
            this.objCarerInitialCheckDTO.ConsentDate = null;
            this.objCarerInitialCheckDTO.AgreementReceivedDate =null;


        }
    }

    DocOk = true;

    clicksubmit(UploadDocIds,IsUpload, uploadFormBuilder) {
        if (!this._Form.valid) {
            this.modal.GetErrorFocus(this._Form);
            this.insd3InfoActive = "active";
            this.insDocumentActive = "";
        }
        this.DocOk = true;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
            {
                this.DocOk = false;
                this.insd3InfoActive = "";
                this.insDocumentActive = "active";
        
            }
        }

        if (this._Form.valid && this.DocOk) {
            this.isLoading = true;
            let type = "save";
            if (this.objCarerInitialCheckDTO.CarerInitialCheckId > 0)
                type = "update";

            this.objCarerInitialCheckDTO.HealthSafetyCheckDate = this.modal.GetDateSaveFormat(this.objCarerInitialCheckDTO.HealthSafetyCheckDate);
            this.objCarerInitialCheckDTO.PetQuestionaireDate = this.modal.GetDateSaveFormat(this.objCarerInitialCheckDTO.PetQuestionaireDate);
            this.objCarerInitialCheckDTO.ConsentDate = this.modal.GetDateSaveFormat(this.objCarerInitialCheckDTO.ConsentDate);
            this.objCarerInitialCheckDTO.AgreementReceivedDate = this.modal.GetDateSaveFormat(this.objCarerInitialCheckDTO.AgreementReceivedDate);
           
            this.objCarerInitialCheckDTO.CarerParentId = this.CarerParentId;
            this.objCarerInitialCheckDTO.CreatedUserId = parseInt(Common.GetSession("UserProfileId"));
            this.objCarerInitialCheckDTO.UpdatedUserId = parseInt(Common.GetSession("UserProfileId"));
            this.apiService.save(this.controllerName, this.objCarerInitialCheckDTO, "save").then(data => this.Respone(data, type,IsUpload));
        }
    }

    private Respone(data, type,IsUpload) {
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
            if (IsUpload) {
                this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
            }
            this.LoadCarerInitialCheck();
        }
    }

}