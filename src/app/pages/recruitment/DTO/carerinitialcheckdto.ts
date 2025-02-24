import { BaseDTO} from  '../../basedto'

export class CarerInitialCheckDTO extends BaseDTO {
    CarerInitialCheckId: number;
    CarerParentId: number;
    InitialHomeVisitCompleted: number;
    InitialHomeVisitAuthorised: number;
    HealthSafetyCheckUploaded: number;
    HealthSafetyCheckDate: Date;
    HealthSafetyCheckAuthorised: number;
    PetQuestionaireCompleted:number;
    PetQuestionaireDate:Date;
    ConsentFormSigned:number;
    ConsentDate:Date;
    AgreementSigned:number;
    AgreementReceivedDate:Date;
    ApprovedByManager:number;
}