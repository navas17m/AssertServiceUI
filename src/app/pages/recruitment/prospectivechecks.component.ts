
import { Component,ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProspectiveChecksDTO } from './DTO/prospectivechecksdto'
import { Common} from '../common'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { APICallService } from '../services/apicallservice.service';
import { PagesComponent } from '../pages.component';

@Component({
    selector: 'ProspectiveChecks',
    templateUrl: './prospectivechecks.component.template.html',
})

export class ProspectiveChecksComponent {
    isLoading = false;
    _Form: FormGroup;
    CarerParentId;
    FormCnfgId;
    AgencyProfileId;
    objProspectiveChecksDTO: ProspectiveChecksDTO = new ProspectiveChecksDTO();
    insChildDetails; 
    objQeryVal;
    controllerName = "CarerProspectiveCheck";
    listddlYesNoNotApplicable = [];
    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private _router: Router,  private route: ActivatedRoute,
         private modal: PagesComponent) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));

        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 13]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 33]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.LoadProspectiveChecks();
        }
        else if (this.objQeryVal.mid == 13) {
           
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.LoadProspectiveChecks();
        }
        this.FormCnfgId = 302;

        this._Form = _formBuilder.group({
            LocalAuthority: [],
            FirstApplicantCRB: [],
            SecondApplicantCRB: [],
            ChildrenCRB: [],
            NominatedCarerCRB1: [],
            NominatedCarerCRB2:[],
            FrequentVisitorsCRB:[],
            Reference1:[],
            Reference2:[],
            Reference3:[],
            ExpartnerReference1:[],
            ExpartnerReference2:[],
            EducationReference1:[],
            EducationReference2:[],
            EmploymentReference1:[],
            EmploymentReference2:[],
            OtherIFA:[],
            MedicalAdvisor:[],
            AgencyMedicalAdvisor:[],
            TrainingSTF:[],
            PhotoUploaded:[],
            Interview:[],
            DriversLicence:[],
            Passport:[],
            MortgageStatement:[],
            TenancyAgreement:[],
            UtilityBills:[],
            NationalInsuranceNumber:[],
            Marriage:[],
            ManagerCommnets:[],
            SocialWorkerComment:[],
            SeniorManagersApproval:[],
            ApprovedByManager:[],       
        });
       //Doc
       this.formId = 302;
       this.TypeId = this.CarerParentId;
       this.tblPrimaryKey = this.CarerParentId;
    }

    ChecksRecievedActive='active';
    AdditionalActive;
    ApprovalActive;
    insDocumentActive = "";
    fnChecksRecieved(){
       this.ChecksRecievedActive='active';
       this.AdditionalActive='';
       this.ApprovalActive='';
       this.insDocumentActive = "";
    }
    fnAdditional(){
        this.ChecksRecievedActive='';
        this.AdditionalActive='active';
        this.ApprovalActive='';
        this.insDocumentActive = "";
     }
     fnApproval(){
        this.ChecksRecievedActive='';
        this.AdditionalActive='';
        this.ApprovalActive='active';
        this.insDocumentActive = "";

     }
     fnDocumentActive() {
        this.ChecksRecievedActive='';
        this.AdditionalActive='';
        this.ApprovalActive='';
        this.insDocumentActive = "active";

    }
    LoadProspectiveChecks() {
        this.apiService.get(this.controllerName, "GetById", this.CarerParentId).then(data => {
           this.responseData(data);
        });
    }

    dateString;
    responseData(data) {
        if (data) {
            this.objProspectiveChecksDTO = data;
        }
    }

    DocOk = true;
    clicksubmit(UploadDocIds,IsUpload, uploadFormBuilder) {

        if (!this._Form.valid) {
            this.modal.GetErrorFocus(this._Form);
            this.ChecksRecievedActive='active';
                this.AdditionalActive='';
                this.ApprovalActive='';
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
                this.ChecksRecievedActive='';
                this.AdditionalActive='';
                this.ApprovalActive='';
                this.insDocumentActive = "active";
        
            }
        }

        if (this._Form.valid && this.DocOk) {
            this.isLoading = true;
            let type = "save";
            if (this.objProspectiveChecksDTO.CarerProspectiveCheckId > 0)
                type = "update";

            this.objProspectiveChecksDTO.CarerParentId = this.CarerParentId;
            this.objProspectiveChecksDTO.CreatedUserId = parseInt(Common.GetSession("UserProfileId"));
            this.objProspectiveChecksDTO.UpdatedUserId = parseInt(Common.GetSession("UserProfileId"));
            this.apiService.save(this.controllerName, this.objProspectiveChecksDTO, "save").then(data => this.Respone(data, type,IsUpload));
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
            this.LoadProspectiveChecks();
        }
    }

}