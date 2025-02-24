import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PagesComponent} from '../pages.component'
import { CarersYpProgressDTO} from './DTO/carersypprogressdto'
import { ConfigTableNames } from '../configtablenames'
import { ConfigTableNamesDTO} from '../superadmin/DTO/configtablename'
import { APICallService } from '../services/apicallservice.service';

@Component({
    selector: 'CarersYpProgress',
    templateUrl: './carersypprogressdata.component.template.html',
})

export class CarersYpProgressDataComponent {
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objCarersYpProgressDTO: CarersYpProgressDTO = new CarersYpProgressDTO();
    submitted = false;
    _Form: FormGroup;
    AgencyProfileId;
    objQeryVal;
    isLoading: boolean = false;
    controllerName = "CarersYpProgress";
    EducationTabActive = "active";
    SocialDeveTabActive = "";
    HealthActive = "";
    ContactActive = "";
    StaySafeActive = "";

    AbsenceReasonList = [];
    MeetingTypeList = [];
    ExclusionTypeList = [];
    TakenExamTypeList = [];
    Post18TypeList = [];
    SubstanceTypeList = [];
    BehaviourTypeList = [];
    HealthAppointmentList = [];
    ContactList = [];
    AccidentTypeList = [];
    insChildDetails;
    CarerName;
    CarerId;
    ChildId;

    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute, private _router: Router, private moduel: PagesComponent) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));

        this.CarerName = Common.GetSession("CarerName") == "null" ? "Not Placed" : Common.GetSession("CarerName");
        this.CarerId = Common.GetSession("CarerId")
        this.ChildId = parseInt(Common.GetSession("ChildId"));

        if (Common.GetSession("SelectedChildProfile") != null) {
            this.insChildDetails = JSON.parse(Common.GetSession("SelectedChildProfile"));
        }


        this._Form = _formBuilder.group({
            ReportDate: ['', [Validators.required]],
            AttendSchool: [],
            AbsenceReason: ['0'],
            Reading: [],
            Homework: [],
            Activity: [],
            AttendAcademicClub: [],
            SchoolTrip: [],
            AttendCollege: [],
            AttendTraining: [],
            AttendWorkExp: [],
            Meeting: [],
            MeetingType: ['0'],
            Detention: [],
            Training: [],
            Excluded: [],
            PermanentExclusion: ['0'],
            TakenExam: [],
            Exam: ['0'],
            PupilPremium: [],
            EducationComments: [],
            //SocialDeve
            CommunityActivity: [],
            Trip: [],
            Holiday: [],
            LifeStory: [],
            ContributeLifeStory: [],
            Budget: [],
            Hygiene: [],
            HealthyEating: [],
            Cooking: [],
            Washing: [],
            HappyInPlacement: [],
            BankAccount: [],
            Passport: [],
            Post18: [],
            Post18Type: ['0'],
            SocialDevelopmentComments: [],
            //Health
            Smoke: [],
            UseSubstance: [],
            SubstanceType: ['0'],
            Alcohol: [],
            RiskBehaviour: [],
            BehaviourType: ['0'],
            DLA: [],
            ReceiveDLA: [],
            HealthAppointment: ['0'],
            Medication: [],
            HealthComments: [],
            //Contact
            TransportContact: [],
            SuperviseContact: [],
            Placement: [],
            Contact: ['0'],
            SleepoverPlacement: [],
            SleepoverLocation: [],
            RespiteRequested: [],
            RespiteForChild: [],
            ContactComments: [],
            //StaySafe
            AccidentPlacement: [],
            AccidentOutsidePlacement: [],
            AccidentType: ['0'],
            UnauthorisedAbsence: [],
            Treatment: [],
            EDT: [],
            Allegations: [],
            Restraint: [],
            Prostitution: [],
            Disease: [],
            CriminalJustice: [],
            Victim: [],
            Offender: [],
            DrugOffences: [],
            CriminalDamage: [],
            Theft: [],
            Shoplifting: [],
            OffenceAgainstVehicles: [],
            Burglary: [],
            Robbery: [],
            Sexual: [],
            Violence: [],
            Court: [],
            YouthJustice: [],
            Police: [],
            ExperiencedBullying: [],
            AdressBullying: [],
            Sanction: [],
            StayingSafeComments: [],
        });


        this.apiService.get(this.controllerName, "GetYPProgressDDLValues", this.AgencyProfileId).then(data => {
           
            this.AbsenceReasonList = data.lstReasonforAbsence;
            this.MeetingTypeList = data.lstMeetingType;
            this.ExclusionTypeList = data.lstExclusionType;
            this.TakenExamTypeList = data.lstExamsType;
            this.Post18TypeList = data.lstPost18SupportType;
            this.SubstanceTypeList = data.lstSubstancesType;
            this.BehaviourTypeList = data.lstRiskBehaviours;
            this.HealthAppointmentList = data.lstHealthAppointment;
            this.ContactList = data.lstContactType;
            this.AccidentTypeList = data.lstAccidentType;
        });

        //Get By Id
        if (this.objQeryVal.id != 0) {
            this.apiService.get(this.controllerName, "GetById", this.objQeryVal.id).then(data => {
                this.objCarersYpProgressDTO = data;
                this.setDate();
            });

        }
    }

    fnEducationTab() {
        this.EducationTabActive = "active";
        this.SocialDeveTabActive = "";
        this.HealthActive = "";
        this.ContactActive = "";
        this.StaySafeActive = "";
    }
    fnSocialDeveTab() {
        this.EducationTabActive = "";
        this.SocialDeveTabActive = "active";
        this.HealthActive = "";
        this.ContactActive = "";
        this.StaySafeActive = "";
    }
    fnHealthTab() {
        this.EducationTabActive = "";
        this.SocialDeveTabActive = "";
        this.HealthActive = "active";
        this.ContactActive = "";
        this.StaySafeActive = "";
    }
    fnContactTab() {
        this.EducationTabActive = "";
        this.SocialDeveTabActive = "";
        this.HealthActive = "";
        this.ContactActive = "active";
        this.StaySafeActive = "";
    }
    fnStaySafeTab() {
        this.EducationTabActive = "";
        this.SocialDeveTabActive = "";
        this.HealthActive = "";
        this.ContactActive = "";
        this.StaySafeActive = "active";
    }


    clicksubmit(mainFormBuilder) {
        this.submitted = true;
        if (!mainFormBuilder.valid) {
            this.EducationTabActive = "active";
            this.SocialDeveTabActive = "";
            this.HealthActive = "";
            this.ContactActive = "";
            this.StaySafeActive = "";
            this.moduel.GetErrorFocus(mainFormBuilder);
        }
        if (mainFormBuilder.valid) {
            this.isLoading = true;
            let type = "save";
            if (this.objQeryVal.id != 0)
                type = "update";
            this.objCarersYpProgressDTO.CarerID = this.CarerId;
            this.objCarersYpProgressDTO.ChildId = this.ChildId
            this.apiService.save(this.controllerName, this.objCarersYpProgressDTO, type).then(data => this.Respone(data, type));
        }
    }

    dateString;
    setDate() {
        if (this.objCarersYpProgressDTO.ReportDate != null) {
            this.dateString = this.objCarersYpProgressDTO.ReportDate;
            this.dateString = this.dateString.split('T')[0];
            this.objCarersYpProgressDTO.ReportDate = this.dateString;
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.moduel.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.moduel.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            if (type == "update") {
                this.moduel.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            this._router.navigate(['/pages/child/carersypprogresslist/4']);
        }
    }
}

