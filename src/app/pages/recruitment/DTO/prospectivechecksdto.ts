import { Numeric } from 'd3';
import { BaseDTO} from  '../../basedto'

export class ProspectiveChecksDTO extends BaseDTO {
    CarerProspectiveCheckId: number;
    CarerParentId: number;
    LocalAuthority: number;
    FirstApplicantCRB: number;
    SecondApplicantCRB: number;
    ChildrenCRB: number;
    NominatedCarerCRB1: number;
    NominatedCarerCRB2:number;
    FrequentVisitorsCRB:number;
    Reference1:number;
    Reference2:number;
    Reference3:number;
    ExpartnerReference1:number;
    ExpartnerReference2:number;
    EducationReference1:number;
    EducationReference2:number;
    EmploymentReference1:number;
    EmploymentReference2:number;
    OtherIFA:number;
    MedicalAdvisor:number;
    AgencyMedicalAdvisor:number;
    TrainingSTF:number;
    PhotoUploaded:number;
    Interview:number;
    DriversLicence:number;
    Passport:number;
    MortgageStatement:number;
    TenancyAgreement:number;
    UtilityBills:number;
    NationalInsuranceNumber:number;
    Marriage:number;
    ManagerCommnets:string;
    SocialWorkerComment:string;
    SeniorManagersApproval:string;
    ApprovedByManager:number; 
}