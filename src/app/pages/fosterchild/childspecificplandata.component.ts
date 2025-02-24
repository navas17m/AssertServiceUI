/// <reference path="DTO/childspecificplandto.ts" />

import { Location} from '@angular/common';
import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChildSpecificPlanDTO } from './DTO/childspecificplandto'
import { Common} from '../common'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { APICallService } from '../services/apicallservice.service';
import { PagesComponent } from '../pages.component';
import { ConfigTableNames } from '../configtablenames'
import { ConfigTableNamesDTO} from '../superadmin/DTO/configtablename'
import { environment } from '../../../environments/environment';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';

declare var window: any;
declare var $: any;

@Component({
    selector: 'ChildSpecificPlan',
    templateUrl: './childspecificplandata.component.template.html',
})

export class ChildSpecificPlanComponent {
    isLoading = false;
    _Form: FormGroup;
    ChildId;
    AgencyProfileId;
    showHistory = false;
    hisobjChildSP;
    objChildSP: ChildSpecificPlanDTO = new ChildSpecificPlanDTO();
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    insChildDetails; objQeryVal; controllerName = "ChildSpecificPlan";
    listddlYesNoNotApplicable = [];
    CarerParentId;
    CarerName; submitted = false;
    SocialWorkerName; SocialWorkerId;
    @ViewChild('btnViewCSPDocu') infobtnViewCSPDocu: ElementRef;
    LstChildSpecificPlanHistory = [];
    RiskTabActive = "active";
    SaferTabActive = "";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    apiURL = environment.api_url + "/api/GeneratePDF/";
    fnRiskTab() {
        this.RiskTabActive = "active";
        this.SaferTabActive = "";
    }
    fnSaferTab() {
        this.RiskTabActive = "";
        this.SaferTabActive = "active";
    }
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private renderer: Renderer2,
        private _router: Router, private _location: Location, private route: ActivatedRoute, private modal: PagesComponent) {

        this.CarerName = Common.GetSession("CarerName");
        if (this.CarerName == "null") {
            this.CarerName = "Not Placed";
            this.CarerParentId = 0;
        }
        else this.CarerParentId = parseInt(Common.GetSession("CarerId"));
        this.SocialWorkerName = Common.GetSession("SSWName");
        this.SocialWorkerId = Common.GetSession("SSWId");
        if (this.SocialWorkerName == "null")
            this.SocialWorkerName = "Not Assigned";
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this._Form = _formBuilder.group({
            ReviewDate: [''],
            ReasonforUpdate: [],
            ChildSummary: [],
            SelfHarmBehaviour: [],
            SelfHarmBehaviourScore: [],
            SelfHarmBehaviourRating: [],
            SelfHarmBehaviourInfo: [],
            SuicideThreats: [],
            SuicideThreatsScore: [],
            SuicideThreatsRating: [],
            SuicideThreatsInfo: [],
            SuicideThreatsHis: [],
            SuicideThreatsScoreHis: [],
            SuicideThreatsRatingHis: [],
            SuicideThreatsInfoHis: [],
            MedicalCondition: [],
            MedicalConditionScore: [],
            MedicalConditionRating: [],
            MedicalConditionInfo: [],
            HighRiskMedicalCondition: [],
            HighRiskMedicalConditionScore: [],
            HighRiskMedicalConditionRating: [],
            HighRiskMedicalConditionInfo: [],
            EatingDisorders: [],
            EatingDisordersScore: [],
            EatingDisordersRating: [],
            EatingDisordersInfo: [],
            VerbalViolenceOtherChildren: [],
            VerbalViolenceOtherChildrenScore: [],
            VerbalViolenceOtherChildrenRating: [],
            VerbalViolenceOtherChildrenInfo: [],
            PhysicalViolenceOtherChildren: [],
            PhysicalViolenceOtherChildrenScore: [],
            PhysicalViolenceOtherChildrenRating: [],
            PhysicalViolenceOtherChildrenInfo: [],
            VerbalViolenceAdults: [],
            VerbalViolenceAdultsScore: [],
            VerbalViolenceAdultsRating: [],
            VerbalViolenceAdultsInfo: [],
            PhysicalViolenceAdults: [],
            PhysicalViolenceAdultsScore: [],
            PhysicalViolenceAdultsRating: [],
            PhysicalViolenceAdultsInfo: [],
            ViolenceCrueltyAnimals: [],
            ViolenceCrueltyAnimalsScore: [],
            ViolenceCrueltyAnimalsRating: [],
            ViolenceCrueltyAnimalsInfo: [],
            SexuallyHarmfulOthers: [],
            SexuallyHarmfulOthersScore: [],
            SexuallyHarmfulOthersRating: [],
            SexuallyHarmfulOthersInfo: [],
            VulnerabilityAroundSexuality: [],
            VulnerabilityAroundSexualityScore: [],
            VulnerabilityAroundSexualityRating: [],
            VulnerabilityAroundSexualityInfo: [],
            ChildSexualExploitation: [],
            ChildSexualExploitationScore: [],
            ChildSexualExploitationRating: [],
            ChildSexualExploitationInfo: [],
            ChildCriminalExploitation: [],
            ChildCriminalExploitationScore: [],
            ChildCriminalExploitationRating: [],
            ChildCriminalExploitationInfo: [],
            RiskFireSetting: [],
            RiskFireSettingScore: [],
            RiskFireSettingRating: [],
            RiskFireSettingInfo: [],
            RiskDestructionToProperty: [],
            RiskDestructionToPropertyScore: [],
            RiskDestructionToPropertyRating: [],
            RiskDestructionToPropertyInfo: [],
            RiskOffendingBehaviour: [],
            RiskOffendingBehaviourScore: [],
            RiskOffendingBehaviourRating: [],
            RiskOffendingBehaviourInfo: [],
            RiskRadicalisation: [],
            RiskRadicalisationScore: [],
            RiskRadicalisationRating: [],
            RiskRadicalisationInfo: [],
            RiskMakingAllegation: [],
            RiskMakingAllegationScore: [],
            RiskMakingAllegationRating: [],
            RiskMakingAllegationInfo: [],
            SmokingCigarettes: [],
            SmokingCigarettesScore: [],
            SmokingCigarettesRating: [],
            SmokingCigarettesInfo: [],
            RiskTakingDealingDrugs: [],
            RiskTakingDealingDrugsScore: [],
            RiskTakingDealingDrugsRating: [],
            RiskTakingDealingDrugsInfo: [],
            RiskAlcoholConsumption: [],
            RiskAlcoholConsumptionScore: [],
            RiskAlcoholConsumptionRating: [],
            RiskAlcoholConsumptionInfo: [],
            RiskAbsconding: [],
            RiskAbscondingScore: [],
            RiskAbscondingRating: [],
            RiskAbscondingInfo: [],
            RiskSportsActivities: [],
            RiskSportsActivitiesScore: [],
            RiskSportsActivitiesRating: [],
            RiskSportsActivitiesInfo: [],
            RiskTakingBehaviourAdrenaline: [],
            RiskTakingBehaviourAdrenalineScore: [],
            RiskTakingBehaviourAdrenalineRating: [],
            RiskTakingBehaviourAdrenalineInfo: [],
            OtherRiskIdentified: [],
            OtherRiskIdentifiedScore: [],
            OtherRiskIdentifiedRating: [],
            OtherRiskIdentifiedInfo: [],
            //Part B
            ChildPreferredName: [],
            HealthDisabilityDetails: [],
            HealthDisabilityStrategies: [],
            PersonalCareDetails: [],
            PersonalCareStrategies: [],
            ShowingAffectionDetails: [],
            ShowingAffectionStrategies: [],
            DailyRoutinesBedtimeDetails: [],
            DailyRoutinesBedtimeStrategies: [],
            PrivacyBathroomBedroomsDetails: [],
            PrivacyBathroomBedroomsStrategies: [],
            PlayDetails: [],
            PlayStrategies: [],
            SocialMediaPhotosDetails: [],
            SocialMediaPhotosStrategies: [],
            LearningSupportNeedsDetails: [],
            LearningSupportNeedsStrategies: [],
            LimitedSenseDangerDetails: [],
            LimitedSenseDangerStrategies: [],
            AdviceSelfStimulatorySexualisedDetails: [],
            AdviceSelfStimulatorySexualisedStrategies: [],
            VisitorsHomeDetails: [],
            VisitorsHomeStrategies: [],
            TravelTransportDetails: [],
            TravelTransportStrategies: [],
            GoingOutAloneDetails: [],
            GoingOutAloneStrategies: [],
            ContactWithFriendsFamilyDetails: [],
            ContactWithFriendsFamilyStrategies: [],
            RegularVisitorsDetails: [],
            RegularVisitorsStrategies: [],
            ConfidentialitySecretsDetails: [],
            ConfidentialitySecretsStrategies: [],
            OtherDetails: [],
            OtherStrategies: [],
        });
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });
        if (Common.GetSession("ChildId") != null) {
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
            Common.SetSession("UrlReferral", "pages/child/childspecificplan/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
        }
    }

    LoadHistory() {
        this.apiService.get(this.controllerName, "GetAllByChildId", this.ChildId).then(data => {
            if (data != null && data.ChildSpecificPlan != null) {
                this.objChildSP = data.ChildSpecificPlan;
                this.CarerName = data.ChildSpecificPlan.CarerName;
                this.SocialWorkerName = data.ChildSpecificPlan.SSWName;
            }
            this.SetReviewDate();
            this.LstChildSpecificPlanHistory = data.LstChildSpecificPlan;
        });
    }
    SetReviewDate() {
        this.objChildSP.ReviewDate = this.modal.GetDateEditFormat(this.objChildSP.ReviewDate);

    }


    clicksubmit() {
        this.submitted = true;
        if (this._Form.valid) {
            this.isLoading = true;
            let type = "save";
            if (this.objChildSP.ChildSpecificPlanId > 0)
                type = "update";

            this.objChildSP.ChildId = this.ChildId;
            this.objChildSP.CreatedUserId = parseInt(Common.GetSession("UserProfileId"));
            this.objChildSP.UpdatedUserId = parseInt(Common.GetSession("UserProfileId"));
            this.objChildSP.ReviewDate = this.modal.GetDateSaveFormat(this.objChildSP.ReviewDate);
            this.SocialWorkerId = Common.GetSession("SSWId");
            this.CarerParentId = parseInt(Common.GetSession("CarerId"));
            this.objChildSP.CarerParentId = this.CarerParentId;
            this.objChildSP.SSWId = this.SocialWorkerId;
            this.apiService.save(this.controllerName, this.objChildSP, "save").then(data => this.Respone(data, type));
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.SetReviewDate();
            if (type == "save") {
                this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            // this.responseData(this.objChildSP);

            this.LoadHistory();
        }
    }

    fnViewCSPDocu(ChildSpecificPlanId) {

        let data = this.LstChildSpecificPlanHistory.filter(x => x.ChildSpecificPlanId == ChildSpecificPlanId);
        if (data.length > 0) {
           

            this.hisobjChildSP = data[0];
            this.showHistory = true;
        }
        let event = new MouseEvent('click', { bubbles: true });
        this.infobtnViewCSPDocu.nativeElement.dispatchEvent(event);
    }


    fnDonloadPDF() {
        var carerName = this.CarerName.replace('/', '\'');
        window.location.href = this.apiURL + "GenerateChildSpecificPlanPDF/" + this.ChildId + "," + this.AgencyProfileId + "," + carerName;
    }
    fnDonloadWord() {
        var carerName = this.CarerName.replace('/', '\'');
        window.location.href = this.apiURL + "GenerateChildSpecificPlanWord/" + this.ChildId + "," + this.AgencyProfileId + "," + carerName;
    }
    fnPrint() {
        var carerName = this.CarerName.replace('/', '\'');
        this.apiService.get("GeneratePDF", "GenerateChildSpecificPlanPrint", this.ChildId + "," + this.AgencyProfileId + "," + carerName).then(data => {
            var popupWin;
            // var style = ""; var link = "";
            // var i;
            // for (i = 0; i < $("style").length; i++) {
            //     style = style + $("style")[i].outerHTML;
            // }
            // var j;
            // for (j = 0; j < $("link").length; j++) {
            //     link = link + $("link")[j].outerHTML;
            // }
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
      <html>
        <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Print tab</title>     
           
        <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
    <body onload="window.print();window.close()">${data}</body>
      </html>`);
            popupWin.document.close();
        });
    }
    fnShowEmail() {
        this.subject = "";
        this.eAddress = "";
        this.submittedprint = false;
        let event = new MouseEvent('click', { bubbles: true });
        this.infoPrint.nativeElement.dispatchEvent(event);
    }
    fnEmail(form) {
        this.submittedprint = true;
        if (form.valid) {
            var carerName = this.CarerName.replace('/', '\'');
            this.isLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.ChildId + "," + this.AgencyProfileId + "," + carerName;
            this.apiService.post("GeneratePDF", "EmailChildSpecificPlan", this.objNotificationDTO).then(data => {
                if (data == true)
                    this.modal.alertSuccess("Email Send Successfully..");
                else
                    this.modal.alertDanger("Email not Send Successfully..");
                this.fnCancelClick();
                this.isLoading = false;
            });

        }
    }
    fnCancelClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoCancel.nativeElement.dispatchEvent(event);
    }

}