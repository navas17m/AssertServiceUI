
import { BaseDTO } from '../../basedto'
import { Contact } from '../../contact/contact'
import { PersonalInfo } from '../../personalinfo/personalinfo'
import { CarerEmployerInfo } from './careremployerinfo'
import { CarerExPartnerInfo } from './carerexpartnerinfo'
import { CarerFamilyInfo } from './carerfamilyinfo'
import { CarerKOPInfo } from './carerkopinfo'
import { CarerOtherInfo } from './carerotherinfo'
import { CarerReferenceInfo } from './carerreferenceinfo'
import { DynamicValue } from '../../dynamic/dynamicvalue';
import { CarerAddressHistoryComponent } from '../careraddresshistory.component'
import { CarerAddressHistoryDTO } from '../../fostercarer/DTO/careraddresshistorydto'
import { BackupCarerDTO } from './backupcarer'

export class CarerInfo extends BaseDTO {

    CarerId: number;
    CarerParentId: number;
    CarerCode: string;
    CarerTypeid: number;
    AreaOfficeid: number;
    CarerStatusId: number;
    SourceOfMediumId: number = null;
    NationalInsurenceNumber: string;
    PassportNumber: string;
    EthinicityId: number = null;
    OfstedEthinicityId: number = null;
    ReligionId: number = null;
    JobTitleId: number = null;
    PractisingStatus: boolean = null;
    HasDisability: boolean;
    AgencyName:string;
    DisabilityDetail: string;
    HasSocialServicesInvolved:boolean;
    SocialServicesInvolvedDetail:string;
    DateOfMarriage:Date = null;
    PlaceOfMarriage:string;
    DateOfDivorce:Date = null;
    HasAnyChildCriminalConviction:boolean;
    ChildConvictionDetail:string;
    HasSexualorientation: number = null;
    FamilyGPPersonalInfoId: number;
    FamilyGPContentId: number;
    MedicalTreatmentDetails: string;
    HaveCriminalOffenseConviction: boolean;
    CriminalOffenceConvictionDetail: string;
    ApplicationFilledDate: Date = null;
    LanguagesSpokenIds: string;
    IsChecksRequired: boolean;
    DateOfEnquiry: Date = null;
    PCFullName: string;
    SCFullName: string;
    IsSelected: boolean;
    CarerStatusName: string;
    SpareBedRoomCount: number;
    IsChildPlaced: number;

    PersonalInfo: PersonalInfo = new PersonalInfo();
    ContactInfo: Contact = new Contact();
    ContactInfoSA: Contact = new Contact();
    CarerKOP: CarerKOPInfo = new CarerKOPInfo();
    CarerFamilyInfo: CarerFamilyInfo = new CarerFamilyInfo();
    CarerReferenceInfo: CarerReferenceInfo = new CarerReferenceInfo();
    CarerExPartnerInfo: CarerExPartnerInfo = new CarerExPartnerInfo();
    CarerEmployerInfo: CarerEmployerInfo = new CarerEmployerInfo();
    CarerOtherInformation: CarerOtherInfo = new CarerOtherInfo();
    CarerAddressHistory: CarerAddressHistoryDTO = new CarerAddressHistoryDTO();
    BackupCarerList:BackupCarerDTO = new BackupCarerDTO();

    FamilyGPPersonalInfo: PersonalInfo = new PersonalInfo();
    FamilyGPContactInfo: Contact = new Contact();

    ApprovedGender: number;
    AgeRangeMin: number;
    AgeRangeMax: number;
    EthinicityIds: string;
    ReligionIds: string;
    DisabilityIds: string;
    ImmigrationStatusIds: string;
    IsSiblingAcceptable: number;

    HasPermanentResidencyInUK: boolean = true;
    PermanentResidencyDetails: string;
    HaveRelationshipAbove2Years: boolean;
    RelationshipAbove2YearsDetails: string;
    SiblingCount: number = null;
    CarerBornCountry: number = 236;
    HowLongLivedInLocalArea: string;
    PreviousMarriageDetails: string;
    MaritalStatusId: number = null;

    DoYouHaveYourOwnVehicle:boolean;
    DoesCarerDriveCar:boolean;
    VehicleRegistrationNumber:string;
    DrivingLicenceNumber:string;

    InGoodHealth: boolean;
    OnAnyMedication: boolean;
    MedicationDetail: string;
    AnySurgeryIn5Years: boolean;
    SurgeryDetail: string;
    DoYouSmoke: boolean;
    SmokingHowOften:string;
    DoYouDrink:boolean;
    DrinkingHowOften:string;
    SmokeDrinkTerms:boolean;
    AnyOutstandingCourtOrders:boolean;
    OutstandingCourtOrderDetail:string;
    AnyChildOutstandingCourtOrders:boolean;
    ChildOutstandingCourtOrderDetail:string;

}

export class CarerInfoDTOCombo {
    CarerInfoPC: CarerInfo = new CarerInfo();
    CarerInfoSC: CarerInfo = new CarerInfo();
    Jointapplicant: boolean;
    DynamicControls = [];
}

export class ApplicantListDTO {
    AreaOfficeid: number;
    CarerStatusId: number;
    CarerLoadingTypeId:number=0;
    SupervisingSocialWorkerId:number;
    CarerStatusIds=[];
}

export class FosterCarerPoliciesFCSignatureDTO extends BaseDTO {
    CarerParentId: number;
    DocumentId: number;
    DocumentName:string;
    SequenceNo: number;
    FieldId: number;
    FieldValue: string;
    UniqueID: number;
    DynamicValue: DynamicValue = new DynamicValue();
}
