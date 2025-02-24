
import { Location} from '@angular/common';
import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
////import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CLADocumentationDTO } from './DTO/cladocumentationdto'
import { Common} from '../common'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { APICallService } from '../services/apicallservice.service';
import { PagesComponent } from '../pages.component';

import { ConfigTableNames } from '../configtablenames'
import { ConfigTableNamesDTO} from '../superadmin/DTO/configtablename'
@Component({
    selector: 'CLADocumentation',
    templateUrl: './cladocumentation.component.template.html',
})

export class CLADocumentationComponent {
    isLoading = false;
    _Form: FormGroup;
    ChildId;
    AgencyProfileId;
    hisCLADocumentationDTO: CLADocumentationDTO = new CLADocumentationDTO();
    objCLADocumentationDTO: CLADocumentationDTO = new CLADocumentationDTO();
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    insChildDetails; objQeryVal; controllerName = "ChildCLADocumentation";
    listddlYesNoNotApplicable = [];
    @ViewChild('btnViewCLADocu') infobtnViewCLADocu: ElementRef;
    lstcladoumentationHistory = [];
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private renderer: Renderer2,
        private _router: Router, private _location: Location, private route: ActivatedRoute, private modal: PagesComponent) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this._Form = _formBuilder.group({
            LAPlacementPlanDate: [],
            LAPlacementPlanOnFile: ['0'],
            LARiskAssessmentDate: [],
            LARiskAssessmentOnFile: ['0'],
            DelegatedAuthorityDate: [],
            DelegatedAuthorityOnFile: ['0'],
            CLAMedicalDate: [],
            CLAMedicalOnFile: ['0'],
            CLAReviewDate: [],
            CLAReviewOnFile: ['0'],
            CarePlanPt1Date: [],
            CarePlanPt1OnFile: ['0'],
            CarePlanPt2Date: [],
            CarePlanPt2OnFile: ['0'],
            PEPDate: [],
            PEPOnFile: ['0'],
            EHCPDate: [],
            EHCPOnFile: ['0'],
            PathwayPlanDate: [],
            PathwayPlanOnFile: ['0'],
            PlacementAgreementDate: [],
            PlacementAgreementOnFile: ['0'],
            PlacementInformationDate: [],
            PlacementInformationOnFile: ['0'],
            GrabPackDate: [],
            GrabPackOnFile: ['0'],

            LAPlacementPlanComments: [],
            LARiskAssessmentComments: [],
            DelegatedAuthorityComments: [],
            CLAMedicalComments: [],
            CLAReviewComments: [],
            CarePlanPt1Comments: [],
            CarePlanPt2Comments: [],
            PEPComments: [],
            EHCPComments: [],
            PathwayPlanComments: [],
            PlacementAgreementComments: [],
            PlacementInformationComments: [],
            GrabPackComments: [],
        });

        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildId = parseInt(Common.GetSession("ChildId"));

            this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
            this.objConfigTableNamesDTO.Name = ConfigTableNames.YesNoNotApplicable;
            this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => {
                this.listddlYesNoNotApplicable = data;
                this.listddlYesNoNotApplicable.sort(x => x.ValueOrder);
            });

            //Get Already saved
            this.LoadHistory();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/cladocumentation/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
        }
    }

    LoadHistory() {
        this.apiService.get(this.controllerName, "GetAllByChildId", this.ChildId).then(data => {
            this.responseData(data.ChildCLADocumentation);
            this.lstcladoumentationHistory = data.LstChildCLADocumentation;
        });
    }

    dateString;
    responseData(data: CLADocumentationDTO) {
        if (data) {
            this.objCLADocumentationDTO = data;
            this.objCLADocumentationDTO.LAPlacementPlanDate = this.modal.GetDateEditFormat(this.objCLADocumentationDTO.LAPlacementPlanDate);
            this.objCLADocumentationDTO.LARiskAssessmentDate = this.modal.GetDateEditFormat(this.objCLADocumentationDTO.LARiskAssessmentDate);
            this.objCLADocumentationDTO.DelegatedAuthorityDate = this.modal.GetDateEditFormat(this.objCLADocumentationDTO.DelegatedAuthorityDate);
            this.objCLADocumentationDTO.CLAMedicalDate = this.modal.GetDateEditFormat(this.objCLADocumentationDTO.CLAMedicalDate);
            this.objCLADocumentationDTO.CLAReviewDate = this.modal.GetDateEditFormat(this.objCLADocumentationDTO.CLAReviewDate);
            this.objCLADocumentationDTO.CarePlanPt1Date = this.modal.GetDateEditFormat(this.objCLADocumentationDTO.CarePlanPt1Date);
            this.objCLADocumentationDTO.CarePlanPt2Date = this.modal.GetDateEditFormat(this.objCLADocumentationDTO.CarePlanPt2Date);
            this.objCLADocumentationDTO.PEPDate = this.modal.GetDateEditFormat(this.objCLADocumentationDTO.PEPDate);
            this.objCLADocumentationDTO.EHCPDate = this.modal.GetDateEditFormat(this.objCLADocumentationDTO.EHCPDate);
            this.objCLADocumentationDTO.PathwayPlanDate = this.modal.GetDateEditFormat(this.objCLADocumentationDTO.PathwayPlanDate);
            this.objCLADocumentationDTO.PlacementAgreementDate = this.modal.GetDateEditFormat(this.objCLADocumentationDTO.PlacementAgreementDate);
            this.objCLADocumentationDTO.PlacementInformationDate = this.modal.GetDateEditFormat(this.objCLADocumentationDTO.PlacementInformationDate);
            this.objCLADocumentationDTO.GrabPackDate = this.modal.GetDateEditFormat(this.objCLADocumentationDTO.GrabPackDate);

        }
    }



    clicksubmit() {
        if (this._Form.valid) {
            this.isLoading = true;
            let type = "save";
            if (this.objCLADocumentationDTO.CLADocumentationId > 0)
                type = "update";

            this.objCLADocumentationDTO.LAPlacementPlanDate = this.modal.GetDateSaveFormat(this.objCLADocumentationDTO.LAPlacementPlanDate);
            this.objCLADocumentationDTO.LARiskAssessmentDate = this.modal.GetDateSaveFormat(this.objCLADocumentationDTO.LARiskAssessmentDate);
            this.objCLADocumentationDTO.DelegatedAuthorityDate = this.modal.GetDateSaveFormat(this.objCLADocumentationDTO.DelegatedAuthorityDate);
            this.objCLADocumentationDTO.CLAMedicalDate = this.modal.GetDateSaveFormat(this.objCLADocumentationDTO.CLAMedicalDate);
            this.objCLADocumentationDTO.CLAReviewDate = this.modal.GetDateSaveFormat(this.objCLADocumentationDTO.CLAReviewDate);
            this.objCLADocumentationDTO.CarePlanPt1Date = this.modal.GetDateSaveFormat(this.objCLADocumentationDTO.CarePlanPt1Date);
            this.objCLADocumentationDTO.CarePlanPt2Date = this.modal.GetDateSaveFormat(this.objCLADocumentationDTO.CarePlanPt2Date);
            this.objCLADocumentationDTO.PEPDate = this.modal.GetDateSaveFormat(this.objCLADocumentationDTO.PEPDate);
            this.objCLADocumentationDTO.EHCPDate = this.modal.GetDateSaveFormat(this.objCLADocumentationDTO.EHCPDate);
            this.objCLADocumentationDTO.PathwayPlanDate = this.modal.GetDateSaveFormat(this.objCLADocumentationDTO.PathwayPlanDate);
            this.objCLADocumentationDTO.PlacementAgreementDate = this.modal.GetDateSaveFormat(this.objCLADocumentationDTO.PlacementAgreementDate);
            this.objCLADocumentationDTO.PlacementInformationDate = this.modal.GetDateSaveFormat(this.objCLADocumentationDTO.PlacementInformationDate);
            this.objCLADocumentationDTO.GrabPackDate = this.modal.GetDateSaveFormat(this.objCLADocumentationDTO.GrabPackDate);

            this.objCLADocumentationDTO.ChildId = this.ChildId;
            this.objCLADocumentationDTO.CreatedUserId = parseInt(Common.GetSession("UserProfileId"));
            this.objCLADocumentationDTO.UpdatedUserId = parseInt(Common.GetSession("UserProfileId"));
            this.apiService.save(this.controllerName, this.objCLADocumentationDTO, "save").then(data => this.Respone(data, type));
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
            // this.responseData(this.objCLADocumentationDTO);
            this.LoadHistory();
        }
    }

    fnViewCLADocu(CLADocumentationId) {

        let data = this.lstcladoumentationHistory.filter(x => x.CLADocumentationId == CLADocumentationId);
        if (data.length > 0) {
            //console.log(data[0]);
            this.hisCLADocumentationDTO = data[0];

            //this.hisCLADocumentationDTO.LAPlacementPlanDate = this.modal.GetDateEditFormat(this.hisCLADocumentationDTO.LAPlacementPlanDate);
            //this.hisCLADocumentationDTO.LARiskAssessmentDate = this.modal.GetDateEditFormat(this.hisCLADocumentationDTO.LARiskAssessmentDate);
            //this.hisCLADocumentationDTO.DelegatedAuthorityDate = this.modal.GetDateEditFormat(this.hisCLADocumentationDTO.DelegatedAuthorityDate);
            //this.hisCLADocumentationDTO.CLAMedicalDate = this.modal.GetDateEditFormat(this.hisCLADocumentationDTO.CLAMedicalDate);
            //this.hisCLADocumentationDTO.CLAReviewDate = this.modal.GetDateEditFormat(this.hisCLADocumentationDTO.CLAReviewDate);
            //this.hisCLADocumentationDTO.CarePlanPt1Date = this.modal.GetDateEditFormat(this.hisCLADocumentationDTO.CarePlanPt1Date);
            //this.hisCLADocumentationDTO.CarePlanPt2Date = this.modal.GetDateEditFormat(this.hisCLADocumentationDTO.CarePlanPt2Date);
            //this.hisCLADocumentationDTO.PEPDate = this.modal.GetDateEditFormat(this.hisCLADocumentationDTO.PEPDate);
            //this.hisCLADocumentationDTO.EHCPDate = this.modal.GetDateEditFormat(this.hisCLADocumentationDTO.EHCPDate);
            //this.hisCLADocumentationDTO.PathwayPlanDate = this.modal.GetDateEditFormat(this.hisCLADocumentationDTO.PathwayPlanDate);
        }
        let event = new MouseEvent('click', { bubbles: true });
        this.infobtnViewCLADocu.nativeElement.dispatchEvent(event);
    }

}