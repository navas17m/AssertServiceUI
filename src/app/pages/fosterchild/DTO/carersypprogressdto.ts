import { BaseDTO } from '../../basedto';
export class CarersYpProgressDTO extends BaseDTO {
    YPProgressID: number;
    ChildId: number;
    ChildName: string;
    CarerID: number;
    CarerName: number;
    ReportDate: Date;
    
    AttendSchool: number;
    AbsenceReason: number=null;
    Reading: number;
    Homework: number;
    Activity: number;
    AttendAcademicClub: number;
    SchoolTrip: number;
    AttendCollege: number;
    AttendTraining: number;
    AttendWorkExp: number;
    Meeting: number;
    MeetingType: number = null;
    Detention: number;
    Training: number;
    Excluded: number;
    PermanentExclusion: number=null;
    TakenExam: number;
    Exam: number=null;
    PupilPremium: number;
    EducationComments: string;
    //SocialDeve
    CommunityActivity: number;
    Trip: number;
    Holiday: number;
    LifeStory: number;
    ContributeLifeStory: number;
    Budget: number;
    BudgetSkill: number=0;
    Hygiene: number;
    HygieneSkill: number=0;
    HealthyEating: number;
    HealthyEatingSkill: number=0;
    Cooking: number;
    CookingSkill: number=0;
    Washing: number;
    WashingSkill: number=0;
    HappyInPlacement: number;
    HowHappyInPlacement: number=0;
    BankAccount: number;
    Passport: number;
    Post18: number;
    Post18Type: number = null;
    SocialDevelopmentComments: string;
    //Health
    Smoke: number;
    SmokePerDay: number=0;
    UseSubstance: number;
    SubstanceType: number = null;
    Alcohol: number;
    AlcoholPerDay: number=0;
    RiskBehaviour: number;
    BehaviourType: number=null;
    DLA: number;
    HowMuchDLA: number=0;
    ReceiveDLA: number;
    HealthAppointment: number = null;
    Medication: number;
    HealthComments: string;
    //Contact
    TransportContact: number;
    SuperviseContact: number;
    Placement: number;
    BehaviourBeforeContact: number = 0;
    BehaviourAfterContact: number=0;
    Contact: number=null;
    SleepoverPlacement: number;
    SleepoverLocation: number;
    RespiteRequested: number;
    RespiteForChild: number;
    ContactComments: string;
    //StaySafe
    AccidentPlacement: number;
    AccidentOutsidePlacement: number;
    AccidentType: number=null;
    UnauthorisedAbsence: number;
    Treatment: number;
    EDT: number;
    Allegations: number;
    Restraint: number;
    Prostitution: number;
    Disease: number;
    CriminalJustice: number;
    Victim: number;
    Offender: number;
    DrugOffences: number;
    CriminalDamage: number;
    Theft: number;
    Shoplifting: number;
    OffenceAgainstVehicles: number;
    Burglary: number;
    Robbery: number;
    Sexual: number;
    Violence: number;
    Court: number;
    YouthJustice: number;
    Police: number;
    ExperiencedBullying: number;
    AdressBullying: number;
    Sanction: number;  
    StayingSafeComments: string;
    ///

    
  
 
}